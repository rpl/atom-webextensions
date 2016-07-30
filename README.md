# atom-webextension plugin package

[![Build Status](https://travis-ci.org/rpl/atom-webextensions.svg?branch=master)](https://travis-ci.org/rpl/atom-webextensions)

This package provides a plugin for the [Atom Editor][atom]

It currently provides the following features:

- linting an addon project using the [addons-linter][addons-linter]
- open the WebExtensions MDN landing page

[![Screenshot of atom-webextensions in action][screenshot]][screencast]

## Installation from apm

You'll need:
* [Atom][atom], 1.0 or higher

As an highly experimental Atom plugin, this is not yet installable directly from the
Atom editor, but you can easily install it from the command line:

    apm install rpl/atom-webextensions

This command will clone the repo for you, installs any needed dependency module and
finally install it into your Atom packages dir.

## Installation from source

If you want to hack on the plugin sources, you can easily clone this repo and link
the plugin to Atom Development Mode:

    git clone https://github.com/rpl/atom-webextensions.git
    cd atom-webextensions
    apm install
    apm link --dev
    atom -d

Take a look a [CONTRIBUTING.md][contributing] for more information on how to
properly hack on the plugin sources (e.g. how to run tests, writing commit messages etc.)

[atom]: https://atom.io
[addons-linter]: https://github.com/mozilla/addons-linter
[screenshot]: https://raw.githubusercontent.com/rpl/atom-webextensions/master/assets/screenshot.png
[screencast]: https://youtu.be/7pzyDttiBhk
[contributing]: CONTRIBUTING.md
