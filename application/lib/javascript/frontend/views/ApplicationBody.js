/* 
 * @Author: LogIN
 * @Date:   2014-07-31 23:30:12
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-08-24 13:39:55
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-07-31 23:30:12 The Chuppy Authors
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
/* global crypt */
// The Application(s) main body container, responsible for managing tabs, sub-views etc..
// Our overall **ApplicationBody** is the top-level piece of UI.

App.View.ApplicationBodyItemHeader = Backbone.View.extend({
    // Bind to the existing skeleton of
    // the App already present in the HTML.
    template: '<a href="#application-tabs-<%- app.uid %>"><%- app.name %><span class="glyphicon glyphicon-remove"></span></a>',
    // Element container
    tagName: 'li',
    // Item html data attributes
    attributes: function() {
        return {
            'data-cid': this.model.cid,
            'data-namespace': this.model.get('name-space')
        };
    },
    // Item initialization function
    initialize: function() {
        // Ensure our methods keep the `this` reference to the view itself
        _.bindAll(this, 'render');

        // Render item template
        this.template = _.template(this.template, this.model.toJSON(), {
            variable: 'app'
        });
    },
    // Item render function
    render: function() {
        // Add item to view
        $(this.el).html(this.template);
        return this;
    },
});

App.View.ApplicationBodyItemBody = Backbone.View.extend({
    // Element container
    tagName: 'div',
    id: function() {
        return "application-tabs-" + this.model.get('uid');
    },
    // Item html data attributes
    attributes: function() {
        return {
            'data-cid': this.model.cid,
            'data-namespace': this.model.get('name-space')
        };
    },
    // Item initialization function
    initialize: function() {
        // Ensure our methods keep the `this` reference to the view itself
        _.bindAll(this, 'render');
    },
    // Item render function
    render: function() {
        return this;
    },
});

App.View.ApplicationBody = Backbone.View.extend({
    // Bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("div#application-tabs"),

    viewHeaderEl: $("ul.application-tabs-header"),
    // Is view rendered or not helper?
    _rendered: false,
    // Container for nested sub-views (item-views)
    _itemViews: [],
    // ------ _itemHeaderView: [],
    // ------ _itemBodyView: [],

    // Bind mouse events to item
    // events: {
    //   "keypress":  "createOnEnter"
    // },

    // View initialization function
    initialize: function() {
        // Ensure our methods keep the `this` reference to the view itself
        _(this).bindAll('add', 'remove');
        // add each item to the view
        this.collection.each(this.add);
        // bind this view to the add and remove events of the collection!
        this.collection.bind('add', this.add);
        this.collection.bind('remove', this.remove);
        // this.collection.bind('reset', this.reset);
        this.render();
    },
    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
        var self = this;
        var viewBodyEl = $(self.el);
        var viewHeaderEl = $(self.viewHeaderEl);

        viewBodyEl.tabs({
            active: 1
        });

        // Render each Item View and append them.
        _(this._itemViews).each(function(model) {
            var uid = model.get('uid');
            // Our application sub-view has two elements tabs header and application body
            this._itemViews[uid] = {};
            this._itemViews[uid]._itemHeaderView = new App.View.ApplicationBodyItemHeader({
                model: model
            });
            this._itemViews[uid]._itemBodyView = new App.View.ApplicationBodyItemBody({
                model: model
            });

            $(this._itemViews[uid]._itemHeaderView.render().el).appendTo(viewHeaderEl);
            $(this._itemViews[uid]._itemBodyView.render().el).appendTo(viewBodyEl);

        });
        // We keep track of the rendered state of the view
        this._rendered = true;

        viewBodyEl.tabs("refresh");

        return this;
    },
    // Add model(item) to view
    add: function(model) {
        console.info("Adding new module to main view!!");
        var uid = model.get('uid');
        // We create an updating Application view for each Application that is started.
        // And add it to the collection so that it's easy to reuse.
        if (this._itemViews[uid]) {
            console.info("Application model already added...");
            return;
        }
        // Our application sub-view has two elements tabs header and application body
        this._itemViews[uid] = {};
        this._itemViews[uid]._itemHeaderView = new App.View.ApplicationBodyItemHeader({
            model: model
        });
        this._itemViews[uid]._itemBodyView = new App.View.ApplicationBodyItemBody({
            model: model
        });
        // If the view has been rendered, then
        // we immediately append the rendered item.
        if (this._rendered === true) {
            console.info("Main view already rendered appending top it...");
            // 1. Render item view and append it to main folder view
            $(this._itemViews[uid]._itemHeaderView.render().el).appendTo($(this.viewHeaderEl));
            $(this._itemViews[uid]._itemBodyView.render().el).appendTo($(this.el));
            $(this.el).tabs("refresh");
        }
        if(model.get('active') === true){
            console.info("Activating active tab by settings!");
            var index = $('#application-tabs a[href="#application-tabs-' + uid + '"]').parent().index();
            $(this.el).tabs("option", "active", index);
        }
        this.startApp(uid, model);
    },
    startApp: function(uid, model) {
        console.info("Plug-in view appended starting internals");
        var appID = model.get('name-space');
        var options = {
            container: "#application-tabs-" + uid,
        };
        if (document.getElementById("application-tabs-" + uid) === null) {
            console.log("ERROR HTML ISNT IN PLACE", uid, appID);
            return;
        }
        // Create new app Object
        this._itemViews[uid]._itemSystemView = new App.Apps.App[appID].Setup(options);
        // Insert app styles and scripts directly into DOM
        this._itemViews[uid]._itemSystemView.setupDependencies();
        // Start app 
        this._itemViews[uid]._itemSystemView.initilizeAppUI();
    },
    // Remove one model(item) from view
    remove: function(model) {
        var self = this;
        // Remove model from DOM
        var uid = model.get('uid');
        console.info("Model remove started uid:", uid);
        if (self._rendered === true && self._itemViews[uid] !== null) {

            $(self._itemViews[uid]._itemHeaderView.el).remove();
            $(self._itemViews[uid]._itemBodyView.el).remove();
            delete self._itemViews[uid];

        } else {
            console.log("no model to remove");
        }
    },
    // Remove this view completely
    removeView: function() {
        $(this.el).remove();
        this.undelegateEvents();
        console.log("SYSTEM: ExplorerMain removeView");
    },

});
