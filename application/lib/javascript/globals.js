/* 
 * @Author: LogIN
 * @Date:   2014-08-20 13:13:50
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-08-28 11:03:25
 * Use of this source code is governed by a license: 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014-08-20 13:13:50 The Chuppy Authors
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
 
var
// Configuration variable
    applicationRoot = './',
    // Load native UI library
    gui = require('nw.gui'),
    // Debug flag
    isDebug = gui.App.argv.indexOf('--debug') > -1,
    // browser window object
    win = gui.Window.get(),
    // Reference to sys-tray
    tray = null,
    // os object
    os = require('os'),
    // Open a file or url in the user's preferred application.
    openExternal = require("open"),
    // path object
    path = require('path'),
    // Comprehensive MIME type mapping API
    mime = require('mime'),
    // fs object
    fs = require('fs'),
    // url object
    url = require('url'),
    // i18n module (translations)
    i18n = require('i18n'),
    // http module
    http = require('http'),
    // Our templates container object
    template = {},
    // Native implementation of bcrypt for NodeJS
    bcrypt = require('bcrypt-nodejs'),
    // Native node crypto module
    crypt = require('crypto'),
    // Contains path to MAIN database from settings
    dbLocation,
    // knex instance
    // http://knexjs.org/
    knex,
    // DB ORM - bookshelf instance
    // http://bookshelfjs.org/#
    dbORM,
    // Folder index Persistent datastore
    Datastore = require('nedb'),
    // localtunnel exposes your localhost to the world
    localtunnel = require('localtunnel'),
    // Get free port
    freeport = require('freeport'),
    // Simple featureless FTP server
    ftpd = require('ftp-server'),
    // node util module
    util = require('util'),
    // URL resolution and parsing
    url = require("url"),
    // async flow management module
    async = require("async"),
    // URL route matching 
    urlRoute = require('routes'),
    // Pure JavaScript implementation for zip
    AdmZip = require('adm-zip'),
    // Time/Data JS manipulation
    moment = require('moment'),
    // GeoIP native JS module
    geoip = require('geoip-lite'),
    // Signed and unsigned cookies based on Keygrip
    Cookies = require('cookies'),
    // Module for signing and verifying data through a rotating credential system
    Keygrip = require('keygrip');

// window state preservation across platforms
// - /lib/javascript/lib/winstate.js
var
// Object with window coordinates and state
    winState = {},
    // String with current window mode: maximized, minimized, normal
    currWinMode,
    // resize event one resize action (setTiemout)
    resizeTimeout,
    // resize event one move action (setTiemout)
    moveTimeout,
    // resize maximized window, so it's no longer maximized
    isMaximizationEvent = false;

// Global Chuppy object for application skeleton structure
var Chuppy = {
    // Our main application router
    Router: null,
    // All backbone collections will be initialized in this context
    Collections: {},
    View: {},
    Model: {},
    // ????
    Page: {},
    // Object that contains few helper objects with common functions
    // - /lib/javascript/lib/utils.js
    Utils: {
        Share: {}
    },
    // Object that contains DB CURD operations
    // - /lib/javascript/lib/database.js
    Database: {},
    // Configuration variables for our app 
    // - /lib/javascript/lib/settings.js
    Settings: {},
    // Object with system apps configuration and runtime
    Apps: {
        Configuration : require('./apps/config.json'),
        App: []
    },
    // Public object class that will hold our current user etc...
    // lib/public/
    Public: {},
    Private: {}
};
