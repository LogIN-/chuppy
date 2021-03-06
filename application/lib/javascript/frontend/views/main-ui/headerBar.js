/* 
 * @Author: LogIN
 * @Date:   2014-08-21 10:44:36
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   login
 * @Last Modified time: 2014-08-28 10:07:58
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-08-21 10:44:36 The Chuppy Authors
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

// The Application window bar 
// Our overall **loginView** is the top-level piece of UI.

Chuppy.View.headerBar = Backbone.View.extend({
    user: Chuppy.Public.User.getUserKeysAll(),
    template: null,
    // Bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#top-headers"),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
        "click #header-user-panel li a": "userPanelActions",
    },

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function() {
        // if debugging let us notify about firstRun init
        if (isDebug) {
            console.log("initialized: Chuppy.View.headerBar");
        }

        this.template = _.template(Chuppy.Utils.Template.loadTemplate('lib/templates/main-ui/header-bar.tpl', 'sync'), this.user, {
            variable: 'user'
        });

        this.render();
    },
    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
        $(this.el).append(this.template);
        return this; // returning this for chaining..
    },
    userPanelActions: function(e) {
        var actionType = $(e.currentTarget).attr('data-id');

        if (actionType === "0") { // data-id 0 shutdown Chuppy action
            // Dialog variables
            var dialogTitle = i18n.__('Confirm to quit:');
            var dialogContent = i18n.__('Any unsaved changes will be permanently deleted and cannot be recovered. Are you sure to quit?');
            var dialogButtons = [{
                text: i18n.__('Exit'),
                click: function() {
                    Chuppy.Utils.Functions.doPlaySound('lib/sounds/service-logout.oga');
                    $(this).dialog("close");
                    $(this).remove();
                    // Just in case clear User and System objects from memory
                    Chuppy.Public.User.resetValues();
                    Chuppy.Public.System.resetValues();
                    Chuppy.Utils.Helpers.exit();
                }
            }, {
                text: i18n.__('Cancel'),
                click: function() {
                    $(this).dialog("close");
                    $(this).remove();
                }
            }];
            // Show dialog
            Chuppy.Utils.Template.confirmDialog(dialogTitle, dialogContent, dialogButtons);

        } else if (actionType === "1") { // data-id 1 logout Chuppy action
            // Reset and clear all active classes and system values
            Chuppy.Public.System.reInitilize();

        } else if (actionType === "2") {
            console.log("User Setting window");
        }

    },
    removeView: function() {
        $("#header-bar").remove();
        this.undelegateEvents();
        console.log("SYSTEM: Chuppy.View.headerBar removeView");
    }
});
