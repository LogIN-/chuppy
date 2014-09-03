/* 
 * @Author: LogIN
 * @Date:   2014-08-27 18:25:21
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-08-28 12:50:29
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-08-27 18:25:21 The Chuppy Authors
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

/* Main file-explorer application class */
Chuppy.Apps.App["com.editorHtml"].Main.Private.Init = function(options) {

    var self = this;
    self.md2htmlConverter = null;

    /* Configuration variable */
    self.directory = {
        location: {
            filePath: options.filePath,
        },
        system: {
            uid: options.uid,
        },
    };

    console.log("NEW editorHtml OBJECT:", options.uid);

    self.initialize = function() {

        $('#application-tabs-' + self.directory.system.uid).append('<div class="htmlEditor"></div>');
        Chuppy.Utils.FileSystem.loadTextFile(self.directory.location.filePath, null, function(data) {
            self.setContent(data);
        });
    };

    self.setContent = function(content) {
        var reg = /<body[^>]*>((.|[\n\r])*)<\/body>/im;

        var bodyContent = null;

        // TODO try this 
        try {
            bodyContent = content.match(reg)[1];
        } catch (e) {
            console.log("Error parsing HTML document. " + e);
            // "Probably a body tag was not found in the document. Document will be closed.","Error parsing HTML document");
        }

        var cleanedBodyContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

        $('#application-tabs-' + self.directory.system.uid + ' .htmlEditor').append(cleanedBodyContent);
        $('#application-tabs-' + self.directory.system.uid + ' .htmlEditor').summernote();
    };

};
