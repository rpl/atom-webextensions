'use babel';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

const path = require("path");
const lint = require('../lib/plugin').provideLinter().lint;
const SIMPLE_INVALID_ADDON = path.join(__dirname, 'fixtures', 'simple-invalid-addon');

describe('WebExtensions Plugin', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('atom-webextensions');
  });


  describe('addons-linter on a simple invalid addon', () => {
    beforeEach(() => {
      atom.project.setPaths([SIMPLE_INVALID_ADDON]);
    });

    it('generate the expected linting errors on manifest.json', () => {
      waitsForPromise(() => {
        let manifestPath = path.join(SIMPLE_INVALID_ADDON, 'manifest.json');
        return atom.workspace.open(manifestPath).then(editor => {
          return lint(editor).then(messages => {
            expect(messages.length).toBe(1);
            expect(messages[0].type).toBe('Error');
          });
        });
      });
    });

    it('generate the expected linting warnings on bad.js', () => {
      waitsForPromise(() => {
        let manifestPath = path.join(SIMPLE_INVALID_ADDON, 'bad.js');
        return atom.workspace.open(manifestPath).then(editor => {
          return lint(editor).then(messages => {
            expect(messages.length).toBe(1);
            expect(messages[0].type).toBe('Warning');
          });
        });
      });
    });
  });
});
