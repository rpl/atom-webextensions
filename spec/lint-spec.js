'use babel';

const path = require('path');
const lint = require('../lib/plugin').provideLinter().lint;

const SIMPLE_INVALID_ADDON = path.join(__dirname, 'fixtures', 'simple-invalid-addon');

describe('WebExtensions Plugin', () => {
  let activationPromise;

  beforeEach(() => {
    activationPromise = atom.packages.activatePackage('atom-webextensions');
    return activationPromise;
  });


  describe('addons-linter on a simple invalid addon', () => {
    beforeEach(() => {
      atom.project.setPaths([SIMPLE_INVALID_ADDON]);
    });

    it('generate the expected linting errors on manifest.json', () => {
      waitsForPromise(() => {
        const manifestPath = path.join(SIMPLE_INVALID_ADDON, 'manifest.json');

        return atom.workspace.open(manifestPath).then(
          editor => lint(editor).then(messages => {
            expect(messages.length).toBe(1);
            expect(messages[0].type).toBe('Error');
          })
        );
      });
    });

    it('generate the expected linting warnings on bad.js', () => {
      waitsForPromise(() => {
        const manifestPath = path.join(SIMPLE_INVALID_ADDON, 'bad.js');

        return atom.workspace.open(manifestPath).then(
          editor => lint(editor).then(messages => {
            expect(messages.length).toBe(1);
            expect(messages[0].type).toBe('Warning');
          })
        );
      });
    });
  });
});
