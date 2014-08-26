/* 
 * @Author: LogIN
 * @Date:   2014-08-04 15:02:47
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-08-26 14:43:48
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-08-04 15:02:47 The Chuppy Authors
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

// Our overall **loginView** is the top-level piece of UI.

App.View.loginView = Backbone.View.extend({
    template: null,
    // Bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("body"),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
        "mouseenter .loginUserChooser": "loginUserAnimation",
        "click .loginUserChooser": "toggleBoxes",
        "click #loginContainerPrompt span.back": "toggleBoxes",
        "click #loginContainerPrompt .btn-login": "checkLogin"
    },

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function() {
        var self = this;
        // if debugging let us notify about firstRun init
        if (isDebug) {
            console.log("initialized: App.View.loginView");
        }

        new App.Database.User().fetchAll({
            withRelated: ['userDetails']
        }).then(function(collection) {

            self.template = _.template(App.Utils.Template.loadTemplate('lib/templates/main-ui/login.tpl', 'sync'), collection.models, {
                variable: 'users_models'
            });
            self.render();

        });

    },
    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
        $(this.el).append(this.template);
        return this; // returning this for chaining..
    },
    toggleBoxes: function(e) {
        var actionType = $(e.currentTarget).attr("data-id");
        var autoLogin = $(e.currentTarget).attr("data-password-login");
        var username = $(e.currentTarget).attr("data-username"); 

        if (actionType === "1") {
            // Does user wants to autologin ??
            // 0- no
            // 1- yes
            if (autoLogin === "1") {
                App.Utils.User.loginUser(username, "", this);
            } else {
                $("#loginContainerUserList").removeClass('bounceIn').addClass('bounceOut').hide();
                $("#loginContainerPrompt").show();
                $("#loginContainerUserList").removeClass('bounceOut').addClass('bounceIn').hide();
                $(".loginUserAvatar img").addClass('animated').addClass('swing');
            }

        } else if (actionType === "2") {
            $("#loginContainerPrompt").removeClass('bounceIn').addClass('bounceOut').hide();
            $(".loginUserAvatar img").removeClass('animated').removeClass('swing');

            $("#loginContainerUserList").show();
            $("#loginContainerPrompt").removeClass('bounceOut').addClass('bounceIn').hide();
        }


    },
    loginUserAnimation: function(e) {
        var loginImage = $(e.currentTarget).children('span.glyphicon');

        loginImage.addClass('bounceIn');
    },
    checkLogin: function(e) {
        var username = $("#loginUserPromptUsername").val();
        var password = $("#loginUserPromptpassword").val();

        App.Utils.User.loginUser(username, password, this);
    },
    removeView: function() {
        var self = this;

        $("#loginBox").remove();
        self.undelegateEvents();

        // this.$el.removeData().unbind(); 
        // // Remove view from DOM
        // this.remove(); 

        //App.Utils.Helpers.exitDelay("body", 3000);
        console.log("SYSTEM: LOGIN removeView");

        //Backbone.View.prototype.remove.call(this);
    }
});
