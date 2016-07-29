'use babel';

// @flow

/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved */
import Shell from 'shell';
/* eslint-enable */

const MDN_DOC_URL = 'https://developer.mozilla.org/en-US/Add-ons/WebExtensions';

export function openMDNLandingPage() {
  let integratedHTTPOpener = false;

  // Detect if there is a registered opener (e.g. atom-webbrowser).
  for (const opener of atom.workspace.getOpeners()) {
    const res = opener(MDN_DOC_URL);
    if (res) {
      integratedHTTPOpener = true;
      break;
    }
  }

  if (!integratedHTTPOpener) {
    Shell.openExternal(MDN_DOC_URL);
  } else {
    // TODO: check if it's already opened.
    atom.workspace.open(MDN_DOC_URL, { split: 'right' });
  }
}

export function subscribeCommands() {
  return atom.commands.add('atom-workspace', {
    'web-ext:open-mdn-docs': () => {
      openMDNLandingPage();
    },
  });
}
