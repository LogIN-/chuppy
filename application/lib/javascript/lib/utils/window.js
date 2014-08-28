/* 
 * @Author: LogIN
 * @Date:   2014-08-22 10:39:49
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   login
 * @Last Modified time: 2014-08-28 10:05:06
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-08-22 10:39:49 The Chuppy Authors
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
// Set global variable for Jslint
/* global dumpWindowState, restoreWindowState, openExternal, Chuppy */

// Global window behaver functions
Chuppy.Utils.Window = {
    // Maximize current window
    minimize: function() {
        win.minimize();
    },
    // Minimze current window
    maximize: function() {
        win.maximize();
    },
    // Restore current window from maximize
    unmaximize: function() {
        win.unmaximize();
    },
    // Close current window
    closewin: function() {
        win.close(true);
    },
    // Window nav-bar action handler
    action: function(action_type) {
        switch (action_type) {
            case 0: // data-id 0 minimize window action
                Chuppy.Utils.Window.minimize();
                break;
            case 1: // data-id 1 maximize window action
                Chuppy.Utils.Window.maximize();
                break;
            case 2: // data-id 2 unmaximize window action
                Chuppy.Utils.Window.unmaximize();
                break;
            case 3: // data-id 3 shutdown window action
                Chuppy.Utils.Helpers.exit();
                break;
            default: // defoult action is to maximize window
                Chuppy.Utils.Window.maximize();

        }

    },
    // Creates tray menu icon and menu
    initTray: function() {
        if (tray === null) {
            // Show tray
            tray = new gui.Tray({
                title: 'Chuppy',
                tooltip: 'Click to open Chuppy',
                icon: 'lib/images/icon.png'
            });

            // Give it a menu
            var menu = new gui.Menu();
            menu.append(new gui.MenuItem({
                type: "normal",
                label: 'Exit',
                icon: "lib/images/icon.png",
                click: function() {
                    // win.hide();
                    // console.log("We're closing...");
                    // win.close(true);
                    // Quit current app
                    Chuppy.Utils.Helpers.exit();
                }
            }));
            tray.menu = menu;
        }
        // Show window and remove tray when clicked
        tray.on('click', function() {

            if (currWinMode !== 'minimized' && currWinMode !== 'hidden') {
                // save window coordinates/state for nice restore
                dumpWindowState();
                win.hide();
                currWinMode = 'hidden';

            } else if (currWinMode === 'hidden') {
                win.show();
                currWinMode = 'normal';
                restoreWindowState();
            } else if (currWinMode === 'minimized') {
                win.restore();
                currWinMode = 'normal';
                restoreWindowState();
            } else {
                console.log(currWinMode);
            }
        });
    },
    // Handle external links
    openLinkExternally: function(url) {
        console.log('opening:', url);
        openExternal(url);
        // _system is needed for cordova
        // window.open(url, "_system");
    },
    // Manage Drag and Drop events
    // They should be disabled on all elements except application body
    manageDragAndDrop: function(e) {
        // Stops from redirecting.
        if (e.preventDefault) {
            e.preventDefault();
        }
    }

};
