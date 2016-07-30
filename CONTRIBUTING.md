# Development of atom-webextensions

To get started, first install it from [source](README.md#installation-from-source).

## Atom Development Mode

Once you have linked the plugin repo to your Atom dev packages dir, as
described in the above link, you can start an Atom instance in
Development Mode at any yime by running it as `atom -d`.

## Run all the plugin specs

To run the entire suite of tests once and exit, type:

    apm test

If you want to run all the tests and checks that are running on travis
(eslint and flow), type:

    npm test

### Check for lint

Type `npm run lint` if you want to run only the eslint checks to make sure
there are no syntax errors or other house keeping problems in the source code.

### Check for Flow errors

This project relies on [flow](http://flowtype.org/) to ensure functions and
classes are used correctly. Run all flow checks with `npm run flow-check`.

### Code Coverage

TODO: not yet integrated

## Writing commit messages

This repo uses the same changelog generation strategy that we are using in [web-ext](https://github.com/mozilla/web-ext/blob/master/CONTRIBUTING.md#writing-commit-messages)

First, try to follow the
[standard git commit message style](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html).
This includes limiting the summary to 50 chars (which integrates well with git
tools) but favor readability over conciseness if you need to go over that limit.

Next, try adhering to the Angular style of
[semantic messages](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit)
when writing a commit message.
This should allow us to auto-generate a changelog without too much noise in it.
Additionally, write the commit message in past tense so it will read
naturally as a historic changelog.

Examples:
* `feat: Added a systematic dysfunctioner`
* `fix: Fixed hang in systematic dysfunctioner`
* `docs: Improved contributor docs`
* `style: Added no-console linting, cleaned up code`
* `refactor: Split out dysfunctioner for testability`
* `perf: Systematic dysfunctioner is now 2x faster`
* `test: Added more tests for systematic dysfunctioner`
* `chore: Upgraded yargs to 3.x.x`

If you want to use scopes then it would look more like:
`feat(dysfunctioner): Added --quiet option`.

### Check for commit message lint

You can test that your commit message is formatted in a way that will support
our changelog generator like this:

    npm run changelog-lint

## Squashing commits

When fixing up a pull request based on code review comments,
[squash all commits together](https://github.com/ginatrapani/todo.txt-android/wiki/Squash-All-Commits-Related-to-a-Single-Issue-into-a-Single-Commit)
before merging. This will allow us to auto-generate a more concise
changelog. If a pull request contains more than one feature or fix then
it is okay to include each as a separate commit.

## Creating a release

TODO: to be documented
