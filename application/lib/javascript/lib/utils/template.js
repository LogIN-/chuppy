/* 
 * @Author: LogIN
 * @Date:   2014-08-22 14:20:32
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   login
 * @Last Modified time: 2014-08-22 16:47:30
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-08-22 14:20:32 The Chuppy Authors
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

// Global application template related operations
App.Utils.Template = {
    loadTemplate: function(path, readType) {
        var template = "";
        var path_system = path;
        var current_theme = App.Settings.getLocal('theme');
        // If user doesn't has Theme defined in Settings lets use default template
        if (typeof current_theme === 'undefined') {
            template = App.Utils.FileSystem.readFileLocal(path_system, readType);
        } else {
            var path_theme = path_system.replace('lib', 'themes/' + current_theme);
            template = App.Utils.FileSystem.readFileLocal(path_theme, readType);
        }
        return template;
    },
    /* Global notification alert box
     * @parms  html_class - success, info, warning, danger                  @optional
     *         html_body  - html body of alert                              @required
     *         parent_el  - parent element where alert would be appended    @required
     *         alert_class- unique alert class for identification           @optional, if timeout set than its required
     *         action     - alert action - show/close                       @optional
     *         timeout    - time is alert should remove itself              @optional
     */
    globalNotify: function(html_class, html_body, parent_el, alert_class, action, timeout) {
        var alertElement;
        // Default dialog sound notification
        var dialogSound = "dialog-information.oga";
        // If CSS class of alter box isn't given lets generate random "uuid" for it as class reference
        if (alert_class === "") {
            alert_class = App.Utils.Helpers.genUUID();
        }
        // Assign element to its css class
        alertElement = "." + alert_class;
        // Default is info-box alert
        if (html_class === "") {
            html_class = "info";
        }
        // Play sound for dialog
        if (html_class === "warning" || html_class === "danger") {
            dialogSound = "dialog-warning.oga";
        }
        // play desired sound
        App.Utils.Functions.doPlaySound('/lib/sounds/' + dialogSound);

        // Default is show action
        if (action === "") {
            action = "show";
        } else {
            // Set custom action to our alert element
            // hide ?
            $(alertElement).alert(action);
            return;
        }
        // Make alert html   
        var html = '<div class="animated rollIn global-notofication ' + alert_class + '"> ' +
            '    <div style="position:fixed; left: 50%;"> ' +
            '        <div style="position: relative; left: -50%;"> ' +
            '            <div class="alert alert-' + html_class + ' fade in"><a href="#" class="close" data-dismiss="alert">&times;</a>' + html_body + '</div>' +
            '        </div> ' +
            '    </div> ' +
            '</div>';
        // Append alert html to desired element
        $(html).appendTo(parent_el);

        if (timeout !== "") {
            setTimeout(function() {
                if ($(alertElement).length > 0) {
                    $(alertElement).removeClass('rollIn').addClass('rollOut');
                    // on animation end detach element from DOM
                    $(alertElement).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                        $(alertElement).detach();
                    });
                } else {
                    console.log(alertElement);
                    console.log($(alertElement));
                }
            }, timeout);
        }
    },
    /* Confirm dialog constructor
     * {parm} {string} {dialogTitle} Title of dialog box
     * {parm} {string} {dialogContent} Html content for dialog box
     * {parm} {array} {dialogButtons} Elements of array must be an object defining the attributes and event handlers to set on the button.
     * {returns} {void}
     */
    confirmDialog: function(dialogTitle, dialogContent, dialogButtons) {
        var dialogClass = App.Utils.Helpers.genUUID();
        var html = '<div class="dialogNotificationBox ' + dialogClass + '">' + dialogContent + '</div>';
        $(html).appendTo('body');

        $('.' + dialogClass).dialog({
            autoOpen: true,
            closeOnEscape: true,
            resizable: false,
            modal: true,
            position: {
                my: "center center",
                at: "center center",
                of: "body"
            },
            hide: {
                effect: "explode",
                duration: 500
            },
            open: function(event, ui) {
                App.Utils.Functions.doPlaySound('/lib/sounds/dialog-information.oga');
            },
            title: dialogTitle,
            buttons: dialogButtons
        });
        // Clean up dialogs after 60sec if dialog isn't closed
        setTimeout(function() {
            if ($('.' + dialogClass).length > 0) {
                $('.' + dialogClass).dialog("destroy");
                $('.' + dialogClass).remove();
            }
        }, 60000);
    },
    // Main/apps application activity loading screen
    // action - 1 - start loading screen
    // action - 0 - stop loading screen
    loadingScreen: function(element, action, cssClass) {
        // Default values
        element = typeof element !== 'undefined' ? element : "body";
        action = typeof action !== 'undefined' ? action : 1;
        cssClass = typeof cssClass !== 'undefined' ? cssClass : "loading_screen";

        // We need to prevent multiple calls
        if (action === 1 && $(element).hasClass(cssClass) === false) {
            // Add nice animation  
            $(element).addClass(cssClass);
            $(element).show();
        } else if (action === 0 && $(element).hasClass(cssClass) === true) {
            // Remove nice animation  
            $(element).removeClass(cssClass);
            $(element).hide();
        }

    },
    /* Appends script or style tags to document body
     * @parm {string} data
     * @parm {string} dataID
     * @parm {string} dataType
     */
    createHTMLTag: function(data, dataID, dataType) {
        if (data.length > 0 && dataID.length > 0 && dataType.length > 0) {
            if (dataType === "script") {

                var script = document.createElement("script");
                script.type = "text/javascript";
                script.async = false;
                script.src = data;

                var script_type = document.createAttribute("data-id");
                script_type.value = dataID;

                document.getElementsByTagName("head")[0].appendChild(script).setAttributeNode(script_type);

            } else if (dataType === "style") {

                var style = document.createElement("link");
                style.type = "text/css";
                style.rel = "stylesheet";
                style.href = data;

                var style_type = document.createAttribute("data-id");
                style_type.value = dataID;

                document.getElementsByTagName("head")[0].appendChild(style).setAttributeNode(style_type);
            }
        } else {
            console.log("SYSTEM: App.Utils.Template.createHTMLTag invalid size");
        }
    },
    removeHTMLTag: function() {

    }

};
