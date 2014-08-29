/* 
 * @Author: LogIN
 * @Date:   2014-08-29 10:02:13
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-08-29 10:37:06
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-08-29 10:02:13 The Chuppy Authors
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

Chuppy.Apps.App["com.mdViewer"].Main.Utils = {

    cleanFileContent: function(content, filePath) {
        var UTF8_BOM = "\ufeff";
        // removing the UTF8 bom because it brakes things in the beginning of the document
        if (content.indexOf(UTF8_BOM) === 0) {
            content = content.substring(1, content.length);
        }
        var cleanedContent = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
        var fileDirectory = Chuppy.Utils.FileSystem.extractContainingDirectoryPath(filePath);

        var imgRegex = /<img.*?src='(.*?)'/;
        var matchs = imgRegex.exec(cleanedContent);

        _.each(matchs, function (match){
            console.info(match[1]);
            if (match[1].indexOf("http://") === 0 || match[1].indexOf("https://") === 0 || match[1].indexOf("data:") === 0) {
                // do nothing if src begins with http(s)://
            } else {
                cleanedContent = cleanedContent.replace(match[1], "file://" + fileDirectory + '/' +  match[1]); 
            }
        });
        return cleanedContent;
    }
};
