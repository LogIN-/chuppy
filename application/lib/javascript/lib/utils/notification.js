/* 
 * @Author: LogIN
 * @Date:   2014-08-21 19:11:27
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   login
 * @Last Modified time: 2014-08-28 10:06:19
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-08-21 19:11:27 The Chuppy Authors
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

/**
 * Desktop notifications UI
 * @name Chuppy.Utils.Notify
 * @doc object
 * @constructor
 * @param {object} notifyOpts - Notification options
 * @param {object} winOpts - Man UI Window options
 * @description Use this object to construct native UI
 * notifications.
 * EXAMPLE:
 * new Chuppy.Utils.Notify({
 *     icon: "/lib/images/icon.png",
 *     title: "Incoming call!",
 *     content: "Please answer call from: xyz",
 *     animationType: "pulse",
 *     animationCount: "infinite"
 *     },{
 *         width: 230,
 *         height: 60,
 *         possition: "middle-center",
 *         // BOTTOM: bottom-right bottom-left bottom-center
 *         // TOP: top-right top-left top-center
 *         // CENTER: middle-center
 *         timeout: 0, // No timeout time!!
 *         onPress: function () { console.log("You answered!"); },
 *         onDrain: function () { console.log("Missed call!"); }
 *     }).render();
 */
Chuppy.Utils.Notify = function(notifyOpts, winOpts) {

    var self = this;
    self.uuid = null;
    // Notifications container
    self.notification = {};

    // Window options
    self.main_options = {
        width: 230,
        height: 60,
        possition: "bottom-right",
        timeout: 5000,
        onStart: null,
        onDrain: null,
        onPress: null,
    };

    // Notification window options
    self.win_options = {
        win: null,
        icon: "/lib/images/icon.png",
        title: "Notification",
        content: "Buahaha, you have new mail!",
        animate: true,
        animationType: "rubberBand",
        animationDuration: "2",
        animationDelay: "0",
        animationCount: "1",
        elementID: "",
        notifyHTML: null,
    };

    self.onStart = function() {

    };
    self.onDrain = function() {

    };
    self.onPress = function() {

    };

    self.render = function() {
        // First Generate unique ID for action
        // self.uuid = self.genUUID();
        self.uuid = Chuppy.Utils.Helpers.genUUID();

        console.log("UUID", self.uuid);

        self.notification[self.uuid] = {
            main_options: _.extend(self.main_options, winOpts),
            win_options: _.extend(self.win_options, notifyOpts)
        };

        if (!self.notification[self.uuid].win_options.win) {
            self.makeNotificationWin();
        }
    };

    self.makeNotificationWin = function() {
        // Make new frame-less window with height 0
        self.notification[self.uuid].win_options.win = gui.Window.open(
            '/lib/templates/system/notifications.html', {
                frame: false,
                width: self.notification[self.uuid].main_options.width,
                height: 1,
                show: false,
                toolbar: false,
                show_in_taskbar: false,
                "always-on-top": true,
                "resizable": true,
                "min_width": self.notification[self.uuid].main_options.width,
                "min_height": 1,
                "max_width": self.notification[self.uuid].main_options.width,
                "max_height": self.notification[self.uuid].main_options.height
            });
        // on window loaded append notification content
        self.notification[self.uuid].win_options.win.on('loaded', function() {
            // When window is loaded lets load our content in it and continue
            self.appendNotificationWinContent();

            var notifyBody = $(self.notification[self.uuid].win_options.win.window.document.body);
            // Document body should have dimension like our window dimensions
            notifyBody.css({
                "max-width": self.notification[self.uuid].main_options.width + "px",
                "max-height": self.notification[self.uuid].main_options.height + "px"
            });

            var notifyEl = notifyBody.find('#' + self.notification[self.uuid].win_options.elementID);
            // Our notification has dimensions 20px smaller because of paddings
            notifyEl.css({
                "width": (self.notification[self.uuid].main_options.width - 20) + "px",
                "height": (self.notification[self.uuid].main_options.height - 20) + "px"
            });

            // Add custom on press function to whole notification
            if (typeof self.notification[self.uuid].main_options.onPress === "function") {
                notifyEl.click(self.notification[self.uuid].main_options.onPress);
            }


            notifyBody.find('#closer').click(function() {
                self.distroy();
                if (typeof self.notification[self.uuid].main_options.onDrain === "function") {
                    self.notification[self.uuid].main_options.onDrain();
                }

            });

            if (self.notification[self.uuid].win_options.animate === true) {
                var notifyElStyles = {
                    "-webkit-animation-duration": self.notification[self.uuid].win_options.animationDuration + "s",
                    "animation-duration": self.notification[self.uuid].win_options.animationDuration + "s",
                    "-webkit-animation-delay": self.notification[self.uuid].win_options.animationDelay + "s",
                    "animation-delay": self.notification[self.uuid].win_options.animationDelay + "s",
                    "-webkit-animation-iteration-count": self.notification[self.uuid].win_options.animationCount,
                    "animation-iteration-count": self.notification[self.uuid].win_options.animationCount
                };
                notifyEl.css(notifyElStyles);

                notifyEl.addClass('animated').addClass(self.notification[self.uuid].win_options.animationType);
            }
            if (typeof self.notification[self.uuid].main_options.onStart === "function") {
                self.notification[self.uuid].main_options.onStart();
            }
            if (self.notification[self.uuid].main_options.timeout > 0) {
                setTimeout(function() {
                    if (self.notification[self.uuid].win_options.animate === true) {
                        notifyEl.removeClass('animated').removeClass(self.notification[self.uuid].win_options.animationType).addClass('animated').addClass('fadeOut').hide();
                    }

                    if (typeof self.notification[self.uuid].main_options.onDrain === "function") {
                        self.notification[self.uuid].main_options.onDrain();
                    }

                    self.distroy();

                }, self.notification[self.uuid].main_options.timeout);
            }



        });
    };
    self.appendNotificationWinContent = function() {
        // If there isn't any custom html lest make our own!!
        if (!self.notification[self.uuid].win_options.notifyHTML) {
            self.makeNotificationMarkup();
        }

        var notifyBody = $(self.notification[self.uuid].win_options.win.window.document.body);

        notifyBody.find('#notifications').html(self.notification[self.uuid].win_options.notifyHTML);

        self.displayNotificationWindow();

    };
    self.distroy = function() {
        self.notification[self.uuid].win_options.win.hide(); // Pretend to be closed already
        self.notification[self.uuid].win_options.win.close(true);
        // Some default values
        self.notification[self.uuid] = {};
        delete self.notification[self.uuid];
    };
};

