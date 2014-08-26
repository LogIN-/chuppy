/* 
 * @Author: LogIN
 * @Date:   2014-08-22 16:21:53
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-08-26 14:50:46
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-08-22 16:21:53 The Chuppy Authors
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

// Create the System Temp Folder. This is used to store temporary data files.
App.Utils.FileSystem.initTempFolder();

// Wipe the tmpFolder when closing the app (this frees up disk space)
win.on('close', function() {
    App.Utils.FileSystem.wipeTempFolder();
    App.Utils.Window.closewin();
});

// Handles language detection and internationalization
// https://github.com/mashpie/i18n-node
i18n.configure({
    defaultLocale: 'en',
    locales: ['ar', 'da', 'de', 'en', 'es', 'eu', 'fr', 'gr', 'he', 'it', 'ja', 'kr',
        'lt', 'nl', 'no', 'pl', 'pt', 'pt-br', 'ro', 'ru', 'sk', 'sv', 'tr'
    ],
    directory: './lib/language',
    debug: true,
    saveMissing: true
});

// lets try to detect and set app language - The default is English
App.Utils.Helpers.detectLanguage('en');


// Not debugging, hide all messages!
App.Utils.Developer.initDebugTools();


// Set the app title (for Windows mostly)
win.title = 'Chuppy';

// Focus the window when the app opens
win.focus();

// Lets set Try icon and Menu
App.Utils.Window.initTray();

// Cancel all new windows (Middle clicks / New Tab)
win.on('new-win-policy', function(frame, url, policy) {
    console.log("Window policy:", url);
    policy.ignore();
});


// Prevent dropping files into the window (this can be overridden from subapps views if needed)
window.addEventListener("dragover", App.Utils.Window.manageDragAndDrop, false);
window.addEventListener("drop", App.Utils.Window.manageDragAndDrop, false);
// Prevent dragging files outside the window
window.addEventListener("dragstart", App.Utils.Window.manageDragAndDrop, false);

// ***********************************************************
// if(!isDebug){
//     /**
//     * Show 404 page on uncaughtException
//     */
//     process.on('uncaughtException', function(e) {
//         console.log('**********************************');
//         console.log(e.toString());
//         console.log('**********************************');
//         // process.exit(1);
//     });
// }


// Initialize application
// Our default system window top bar with window actions
$(function() {
    if (!App.View.windowBar) {
        App.View.windowBar = new App.View.WindowBar();
    }
    // If app is run for first time show user configuration interface
    if (!App.Settings.getLocal('firstRun') || App.Settings.getLocal('firstRun') === "0") {
        if (!App.View.chuppySetUp) {
            App.View.chuppySetUp = new App.View.ChuppySetUp();
        }
    } else {
        App.Public.System.initilize();
    }
});