# atom-webextension plugin package

[![Build Status](https://travis-ci.org/rpl/atom-webextensions.svg?branch=master)](https://travis-ci.org/rpl/atom-webextensions)
[![Package version!](https://img.shields.io/apm/v/atom-webextensions.svg?style=flat)](https://atom.io/packages/atom-webextensions)

This package provides a plugin for the [Atom Editor][atom]

It currently provides the following features:

- linting an addon project using the [addons-linter][addons-linter]
- open the WebExtensions MDN landing page

Take a look at the [Changelog][changelog] for more details about the recent changes.

[![Screenshot of atom-webextensions in action][screenshot]][screencast]

## Installation from apm

You'll need:
* [Atom][atom], 1.0 or higher

As an highly experimental Atom plugin, sometimes you may want to install a more recent version
of the one currently listed in the Atom packages list, you can easily install the "bleeding edge"
version of this plugin from the command line:

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
[changelog]: CHANGELOG.md
