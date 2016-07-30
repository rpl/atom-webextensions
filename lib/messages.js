'use babel';

/* eslint-disable max-len */

export const HOW_TO_FORCE_LINTING = 'You can force the WebExtensions linting on a project using the **addons-linter:force-on-this-project** command.';

export const HOW_TO_CUSTOMIZE_TOOL_PATH = 'You can customize the path to the executable in the **WebExtensions Plugin Settings**';

export const HOW_TO_FIX_LINTER_TIMEOUT = `
  WebExtensions Plugin timed out running **addons-linter**:

  <small>
  This is probably due to a known **addons-linter** issue ([#3][issue-3],
  and it is usually related to the presence of a \`node_modules/\` dir in the project.

  As a workaround (at least until the issue is fixed on the **addons-linter** itself),
  you can remove the content of the \`node_modules/\` dir or customize the timeout
  in the Package Settings.
  </small>

  [issue-3]: https://github.com/rpl/atom-webextensions/issues/3
`;
