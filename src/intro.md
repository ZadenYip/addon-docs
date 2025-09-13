# Introduction

## Translations

- 日本語: 
  - <https://t-cool.github.io/anki-addon-docs-ja/>
  - <http://rs.luminousspice.com/ankiaddons21/>
- 中文：
  - <https://zadenyip.github.io/addon-docs-zh/> 

## Overview

Anki's UI is primarily written in Python/PyQt. A number of screens, such as the review
screen and editor, also make use of TypeScript and Svelte. To write add-ons, you will
need some basic programming experience, and some familiarity with Python. The [Python
tutorial](http://docs.python.org/tutorial/) is a good place to start.

Add-ons in Anki are implemented as Python modules, which Anki loads at startup.
They can register themselves to be notified when certain actions take place (eg,
a hook that runs when the browse screen is loaded), and can make changes to the
UI (e.g.adding a new menu item) when those actions take place.

There is a [brief overview of Anki's
architecture](https://github.com/ankitects/anki/blob/main/docs/architecture.md)
available.

While it is possible to develop Anki add-ons with just a plain text editor, you
can make your life much easier by using a proper code editor/IDE. Please see the [Editor Setup](https://addon-docs.ankiweb.net/editor-setup.html) section for more information.