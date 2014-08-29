/* 
 * @Author: LogIN
 * @Date:   2014-07-31 23:30:12
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-08-29 14:52:16
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
 // Set global variable for Jslint
/* global Chuppy */
/* global crypt, moment */
// The Application(s) main body container, responsible for managing tabs, sub-views etc..
// Our overall **ApplicationBody** is the top-level piece of UI.

Chuppy.View.ApplicationBodyItemHeader = Backbone.View.extend({
    // Bind to the existing skeleton of
    // the App already present in the HTML.
    template: '<a href="#application-tabs-<%- app.uid %>">' +
              '<% if(app.supportedFileTypes) { %>' +
              '<div class="pull-left">' +
              '    <img ' +
              '    style="position: absolute; top: 2px; left: 2px"' +
              '    onerror="$(this).avatar();" ' +
              '    data-fontSize="13"' +
              '    data-name="<%- app.name %>"' +
              '    data-width="18" ' +
              '    data-height="18" ' +
              '    width="18" ' +
              '    height="18" ' +
              '    src="lib/images/system-icons/extensions/<%- app.supportedFileTypes[0] %>.png" ' +
              '    alt="<%- app.name %>" ' +
              '    class="animated swing img-circle" />' +
              '</div>' +
              '<% } %>' + 
              '<span class="titleText"><%= i18n.__(app.name) %></span>' +
              '<span class="glyphicon glyphicon-remove"></span></a>',

    scrollTitleInterval: null,
    // Element container
    tagName: 'li',
    // Item html data attributes
    attributes: function() {
        return {
            'data-cid': this.model.cid,
            'data-uid': this.model.get('uid'),
            'data-namespace': this.model.get('name-space')
        };
    },
    events: {
        "click span.glyphicon-remove": "removeTabView",
        "mouseenter": "mouseOverStart",
        "mouseleave": "mouseOverStop"
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
    removeTabView: function(e) {
        var element = $(this.el);
        var modelCID = element.attr('data-cid');
        var model = Chuppy.Public.System.mainUI.collection.applications.get({
            cid: modelCID
        });
        if (model !== null) {
            console.log(model);
            console.info("Removing model from main View collection: ", modelCID);
            Chuppy.Public.System.mainUI.collection.applications.remove(model);
        }
    },
    mouseOverStart: function(e) {
        var titleElement = $(e.currentTarget).find('span.titleText');
        var title = titleElement.text(); 
        var titleLenght = title.length; 
        if(titleLenght > 10){
            var start = 1; 
            var newTitle;
            console.info("Title scroll interval started!");
            console.info(title);

            this.scrollTitleInterval = setInterval(function() {
                newTitle = title.substring(start, titleLenght) + title.substring(0, start);
                titleElement.html(newTitle); 
                start++;
                if (start === titleLenght + 1) {
                    start = 0;
                }
            }, 100);
        }
    },
    mouseOverStop: function(e) {
        if(this.scrollTitleInterval !== null){
            console.info("Title scroll interval stopped!");
            clearInterval(this.scrollTitleInterval);
            this.scrollTitleInterval = null;

            var modelCID = $(e.currentTarget).attr('data-cid');
            var model = Chuppy.Public.System.mainUI.collection.applications.get({
                cid: modelCID
            });
            $(e.currentTarget).find('span.titleText').html(model.get('tile')); 
        }
    }
});

Chuppy.View.ApplicationBodyItemBody = Backbone.View.extend({
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

Chuppy.View.ApplicationBody = Backbone.View.extend({
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

    // View initialization function
    initialize: function() {
        // Ensure our methods keep the `this` reference to the view itself
        _(this).bindAll('add', 'remove');
        // add each item to the view
        this.collection.each(this.add);
        // bind this view to the add and remove events of the collection!
        this.collection.bind('add', this.add);
        this.collection.bind('remove', this.remove);
        // this.collection.bind('reset', this.removeAll);
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
            this._itemViews[uid]._itemHeaderView = new Chuppy.View.ApplicationBodyItemHeader({
                model: model
            });
            this._itemViews[uid]._itemBodyView = new Chuppy.View.ApplicationBodyItemBody({
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
    /* UNUSED FUNCTION */
    removeAll: function() {
        console.info("Application body collection hard reset!");
        var self = this;
        console.log(self._itemViews);
        // Remove every model from view
        self._itemViews.forEach(function(model) {
            console.info("Removing main model view!");
            console.log(model._itemBodyView.get('uid'));
            self.remove(model._itemBodyView);
        });
        // Reset our check variables and model view container
        this._itemViews = null;
        this._rendered = false;
    },
    // Add model(item) to view
    add: function(model) {
        console.info("Adding new module to main view!!");
        console.log(model.toJSON());

        // Generate unique model UID
        var uid = model.get('uid') + moment();
        // Set new model UID
        model.set('uid', uid);

        // If UID is already in array don't allow re-adding it        
        if (this._itemViews[uid]) {
            console.info("Application model already added...");
            return;
        }

        // Our application sub-view has two elements tabs header and application body
        this._itemViews[uid] = {};
        // We create an updating Application view for each Application that is started.
        this._itemViews[uid]._itemHeaderView = new Chuppy.View.ApplicationBodyItemHeader({
            model: model
        });
        this._itemViews[uid]._itemBodyView = new Chuppy.View.ApplicationBodyItemBody({
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

        console.info("Activating active tab by settings!");
        var index = $('#application-tabs a[href="#application-tabs-' + uid + '"]').parent().index();
        $(this.el).tabs("option", "active", index);
        $(this.el).find(".ui-tabs-nav").sortable({
            axis: "x",
            stop: function() {
                $(this.el).tabs("refresh");
            }
        });
        this.startAppTab(model);
        this.checkTabVisibility();
    },
    startAppTab: function(model) {
        console.info("Plug-in view appended starting internals");
        var appID = model.get('name-space');
        var uid = model.get('uid');

        if (document.getElementById("application-tabs-" + uid) === null) {
            console.log("ERROR HTML ISNT IN PLACE", uid, appID);
            return;
        }
        // Create new app Object
        Chuppy.Public.System.mainUI.views.apps[uid] = new Chuppy.Apps.App[appID].Setup(model.toJSON());
        // Insert app styles and scripts directly into DOM
        Chuppy.Public.System.mainUI.views.apps[uid].setupDependencies();
        // Start app 
        Chuppy.Public.System.mainUI.views.apps[uid].initilizeAppUI();
    },
    checkTabVisibility: function() {
        var activeViews = Object.keys(this._itemViews).length;
        console.info("Checking - checkTabVisibility, total:", activeViews);
        if (activeViews === 1) {
            $("#application-tabs .ui-tabs-nav").hide();
        } else {
            $("#application-tabs .ui-tabs-nav").show();
        }
        if (activeViews === 0) {
            $(this.el).tabs("destroy");
        }
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

            Chuppy.Public.System.mainUI.views.apps[uid].removeView();

            console.info("Model removed:", uid);
            delete self._itemViews[uid];
            
            $(this.el).tabs("refresh");
        } else {
            console.log("no model to remove");
        }
        // TODO: set active nearby tab
        // var index = $('#application-tabs a[href="#application-tabs-' + uid + '"]').parent().index();
        // $(this.el).tabs("option", "active", index);

        this.checkTabVisibility();
    },
    // Remove this view completely
    removeView: function() {

        console.log("SYSTEM: ExplorerMain removeView");
    },

});
