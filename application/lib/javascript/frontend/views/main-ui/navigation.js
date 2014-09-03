/* 
 * @Author: LogIN
 * @Date:   2014-08-20 16:00:05
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   login
 * @Last Modified time: 2014-08-28 10:07:50
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-08-20 16:00:05 The Chuppy Authors
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

// The Application navigation bar 
// Our overall **Chuppy.View.** is the top-level piece of UI.

Chuppy.View.navigation = Backbone.View.extend({
    apps: null,
    template: null,
    // Bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#main-view"),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
        "click #nav-side-left li": "startApp"
    },

    // At initialization we bind to the relevant events
    initialize: function(options) {
        var self = this;

        console.log("initialized: Chuppy.View.navigation");
        // list of apps with details
        self.apps = options.menuItems;
        self.template = _.template(Chuppy.Utils.Template.loadTemplate('lib/templates/main-ui/left-navigation.tpl', 'sync'), self.apps, {
            variable: 'menuItems'
        });
        self.render();
    },
    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
        $(this.el).append(this.template);
        return this; // returning this for chaining..
    },
    startApp: function(e) {
        var element = $(e.currentTarget);
        var appID = element.attr('data-href');
        // load and start application
        Chuppy.Public.System.startApp(appID);
    },
    removeView: function() {
        var self = this;
        $("#left-navigation").remove();
        self.undelegateEvents();
        console.log("SYSTEM: Chuppy.View.navigation removeView");
    }
});
