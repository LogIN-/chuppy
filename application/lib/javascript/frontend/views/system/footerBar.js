/* 
 * @Author: LogIN
 * @Date:   2014-08-20 14:39:36
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   login
 * @Last Modified time: 2014-08-28 10:07:44
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-08-20 14:39:36 The Chuppy Authors
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

// The Application footer bar 
// Our overall **Chuppy.View.** is the top-level piece of UI.

Chuppy.View.footerBar = Backbone.View.extend({
    template: null,
    // Bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("footer"),

    // Delegated events for creating new items, and clearing completed ones.
    // events: {
    //   "keypress #new-todo":  "createOnEnter",
    //   "click #clear-completed": "clearCompleted",
    //   "click #toggle-all": "toggleAllComplete"
    // },

    // At initialization we bind to the relevant events
    initialize: function() {
        console.log("initialized: Chuppy.View.footerBar");

        this.template = _.template(Chuppy.Utils.Template.loadTemplate('lib/templates/main-ui/footer.tpl', 'sync'), {});
        // Ensure our methods keep the `this` reference to the view itself
        _.bindAll(this, 'render');
        this.render();
    },
    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
        $(this.el).html(this.template);
        return this; // returning this for chaining..
    },
    removeView: function() {
        $(this.el).empty();
        this.undelegateEvents();
        console.log("SYSTEM: Chuppy.View.footerBar removeView");
    }
});
