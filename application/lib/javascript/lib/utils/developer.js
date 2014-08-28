/* 
 * @Author: LogIN
 * @Date:   2014-08-21 19:49:43
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-08-28 10:06:41
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-08-21 19:49:43 The Chuppy Authors
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
/* global Chuppy */
/* global Mousetrap*/
// Global application user related operations
Chuppy.Utils.Developer = {

    // Initialize debug developer menu with developer tools
    // Resets console.log function to output nothing
    initDebugTools: function() {
        if (!isDebug) {
            // console.log = function () { return; };
        } else if (isDebug === true) {
            // Developer Menu building
            var menubar = new gui.Menu({
                    type: 'menubar'
                }),
                developerSubmenu = new gui.Menu(),
                developerItem = new gui.MenuItem({
                    label: 'Developer',
                    submenu: developerSubmenu
                }),
                debugItem = new gui.MenuItem({
                    label: 'Show developer tools',
                    click: function() {
                        win.showDevTools();
                    }
                }),
                exitItem = new gui.MenuItem({
                    label: 'Exit',
                    click: function() {
                        // win.hide();
                        // console.log("We're closing...");
                        // win.close(true);
                        // Quit current app
                        Chuppy.Utils.Helpers.exit();
                    }
                });
            menubar.append(developerItem);
            developerSubmenu.append(debugItem);
            developerSubmenu.append(exitItem);
            win.menu = menubar;

            Chuppy.Utils.FileSystem.rmdirSync('/home/login/documents/apps/science/builds/debug');
            gui.App.setCrashDumpDir('/home/login/documents/apps/science/builds/debug');
        }
        // F12 Opens DevTools
        Mousetrap.bindGlobal('f12', function() {
            win.showDevTools();
        });
        // ESC exit Chuppy
        Mousetrap.bindGlobal('esc', function() {
            Chuppy.Utils.Helpers.exit();
        });

    }

};
