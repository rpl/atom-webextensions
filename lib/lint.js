'use babel';

// @flow

import fs from 'fs';
import path from 'path';

import * as messages from './messages';

// Flow types

type LinterMessageType = "Warning" | "Error";

type AddonsLinterMessageConversionParams = {
  helpers: LinterHelpers,
  textEditor: TextEditor,
  defaultRange: Range,
  filePath: string
}

// Private internals

const notifiedDisabledLintingOnProject = new Map();

function isAddonProject(projectDirPath) {
  const forceAddonsLinterOnProjects = atom.config
        .get('atom-webextensions.forceAddonsLinterOnProjects');

  if (forceAddonsLinterOnProjects.includes(projectDirPath)) {
    return Promise.resolve(true);
  }

  return new Promise((resolve, reject) => {
    fs.exists(path.join(projectDirPath, 'manifest.json'), (res, error) => {
      if (error) {
        reject(error);
      } else {
        resolve(res);
      }
    });
  });
}

function filterAddonLinterMessageByFile(isProject, fileRelPath) {
  return details => (isProject ? true : details.file === fileRelPath);
}

function convertAddonLinterMessage(
  type: LinterMessageType, conversionParams: AddonsLinterMessageConversionParams
) {
  const { helpers, textEditor, defaultRange, filePath } = conversionParams;

  return details => {
    let html;
    let range;

    const linkMatch = typeof details.description === 'string' ?
          details.description.match(/mzl\.la\/([a-zA-Z0-9]+)\s/) : null;
    if (linkMatch) {
      html = `${details.message} <a href="https://mzl.la/${linkMatch[1]}"
                 class="badge badge-flexible badge-addons-linter">
                 ${details.code}
              </a>`;
    }

    if (details.line) {
      range = helpers.rangeFromLineNumber(textEditor, details.line - 1, details.column - 1);
    }

    return {
      type,
      html,
      filePath,
      text: !html ? details.message : null,
      range: range || defaultRange,
    };
  };
}

// Exported helpers

export function addonsLinterForceOnProject() {
  const textEditor = atom.workspace.getActiveTextEditor();
  const filePath = textEditor.getPath();

  const projectDirs = atom.project.getDirectories();

  const projectDir = projectDirs.find(dir => {
    const relPath = path.relative(dir.path, filePath);

    if (!relPath.includes('..')) {
      return true;
    }

    return false;
  });

  if (projectDir) {
    const forceAddonsLinterOnProjects = atom.config.get(
      'atom-webextensions.forceAddonsLinterOnProjects'
    );

    forceAddonsLinterOnProjects.push(projectDir.path);

    atom.config.set(
      'atom-webextensions.forceAddonsLinterOnProjects',
      forceAddonsLinterOnProjects
    );
  }
}

export async function sanityCheckEnvironment() {
  const helpers = require('atom-linter'); // eslint-disable-line global-require

  const msg = messages.HOW_TO_CUSTOMIZE_TOOL_PATH;

  // check nodejs
  try {
    await helpers.exec('node', ['-v'], {
      ignoreExitCode: true,
    });
    // TODO: check node version
  } catch (e) {
    atom.notifications.addError('WebExtensions Plugin is not able to run **node**', {
      description: 'you can install node from **[https://nodejs.org](https://nodejs.org)** if it is not installed.',
      detail: `${e}`,
      dismissable: true,
    });

    return false;
  }

  try {
    const addonsLinterExecutablePath = atom.config.get(
      'atom-webextensions.addonsLinterExecutablePath'
    );
    await helpers.exec(addonsLinterExecutablePath, ['--help'], {
      ignoreExitCode: true,
    });
    // TODO: check addons-linter version is last released
  } catch (e) {
    atom.notifications.addError('WebExtensions Plugin is not able to run **addons-linter**', {
      description: `${msg}, or you can install it with npm: **npm install -g addons-linter**`,
      detail: `${e}`,
      dismissable: true,
    });

    return false;
  }

  try {
    const webextExecutablePath = atom.config.get(
      'atom-webextensions.webextExecutablePath'
    );
    await helpers.exec(webextExecutablePath, ['--version'], {
      ignoreExitCode: true,
    });
    // TODO: check addons-linter version is last released
  } catch (e) {
    atom.notifications.addError('WebExtensions Plugin is not able to run **web-ext**', {
      description: `${msg}, or you can install it with npm: **npm install -g web-ext**`,
      detail: `${e}`,
      dismissable: true,
    });

    return false;
  }

  return true;
}

export async function lint(textEditor: TextEditor, isProject: bool = false) {
  const helpers = require('atom-linter'); // eslint-disable-line global-require

  const filePath = textEditor.getPath();

  const projectDirs = atom.project.getDirectories();

  const projectDir = projectDirs.find(dir => {
    const relPath = path.relative(dir.realPath || dir.path, filePath);

    if (!relPath.includes('..')) {
      return true;
    }

    return false;
  });

  if (!projectDir) {
    // Project Directory not found for file
    return [];
  }

  const projectDirPath = projectDir.realPath || projectDir.path;

  if (!(await isAddonProject(projectDirPath))) {
    // Disable linting on a non-addon project.
    if (!notifiedDisabledLintingOnProject.has(projectDirPath)) {
      atom.notifications.addInfo('**WebExtensions linting disabled.**', {
        details: 'Addon project not recognized',
        description: messages.HOW_TO_FORCE_LINTING,
      });
      notifiedDisabledLintingOnProject.set(projectDirPath, true);
    }
    return [];
  }

  const addonsLinterExecutable = atom.config
        .get('atom-webextensions.addonsLinterExecutablePath');

  const out = await helpers.exec(addonsLinterExecutable, [projectDirPath], {
    cwd: projectDir,
    ignoreExitCode: true,
  });

  const results = JSON.parse(out);

  // Many of addons-linter warnings/errors doesn't produce any line number,
  // mark all the file content in the meantime.
  const defaultRange = [[0, 0], [textEditor.getLineCount() - 1, 0]];

  const fileRelPath = path.relative(projectDirPath, filePath);

  const convertParams = {
    helpers, textEditor, defaultRange, filePath,
  };

  const warnings = results.warnings
        .filter(filterAddonLinterMessageByFile(isProject, fileRelPath))
          .map(convertAddonLinterMessage('Warning', convertParams));

  const errors = results.errors
        .filter(filterAddonLinterMessageByFile(isProject, fileRelPath))
          .map(convertAddonLinterMessage('Error', convertParams));

  return []
    .concat(warnings)
    .concat(errors);
}

export function subscribeCommands() {
  return atom.commands.add('atom-workspace', {
    'addons-linter:force-on-this-project': () => {
      addonsLinterForceOnProject();
    },
  });
}

export function provideLinter() {
  sanityCheckEnvironment();

  return {
    name: 'addons-linter',
    grammarScopes: [
      'source.json',
      'source.js',
    ],
    scope: 'file',
    lintOnFly: true,
    lint,
  };
}
