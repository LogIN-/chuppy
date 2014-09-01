/* 
 * @Author: LogIN
 * @Date:   2014-09-01 10:02:35
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-09-01 10:30:28
 * Use of this source code is governed by a license: 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014-09-01 10:02:35 The Chuppy Authors
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

Chuppy.Apps.App["com.videoViewer"].Main.View.Header = Backbone.View.extend({

    template: '<div class="videoViewerActions btn-group">' +
              '    <button type="button" class="btn btn-default btn-sm btn-small" title="" data-event="fullscreen" tabindex="-1" data-original-title="Full Screen">' +
              '        <i class="fa fa-arrows-alt icon-fullscreen"></i>' +
              '    </button>' +
              '    <button type="button" class="btn btn-default btn-sm btn-small" title="" data-event="codeview" tabindex="-1" data-original-title="Code View">' +
              '        <i class="fa fa-code icon-code"></i>' +
              '    </button>' +
              '</div>',

    events: {
        "click div.videoViewerActions button": "headerActions"
    },
    // View initialization function
    initialize: function(options) {
        // Container of passed arguments
        // this.options.uid
        this.options = options;
        this.template = _.template(this.template);
        this.render();
    },
    render: function() {
        $(this.el).html(this.template);
        return this;
    },
    headerActions: function(e){
        var element = $(e.currentTarget);
        var actionType = element.attr('data-event');
        console.log(actionType);
    },
    removeView: function (){
        $(this.el).remove();
        this.undelegateEvents();
        console.log("SYSTEM: BreadCrumbActions removeView");
    }
});