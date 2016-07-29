# atom-webextension plugin package

This package provides a plugin for the [Atom Editor](https://atom.io)

It currently provides the following features:

- linting an addon project using the [addons-linter](https://github.com/mozilla/addons-linter)
- open the WebExtensions MDN landing page

## Documentation

TBD

## Installation from source

Currently you need to install it from sources.

You'll need:
* [Atom](https://atom.io/), 1.0 or higher

Change into the source and install all dependencies:

    git clone https://github.com/rpl/atom-webextensions.git
    cd atom-webextensions
    apm install
    apm link --dev
    atom -d
