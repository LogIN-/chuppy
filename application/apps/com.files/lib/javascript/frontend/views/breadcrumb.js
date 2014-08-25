/* 
* @Author: LogIN
* @Date:   2014-08-21 15:59:01
* @Email:  unicoart@gmail.com
* @URL:    https://github.com/LogIN-/chuppy
* @Last Modified by:   login
* @Last Modified time: 2014-08-22 16:43:17
* Use of this source code is governed by a license: 
* The MIT License (MIT)
* 
* Copyright (c) 2014-08-21 15:59:01 The Chuppy Authors
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

App.Apps.App["com.files"].Main.View.BreadCrumbActions = Backbone.View.extend({

    elementID: null,

    templateHTML: '<li title="Force directory index reload?" data-id="reload" class="system-actions pull-right"><i class="fa fa-refresh"></i></li>' +
        '<li title="View details as list" data-id="list" class="animated view-actions"><i class="fa fa-list"></i></li>' +
        '<li title="View details as icons" data-id="icons" class="active animated pulse view-actions"><i class="fa fa-th"></i></li>',

    events: {
        "click li.view-actions": "changeViewType",
        "click li.system-actions": "systemActions" 
    },

    initialize: function() {
        this.elementID = App.Apps.App["com.files"].Main.Public.Init.getKeys(['system']).system.uid;

        this.template = _.template(this.templateHTML);
        this.render();

    },
    render: function() {
        $(this.el).html(this.template);
        return this;
    },
    changeViewType: function(e) {
        var dataType = $(e.currentTarget).attr('data-id');
        var systemDetails = App.Apps.App["com.files"].Main.Public.Init.getKeys(['display', 'location']);

        if (systemDetails.display.navType !== dataType) {
            console.info("Change view type from:", systemDetails.display.navType);
            console.info("Change view type to:", dataType);
            // Set Display Type in main Explorer class
            App.Apps.App["com.files"].Main.Public.Init.setKeys({
                display: {navType: dataType} 
            });
            // Reopen current directory with new display class 
            App.Apps.App["com.files"].Main.Public.Init.openDirectory(systemDetails.location.currentLocation);

            // Re-class main container
            $('#application-tabs-' + this.elementID + ' .file-explorer').attr( "class", "file-explorer");
            $('#application-tabs-' + this.elementID + ' .file-explorer').addClass(dataType);
            // $(".file-explorer").addClass(dataType);

            // Remove class of current active object
            $('#application-tabs-' + this.elementID + ' .file-explorer-action-views li.active').removeClass("active").removeClass("pulse");
            // Add active class to new active element
            $(e.currentTarget).addClass("active").addClass("pulse");
        }else{
            console.info("View type already active!");
        }
    },
    systemActions: function(e) {
        var dataType = $(e.currentTarget).attr('data-id');
        var systemDetails = App.Apps.App["com.files"].Main.Public.Init.getKeys(['location']);
        if (dataType === "reload") {
            App.Apps.App["com.files"].Main.Public.Init.setKeys({
                system: {reloadIndex: true} 
            });
            // Reopen current directory with new data 
            App.Apps.App["com.files"].Main.Public.Init.openDirectory(systemDetails.location.currentLocation); 
        }
    },
    removeView: function (){
        $(this.el).remove();
        this.undelegateEvents();
        console.log("SYSTEM: BreadCrumbActions removeView");
    }
});

App.Apps.App["com.files"].Main.View.BreadCrumbItem = Backbone.View.extend({

    templateHTML: '<a href="#"><% if(item.name === "/") { %> <i class="fa fa-folder-open"></i> <% }else{ %> <%- item.name %> <% } %></a>',

    tagName: 'li',
    className: 'file-explorer-breadcrumb-item',

    attributes: function() {
        return {
            'data-path': this.model.get('path')
        };
    },
    initialize: function() {
        // Ensure our methods keep the `this` reference to the view itself
        _.bindAll(this, 'render');
        // If the model changes we need to re-render
        this.model.bind('change', this.render);
        this.template = _.template(this.templateHTML, this.model.toJSON(), {
            variable: 'item'
        });
    },
    render: function() {
        $(this.el).html(this.template);
        return this;
    }
});

App.Apps.App["com.files"].Main.View.BreadCrumb = Backbone.View.extend({
    elementID: null,

    current_dir: null,
    _rendered: false,
    // create an array of views to keep track of items
    _itemViews: [],

    events: {
        "click .file-explorer-breadcrumb-item": "open"
    },
    initialize: function() {

        this.elementID = App.Apps.App["com.files"].Main.Public.Init.getKeys(['system']).system.uid;

        // Ensure our methods keep the `this` reference to the view itself
        _(this).bindAll('add', 'remove');
        // add each item to the view
        this.collection.each(this.add);

        // bind this view to the add and remove events of the collection!
        this.collection.bind('add', this.add);
        this.collection.bind('remove', this.remove);

        this.render();
    },
    render: function() {
        var element = $(this.el);
        // If its first time render lets clean our container
        if (this._rendered === false) {
            element.empty();
        }
        // Render each Item View and append them.
        _(this._itemViews).each(function(item) {
            element.append(item.render().el);
        });

        // We keep track of the rendered state of the view
        this._rendered = true;

        return this;
    },
    add: function(model) {
        // We create an updating Item view for each Item that is added.
        var itemView = new App.Apps.App["com.files"].Main.View.BreadCrumbItem({
            model: model
        });
        // And add it to the collection so that it's easy to reuse.
        this._itemViews[model.id] = itemView;
        // If the view has been rendered, then
        // we immediately append the rendered donut.
        if (this._rendered === true) {
            $(this.el).append(itemView.render().el);
        }
    },
    remove: function(model) {
        console.log("Removing model!");
        // Remove model from DOM
        if (this._rendered === true) {
            $(this._itemViews[model.id].el).remove();
        }
        delete this._itemViews[model.id];
    },
    open: function(e) {
        var item = $(e.currentTarget);
        var itemPath = item.attr('data-path');
        console.log("BREADCRUMB OPEN DIR CLICK");
        App.Apps.App["com.files"].Main.Public.Init.openDirectory(itemPath);
        e.preventDefault();
    },
    removeView: function (){
        $(this.el).remove();
        this.undelegateEvents();
        console.log("SYSTEM: BreadCrumb removeView");
    }

});