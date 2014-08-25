/* 
 * @Author: LogIN
 * @Date:   2014-08-01 18:05:41
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-08-25 10:58:28
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-08-01 18:05:41 The Chuppy Authors
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

// The Application window bar 
// ---------------

// Our overall **AppView** is the top-level piece of UI.

App.View.WindowBar = Backbone.View.extend({
    template: _.template(App.Utils.Template.loadTemplate('lib/templates/main-ui/windows-bar.tpl', 'sync'), {}),
    // Bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#top-headers"),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
        "click #windows-bar button": "windowResizeActions"
    },

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function() {
        // if debugging let us notify about firstRun init
        if (isDebug) {
            console.log("initialized: App.View.WindowBar");
        }
        // Ensure our methods keep the `this` reference to the view itself
        _.bindAll(this, 'render');
        this.render();
    },
    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
        $(this.el).append(this.template);
        return this; // returning this for chaining..
    },
    windowResizeActions: function(e) {
        var actionType = $(e.currentTarget).attr('data-id');
        var buttonImage = $(e.currentTarget).children('span.glyphicon');

        switch (parseInt(actionType, 10)) {
            case 0: // data-id 0 minimize window action
                App.Utils.Window.action(0);
                break;
            case 1: // data-id 1 maximize window action
                App.Utils.Window.action(1);
                buttonImage.removeClass('glyphicon-chevron-up');
                buttonImage.addClass('glyphicon-collapse-down');
                $(e.currentTarget).attr("data-id", "2");
                break;
            case 2: // data-id 2 unmaximize window action
                App.Utils.Window.action(2);
                buttonImage.removeClass('glyphicon-collapse-down');
                buttonImage.addClass('glyphicon-chevron-up');
                $(e.currentTarget).attr("data-id", "1");
                break;
            case 3: // data-id 3 shutdown window action
                App.Utils.Helpers.exitDelay(null, 1500);
                // App.Utils.Window.action(3);
                break;
            default: // defoult action is to maximize window
                App.Utils.Window.action(1);
                buttonImage.removeClass('glyphicon-chevron-up');
                buttonImage.addClass('glyphicon-collapse-down');
                $(e.currentTarget).attr("data-id", "2");
        }
        if (isDebug) {
            console.log('System, App.View.WindowBar: windowResizeActions: ', actionType);
        }

    }

});
