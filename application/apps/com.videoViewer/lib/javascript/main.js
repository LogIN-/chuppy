/* 
 * @Author: LogIN
 * @Date:   2014-09-01 09:40:32
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-09-01 11:02:03
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-09-01 09:40:32 The Chuppy Authors
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
/* global Chuppy, videojs, crypt, path, mime */

/* Main videoPlayer application class */
Chuppy.Apps.App["com.videoViewer"].Main.Private.Init = function(options) {

    var self = this;
    /* Configuration variable */
    self.directory = {
        location: {
            filePath: options.filePath,
        },
        system: {
            uid: options.uid,
        },
    };

    self.mainUI = {
        models: {
            mainModel: null,
        },
        views: {
            navigation: null,
            content: {
                videoViewer: null
            }
        }
    };

    console.log("NEW videoViewer OBJECT:", options.uid);

    self.initialize = function() {

        // Initialize our main content model
        if (self.mainUI.models.mainModel === null) {
            self.mainUI.models.mainModel = new Chuppy.Apps.App["com.videoViewer"].Main.Model.videoFile({
                uid: crypt.createHash('md5').update(self.directory.location.filePath).digest('hex'),
                name: path.basename(self.directory.location.filePath),
                filePath: self.directory.location.filePath,
                mime: mime.lookup(self.directory.location.filePath)
            });
        }
        // Initialize videoViewer header navigation view
        if (self.mainUI.views.navigation === null) {
            self.mainUI.views.navigation = new Chuppy.Apps.App["com.videoViewer"].Main.View.Header({
                // ID for current constructed class
                uid: options.uid,
                // DOM Element
                el: $('#application-tabs-' + options.uid + ' .videoPlayerHeader')
            });
        }
        // Initialize videoViewer View
        if (self.mainUI.views.content.videoViewer === null) {
            self.mainUI.views.content.videoViewer = new Chuppy.Apps.App["com.videoViewer"].Main.View.videoViewer({
                model: self.mainUI.models.mainModel,
                // ID for current constructed class
                uid: options.uid,
                // DOM Element
                el: $('#application-tabs-' + options.uid + ' .videoPlayerContainer')
            });
        }
    };
};
