/* 
 * @Author: LogIN
 * @Date:   2014-08-27 12:43:11
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-08-27 19:10:45
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-08-27 12:43:11 The Chuppy Authors
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
/* global marked */

/* Main file-explorer application class */
App.Apps.App["com.mdViewer"].Main.Private.Init = function(options) { 

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

    console.log("NEW mdViewer OBJECT:", options.uid);

    self.initialize = function() {

        self.md2htmlConverter = marked;
        self.md2htmlConverter.setOptions({
            renderer: new marked.Renderer(),
            //highlight: function (code) {
            //    //return require([extensionDirectory+'/highlightjs/highlight.js']).highlightAuto(code).value;
            //},
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            smartLists: true,
            smartypants: false
        });
        App.Utils.FileSystem.loadTextFile(self.directory.location.filePath, null, function(data){
            self.setContent(data);
        });
    };

    self.setContent = function(content) {
       var UTF8_BOM = "\ufeff";

       // removing the UTF8 bom because it brakes thing like #header1 in the beginning of the document
       if(content.indexOf(UTF8_BOM) === 0) {
           content = content.substring(1,content.length); 
       }

       var cleanedContent = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,"");
       $('#application-tabs-' + self.directory.system.uid).append($("<div>", { class: "viewerMDContainer" })
            .append(self.md2htmlConverter(cleanedContent))
            );
       
       var fileDirectory = App.Utils.FileSystem.extractContainingDirectoryPath(self.directory.location.filePath);

       // fixing embedding of local images
       $('#application-tabs-' + self.directory.system.uid + ' img[src]').each(function(){
           var currentSrc = $( this ).attr("src");
           if(currentSrc.indexOf("http://") === 0 || currentSrc.indexOf("https://") === 0 || currentSrc.indexOf("data:") === 0) {
               // do nothing if src begins with http(s)://
           } else {
               $( this ).attr("src","file://"+fileDirectory+'/'+currentSrc);
           }
       });

        // making all links open in the user default browser
        $('#application-tabs-' + self.directory.system.uid + ' a').bind('click', function(e){
            e.preventDefault();
            console.log("Click");
        });
    };

};
