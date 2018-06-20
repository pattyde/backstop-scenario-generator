⚾️ BackstopJS Scenario Generator
==============

> A simple script to generate a [BackstopJS](https://github.com/garris/BackstopJS#testing-across-different-environments)
configuration file.

## Install

```console
npm install --global backstop-scenario-generator
```

Tested on `BackstopJS v3.2.17`, `node v10.3.0` and `npm v6.1.0`

## Usage

```console
$ generate-scenarios
Test URL: http://localhost:8080
Reference URL: https:yourproductionsite.com
Backstop configuration file successfully created
```

You will be prompted for two URLs: Test URL and Reference URL.

This will create a new file in the current directory called `backstop.json`. If a file
named `backstop.json` already exists it will overwrite it, so if you have an
existing configuration file, **make sure you back it up before running the script**.

**Test URL** is the URL for the site you want to test. It will be passed to
[get-site-urls](https://www.npmjs.com/package/get-site-urls) to fetch a
complete list of URLs on your site to test. Each URL returned will be associated
with the `url` key for each scenario.

**Reference URL** is the URL for the site you're testing against. This is
typically your production or live site. This URL will be associated with
`referenceUrl` key for each scenario.

The reference URL makes it easy to
[test across different environments](https://github.com/garris/BackstopJS#testing-across-different-environments).

## Release History

* v1.0.2 - 💄 Use spaces for alignment, always.
* v1.0.1 - 📚 Update readme
* v1.0.0 - ✨ Get test and reference URLs from prompt
* v0.0.0 - 🎉 Initial commit
