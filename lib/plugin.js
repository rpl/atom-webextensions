'use babel';

// @flow

import { CompositeDisposable } from 'atom';

import path from "path";

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
    webextExecutablePath: {
      type: 'string',
      default: 'web-ext',
      description: 'Absolute path to the **web-ext** executable on your system.',
    },
  },

  subscriptions: null,

  activate(state: any) {
    require('atom-package-deps').install();

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(require("./lint").subscribeCommands());
    this.subscriptions.add(require("./docs").subscribeCommands());
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
    return {};
  },

  provideLinter() {
    return require('./lint').provideLinter();
  }
};