Chuppy.Utils.Notify.prototype.makeNotificationMarkup = function() {
    var self = this;

    self.notification[self.uuid].win_options.elementID = self.uuid;

    var html = '<li id="' + self.notification[self.uuid].win_options.elementID + '" class="unselectable">' +
        '<div class="icon">' +
        '<img src="' + self.notification[self.uuid].win_options.icon + '" />' +
        '</div>' +
        '<div class="title">' + self.notification[self.uuid].win_options.title + '</a></div>' +
        '<div class="description">' + self.notification[self.uuid].win_options.content + '</div>' +
        '</li>';

    // If underscorejs exist lets load it through its template system
    if (_) {
        this.notification[self.uuid].win_options.notifyHTML = _.template(html);
    } else {
        this.notification[self.uuid].win_options.notifyHTML = html;
    }

};
Chuppy.Utils.Notify.prototype.displayNotificationWindow = function() {
    var self = this;

    var y = self.getYPos();
    var x = self.getXPos();
    // Starting point of window fadeIN
    var winY = 0;

    self.notification[self.uuid].win_options.win.moveTo(x, y);
    self.notification[self.uuid].win_options.win.show();

    function animate() {
        setTimeout(function() {
            if (winY < self.notification[self.uuid].main_options.height) {
                winY += 10;
                self.notification[self.uuid].win_options.win.resizeTo(self.notification[self.uuid].main_options.width, winY);
                animate();
            }
        }, 5);
    }
    animate();
    console.log(self.notification[self.uuid].main_options.height, self.notification[self.uuid].main_options.width);
    // At the end set window to unrealizable
    // self.notification[self.uuid].win_options.win.setResizable(false);


};

// Chuppy.Utils.Notify.prototype.genUUID = function() {
//     var d = new Date().getTime();
//     var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//         var r = (d + Math.random()*16)%16 | 0;
//         d = Math.floor(d/16);
//         return (c === 'x' ? r : (r&0x7|0x8)).toString(16);
//     });
//     return uuid;
// };

Chuppy.Utils.Notify.prototype.getXPos = function() {
    var x = 0;

    console.log(this.notification[this.uuid].main_options.possition);
    // RIGHT
    if (this.notification[this.uuid].main_options.possition === "bottom-right" || this.notification[this.uuid].main_options.possition === "top-right") {
        x = screen.availLeft + screen.availWidth - this.notification[this.uuid].main_options.width;
        // LEFT
    } else if (this.notification[this.uuid].main_options.possition === "bottom-left" || this.notification[this.uuid].main_options.possition === "top-left") {
        x = screen.availLeft;
        // MIDDLE
    } else if (this.notification[this.uuid].main_options.possition === "bottom-center" || this.notification[this.uuid].main_options.possition === "middle-center" || this.notification[this.uuid].main_options.possition === "top-center") {
        x = (screen.availLeft + screen.availWidth) / 2 + (this.notification[this.uuid].main_options.width * 2);
        // RIGHT
    } else {
        // Default position is right
        x = screen.availLeft + screen.availWidth - this.notification[this.uuid].main_options.width;
    }
    return x;
};
Chuppy.Utils.Notify.prototype.getYPos = function() {
    var y = 0;
    // BOTTOM
    if (this.notification[this.uuid].main_options.possition === "bottom-right" || this.notification[this.uuid].main_options.possition === "bottom-left" || this.notification[this.uuid].main_options.possition === "bottom-center") {
        y = screen.availTop + screen.height - this.notification[this.uuid].main_options.height;
        // TOP
    } else if (this.notification[this.uuid].main_options.possition === "top-right" || this.notification[this.uuid].main_options.possition === "top-left" || this.notification[this.uuid].main_options.possition === "top-center") {
        y = screen.availTop;
        // CENTER
    } else if (this.notification[this.uuid].main_options.possition === "bottom-center" || this.notification[this.uuid].main_options.possition === "top-center") {
        y = (screen.availTop + screen.height) / 2 + (this.notification[this.uuid].main_options.height * 2);
        // MIDDLE CENTER
    } else if (this.notification[this.uuid].main_options.possition === "middle-center") {
        y = (screen.availTop + screen.height) / 2 - (this.notification[this.uuid].main_options.height);
        // BOTTOM
    } else {
        // Default position is bottom
        y = screen.availTop + screen.height - (this.notification[this.uuid].main_options.height);
    }

    return y;
};

Chuppy.Utils.Notify.prototype.truncate = function(str, size) {
    str = $.trim(str);
    if (str.length > size) {
        return $.trim(str.substr(0, size)) + '...';
    } else {
        return str;
    }
};
