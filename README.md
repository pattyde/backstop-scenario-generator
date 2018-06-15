⚾️ BackstopJS Scenario Generator
==============

> A simple script to generate a [BackstopJS](https://github.com/garris/BackstopJS#testing-across-different-environments) configuration file from an array of
URLs.

## Install

1. Make sure you have a current version of `node` and `npm`.

1. Download or copy the `generate-scenario.js` file to your BackstopJS project
directory.

Tested on `BackstopJS v3.2.17`, `node v10.3.0` and `npm v6.1.0`

## Usage

```console
node generate-scenario.js
```

This will create a new file in the directory called `backstop.json`. If a file
named `backstop.json` already exists it will overwrite it, so if you have an
existing configuration file, make sure you back it up before running the script.

By default, BackstopJS will look for this file when you run `backstop test`.

The script takes a reference URL to make it easy to
[test across different environments](https://github.com/garris/BackstopJS#testing-across-different-environments).

## Release History

* v0.0.0 - Initial commit
