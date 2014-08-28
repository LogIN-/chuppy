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
// Set global variable for Jslint
/* global Chuppy */

Chuppy.Apps.App["com.files"].Main.View.BreadCrumbActions = Backbone.View.extend({

    templateHTML: '<li title="Force directory index reload?" data-id="reload" class="system-actions pull-right"><i class="fa fa-refresh"></i></li>' +
        '<li title="View details as list" data-id="list" class="animated view-actions"><i class="fa fa-list"></i></li>' +
        '<li title="View details as icons" data-id="icons" class="active animated pulse view-actions"><i class="fa fa-th"></i></li>',

    events: {
        "click li.view-actions": "changeViewType",
        "click li.system-actions": "systemActions" 
    },
    // View initialization function
    initialize: function(options) {
        // Container of passed arguments
        // this.options.uid
        this.options = options;   

        this.template = _.template(this.templateHTML);
        this.render();

    },
    render: function() {
        $(this.el).html(this.template);
        return this;
    },
    changeViewType: function(e) {
        var dataType = $(e.currentTarget).attr('data-id');
        var systemDetails = Chuppy.Public.System.mainUI.views.apps[this.options.uid].FilesMain.getKeys(['display', 'location']);

        if (systemDetails.display.navType !== dataType) {
            console.info("Change view type from:", systemDetails.display.navType);
            console.info("Change view type to:", dataType);
            // Set Display Type in main Explorer class
            Chuppy.Apps.App["com.files"].Main.Public.Init.setKeys({
                display: {navType: dataType} 
            });
            // Reopen current directory with new display class 
            Chuppy.Public.System.mainUI.views.apps[this.options.uid].FilesMain.openDirectory(systemDetails.location.currentLocation);

            // Re-class main container
            $('#application-tabs-' + this.options.uid + ' .file-explorer').attr( "class", "file-explorer");
            $('#application-tabs-' + this.options.uid + ' .file-explorer').addClass(dataType);
            // $(".file-explorer").addClass(dataType);

            // Remove class of current active object
            $('#application-tabs-' + this.options.uid + ' .file-explorer-action-views li.active').removeClass("active").removeClass("pulse");
            // Add active class to new active element
            $(e.currentTarget).addClass("active").addClass("pulse");
        }else{
            console.info("View type already active!");
        }
    },
    systemActions: function(e) {
        var dataType = $(e.currentTarget).attr('data-id');
        var systemDetails = Chuppy.Public.System.mainUI.views.apps[this.options.uid].FilesMain.getKeys(['location']);
        if (dataType === "reload") {
            Chuppy.Public.System.mainUI.views.apps[this.options.uid].FilesMain.setKeys({
                system: {reloadIndex: true} 
            });
            // Reopen current directory with new data 
            Chuppy.Public.System.mainUI.views.apps[this.options.uid].FilesMain.openDirectory(systemDetails.location.currentLocation); 
        }
    },
    removeView: function (){
        $(this.el).remove();
        this.undelegateEvents();
        console.log("SYSTEM: BreadCrumbActions removeView");
    }
});

Chuppy.Apps.App["com.files"].Main.View.BreadCrumbItem = Backbone.View.extend({

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

Chuppy.Apps.App["com.files"].Main.View.BreadCrumb = Backbone.View.extend({
    events: {
        "click .file-explorer-breadcrumb-item": "open"
    },

    // View initialization function
    initialize: function(options) {
        // Container of passed arguments
        // this.options.uid
        this.options = options;
        // create an array of views to keep track of items
        this._itemViews = [];

        // Ensure our methods keep the `this` reference to the view itself
        _(this).bindAll('add', 'remove');

        // bind this view to the add and remove events of the collection!
        this.collection.bind('add', this.add);
        this.collection.bind('remove', this.remove);
        // this.collection.bind('reset', this.reset);
        this.render();
        // add each item to the view
        this.collection.each(this.add);

    },
    render: function() {
        console.log("RENDERING BREADCRUMB VIEW FOR FIRST TIME");
        $(this.el).html('');
        // Render each Item View and append them.
        _(this._itemViews).each(function(item) {
            $(this.el).append(item.render().el);
        });
        return this;
    },
    add: function(model) {
        console.log("Adding Breadcrumb model!");
        console.log(JSON.stringify(this._itemViews));

        var uid = model.get('uid');
        if(this._itemViews[uid]){
            console.log("Breadcrumb already in view:", uid);
            console.log(_.keys(this._itemViews));
            return;
        }
        // We create an updating Item view for each Item that is added.
        // And add it to the collection so that it's easy to reuse.
        this._itemViews[uid] = new Chuppy.Apps.App["com.files"].Main.View.BreadCrumbItem({
            model: model
        });       

        $(this.el).append(this._itemViews[uid].render().el);

    },
    remove: function(model) {
        console.log("Removing Breadcrumb model!");
        var uid = model.get('uid');
        if(!this._itemViews[uid]){
            console.log("Breadcrumb not in view nothing to remove!");
            return;
        }
        // Remove model from DOM
        if (this._itemViews[uid]) {
            $(this._itemViews[uid].el).remove();
            console.log("Breadcrumb deleted", model.get('path'));
            delete this._itemViews[uid];
        }else{
            console.log("No model to remove!");
        }
        
    },
    open: function(e) {
        var item = $(e.currentTarget);
        var itemPath = item.attr('data-path');
        console.log("BREADCRUMB OPEN DIR CLICK");
        Chuppy.Public.System.mainUI.views.apps[this.options.uid].FilesMain.openDirectory(itemPath);
        e.preventDefault();
    },
    removeView: function (){
        $(this.el).remove();
        this.undelegateEvents();
        console.log("SYSTEM: BreadCrumb removeView");
    }

});