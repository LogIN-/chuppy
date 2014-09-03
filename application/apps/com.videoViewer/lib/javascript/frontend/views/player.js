/* 
 * @Author: LogIN
 * @Date:   2014-09-01 10:02:43
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-09-01 19:07:03
 * Use of this source code is governed by a license: 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014-09-01 10:02:43 The Chuppy Authors
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

Chuppy.Apps.App["com.videoViewer"].Main.View.videoViewer = Backbone.View.extend({

    template: '<video ' +
              '    id="video-<%- item.uid %>" ' +
              '    class="video-js vjs-default-skin vjs-big-play-centered"' +
              '    controls preload="metadata" width="auto" height="350"' +
              '    data-setup=\'{"techOrder": ["html5", "flash"]}\'>' +
              '    <source src="http://video-js.zencoder.com/oceans-clip.ogv" type=\'video/ogg\' />' +
              '    <p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>' +
              '</video>',

    // View initialization function
    initialize: function(options) {
        console.info("Starting videoViewer view!");
        // Container of passed arguments
        // this.options.uid
        this.options = options;   
        console.log(this.options.uid);
        // Ensure our methods keep the `this` reference to the view itself
        _.bindAll(this, 'render');
        // bind this view to the add and remove events of the collection!
        this.model.bind('change', this.attributesChanged);      
        this.template = _.template(this.template, this.model.toJSON(), {
            variable: 'item'
        });
        this.render();

    },
    render: function() {
        $(this.el).html(this.template);
        return this;
    },
    attributesChanged: function(){
        console.log("Model content changed!");
    },
    removeView: function (){
        $(this.el).remove();
        this.undelegateEvents();
        console.log("SYSTEM: BreadCrumbActions removeView");
    }
});