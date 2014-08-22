/* 
 * @Author: LogIN
 * @Date:   2014-08-22 16:21:07
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-08-22 16:48:57
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-08-22 16:21:07 The Chuppy Authors
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

/**
 * Handles configuration variables for the Chuppy.
 * Closely tied to the update process, uses localStorage for everything
 */

App.Settings = {

    _defaultSettings: {
        // Default to the first beta -- application version
        "version": "0.1.0",
        // database version
        "dbVersion": "1.0",
        // Database file name its replaced with install_token on first run
        "DBLocation": "chuppy.sqlite",
        "devDBLocation": "/home/login/documents/apps/science/application/databases/chuppy_v1.sqlite",
        // Used to check for the latest version
        "updateNotificationUrl": "http://chuppy.cu.cc/api/update.json",
        // Used to check if there's an internet connection
        "connectionCheckUrl": "http://www.google.com",
        // Application temp folder for cache it is deleted on application exit
        "temp": path.join(os.tmpDir(), 'chuppy'),
        // Checks if installation is necessary 
        "firstRun": "0", // 0- program is not setup jet, 1 - first run is already made
        // little hashing / salting helpers/tokens
        "install_uuid": App.Utils.Helpers.genUUID(),
        "token": App.Utils.Helpers.genUUID(),
        "salt": App.Utils.Helpers.genUUID()
    },

    setup: function(forceReset) {
        //  Clear HTML5 local storage
        if (forceReset === true) {
            window.localStorage.clear();
            console.log("CLEARING LOCAL STORAGE");
        }

        // If there's no version, assume it's a new install
        if (typeof App.Settings.getLocal('version') === 'undefined') {
            window.__isNewInstall = true;
        }
        // Set default values
        for (var key in App.Settings._defaultSettings) {
            // Create new settings if necessary
            if (typeof App.Settings.getLocal(key) === 'undefined' || (forceReset === true)) {
                App.Settings.setLocal(key, App.Settings._defaultSettings[key]);
            }
        }

        App.Settings.performUpgrade();
    },

    performUpgrade: function() {

        var currentVersion = gui.App.manifest.version;

        if (currentVersion > App.Settings.getLocal('version')) {
            // Nuke the DB if there's a newer version
            // Todo: Make this nicer so we don't lose all the cached data
            // var cacheDb = openDatabase('cachedb', '1.0', 'Cache database', 50 * 1024 * 1024);
            // cacheDb.transaction(function (tx) {
            //     tx.executeSql('DELETE FROM');
            // });

            // Add an upgrade flag
            window.__isUpgradeInstall = true;
        }

        App.Settings.setLocal('version', currentVersion);
    },
    getLocal: function(varName) {
        return localStorage['settings_' + varName];
    },
    setLocal: function(varName, varValue) {
        localStorage.setItem('settings_' + varName, varValue);
    },
    delLocal: function(varName) {
        localStorage.removeItem('settings_' + varName);
    }

};

App.Settings.setup(false);
