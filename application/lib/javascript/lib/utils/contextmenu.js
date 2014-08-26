/* 
 * @Author: LogIN
 * @Date:   2014-08-22 14:16:00
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-08-26 15:03:36
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-08-22 14:16:00 The Chuppy Authors
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

/* global crypt, mime */

// Context Menu Builder
// @parm menuDetails {object} - With directory scope and clicked item data
// var menuDetails = {
//     // Jquery Object
//     item: element,
//     // Backbone generated CID so we have reference in collection
//     modelCID: element.attr('data-cid'),
//     // Our unique model id in DB
//     modelUID: element.attr('data-uid'),
//     // File system Path of element
//     itemPath: element.attr('data-path'),
//     // File or Folder
//     itemType: element.attr('data-type'),
//     // App memory keys storage
//     systemDetails: App.Public.System.mainUI.views.apps[menuDetails.uid].FilesMain.getKeys(['location', 'userActions'])
// };
// @returns {array}

App.Utils.ContextMenu = function(menuDetails) {
    console.info("Initializing Context menu");
    console.log(JSON.stringify(menuDetails));

    var menu = [];
    // Add "open" action only if item is directory
    // and if only one item is selected
    if (menuDetails.itemType === "1") {
        menu.push({
            // ContextMenu Item Html name
            'Open': {
                onclick: function(menuItem, menu) {
                    App.Public.System.mainUI.views.apps[menuDetails.uid].FilesMain.setKeys({
                        userActions: {
                            activeAction: 'open',
                            open: {
                                source: menuDetails.itemPath
                            }
                        }
                    });
                    // App.Public.System.mainUI.views.apps[uid]
                    App.Public.System.mainUI.views.apps[menuDetails.uid].FilesMain.openDirectory(menuDetails.itemPath);
                },
                // Context Menu item Icon
                icon: 'lib/images/system-icons/system/holo_light/01_core_new/drawable-xhdpi/ic_action_new.png',
                // Context Menu item hover Title
                title: 'Click to open'
            }
        });
        menu.push({
            // ContextMenu Item Html name
            'Open in Tab': {
                onclick: function(menuItem, menu) {
                    App.Public.System.mainUI.views.apps[menuDetails.uid].FilesMain.setKeys({
                        userActions: {
                            activeAction: 'open',
                            open: {
                                source: menuDetails.itemPath
                            }
                        }
                    });
                    var options = App.Apps.Public.getUserAppDetails("com.files");
                    App.Public.System.mainUI.collection.applications.add(_.extend(options, {
                        uid: crypt.createHash('md5').update(options["name-space"]).digest('hex'),
                        filePath: menuDetails.itemPath
                    }));
                },
                // Context Menu item Icon
                icon: 'lib/images/system-icons/system/holo_light/01_core_new/drawable-xhdpi/ic_action_new.png',
                // Context Menu item hover Title
                title: 'Click to open'
            }
        });
        // Add separator line to Context Menu
        menu.push($.contextMenu.separator);
    } // Check if item is directory

    if (menuDetails.itemType === "0") {
       var mimeType = mime.lookup(menuDetails.itemPath);
       var supportedApps = App.Apps.Public.getSupportedAppsForMimeType(mimeType);
       // If there are any supported apps lets build menu
       if(supportedApps !== null){
            menu.push({
                // ContextMenu Item Html name
                'Open': {
                    onclick: function(menuItem, menu) {
                        App.Public.System.mainUI.views.apps[menuDetails.uid].FilesMain.setKeys({
                            userActions: {
                                activeAction: 'open',
                                open: {
                                    source: menuDetails.itemPath
                                }
                            }
                        });
                        var firstAppNameSpace = _.first(supportedApps);
                        var options = App.Apps.Public.getUserAppDetails(firstAppNameSpace);

                        App.Public.System.mainUI.collection.applications.add(_.extend(options, {
                            uid: crypt.createHash('md5').update(options["name-space"]).digest('hex'),
                            filePath: menuDetails.itemPath
                        }));
                    },
                    // Context Menu item Icon
                    icon: 'lib/images/system-icons/system/holo_light/01_core_new/drawable-xhdpi/ic_action_new.png',
                    // Context Menu item hover Title
                    title: 'Click to open'
                }
            });
            // Add separator line to Context Menu
            menu.push($.contextMenu.separator);
       }

    }// Check if item is file

    menu.push({
        // ContextMenu Item Html name
        'Copy': {
            onclick: function(menuItem, menu) {
                // Get all selected items           
                var selectedItems = $("li.selectedItem");
                // Array to save item details
                var selectedItemsResults = [];
                // Item details object
                var selectedItemDetails = {};
                // loop every selected item and save details in array
                selectedItems.each(function() {
                    selectedItemDetails = {
                        sourceFilePath: $(this).attr('data-path'),
                        targetFilePath: null
                    };
                    selectedItemsResults.push(selectedItemDetails);
                });
                // Set Action and  details array
                App.Public.System.mainUI.views.apps[menuDetails.uid].FilesMain.setKeys({
                    userActions: {
                        activeAction: 'copy',
                        copy: selectedItemsResults
                    }
                });

            },
            // Context Menu item Icon
            icon: 'lib/images/system-icons/system/holo_light/01_core_copy/drawable-xhdpi/ic_action_copy.png',
            // Context Menu item hover Title
            title: 'Copy'
        }
    });
    menu.push({
        // ContextMenu Item Html name
        'Cut': {
            onclick: function(menuItem, menu) {
                // Get all selected items           
                var selectedItems = $("li.selectedItem");
                // Array to save item details
                var selectedItemsResults = [];
                // Item details object
                var selectedItemDetails = {};
                // loop every selected item and save details in array
                selectedItems.each(function() {
                    selectedItemDetails = {
                        sourceFilePath: $(this).attr('data-path'),
                        targetFilePath: null
                    };
                    selectedItemsResults.push(selectedItemDetails);
                });
                // Set Action and  details array
                App.Public.System.mainUI.views.apps[menuDetails.uid].FilesMain.setKeys({
                    userActions: {
                        activeAction: 'cut',
                        cut: selectedItemsResults
                    }
                });
            },
            // Context Menu item Icon
            icon: 'lib/images/system-icons/system/holo_light/01_core_cut/drawable-xhdpi/ic_action_cut.png',
            // Context Menu item hover Title
            title: 'Cut'
        }
    });

    // Add paste option only if copy or cut actions are active
    // and if only  selected item is folder
    if (menuDetails.systemDetails.userActions.activeAction === 'copy' ||
        menuDetails.systemDetails.userActions.activeAction === 'cut' &&
        menuDetails.itemType === "1") {

        menu.push({
            // ContextMenu Item Html name
            'Paste': {
                onclick: function(menuItem, menu) {
                    App.Utils.Template.loadingScreen("#files-loading-screen", 1, "files_loading_screen");
                    var itemsDetails = [];
                    // If previous action is "copy" lets copy files
                    if (menuDetails.systemDetails.userActions.activeAction === 'copy') {
                        _.each(menuDetails.systemDetails.userActions.copy, function(item) {
                            itemsDetails.push({
                                sourceFilePath: item.sourceFilePath,
                                targetFilePath: menuDetails.systemDetails.location.currentLocation + path.basename(item.sourceFilePath)
                            });
                        });
                        // Execute Copy action
                        App.Utils.FileSystem.copyFileSync(itemsDetails, 'copy');
                        // If previous action is "cut" 1. copy files  2. delete source
                    } else if (menuDetails.systemDetails.userActions.activeAction === 'cut') {
                        _.each(menuDetails.systemDetails.userActions.cut, function(item) {
                            itemsDetails.push({
                                sourceFilePath: item.sourceFilePath,
                                targetFilePath: menuDetails.systemDetails.location.currentLocation + path.basename(item.sourceFilePath)
                            });
                        });
                        // Execute Cut action
                        App.Utils.FileSystem.copyFileSync(itemsDetails, 'cut');
                    }

                    App.Public.System.mainUI.views.apps[menuDetails.uid].FilesMain.setKeys({
                        userActions: {
                            activeAction: 'paste'
                        }
                    });
                    App.Utils.Template.loadingScreen("#files-loading-screen", 0, "files_loading_screen");
                },
                // Context Menu item Icon
                icon: 'lib/images/system-icons/system/holo_light/01_core_paste/drawable-xhdpi/ic_action_paste.png',
                // Context Menu item hover Title
                title: 'Paste'
            }
        });
    }

    menu.push({
        // ContextMenu Item Html name
        'Delete': {
            onclick: function(menuItem, menu) {
                // Get all selected items           
                var selectedItems = $("li.selectedItem");

                // Dialog variables
                var dialogTitle = "Confirm to delete:";
                var dialogContent = "Item(s) will be permanently deleted. Are you sure to delete?";
                var dialogButtons = [{
                    text: "Delete",
                    click: function() {
                        // play confirmation sound
                        App.Utils.Functions.doPlaySound('lib/sounds/dialog-warning.oga');
                        // Remove dialog
                        $(this).dialog("close");
                        $(this).remove();
                        // Start loading screen
                        App.Utils.Template.loadingScreen("#files-loading-screen", 1, "files_loading_screen");
                        // Prepare item variables for loop
                        var itemType;
                        var itemPath;
                        var itemCID;
                        // loop every selected item and save details in array
                        selectedItems.each(function() {
                            // populate variables from DOM
                            itemPath = $(this).attr('data-path');
                            itemType = $(this).attr('data-type');
                            itemCID = $(this).attr('data-cid');
                            // Delete item
                            // itemType 0: file
                            if (itemType === "0") {
                                console.info("Deleting file:", itemPath, itemType);
                                App.Utils.FileSystem.rmFileSync([itemPath]);
                                // itemType 1: directory
                            } else if (itemType === "1") {
                                console.info("Deleting directory:", itemPath, itemType);
                                App.Utils.FileSystem.rmDirSync([itemPath]);
                            } else {
                                // Remove loading screen
                                App.Utils.Template.loadingScreen("#files-loading-screen", 0, "files_loading_screen");
                                // Notify user about share action status
                                App.Utils.Template.globalNotify('warning', i18n.__('Error: cant detect item type.'), 'body', '', '', 5000);
                                return;
                            }
                            // Remove item from view
                            App.Public.System.mainUI.views.apps[menuDetails.uid].FilesMain.removeFolderModels([itemCID]);
                        });

                        // Set last user action to "deleteItem"
                        App.Public.System.mainUI.views.apps[menuDetails.uid].FilesMain.setKeys({
                            userActions: {
                                activeAction: 'deleteItem'
                            }
                        });
                        // Remove loading screen
                        App.Utils.Template.loadingScreen("#files-loading-screen", 0, "files_loading_screen");
                        // Notify user about delete action status
                        App.Utils.Template.globalNotify('success', i18n.__('"{{total}}"" item(s) successfully deleted.', {
                            total: selectedItems.length
                        }), 'body', '', '', 5000);


                    }
                }, {
                    text: "Cancel",
                    click: function() {
                        $(this).dialog("close");
                        $(this).remove();
                    }
                }];
                // Show dialog
                App.Utils.Template.confirmDialog(dialogTitle, dialogContent, dialogButtons);

            },
            // Context Menu item Icon
            icon: 'lib/images/system-icons/system/holo_light/01_core_remove/drawable-xhdpi/ic_action_remove.png',
            // Context Menu item hover Title
            title: 'Delete'
        }
    });
    // Add separator line to Context Menu
    menu.push($.contextMenu.separator);
    menu.push({
        // ContextMenu Item Html name
        'Share': {
            onclick: function(menuItem, menu) {
                // If item is Folder
                if (menuDetails.itemType === "1") {
                    // Start web server to serve this folder
                    App.Utils.Share.LocalTunel.registerShare(menuDetails.itemPath);
                    App.Public.System.mainUI.views.apps[menuDetails.uid].FilesMain.setKeys({
                        userActions: {
                            activeAction: 'share',
                            share: {
                                source: menuDetails.itemPath
                            }
                        }
                    });
                } else {
                    // Notify user about share action status
                    App.Utils.Template.globalNotify('warning', i18n.__('Sharing item must be directory for now.'), 'body', '', '', 5000);
                }
            },
            // Context Menu item Icon
            icon: 'lib/images/system-icons/system/holo_light/01_core_share/drawable-xhdpi/ic_action_share.png',
            // Context Menu item hover Title
            title: 'Share with public URL'
        }
    });
    // Add separator line to Context Menu
    menu.push($.contextMenu.separator);
    menu.push({
        // ContextMenu Item Html name
        'Details': {
            onclick: function(menuItem, menu) {
                App.Public.System.mainUI.views.apps[menuDetails.uid].FilesMain.setKeys({
                    userActions: {
                        activeAction: 'details',
                        details: {
                            source: menuDetails.itemPath
                        }
                    }
                });
            },
            // Context Menu item Icon
            icon: 'lib/images/system-icons/system/holo_light/13_extra_actions_about/drawable-xhdpi/ic_action_about.png',
            // Context Menu item hover Title
            title: 'Item Details'
        }
    });

    // return constructed menu array
    return menu;
};
