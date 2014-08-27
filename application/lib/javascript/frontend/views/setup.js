/* 
 * @Author: LogIN
 * @Date:   2014-08-04 13:06:56
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-08-27 10:10:50
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-08-04 13:06:56 The Chuppy Authors
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

/* global alert */
// The ChuppySetUp View
// ---------------
// Our overall **ChuppySetUp** is run only at app frst run 
App.View.ChuppySetUp = Backbone.View.extend({

    template: _.template(App.Utils.FileSystem.readFileLocal('lib/templates/setup.tpl', 'sync')),
    // Bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("body"),
    setupForm: "#userSetupForm",
    // Default TAB view (step)
    currentStep: "1",
    // Holds our current video stream
    webRTCStream: null,
    // Holds our current preview divs ids so we can reuse some functions
    previewElementPrefix: "",
    // Delegated events for creating new items, and clearing completed ones.
    events: {
        "click .modal-footer button": "setupButtonNavigation",
        "click input[name=configuration-user-usage]:checked": "onUserTypeChange",
        "click input[name=configuration-organization-server]:checked": "onServerUsageChange",
        "click input[name=configuration-organization-join-server]:checked": "onServerUsageChange",
        "click input[name=configuration-user-avatar]:checked": "avatarHandler",
        "change #configuration-user-avatar-file-pc": "avatarPicture",
        "click video#configuration-user-avatar-video": "captureCameraPhoto"
    },
    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function() {
        // if debugging let us notify about firstRun init
        if (isDebug) {
            console.log("initialized: App.View.chuppySetUp");
        }
        this.render();
    },
    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
        $(this.el).append(this.template);
        this.initializeModal();
        this.initializeValidator();
        return this; // returning this for chaining..
    },
    initializeModal: function() {
        $('#chuppy-firstrun').modal('show');
        $('#chuppy-firstrun').on('shown.bs.modal', function() {
            $("input[name=configuration-user-firstname]").focus();
            console.log("************ Modal shown!!");
        });
    },
    // http://bootstrapvalidator.com/
    initializeValidator: function() {
        $(this.setupForm).bootstrapValidator({
            container: 'tooltip',
            message: i18n.__('This value is not valid'),
            live: 'enabled',
            excluded: [':disabled', ':hidden', ':not(:visible)'],
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            submitButtons: '#chuppy-firstrun button[name=configuration-button-success]',
            fields: {
                "configuration-user-usage": {
                    validators: {
                        notEmpty: {
                            message: i18n.__('Usage type is required')
                        }
                    }
                },
                "configuration-user-encryption": {
                    validators: {
                        notEmpty: {
                            message: i18n.__('This is required')
                        }
                    }
                },
                "configuration-user-avatar": {
                    validators: {
                        notEmpty: {
                            message: i18n.__('Usage type is required')
                        }
                    }
                },
                "configuration-user-phone": {
                    validators: {
                        digits: {
                            message: i18n.__('The phone number can contain digits only')
                        },
                        notEmpty: {
                            message: i18n.__('The phone number is required')
                        }
                    }
                },
                "configuration-organization-avatar": {
                    validators: {
                        file: {
                            extension: 'jpeg,jpg,png',
                            type: 'image/jpeg,image/jpg,image/png',
                            maxSize: 1024 * 1024, // 2 MB
                            message: i18n.__(
                                'The selected file is not valid. Only .jpeg, .jpg and .png extensions are allowed with maximum size of 1MB'
                            )
                        }
                    }
                },
                "configuration-organization-server": {
                    validators: {
                        notEmpty: {
                            message: i18n.__('This is required')
                        }
                    }
                },
                "configuration-organization-join-server": {
                    validators: {
                        notEmpty: {
                            message: i18n.__('This is required')
                        }
                    }
                },
                "configuration-user-root-folder": {
                    validators: {
                        notEmpty: {
                            message: i18n.__('This is required')
                        }
                    }
                }
            }
        })
            .on('status.field.bv', function(e, data) {
                // $(e.target)  --> The field element
                // data.bv      --> The BootstrapValidator instance
                // data.field   --> The field name
                // data.element --> The field element
                // data.bv.disableSubmitButtons(false);
                if (data.bv.getSubmitButton()) {
                    data.bv.disableSubmitButtons(false);
                }
            });
        // Validate form automatically if in debug mode!
        // if(isDebug){
        //   this.setupForm.data('bootstrapValidator').validate();
        //   console.log('System, Template: initializeValidator, setup form validated!');
        // }
    },
    setupButtonNavigation: function(e) {
        var self = this;
        var actionType = $(e.currentTarget).attr('data-id');
        self.currentStep = actionType;
        // is fully setup completed or not
        var setupState = false;
        // If form is invalid and Quit isn't pressed lets cancel this context
        if (self.checkFormIsValid() === false && actionType !== "0") {
            return;
        }
        // Release webcam (just in case!)
        if (self.webRTCStream !== null) {
            self.webRTCStream.stop();
            self.webRTCStream = null;
        }
        switch (parseInt(actionType, 10)) {
            case 0: // data-id 0 user clicked Quit
                App.Utils.Helpers.exitDelay("body", 3000);
                break;
            case 1: // data-id 1 create stand alone user and finish process!
                // Check input fields ??
                // Save in local storage that app is initiated
                // App.Settings.setLocal('firstRun', 1);
                // Description: Encode a set of form elements as an array of names and values.
                var submitedUserData = App.Utils.Functions.serilizeObject($("#userSetupForm"));
                App.Utils.User.createUser(submitedUserData, self);
                break;
            case 2: // data-id 2 Create new organization
                console.log("Create new organization");
                $("#setup-step" + actionType).tab('show');
                break;
            case 3: // data-id 3 Join existing organization
                console.log("Join existing organization");
                $("#setup-step" + actionType).tab('show');
                break;
            default: // default action is to nothing!
                console.log('System, Template: buttonNavigation, unknown action: ', actionType);
        }
        e.preventDefault();
    },
    // on AvatarPicture Change lets make some checks like size in px, MB and type and also make small preview in fronted
    avatarPicture: function(event) {
        var self = this;
        var input = $(event.currentTarget);
        var previewSrc = document.getElementById(self.previewElementPrefix + '-canvas');
        var previewSrcCTX = previewSrc.getContext('2d');
        var file = event.target.files[0];
        // Check if file type is allowed
        if (file.type !== "image/png" && file.type !== "image/jpeg" && file.type !== "image/jpg") {
            App.Utils.Template.globalNotify('info', i18n.__(
                    'The selected file is not valid. Only .jpeg, .jpg and .png extensions are allowed with maximum size of 1MB'), 'body', '',
                '', 10000);
            return;
        }
        // Check if file is larger then 1MB let them know!!
        if (file.size > 1024 * 1024) {
            App.Utils.Template.globalNotify('info', i18n.__(
                    'The selected file is not valid. Only .jpeg, .jpg and .png extensions are allowed with maximum size of 1MB'), 'body', '',
                '', 10000);
            return;
        }
        var reader = new FileReader();
        reader.onload = (function(file) {
            var image = new Image();
            image.src = file.target.result;
            image.onload = function() {
                // lets check if avatar image is in allowed size limits
                if (this.width > 128 || this.height > 128) {
                    App.Utils.Template.globalNotify('info', i18n.__('Maximum avatar dimensions are 128x128px!'), 'body', '', '', 10000);
                    // Clear a File Input
                    input.replaceWith(input.val('').clone(true));
                    // TODO:
                    // Implement http://mattketmo.github.io/darkroomjs/
                } else {
                    // Clear canvas for redrawing
                    previewSrcCTX.clearRect(0, 0, previewSrc.width, previewSrc.height);
                    // If dimensions are ok lets put preview on center of the canvas
                    previewSrcCTX.drawImage(image,
                        previewSrc.width / 2 - this.width / 2,
                        previewSrc.height / 2 - this.height / 2);
                    // And save data to hidden input field
                    $('#' + self.previewElementPrefix + '-base64').val(file.target.result);
                }
            };
        });
        reader.readAsDataURL(file);
    },
    // Check user decision about program usage type
    // If is for personal use we will finish our setup form if not we will continue further
    // See: setup.tpl: configuration-user-usage
    onUserTypeChange: function(e) {
        var navNextButton = $('button[name=configuration-button-success]');
        var navButtonVal = $(e.currentTarget).val();
        var navButtonText = $(e.currentTarget).attr('data-addon');
        console.log(navButtonText);
        navNextButton.attr("data-id", navButtonVal);
        navNextButton.attr("data-toggle", "tab");
        navNextButton.attr("href", "#setup-step" + navButtonVal);
        navNextButton.html(navButtonText);
    },
    // If user wants to use its own server lets display input form
    onServerUsageChange: function(e) {
        var actionType = $(e.currentTarget).val();
        var serverInput = $(e.currentTarget).attr('data-addon');

        switch (parseInt(actionType, 10)) {
            case 1: // data-id 1 use default server and remove server input URL
                $(serverInput).removeClass('display-block');
                $(serverInput).addClass('display-none');
                break;
            case 2: // data-id 2 display server input
                $(serverInput).removeClass('display-none');
                $(serverInput).addClass('display-block');
                break;
            default: // defoult use default server and remove server input URL
                $(serverInput).removeClass('display-block');
                $(serverInput).addClass('display-none');

        }
    },
    // On form submit check if button should be enabled or not
    checkFormIsValid: function() {
        var navNextButton = $('button[name=configuration-button-success]');
        // Manually validate form
        $(this.setupForm).bootstrapValidator('validate');
        // Check if all fields on current step are valid!
        if ($(this.setupForm).data('bootstrapValidator').isValidContainer("#setup-step" + this.currentStep)) {
            return true;
        } else {
            return false;
        }
    },
    // User choice avatar picture handler
    // -- Select from PC -- value 1
    // -- Select from CAM -- value 2
    avatarHandler: function(event) {
        // reference to itself
        var self = this;
        // CSS ID of current preview elements
        var previewElement = $(event.currentTarget).attr('name');
        self.previewElementPrefix = previewElement;
        // type of action
        var actionType = $(event.currentTarget).val();
        // Define elements needed for preview
        var videoEl = $('#' + previewElement + '-video');
        var canvasEl = $('#' + previewElement + '-canvas');
        var hiddenFileInput = $('#' + previewElement + '-file-pc');

        switch (parseInt(actionType, 10)) {
            case 1: // data-id 1 User select file from PC
                // Manually trigger file-input dialog since there isnt any JS API
                hiddenFileInput.trigger('click');
                canvasEl.removeClass('display-none').addClass('display-block');
                // Stop and remove video frame if any
                if (self.webRTCStream !== null) {
                    videoEl.get(0).pause();
                    videoEl.attr('src', "");
                    self.webRTCStream.stop();
                    self.webRTCStream = null;
                }
                videoEl.removeClass('display-block').addClass('display-none');
                break;
            case 2: // data-id 2 try to start webcam
                if (navigator.webkitGetUserMedia) {
                    canvasEl.removeClass('display-none').addClass('display-block');
                    videoEl.removeClass('display-none').addClass('display-block');
                    navigator.webkitGetUserMedia({
                        video: true
                    }, function(stream) {
                        self.webRTCStream = stream;
                        videoEl.attr('src', window.webkitURL.createObjectURL(self.webRTCStream));
                    }, function() {
                        console.log('System, Template: webkitGetUserMedia, could not connect webRTCStream');
                    });
                } else {
                    App.Utils.Template.globalNotify('info', i18n.__('Sorry it seems we can\'t detect your camera!'), 'body', '', '', 10000);
                }
                break;
            default: // defoult use default server and remove server input URL
                console.log('System, Template: avatarHandler, unknown action: ', actionType);
        }

    },
    // On video element click capture current photo and save base64 encoded data to hidden field
    captureCameraPhoto: function() {
        var self = this;
        var previewSrc = document.getElementById(self.previewElementPrefix + '-canvas');
        var previewSrcCTX = previewSrc.getContext('2d');
        var video = document.getElementById(self.previewElementPrefix + '-video');
        previewSrcCTX.clearRect(0, 0, previewSrc.width, previewSrc.height);
        previewSrcCTX.drawImage(video, 0, 0, 150, 115);
        var dataURL = previewSrc.toDataURL("image/png", "");
        // And save data to hidden input field
        $('#' + self.previewElementPrefix + '-base64').val(dataURL);
    },
    removeView: function() {
        var self = this;
        App.Utils.Template.globalNotify('info', i18n.__('Hello, you have successfully setup Chuppy!'), 'body', '', '', 3000);
        // Remove modal dialog from DOM
        $("#chuppy-firstrun").modal('hide');
        $('#chuppy-firstrun').on('hidden.bs.modal', function(e) {
            // Remove modal element from DOM
            $("#chuppy-firstrun").remove();
            self.undelegateEvents();
            //App.Utils.Helpers.exitDelay("body", 3000);
            console.log("SYSTEM: Chuppy Started from Setup Interface");

            // On first application run create database and SCHEMA
            if (!App.Settings.getLocal('firstRun') || App.Settings.getLocal('firstRun') === "0") {
                App.Settings.setLocal('firstRun', "1");
            }
        });
    }
});
