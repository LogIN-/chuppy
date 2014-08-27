/* 
 * @Author: LogIN
 * @Date:   2014-08-27 13:54:29
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-08-27 14:54:02
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-08-27 13:54:29 The Chuppy Authors
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
/* global ace */
/* Main file-explorer application class */
App.Apps.App["com.editorAce"].Main.Private.Init = function(options) {

    var self = this;
    self.aceEditor = null;

    /* Configuration variable */
    self.directory = {
        location: {
            filePath: options.filePath,
        },
        system: {
            uid: options.uid,
        },
    };

    self.filetype = { h: "c_cpp", c: "c_cpp", clj: "clojure", coffee: "coffee", coldfusion: "cfc", cpp: "c_cpp", cs: "csharp", css: "css", groovy: "groovy", haxe: "hx", htm: "html", html: "html", java: "java", js: "javascript", jsm: "javascript", json: "json", latex: "latex", less: "less", ly: "latex", ily: "latex", lua: "lua", markdown: "markdown", md: "markdown", mdown: "markdown", mdwn: "markdown", mkd: "markdown", ml: "ocaml", mli: "ocaml", pl: "perl", php: "php", powershell: "ps1", py: "python", rb: "ruby", scad: "scad", scala: "scala", scss: "scss", sh: "sh", sql: "sql", svg: "svg", textile: "textile", txt: "textile", xml: "xml" };
    
    console.log("NEW editorAce OBJECT:", options.uid);

    self.initialize = function() {

        var fileExt = self.directory.location.filePath.substring(self.directory.location.filePath.lastIndexOf(".") + 1, self.directory.location.filePath.length).toLowerCase();
        console.info("Detected extension:", fileExt);

        $('#application-tabs-' + self.directory.system.uid).append('<div id="aceEditor" style="width: 100%; height: 100%"></div>');
        
        self.aceEditor = ace.edit('aceEditor');
        // Needed scripts
        if (self.filetype[fileExt] !== null) {
            self.aceEditor.setTheme("ace/theme/xcode");
            self.aceEditor.getSession().setMode("ace/mode/" + self.filetype[fileExt]);
        }

        App.Utils.FileSystem.loadTextFile(self.directory.location.filePath, null, function(data) {
            self.aceEditor.setValue(data);
            self.aceEditor.clearSelection();
        });
    };
};
