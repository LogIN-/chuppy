/* 
 * @Author: LogIN
 * @Date:   2014-07-30 11:41:37
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   login
 * @Last Modified time: 2014-08-28 10:04:26
 * Use of this source code is governed by a license: 
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-07-30 11:41:37 The Chuppy Authors
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
 *
 * Cross-platform window state preservation.
 * Yes this code is quite complicated, but this is the best I came up with for
 * current state of node-webkit Window API (v0.7.3 and later).
 *
 * Known issues:
 * - Unmaximization not always sets the window (x, y) in the lastly used coordinates.
 * - Unmaximization animation sometimes looks wierd.
 * - Extra height added to window, at least in linux x64 gnome-shell env. It seems that
 *   when we read height then it returns it with window frame, but if we resize window
 *   then it applies dimensions only to internal document without external frame.
 *   Need to test in other environments with different visual themes.
 *
 * Change log:
 * 2013-12-01
 * - Workaround of extra height in gnome-shell added.
 *
 * 2014-03-22
 * - Repared workaround (from 2013-12-01) behaviour when use frameless window.
 *   Now it works correctly.
 */
// Set global variable for Jslint
/* global Chuppy */

// extra height added in linux x64 gnome-shell env, use it as workaround
var deltaHeight = (function() {
    // use deltaHeight only in windows with frame enabled
    if (gui.App.manifest.window.frame) {
        return true;
    } else {
        return 'disabled';
    }
})();

function restoreWindowState() {
    // deltaHeight already saved, so just restore it and adjust window height
    if (deltaHeight !== 'disabled' && typeof winState.deltaHeight !== 'undefined') {
        deltaHeight = winState.deltaHeight;
        winState.height = winState.height - deltaHeight;
    }

    win.resizeTo(winState.width, winState.height);
    win.moveTo(winState.x, winState.y);
}

function dumpWindowState() {
    if (!winState) {
        winState = {};
    }

    // we don't want to save minimized state, only maximized or normal
    if (currWinMode === 'maximized') {
        winState.mode = 'maximized';
    } else {
        winState.mode = 'normal';
    }

    // when window is maximized you want to preserve normal
    // window dimensions to restore them later (even between sessions)
    if (currWinMode === 'normal') {
        winState.x = win.x;
        winState.y = win.y;
        winState.width = win.width;
        winState.height = win.height;

        // save delta only of it is not zero
        if (deltaHeight !== 'disabled' && deltaHeight !== 0 && currWinMode !== 'maximized') {
            winState.deltaHeight = deltaHeight;
        }
    }
}

function initWindowState() {
    winState = JSON.parse(Chuppy.Settings.getLocal('windowState') || 'null');

    if (winState) {
        currWinMode = winState.mode;
        if (currWinMode === 'maximized') {
            win.maximize();
        } else {
            restoreWindowState();
        }
    } else {
        currWinMode = 'normal';
        if (deltaHeight !== 'disabled') {
            deltaHeight = 0;
        }
        dumpWindowState();
    }

    win.show();
}

function saveWindowState() {
    dumpWindowState();
    Chuppy.Settings.setLocal('windowState', JSON.stringify(winState));
}
initWindowState();

win.on('maximize', function() {
    isMaximizationEvent = true;
    currWinMode = 'maximized';
});

win.on('unmaximize', function() {
    currWinMode = 'normal';
    restoreWindowState();
});

win.on('minimize', function() {
    currWinMode = 'minimized';
});

win.on('restore', function() {
    currWinMode = 'normal';
});

win.on('move', function() {
    // move event is fired many times on one resize action,
    // this hack with setTiemout forces it to fire only once
    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(function() {
        // save window coordinates/state for nice restore
        dumpWindowState();
    }, 500);
});
win.on('resize', function() {
    // resize event is fired many times on one resize action,
    // this hack with setTiemout forces it to fire only once
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {

        // on MacOS you can resize maximized window, so it's no longer maximized
        if (isMaximizationEvent) {
            // first resize after maximization event should be ignored
            isMaximizationEvent = false;
        } else {
            if (currWinMode === 'maximized') {
                currWinMode = 'normal';
            }
        }

        // there is no deltaHeight yet, calculate it and adjust window size
        if (deltaHeight !== 'disabled' && deltaHeight === false) {
            deltaHeight = win.height - winState.height;

            // set correct size
            if (deltaHeight !== 0) {
                win.resizeTo(winState.width, win.height - deltaHeight);
            }
        }

        dumpWindowState();

    }, 500);
});

win.on('close', function() {
    saveWindowState();
    this.close(true);
});

// Manage window active state for styling...
win.on('blur', function(e) {
    $("#overlay").addClass('inactive');
});

win.on('focus', function(e) {
    $("#overlay").removeClass('inactive');
});
