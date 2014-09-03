## Introduction
`Chuppy` is an fresh open-source approach for data management. 
It gives you maximum freedom and control over your own projects and data.
Also allows you to easily share files and data without messing with 3rd-party service providers and other DNS and firewall settings.
At the end Chuppy enables you to collaborate with your team members, friends, family and provides flexible communication platform. 

[![Build Status](https://travis-ci.org/LogIN-/chuppy.svg?branch=master)](https://travis-ci.org/LogIN-/chuppy)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)


## Implemented Features
* **File managing:** Chuppy provides a workspace interface for browsing, viewing, editing and sharing your local files
* **Direct folder-sharing:** You can create as many folder shares you want. All shares have secret URL that you can give to your friend(s) and all shared files will be accessible from any machine with Internet access by direct traffic tunneling.
* **Cross-platform:** Chuppy should run perfectly on all major platforms.

## Partially Implemented Apps(plug-ins)
* **com.editorAce** [Homepage](http://ace.c9.io/#nav=about)
* **com.editorHtml** [Homepage](http://hackerwins.github.io/summernote/)
* **com.editorOdf** [Homepage](http://www.webodf.org/)
* **com.mdViewer** [Homepage](https://github.com/chjj/marked)
* **com.pdfViewer** [Homepage](http://mozilla.github.io/pdf.js/)
* **com.videoViewer** [Homepage](http://www.videojs.com/)

## Documentation
The native versions of `Chuppy` are built with [node-webkit](https://github.com/rogerwang/node-webkit). node-webkit is an app runtime based on Chromium and NodeJS.
For view management its heavily uses backbonejs

### How to run Chuppy source code?
Chuppy is not yet ready for compiling and running, this is developer release!
but if you wont give it a shoot use (dev) branch and:
Few thing you will need:
* NodeJS - http://nodejs.org/
* Grunt - http://gruntjs.com/installing-grunt
* node-sqlite3 - https://github.com/mapbox/node-sqlite3
    It must be compiled for desired platform to run properly:
```
    1. nodejs: [installing guide](http://bit.ly/1pHkjRW)
    2. [Grunt](http://gruntjs.com/getting-started) : sudo npm install -g grunt-cli
    3. [nw-gyp](https://github.com/rogerwang/nw-gyp): sudo npm install nw-gyp -g
    4. Install deps from main package.json file - npm install
    5. Install deps from app package.json file  - cd application/ && npm install
    6. Compile [sqlite3](https://github.com/mapbox/node-sqlite3#building-for-node-webkit) for your platform: 
       sudo npm install sqlite3 --build-from-source --runtime=node-webkit --target_arch=ia32 --target="0.10.3"
       In case of error: sqlite3 -> package.json -> replace "module_path": "./lib/binding/node-webkit-v0.10.3-linux-ia32"
    7. Edit: node_modules/grunt-node-webkit-builder/tasks/node_webkit_builder.js Edit: L:49-77 ["files"] add missing file(s) like icudt.dat
    8. Add grunt.sublime-build as build system in Sublime or just run grunt from shell. If everything is correctly set `Chuppy` should run.
    Current versions:
    - Node          v0.11.13
    - Chromium      35.0.1916.157
    - node-webkit   v0.10.3
```
## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
No releases yet. This is initial phase of structure design.
The full changelog is available here: [Changelog](CHANGELOG.md)

## License
`Chuppy`'s source-code uses the The MIT License (MIT), see our `LICENSE` file.

## Support and Bugs
If you are having trouble, have found a bug, or want to contribute don't be shy.
[Open a ticket](https://github.com/LogIN-/chuppy/issues) on GitHub.
