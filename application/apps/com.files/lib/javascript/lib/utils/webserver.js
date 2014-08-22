/* 
* @Author: LogIN
* @Date:   2014-08-21 18:20:14
* @Email:  unicoart@gmail.com
* @URL:    https://github.com/LogIN-/chuppy
* @Last Modified by:   LogIN
* @Last Modified time: 2014-08-22 16:42:55
* Use of this source code is governed by a license: 
* The MIT License (MIT)
* 
* Copyright (c) 2014-08-21 18:20:14 The Chuppy Authors
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

/* global crypt, mime, async, urlRoute, moment */
App.Apps.App["com.files"].Main.Private.Webserver = function() {
    var self = this;
    // Array of available web servers
    self.webserver = [];

    // Starts web server on port 
    // Its called on web server initialization only once
    self.createServer = function(itemPath, port) {
        // Server ID - MD5 port number - every share url is temporarily on different port
        var sid = port.toString();

        // We wont to create server for specific path only once!!
        if (self.webserver[sid]) {
            console.log("Server already exist: ", sid);
            return false;
        }
        // Web server defaults
        self.webserver[sid] = {
            location: {
                serverRoot: itemPath,
                reqRelative: null,
                reqAbsolute: itemPath,
                DbAbsolute: path.join(itemPath, "." + crypt.createHash('md5').update(itemPath).digest('hex')),
            },
            template: {
                dirRaw: App.Utils.FileSystem.readFileLocal('apps/com.files/lib/templates/public/directory.tpl', 'sync'),
                errorRaw: App.Utils.FileSystem.readFileLocal('apps/com.files/lib/templates/public/error.tpl', 'sync'),
                dirHtml: null,
                errorHtml: null
            },
            system: {
                // Server ID and active port number
                serverID: sid,
                // Server created time
                createdTime: moment(),
                // Set from create tunnel function
                publicURL: null,
                // Routes handler
                router: urlRoute.Router(),
                // Auth data
                auth: {
                    // Auth enabled??
                    status: false,
                    // Global browsing password
                    password: null,
                    // Users to authenticate
                    users: null,
                },
                // HTTP server instance
                server: null
            },
            // Current browsing page variables
            page: {
                // Current page title
                title: null,
                // Current page items
                items: null
            }
        };

        // Add API routes to our URL router
        // API for user auth
        self.webserver[sid].system.router.addRoute('/8cd75eafa26bf06cf104c24c6016564d/api/auth/*?', self.authentificatePublicUser);
        // Static server assets
        self.webserver[sid].system.router.addRoute('/8cd75eafa26bf06cf104c24c6016564d/assets/:type/*', self.serverStaticAssets);
        // Default handler
        self.webserver[sid].system.router.addRoute('/*', self.handleRequest);


        console.log("Starting share server : " + self.webserver[sid].system.serverID);
        //http.createServer(self.handleRequest).listen(port, '127.0.0.1');
        self.webserver[sid].system.server = http.createServer(function(req, res) {
            var path = url.parse(req.url).pathname;
            var match = self.webserver[sid].system.router.match(path);
            match.fn(req, res, match);
        }).listen(port, '127.0.0.1');
    };
    self.authentificatePublicUser = function(req, res, match) {
        if (1 === 1) {
            match = match.next();
            if (match) {
                match.fn(req, res, match);
            }
            return;
        }
    };
    /* Server request handler
     * URL request if its requesting folder must end in "/"
     *
     *
     */
    self.handleRequest = function(req, res) {
        // Server ID - port number
        var sid = req.socket.localPort.toString();
        console.log("Starting request : " + self.webserver[sid].system.serverID);

        self.webserver[sid].location.reqRelative = url.parse(req.url).pathname || null;

        // if there is any path in request
        if (self.webserver[sid].location.reqRelative !== "/") {
            self.webserver[sid].location.reqAbsolute = path.join(self.webserver[sid].location.serverRoot,
                self.webserver[sid].location.reqRelative);
            // else our request path is root serve path
        } else {
            // Set relative path to share name
            self.webserver[sid].location.reqRelative = path.basename(self.webserver[sid].location.serverRoot);
            // Set absolute path to share root
            self.webserver[sid].location.reqAbsolute = self.webserver[sid].location.serverRoot;
        }
        // Default serve variables
        self.webserver[sid].page.title = self.webserver[sid].location.reqRelative;

        // If requested path exists on our client
        if (fs.existsSync(self.webserver[sid].location.reqAbsolute)) {
            // If request is directory we must serve our index html template
            if (fs.lstatSync(self.webserver[sid].location.reqAbsolute).isDirectory()) {
                // If request items is directory path must end with "/"
                // but this should be set in client side
                if (self.webserver[sid].location.reqAbsolute.substr(-1) !== "/") {
                    self.webserver[sid].location.reqAbsolute = self.webserver[sid].location.reqAbsolute + "/";
                }
                // Reference to directory index database
                if (self.webserver[sid].location.reqAbsolute) {
                    self.webserver[sid].location.DbAbsolute = path.join(self.webserver[sid].location.reqAbsolute, "." +
                        crypt.createHash('md5')
                        .update(self.webserver[sid].location.reqAbsolute)
                        .digest('hex'));
                    // Check if database exist in directory
                    // TODO: index directory and server contents
                    if (!fs.existsSync(self.webserver[sid].location.DbAbsolute)) {
                        self.pathNotFoundPage(req, res);
                        return;
                    }
                } else {
                    self.pathNotFoundPage(req, res);
                    return;
                }
                // Get all items from directory index and server template
                async.parallel({
                        items: App.Apps.App["com.files"].Main.Public.Database.getDirectoryIndexAPI(self.webserver[sid].location.DbAbsolute)
                    },
                    function(result) {
                        self.webserver[sid].page.items = result;
                        // If any items found
                        if (self.webserver[sid].page.items) {
                            self.serveDirectoryContents(req, res);
                        } else {
                            // TODO: serve empty items page
                            self.pathNotFoundPage(req, res);
                        }
                    });
                // If requested item is download (direct path)
                // download file
            } else {
                self.downloadFileDirect(req, res);
            }
            // Request path doesn't exists send 404 Page
        } else {
            self.pathNotFoundPage(req, res);
        }
    };

};
// Set directory object options
// Merge two objects recursively, modifying the first.
App.Apps.App["com.files"].Main.Private.Webserver.prototype.setKeys = function(sid, newObject) {
    this.webserver[sid] = $.extend(true, this.webserver[sid], newObject);
};
// Return keys from directory object
App.Apps.App["com.files"].Main.Private.Webserver.prototype.getKeys = function(sid, keys) {
    return _.pick(this.webserver[sid], keys);
};
// Stops server by server SID (port)
App.Apps.App["com.files"].Main.Private.Webserver.prototype.stopServer = function(sid) {
    this.webserver[sid].system.server.close(function() {
        console.log('Server stopped: ', sid);
    });
};
// Stops server by server SID (port)
App.Apps.App["com.files"].Main.Private.Webserver.prototype.getServersList = function() {
    var serverItem;
    var results = [];

    _.each(this.webserver, function(server){        
        serverItem = {
            port: server.system.serverID,
            path: server.location.serverRoot,
            createdTime: server.system.createdTime
        };
        results.push(serverItem);
    });

    return results;
};

