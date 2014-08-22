/* 
 * @Author: LogIN
 * @Date:   2014-08-20 14:25:48
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   login
 * @Last Modified time: 2014-08-22 16:46:13
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-08-20 14:25:48 The Chuppy Authors
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

var MainAppRouter = Backbone.Router.extend({
    routes: {
        "": "home",
    },
    initialize: function() {
        // Our default system window top bar with window actions
        if (!this.windowBar) {
            this.windowBar = new App.View.windowBar();
        }
        // If app is run for first time show user configuration interface
        if (!App.Settings.getLocal('firstRun') || App.Settings.getLocal('firstRun') === "0") {
            if (!this.setupView) {
                this.setupView = new App.View.chuppySetUp();
            }
        } else {
            App.Public.System.initilize();
        }

    }
});

$(function() {
    App.Router = new MainAppRouter();
    Backbone.history.start({
        hashChange: true,
        pushState: true
    });
});
