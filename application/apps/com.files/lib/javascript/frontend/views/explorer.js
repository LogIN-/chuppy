/* 
* @Author: LogIN
* @Date:   2014-08-22 16:11:25
* @Email:  unicoart@gmail.com
* @URL:    https://github.com/LogIN-/chuppy
* @Last Modified by:   LogIN
* @Last Modified time: 2014-08-22 16:43:10
* Use of this source code is governed by a license: 
* The MIT License (MIT)
* 
* Copyright (c) 2014-08-22 16:11:25 The Chuppy Authors
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

/* com.files application main Folder Views */

// Explorer item view (file/directory)
App.Apps.App["com.files"].Main.View.ExplorerItem = Backbone.View.extend({
    // Underscore template for Icons view
    templateIconsHTML: '<div class="item-icon"><img alt="<%- item.name %>" src="lib/images/system-icons/extensions/<%- item.icon %>.png" /></div> ' +
        '<div title="<%- item.name %>" class="item-name"><span><%- item.name %></span></div>',
    // Underscore template for List view
    templateListHTML: '<div class="item-icon"><img alt="<%- item.name %>" src="lib/images/system-icons/extensions/<%- item.icon %>.png" /></div> ' +
        '<div title="<%- item.name %>" class="item-name"><span><%- item.name %></span></div>' +
        '<div class="item-size"><% if(item.size_human !== 0 && item.fileType === 0) { %><span><%- item.size_human %><% } %></span></div>' +
        '<div class="item-actions animated flipInX"> ' +
        '<span data-action="copy" title="Copy" class="action-box"><i class="fa fa-copy"></i></span> ' +
        '<span data-action="cut" title="Cut" class="action-box"><i class="fa fa-cut"></i></span> ' +
        '<span data-action="share" title="Share" class="action-box"><i class="fa fa-share-alt"></i></span> ' +
        '<span data-action="delete" title="Delete" class="action-box pull-right"><i class="fa fa-trash-o"></i></span> ' +
        '</div>',
    // Navigation type 
    // icons or list
    navType: null,
    // Element container
    tagName: 'li',
    // Default item class
    className: 'file-explore-item animated zoomIn',
    // Bind mouse events to item
    events: {
        "mouseenter": "itemDetailsHover",
        "mouseleave": "itemDetailsHover",
        "click .action-box": "itemActions",
    },
    // Item html data attributes
    attributes: function() {
        return {
            'data-cid': this.model.cid,
            'data-uid': this.model.get('uid'),
            'data-type': this.model.get('fileType'),
            'data-path': this.model.get('path')
        };
    },
    // View initialization function
    initialize: function(options) {
        // Container of passed arguments
        // this.options.uid
        this.options = options;        
        // Ensure our methods keep the `this` reference to the view itself
        _.bindAll(this, 'render');

        // Get current view folder details
        var systemDetails = App.Public.System.mainUI.views.apps[this.options.uid].FilesMain.getKeys(['display', 'location']);
        // Set display type and template (icons or list)
        this.navType = systemDetails.display.navType;
        // console.info("Adding item with view:", this.navType);
        // Choose template based on navigation type settings
        var template = this.templateIconsHTML;
        if (this.navType === "list") {
            template = this.templateListHTML;
        }
        var fileType = this.model.get('fileType');

        // Set Item display settings:
        this.model.set("extension", App.Utils.Functions.findExtension(this.model.get('name')));
        this.model.set("size_human", App.Utils.Functions.humanSize(this.model.get('file_stats').size));
        this.model.set("icon", App.Utils.Functions.findExtensionIcon(this.model.get('extension'), fileType));
        // Set item full path attribute
        var path = systemDetails.location.currentLocation + this.model.get('name');
        if (fileType === 1) {
            path = path + "/";
        }
        this.model.set("path", path);
        // Update current model attributes
        this.$el.attr(_.extend({}, _.result(this, 'attributes')));

        // Render item template
        this.template = _.template(template, this.model.toJSON(), {
            variable: 'item'
        });
    },
    // Item render function
    render: function() {
        // Add item to view
        $(this.el).html(this.template);
        return this;
    },
    // Item hover event
    itemDetailsHover: function(e) {
        if (this.navType === "list") {
            var element = $(e.currentTarget).children(".item-actions");
            // if element is already visible we must hide it!!
            if (element.is(":visible")) {
                element.hide();
            } else {
                element.show();
            }
        }
    },
    // Item actions for List view
    // Cut, copy, delete, share buttons
    itemActions: function(e) {
        var actionType = $(e.currentTarget).attr('data-action');
        var parentElement = $(e.currentTarget).closest("li");

        var actionDetails = {
            // Jquery Object
            item: parentElement,
            // Backbone generated CID so we have reference in collection
            modelCID: parentElement.attr('data-cid'),
            // File system Path of element
            itemPath: parentElement.attr('data-path'),
            // File or Folder
            itemType: parentElement.attr('data-type'),
            // App memory keys storage
            systemDetails: App.Public.System.mainUI.views.apps[this.options.uid].FilesMain.getKeys(['location', 'userActions'])
        };
        console.log(actionDetails.itemPath + " action: " + actionType);

    }
});

