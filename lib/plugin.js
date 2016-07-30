'use babel';

// @flow

/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved */
import { CompositeDisposable } from 'atom';
/* eslint-enable */

export default {
  config: {
    forceAddonsLinterOnProjects: {
      type: 'array',
      default: [],
      description: 'Projects forced to be linted by the addons-linter',
    },
    addonsLinterExecutablePath: {
      type: 'string',
      default: 'addons-linter',
      description: 'Absolute path to the **addons-linter** executable on your system.',
    },
    addonsLinterTimeout: {
      type: 'number',
      default: '5000',
      description: 'Maximum time to wait for **addons-linter** results (defaults to 5000 ms)',
    },
    webextExecutablePath: {
      type: 'string',
      default: 'web-ext',
      description: 'Absolute path to the **web-ext** executable on your system.',
    },
  },

  subscriptions: null,

  activate() {
    /* eslint-disable global-require */
    require('atom-package-deps').install();

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(require('./lint').subscribeCommands());
    this.subscriptions.add(require('./docs').subscribeCommands());
    /* eslint-enable */
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
    return {};
  },

  provideLinter() {
    return require('./lint').provideLinter(); // eslint-disable-line global-require
  },
};
