/* 
 * @Author: LogIN
 * @Date:   2014-08-21 19:48:36
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-08-22 16:48:08
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-08-21 19:48:36 The Chuppy Authors
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

// General global application functions
App.Utils.Helpers = {
    // Exit application
    exit: function() {
        win.close(true);
        gui.App.quit();
    },
    // Exit application with delay
    exitDelay: function(element, miliseconds) {
        // Default values
        element = typeof element !== 'undefined' ? element : "body";
        miliseconds = typeof miliseconds !== 'undefined' ? miliseconds : 1000;

        // We need to prevent multiple clicks
        if ($(element).hasClass('quitting')) {
            return;
        }
        // Add nice animation  
        $(element).addClass('quitting');
        // Quit after n miliseconds
        setTimeout(function() {
            // Quit current app
            App.Utils.Helpers.exit();
        }, miliseconds);
    },
    // Detect the operating system of the user
    getOperatingSystem: function() {
        var platform = os.platform();

        if (platform === 'win32' || platform === 'win64') {
            return 'windows';
        }
        if (platform === 'darwin') {
            return 'mac';
        }
        if (platform === 'linux') {
            return 'linux';
        }
        return null;
    },
    // Check if the user has a working internet connection (uses Google as reference)
    checkInternetConnection: function(callback) {
        var hasInternetConnection = false;

        var opts = url.parse(App.Settings.getLocal('connectionCheckUrl'));
        opts.method = 'HEAD';
        http.get(opts, function(res) {
            if (res.statusCode === 200 || res.statusCode === 302 || res.statusCode === 301) {
                hasInternetConnection = true;
            }
            if (typeof callback === 'function') {
                callback(hasInternetConnection);
            }
        });
    },
    // Detect the language and update the global Language file
    detectLanguage: function(preferredLanguage) {
        var pureLanguage = false;
        var baseLanguage = false;

        var language = window.navigator.userLanguage || window.navigator.language || false;

        if (language !== false) {
            // The full OS language (with localization, like "en-uk")
            pureLanguage = language.toLowerCase();
            // The global language name (without localization, like "en")
            baseLanguage = language.toLowerCase().slice(0, 2);
        }


        if (isDebug) {
            console.log('pureLanguage: ' + pureLanguage + ' baseLanguage: ' + baseLanguage + ' preferredLanguage: ' + preferredLanguage);
        }

        if (pureLanguage !== false && fs.existsSync('lib/language/' + pureLanguage + '.json')) {
            i18n.setLocale(pureLanguage);
            if (isDebug) {
                console.log('detectLanguage : pureLanguage');
            }

        } else if (baseLanguage !== false && fs.existsSync('lib/language/' + baseLanguage + '.json')) {
            i18n.setLocale(baseLanguage);
            if (isDebug) {
                console.log('detectLanguage : baseLanguage');
            }

        } else {
            i18n.setLocale(preferredLanguage);
            if (isDebug) {
                console.log('detectLanguage : preferredLanguage');
            }
        }


    },
    // Throttling function calls
    // http://remysharp.com/2010/07/21/throttling-function-calls/
    throttle: function(handler, time) {
        var throttle;
        time = time || 300;
        return function() {
            var args = arguments,
                context = this;
            clearTimeout(throttle);
            throttle = setTimeout(function() {
                handler.apply(context, args);
            }, time);
        };
    },
    genUUID: function() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
        return uuid;
    }
};
