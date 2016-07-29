'use babel';

// @flow

import fs from "fs";
import path from "path";

function isAddonProject(projectDirPath) {
  let forceAddonsLinterOnProjects = atom.config
        .get('atom-webextensions.forceAddonsLinterOnProjects');

  if (forceAddonsLinterOnProjects.includes(projectDirPath)) {
    return Promise.resolve(true);
  }

  return new Promise((resolve, reject) => {
    fs.exists(path.join(projectDirPath, "manifest.json"), (res, error) => {
      if (error) {
        reject(error);
      } else {
        resolve(res);
      }
    });
  });
}

function filterAddonLinterMessageByFile(isProject, fileRelPath) {
  return details => {
    return isProject ? true : details.file == fileRelPath;
  };
}

function convertAddonLinterMessage(helpers, textEditor, type, defaultRange, filePath) {
  return details => {
    let html, range;

    let linkMatch = typeof details.description == "string" ?
          details.description.match(/mzl\.la\/([a-zA-Z0-9]+)\s/) : null;
    if (linkMatch) {
      html = `${details.message} <a href="https://mzl.la/${linkMatch[1]}"
                 class="badge badge-flexible badge-addons-linter">
                 ${details.code}
              </a>`;
    }

    if (details.line) {
      range = helpers.rangeFromLineNumber(textEditor, details.line-1, details.column-1);
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

export function addonsLinterForceOnProject() {
  let textEditor = atom.workspace.getActiveTextEditor();
  let filePath = textEditor.getPath();

  let projectDirs = atom.project.getDirectories();

  let projectDir = projectDirs.find(dir => {
    let relPath = path.relative(dir.path, filePath);

    if (!relPath.includes("..")) {
      return true;
    }

    return false;
  });

  if (projectDir) {
    let forceAddonsLinterOnProjects = atom.config.get(
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
  let helpers = require('atom-linter');

  let msg = `You can customize the path to the executable in the **WebExtensions Plugin Settings**`;

  // check nodejs
  try {
    await helpers.exec("node", ["-v"], {
      ignoreExitCode: true,
    });
    // TODO: check node version
  } catch(e) {
    atom.notifications.addError("WebExtensions Plugin is not able to run **node**", {
      description: `you can install node from **[https://nodejs.org](https://nodejs.org)** if it is not installed.`,
      detail: `${e}`,
      dismissable: true,
    });

    return false;
  }

  try {
    let addonsLinterExecutablePath = atom.config.get(
      'atom-webextensions.addonsLinterExecutablePath'
    );
    await helpers.exec(addonsLinterExecutablePath, ["--help"], {
      ignoreExitCode: true,
    });
    // TODO: check addons-linter version is last released
  } catch(e) {
    atom.notifications.addError("WebExtensions Plugin is not able to run **addons-linter**", {
      description: `${msg}, or you can install it with npm: **npm install -g addons-linter**`,
      detail: `${e}`,
      dismissable: true,
    });

    return false;
  }

  try {
    let webextExecutablePath = atom.config.get(
      'atom-webextensions.webextExecutablePath'
    );
    await helpers.exec(webextExecutablePath, ["--version"], {
      ignoreExitCode: true,
    });
    // TODO: check addons-linter version is last released
  } catch(e) {
    atom.notifications.addError("WebExtensions Plugin is not able to run **web-ext**", {
      description: `${msg}, or you can install it with npm: **npm install -g web-ext**`,
      detail: `${e}`,
      dismissable: true,
    });

    return false;
  }

  return true;
}

var notifiedDisabledLintingOnProject = new Map();

export async function lint(textEditor: TextEditor, isProject: bool = false) {
  let helpers = require('atom-linter');

  let filePath = textEditor.getPath();

  let projectDirs = atom.project.getDirectories();

  let projectDir = projectDirs.find(dir => {
    let relPath = path.relative(dir.realPath || dir.path, filePath);

    if (!relPath.includes("..")) {
      return true;
    }

    return false;
  });

  if (!projectDir) {
    // Project Directory not found for file
    return;
  }

  let projectDirPath = projectDir.realPath || projectDir.path;

  if (!(await isAddonProject(projectDirPath))) {
    // Disable linting on a non-addon project.
    if (!notifiedDisabledLintingOnProject.has(projectDirPath)) {
      atom.notifications.addInfo("**WebExtensions linting disabled.**", {
        details: "Addon project not recognized",
        description: "You can force the WebExtensions linting on a project using the **addons-linter:force-on-this-project** command."
      });
      notifiedDisabledLintingOnProject.set(projectDirPath, true);
    }
    return [];
  }

  let addonsLinterExecutable = atom.config
        .get('atom-webextensions.addonsLinterExecutablePath');

  let out = await helpers.exec("addons-linter", [projectDirPath], {
    cwd: projectDir,
    ignoreExitCode: true,
  });

  let results = JSON.parse(out);

  // Many of addons-linter warnings/errors doesn't produce any line number,
  // mark all the file content in the meantime.
  let defaultRange = [[0,0],[textEditor.getLineCount()-1,0]];

  let fileRelPath = path.relative(projectDirPath, filePath);

  let warnings = results.warnings
        .filter(filterAddonLinterMessageByFile(isProject, fileRelPath))
        .map(convertAddonLinterMessage(helpers, textEditor, 'Warning', defaultRange, filePath));

  let errors = results.errors
        .filter(filterAddonLinterMessageByFile(isProject, fileRelPath))
        .map(convertAddonLinterMessage(helpers, textEditor, 'Error', defaultRange, filePath));

  return []
    .concat(warnings)
    .concat(errors);
};

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