App.Apps.App["com.files"].Main.Private.Webserver.prototype.serveDirectoryContents = function(req, res) {
    var self = this;
    var sid = req.socket.localPort.toString();

    self.webserver[sid].template.dirHtml = _.template(self.webserver[sid].template.dirRaw, self.webserver[sid].page, {
        variable: 'page'
    });
    // Get directory items from index and serve our template
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    //send the contents with the default 200/ok header
    res.end(self.webserver[sid].template.dirHtml);
};

App.Apps.App["com.files"].Main.Private.Webserver.prototype.downloadFileDirect = function(req, res) {
    var self = this;
    var sid = req.socket.localPort.toString();

    var filename = path.basename(self.webserver[sid].location.reqAbsolute);
    var mimetype = mime.lookup(self.webserver[sid].location.reqAbsolute);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);

    var filestream = fs.createReadStream(self.webserver[sid].location.reqAbsolute);
    filestream.pipe(res);
};

App.Apps.App["com.files"].Main.Private.Webserver.prototype.pathNotFoundPage = function(req, res) {
    var self = this;
    var sid = req.socket.localPort.toString();

    self.webserver[sid].template.errorHtml = _.template(self.webserver[sid].template.errorRaw, self.webserver[sid].page, {
        variable: 'page'
    });
    res.writeHead(404, {
        "Content-Type": "text/html; charset=utf-8"
    });
    res.end(self.webserver[sid].template.errorHtml);
};

App.Apps.App["com.files"].Main.Private.Webserver.prototype.serverStaticAssets = function(req, res, match) {
    var self = this;
    var sid = req.socket.localPort.toString();

    res.statusCode = 200;
    res.end('static files');
};

App.Apps.App["com.files"].Main.Public.Webserver = new App.Apps.App["com.files"].Main.Private.Webserver();
