## Introduction
`Chuppy` is an fresh open-source approach for data management. 
It gives you maximum freedom and control over your own projects and data.
Also allows you to easily share files and data without messing with 3rd-party service providers and other DNS and firewall settings.
At the end Chuppy enables you to collaborate with your team members, friends, family and provides flexible communication platform. 

[![Build Status](https://travis-ci.org/LogIN-/chuppy.svg?branch=master)](https://travis-ci.org/LogIN-/chuppy)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)


## Implemented Features

* **File managing:** Chuppy provides a workspace interface for browsing, viewing and tagging, editing and sharing your project files
* **Direct folder-sharing:** You can create as many folder shares you want. All shares have secret URL that you can give to your friend(s) and all shared files will be accessible from any machine with Internet access by direct traffic tunneling.
* **Cross-platform:** Chuppy runs perfectly on all major platforms.

## Documentation
The native Win, Lin and Mac versions of `Chuppy` are built with [node-webkit](https://github.com/rogerwang/node-webkit). node-webkit is an app runtime based on Chromium and NodeJS.

### How to run Chuppy source code?
Chuppy is not yet ready for compiling and running!!

Few thing you will need:
* NodeJS - http://nodejs.org/
* Grunt - http://gruntjs.com/installing-grunt
* node-sqlite3 - https://github.com/mapbox/node-sqlite3
    It must be compiled for desired platform to run properly:
```
    sudo npm install nw-gyp -g
    sudo npm install sqlite3 --build-from-source --runtime=node-webkit --target_arch=ia32 --target="0.10.3"
    sqlite3 package.json: "module_path": "./lib/binding/node-webkit-v0.10.3-linux-ia32" FIX
```
```
    Current ver:
    Node v0.11.13,
    Chromium 35.0.1916.157
    nodewebkit v0.10.3
```

Dependencies from package.json

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
No releases yet. This is initial phase of structure design.
The full changelog is available here: [Changelog](CHANGELOG.md)

## License
`Chuppy`'s code uses the The MIT License (MIT), see our `LICENSE` file.

## Support and Bugs
If you are having trouble, have found a bug, or want to contribute don't be shy.
[Open a ticket](https://github.com/LogIN-/chuppy/issues) on GitHub.


## Tests are not implemented yet
[![Coverage Status](https://coveralls.io/repos/LogIN-/chuppy/badge.png)](https://coveralls.io/r/LogIN-/chuppy)