// Main folder items display view
App.Apps.App["com.files"].Main.View.ExplorerMain = Backbone.View.extend({
    // Is view rendered or not helper?
    _rendered: false,
    // Container for nested sub-views (item-views)
    _itemViews: [],
    // this creates the selected variable
    // we are going to store the selected objects in here
    selectedItems: $([]),
    // View event handler functions
    events: {
        // Global open action
        "dblclick .file-explore-item": "onItemDblClick",
        // Manual select any item and remove any context if exists
        "click .file-explore-item": "onItemClick",
        // Our item context create and display it
        "contextmenu .file-explore-item": 'displayContextMenu',
        // Check page scroll and add items to collection if necessarily
        "scroll": "checkScroll",
        // Drag and Drop events for direct copy file to Chuppy
        "dragover": "dragAndDropHandlers",
        "drop": "dragAndDropHandlers",
    },
    // View initialization function
    initialize: function(options) {
        // Container of passed arguments
        // this.options.uid
        this.options = options;        
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
    // View render function
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
    // Add model(item) to view
    add: function(model) {
        // Model ID
        var uid = model.get('uid');
        // We create an updating Item view for each Item that is added.
        // And add it to the collection so that it's easy to reuse.
        if (this._itemViews[uid]) {
            return;
        }
        this._itemViews[uid] = new App.Apps.App["com.files"].Main.View.ExplorerItem({
            uid: this.options.uid,
            model: model
        });
        // If the view has been rendered, then
        // we immediately append the rendered item.
        if (this._rendered === true) {
            // 1. Render item view and append it to main folder view
            // 2. Add animation classes and after animation remove animation classes
            $(this._itemViews[uid].render().el).addClass('animated zoomIn').appendTo($(this.el)).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                $(this).removeClass('animated zoomIn');
            });
        }
    },
    // Remove one model(item) from view
    remove: function(model) {
        var self = this;
        // Remove model from DOM
        // Model ID
        var uid = model.get('uid');
        console.info("Model remove started uid:", uid);
        if (self._rendered === true && self._itemViews[uid] !== null) {

            $(self._itemViews[uid].el).removeClass('animated zoomIn').addClass('animated fadeOutUpBig').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                console.info("Model remove animation ended removing from DOM");
                $(this).remove();
                delete self._itemViews[uid];
            });
        } else {
            console.log("no model to remove");
        }
    },
    // Remove all models(items) from folder view 
    // Called on every new openDirectory()
    removeAll: function() {
        $('#application-tabs-' + this.options.uid + ' .file-explorer')[0].innerHTML = '';
        this._itemViews = [];
        // Remove any context menus if they exist
        this.hideContextMenu();
    },
    // Remove this view completely
    removeView: function() {
        $(this.el).remove();
        this.undelegateEvents();
        console.log("SYSTEM: ExplorerMain removeView");
    },
    // Drag and Drop handlers that enable coping items
    // directly to Chuppy folder
    dragAndDropHandlers: function(e) {
        var eventType = e.type;

        if (eventType === 'dragover') {
            console.log("Detected event:", eventType);

        } else if (eventType === 'drop') {
            // Detect data transfer object
            var dt = e.dataTransfer || (e.originalEvent && e.originalEvent.dataTransfer);
            // Detect data-transfer files array
            var files = e.target.files || (dt && dt.files);
            if (!files) {
                console.info("Drop detected but no files!");
                return;
            }
            var fileDetails = [];
            var fileInfo = {};
            var systemDetails = App.Public.System.mainUI.views.apps[this.options.uid].FilesMain.getKeys(['location']);

            // Loop through all files dropped and save them to array
            _.each(files, function(file) {
                fileInfo = {
                    sourceFilePath: file.path,
                    targetFilePath: systemDetails.location.currentLocation + path.basename(file.name)
                };
                fileDetails.push(fileInfo);
            });
            // If there are any files dropped lets ask user what to do?
            if (fileDetails.length > 0) {

                // Dialog variables
                var dialogTitle = "What do you wont to do?";
                var dialogContent = "You dropped " + fileDetails.length + " item(s) to " + path.basename(systemDetails.location.currentLocation) + ". What do you wont to do next?";
                var dialogButtons = [{
                    text: "Move",
                    click: function() {
                        // play confirmation sound
                        App.Utils.Functions.doPlaySound('lib/sounds/dialog-information.oga');
                        // Destroy dialog
                        $(this).dialog("close");
                        $(this).remove();
                        App.Utils.Template.loadingScreen("#files-loading-screen", 1, "files_loading_screen");
                        App.Utils.FileSystem.copyFileSync(fileDetails, 'cut');
                        App.Utils.Template.loadingScreen("#files-loading-screen", 0, "files_loading_screen");
                    }
                }, {
                    text: "Copy",
                    click: function() {
                        // play confirmation sound
                        App.Utils.Functions.doPlaySound('lib/sounds/dialog-information.oga');
                        // Destroy dialog
                        $(this).dialog("close");
                        $(this).remove();
                        App.Utils.Template.loadingScreen("#files-loading-screen", 1, "files_loading_screen");
                        App.Utils.FileSystem.copyFileSync(fileDetails, 'copy');
                        App.Utils.Template.loadingScreen("#files-loading-screen", 0, "files_loading_screen");
                    }
                }, {
                    text: "Cancel",
                    click: function() {
                        // play warning sound
                        App.Utils.Functions.doPlaySound('lib/sounds/dialog-warning.oga');
                        // Destroy dialog
                        $(this).dialog("close");
                        $(this).remove();
                    }
                }];
                // Show dialog
                App.Utils.Template.confirmDialog(dialogTitle, dialogContent, dialogButtons);
            }

        } else {
            console.log("Unknown event:", eventType);
        }
        // Stops default browser action.
        if (e.preventDefault) {
            e.preventDefault();
        }
    },
    // Dblclick on model(item) action
    onItemDblClick: function(e) {
        var itemType = $(e.currentTarget).attr('data-type');
        var itemPath = $(e.currentTarget).attr('data-path');

        // If clicked item is directory lets open it
        if (itemType === "1") {
            App.Public.System.mainUI.views.apps[this.options.uid].FilesMain.openDirectory(itemPath);
        } else if (itemType === "0") {
            // Remove any context menus if they exist
            this.hideContextMenu();

            console.log(itemType);
        }

    },
    // Right click on model(item)
    displayContextMenu: function(e) {
        var element = $(e.currentTarget);
        element.addClass("selectedItem");

        var menuDetails = {
            uid: this.options.uid,
            // Backbone generated CID so we have reference in collection
            modelCID: element.attr('data-cid'),
            // Our unique model id in DB
            modelUID: element.attr('data-uid'),
            // File system Path of element
            itemPath: element.attr('data-path'), 
            // File or Folder
            itemType: element.attr('data-type'),
            // App memory keys storage
            systemDetails: App.Public.System.mainUI.views.apps[this.options.uid].FilesMain.getKeys(['location', 'userActions'])
        };
        // Remove any context menus if they exist
        this.hideContextMenu();
        // Make and show Context menu
        $(e.currentTarget).contextMenu(App.Utils.ContextMenu(menuDetails), {
            theme: 'vista'
        }, e);
        // Set values to our app
        App.Public.System.mainUI.views.apps[this.options.uid].FilesMain.setKeys({
            system: {
                contextActive: true
            },
        });

    },
    /* function setEmptyDirectory()
     * its executed on if directory contains 0 elements
     * Its called from addItemsToPaginator() in main.js
     */
    setEmptyDirectory: function() {
        console.info("setEmptyDirectory check..");
        if (jQuery.isEmptyObject(this._itemViews)) {
            $(this.el).addClass('file-explorer-empty');
        } else {
            $(this.el).removeClass('file-explorer-empty');
        }

    },
    // Remove any opened context menus from view
    // Called on:- item DBl click action     - this.onItemDblClick()
    //           - item right click action   - this.displayContextMenu()
    //           - item single click action  - this.onItemClick()
    //           - page scroll action        - this.checkScroll()
    //           - new page opened           - this.removeAll()
    //           - selectable start and draggable star
    hideContextMenu: function() {
        var systemDetails = App.Public.System.mainUI.views.apps[this.options.uid].FilesMain.getKeys(['system']);
        if (systemDetails.system.contextActive === true) {
            $('.contextMenuItem').remove();
        }
    },
    // Calculate how many model(item) should we display per page
    // Sets start and end number to retrieve from directory index database
    detectItemsPerPage: function() {
        // Current system variables
        var systemDetails = App.Public.System.mainUI.views.apps[this.options.uid].FilesMain.getKeys(['items', 'display']);
        // Internal Details
        var details = {
            // Navigation type
            navType: systemDetails.display.navType,
            // pagination items start
            items_start: systemDetails.items.itemsStart,
            // pagination items end
            items_end: systemDetails.items.itemsEnd,
            // default value because "icons" is default view
            itemHeight: 105,
            itemWidth: 100,
            bodyHeight: $(this.el).height(),
            bodyWidth: $(this.el).width(),
            itemsPerPage: 0
        };
        // if view isn't "icons" change default values
        if (details.navType === "list") {
            details.itemHeight = 30;
            details.itemWidth = details.bodyWidth;
        }
        console.log(details);
        // Calculate total items per page
        details.itemsPerPage = Math.round((details.bodyWidth / details.itemWidth) * (details.bodyHeight / details.itemHeight));
        console.log(details.itemsPerPage);
        // Select model(item) from this start number
        details.items_start = details.items_end;
        // Select model(item) to this end number
        details.items_end = details.items_start + details.itemsPerPage;
        console.info("Automatic calculated values:", details.items_start, details.items_end);
        // Set values to our app
        App.Public.System.mainUI.views.apps[this.options.uid].FilesMain.setKeys({
            items: {
                itemsStart: details.items_start,
                itemsEnd: details.items_end
            }
        });

    },
    /* function checkScroll()
     * its executed on user scroll but there must be more then 10 items on page
     * findItemsToPaginator() is executed to load smoothly more items on page
     */
    checkScroll: function() {
        var itemsDOM = $('#application-tabs-' + this.options.uid + ' .file-explorer > li.file-explore-item');
        var triggerPoint = 100; 
        if (this.el.scrollTop + this.el.clientHeight + triggerPoint > this.el.scrollHeight && itemsDOM.length > 10) {
            // Remove any context menus on scroll if they exist
            this.hideContextMenu();
            // Add next models to collection and trigger add() function
            App.Public.System.mainUI.views.apps[this.options.uid].FilesMain.findItemsToPaginator();
        }
    },
    /* function setupSelectDragDrop()
     * its called once on every new folder view
     * Reset selectedItems {} variable for current view
     * reinitialize Drag Drop and Select classes
     */
    setupSelectDragDrop: function() {
        var self = this;
        // Destroy selectiable element
        if ($(this.el).data('ui-selectable')) {
            $(this.el).selectable("destroy");
        }
        // Loop through all current items on page
        // 1. Add draggable to every item
        // 2. Add droppable only on folders
        $('#application-tabs-' + this.options.uid + ' .file-explorer > li.file-explore-item').each(function() {
            var fileType = $(this).attr('data-type');
            // We must destroy draggable            
            if ($(this).data('draggable')) {
                $(this).draggable("destroy");
            }
            // Initialize draggable on all elements
            $(this).draggable({
                stack: "li",
                addClasses: false,
                containment: "parent",
                // On item Drag Start save each selected item
                start: function(ev, ui) {
                    // Remove any context menus if they exist
                    self.hideContextMenu();
                    // Just in case selectedItem is added from selectable handler (direct drag)
                    $(this).addClass("selectedItem");
                    // Reset selectedItems variables and add all items with selectedItems class to it
                    self.selectedItems = $('#application-tabs-' + this.options.uid + ' .file-explorer > li.selectedItem');

                },
                // On element Draging loop through all selected elements and move them with it
                drag: function(ev, ui) {
                    // Hold reference to this element so we can bind next to it in loop
                    var previousElement = $(this);
                    // Current system details
                    var systemDetails = App.Public.System.mainUI.views.apps[self.options.uid].FilesMain.getKeys(['display']);
                    // take all the elements that are selected expect $("this"), 
                    // which is the element being dragged and loop through each.
                    var my, at;
                    // Loop through all selected elements except one dragging and set position
                    self.selectedItems.not($(this)).each(function() {
                        // Position af selected elements depends of current view settings
                        if (systemDetails.display.navType === "list") {
                            my = "center top";
                            at = "center bottom";
                        } else {
                            my = "right top";
                            at = "left top";
                        }
                        // Set element position next to previous element
                        $(this).position({
                            "of": previousElement,
                            "my": my,
                            "at": at,
                            "collision": "fit none",
                            "within": $(this).parent()
                        });
                        // Update reference for future loop
                        previousElement = $(this);
                    });
                },
                // on Drag end remove all items to starting position and 
                // remove them from selectedItems class
                stop: function(ev, ui) {
                    console.log("Stop detected removing items!");
                    // Loop and reset all dragging items positions and CSS classes
                    self.selectedItems.each(function() {
                        $(this).animate({
                            top: 0,
                            left: 0
                        }, 'slow');
                    });
                },

            });
            // Initialize droppable only on "folders"
            if (fileType === "1") {
                // If item is folder than we must destroy droppable
                if ($(this).data('droppable')) {
                    $(this).droppable("destroy");
                }
                // Initialize droppable on folders
                $(this).droppable({
                    // Accept only items with selectedItem class
                    accept: ".selectedItem",
                    // Dont add any extra classed to droppable elements
                    addClasses: false,
                    // Action when item is dropped 
                    // Remove dropped items and move them to selected folder
                    drop: function(event, ui) {
                        console.log("Drop detected processing items!");
                        // Current dropped destination element
                        var destinationElement = $(this);
                        var destinationPath = destinationElement.attr('data-path');
                        // Details array to be passed to copyFileSync()
                        var itemsDetails = [];
                        // All selected items CID to be passed to removeFolderModels()
                        var itemsCIDs = [];
                        // Dialog buttons and actions
                        var dialogButtons = [{
                            text: "Move",
                            click: function() {
                                // Remove dialog
                                $(this).dialog("close");
                                $(this).remove();
                                // Start loading screen
                                App.Utils.Template.loadingScreen("#files-loading-screen", 1, "files_loading_screen");
                                console.info("Moving files to:", destinationPath);
                                // loop through selected items and populate arrays
                                self.selectedItems.each(function() {
                                    console.log("Adding ", $(this).attr('data-path'));
                                    itemsDetails.push({
                                        sourceFilePath: $(this).attr('data-path'),
                                        targetFilePath: destinationPath + path.basename($(this).attr('data-path'))
                                    });
                                    itemsCIDs.push($(this).attr('data-cid'));
                                });
                                // Execute copyFileSync() on all items
                                App.Utils.FileSystem.copyFileSync(itemsDetails, 'cut');
                                // Remove item(s) from view by itemsCIDs
                                App.Public.System.mainUI.views.apps[self.options.uid].FilesMain.removeFolderModels(itemsCIDs);
                                // Reset global select variables
                                self.selectedItems = $([]);
                                // Save action for future reference
                                App.Public.System.mainUI.views.apps[self.options.uid].setKeys({
                                    userActions: {
                                        activeAction: 'paste'
                                    }
                                });
                                // Remove loading screen
                                App.Utils.Template.loadingScreen("#files-loading-screen", 0, "files_loading_screen");
                            }
                        }, {
                            text: "Cancel",
                            click: function() {
                                $(this).dialog("close");
                                $(this).remove();
                            }
                        }];
                        // Show dialog
                        App.Utils.Template.confirmDialog("Are you sure?", "Item(s) will be permanently moved.", dialogButtons);
                    }
                });
            }

        }); // EACH loop end

        // Initialize selectable on all elements
        $(this.el).selectable({
            filter: "li.file-explore-item",
            start: function(event, ui) {
                // Remove any context menus if they exist
                self.hideContextMenu();
            },
            // On selecting items add selectedItem so can can recognize them later
            selecting: function(event, ui) {
                $(ui.selecting).addClass('selectedItem');
            },
            // On unselected event remove selectedItem CSS class
            // and remove item from selected elements
            unselected: function(event, ui) {
                $(ui.selecting).removeClass('selectedItem');
                self.selectedItems = self.selectedItems.not($(ui.selecting));
            }

        });
    },
    // Handles on click on item
    onItemClick: function(e) {
        var self = this;
        var element = $(e.currentTarget);
        // Remove any context menus if they exist
        self.hideContextMenu();
        // Add selected class to our element
        element.addClass("selectedItem ui-selecting");
        // Add current clicked item to our selectedItems object
        self.selectedItems.push(element);

        // if CRTL or SHIF key isn't pressed deselect existing elements and add current to selection
        if (e.ctrlKey === false && e.shiftKey === false) {
            // If any previous items selected remove them and reset variable
            if (self.selectedItems.length > 0) {
                self.selectedItems.not(element).each(function() {
                    console.log("deselecting other item...");
                    $(this).removeClass("selectedItem ui-selected");
                    $(this).animate({
                        top: 0,
                        left: 0
                    }, 'fast');
                });
                // Reset selectedItems and add only current clicked element
                self.selectedItems = $([element]);
            }
        }else{
            // If element is already selected we must deselect him and remove from selectedItems array
            if (element.hasClass("selectedItem")) {
                // remove selected class from element if already selected
                element.removeClass("selectedItem ui-selected ui-selecting");
                self.selectedItems = self.selectedItems.not(element);
                console.log("de-selecting item");
            }
        }
        $('#application-tabs-' + this.options.uid + ' .file-explorer').data("ui-selectable")._mouseStop(null);
    }

});
