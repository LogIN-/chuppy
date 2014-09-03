/* 
 * @Author: LogIN
 * @Date:   2014-08-21 18:20:14
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-08-31 13:47:27
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
// Set global variable for Jslint
/* global Chuppy */
/* global crypt, mime, async, urlRoute, Cookies, Keygrip, moment */

Chuppy.Apps.App["com.files"].Main.Private.Webserver = function() {
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
                DbAbsolute: path.join(itemPath, "." + crypt.createHash('md5').update(itemPath).digest('hex'))
            },
            template: {
                dirRaw: Chuppy.Utils.FileSystem.readFileLocal('apps/com.files/lib/templates/public/directory.tpl', 'sync'),
                errorRaw: Chuppy.Utils.FileSystem.readFileLocal('apps/com.files/lib/templates/public/error.tpl', 'sync'),
                dirHtml: null,
                errorHtml: null
            },
            system: {
                // Server ID and active port number
                serverID: sid,
                // API calling relative path prefix for this server
                // Equal: MD5 hash of: Installation generated token(UUID) + current PORT + current creation time
                serverApiPath: crypt.createHash('md5').update(Chuppy.Settings.getLocal('token') + sid + moment()).digest('hex'),
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
                    // Array with authenticated users UUID's
                    authenticated: []
                },
                // HTTP server instance
                server: null
            },
            // Current cookie handler object
            cookies: {
                keys: new Keygrip([Chuppy.Settings.getLocal('token'), Chuppy.Settings.getLocal('install_uuid'), Chuppy.Settings.getLocal('salt')])
            }
        };

        // Add API routes to our URL router

        // API for user auth
        self.webserver[sid].system.router.addRoute('/' + self.webserver[sid].system.serverApiPath + '/api/auth/*?', self.authentificatePublicUser);
        // Static server assets
        self.webserver[sid].system.router.addRoute('/' + self.webserver[sid].system.serverApiPath + '/assets/:type/*', self.serverStaticAssets);
        // Direct file downloads
        self.webserver[sid].system.router.addRoute('/' + self.webserver[sid].system.serverApiPath + '/api/download/:path', self.downloadFileDirect);

        // Default handler
        self.webserver[sid].system.router.addRoute('/*', self.handleRequest);


        console.info("Starting share server : " + self.webserver[sid].system.serverID);
        console.info("Share server path: " + self.webserver[sid].location.serverRoot);

        self.webserver[sid].system.server = http.createServer(function(req, res) {
            // Unique clients session ID
            var clientID;
            // Local cookie object
            var cookies;
            // This creates a cookie jar corresponding to the current request and response
            cookies = new Cookies(req, res, self.webserver[sid].cookies.keys);
            // Get signed clientID
            clientID = cookies.get("signed", {
                signed: true
            });
            if (!clientID) {
                // On first request generate random clientID
                clientID = Chuppy.Utils.Helpers.genUUID();
                // Set clientID to signed cookie
                cookies.set("signed", clientID, {
                    maxAge: 21600000,
                    signed: true
                });
            }
            var path = url.parse(req.url).pathname;
            var match = self.webserver[sid].system.router.match(path);
            match.fn(req, res, match);
        }).listen(port, '127.0.0.1');
    };
    /* Server request handler
     * URL request if its requesting folder must end in "/"
     *
     *
     */
    self.handleRequest = function(req, res) {
        // Server ID - port number
        var sid = req.socket.localPort.toString();
        // Current request relative path
        var reqRelative;
        // Current request absolute path
        var reqAbsolute;

        var DbAbsolute;
        // Current browsing page variables
        var page = {
            system: {
                apiURL: self.webserver[sid].system.serverApiPath,
                auth: self.webserver[sid].system.auth,
            },
            // Current page title
            title: null,
            // Current page items
            items: null,
            // Requested Path type (directory || file)
            type: null
        };

        console.info("Starting request : " + sid);
        // Set relative path variable
        reqRelative = url.parse(req.url).pathname || null;
        console.info("Request relative path: ", reqRelative);
        // if there is any path in request
        if (reqRelative !== "/") {
            reqAbsolute = path.join(self.webserver[sid].location.serverRoot, reqRelative);
            // else our request path is root serve path
        } else {
            // Set relative path to share name
            reqRelative = path.basename(self.webserver[sid].location.serverRoot);
            // Set absolute path to share root
            reqAbsolute = self.webserver[sid].location.serverRoot;
        }
        console.info("Request absolute path: ", reqAbsolute);
        // Default serve variables
        page.title = reqRelative;

        // If requested path exists on our client
        if (Chuppy.Utils.FileSystem.existsSync(reqAbsolute)) {
            // If request is directory we must serve our index html template
            if (Chuppy.Utils.FileSystem.lstatSync(reqAbsolute).isDirectory()) {
                // Set request type
                path.type = "directory";
                // If request items is directory path must end with "/"
                // but this should be set in client side
                if (reqAbsolute.substr(-1) !== "/") {
                    reqAbsolute = reqAbsolute + "/";
                }
                // Reference to directory index database
                DbAbsolute = path.join(reqAbsolute, "." + crypt.createHash('md5').update(reqAbsolute).digest('hex'));
                // Check if database exist in directory
                if (!Chuppy.Utils.FileSystem.existsSync(DbAbsolute)) {
                    // If database doesnt exist lets index directory, create database and continue
                    Chuppy.Apps.App["com.files"].Main.Utils.Actions.indexDirectory(reqAbsolute, DbAbsolute, function(err, data) {
                        if (err) {
                            console.log(err);
                            self.pathNotFoundPage(req, res, page);
                        }else{
                            page.items = data;
                            self.serveDirectoryContents(req, res, page);
                        }
                        return;
                    });
                } else {
                    console.info("Reading Directory index file:");
                    // Get all items from directory index and server template
                    Chuppy.Apps.App["com.files"].Main.Public.Database.getDirectoryIndex(DbAbsolute, null, function(err, data){                            
                        if(!data.items){
                            console.log("Empty directory found");
                            page.items = [];
                        }else{
                            console.info("Found items in directory:", data.items.length);
                            page.items = data.items;
                        }
                        // Serve HTML page
                        // If no items found process that in template
                        self.serveDirectoryContents(req, res, page);
                    });
                }
            // If requested item is download (direct path)
            // add it to items so template can server one page "template"
            } else {
                // Serve HTML page
                // If no items found process that in template
                page.items.push(reqAbsolute);
                path.type = "file";
                self.serveFileDownloadPage(req, res, page);
            }
            // Request path doesn't exists send 404 Page
        } else {
            self.pathNotFoundPage(req, res, page);
        }
    };

};
// Set directory object options
// Merge two objects recursively, modifying the first.
Chuppy.Apps.App["com.files"].Main.Private.Webserver.prototype.setKeys = function(sid, newObject) {
    this.webserver[sid] = $.extend(true, this.webserver[sid], newObject);
};
// Return keys from directory object
Chuppy.Apps.App["com.files"].Main.Private.Webserver.prototype.getKeys = function(sid, keys) {
    return _.pick(this.webserver[sid], keys);
};
// Stops server by server SID (port)
Chuppy.Apps.App["com.files"].Main.Private.Webserver.prototype.stopServer = function(sid) {
    this.webserver[sid].system.server.close(function() {
        console.log('Server stopped: ', sid);
    });
};
// Stops server by server SID (port)
Chuppy.Apps.App["com.files"].Main.Private.Webserver.prototype.getServersList = function() {
    var serverItem;
    var results = [];

    _.each(this.webserver, function(server) {
        serverItem = {
            port: server.system.serverID,
            path: server.location.serverRoot,
            createdTime: server.system.createdTime
        };
        results.push(serverItem);
    });
    return results;
};

// Template serve if request is directory
Chuppy.Apps.App["com.files"].Main.Private.Webserver.prototype.serveDirectoryContents = function(req, res, page) {
    var self = this;
    var sid = req.socket.localPort.toString();

    self.webserver[sid].template.dirHtml = _.template(self.webserver[sid].template.dirRaw, page, {
        variable: 'page'
    });
    // Get directory items from index and serve our template
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    //send the contents with the default 200/ok header
    res.end(self.webserver[sid].template.dirHtml);
};
// Template serve if request is file
Chuppy.Apps.App["com.files"].Main.Private.Webserver.prototype.serveFileDownloadPage = function(req, res, page) {
    var self = this;
    var sid = req.socket.localPort.toString();

    self.webserver[sid].template.dirHtml = _.template(self.webserver[sid].template.dirRaw, page, {
        variable: 'page'
    });
    // Get directory items from index and serve our template
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    //send the contents with the default 200/ok header
    res.end(self.webserver[sid].template.dirHtml);
};

// Template serve if 404
Chuppy.Apps.App["com.files"].Main.Private.Webserver.prototype.pathNotFoundPage = function(req, res, page) {
    var self = this;
    var sid = req.socket.localPort.toString();

    self.webserver[sid].template.errorHtml = _.template(self.webserver[sid].template.errorRaw, page, {
        variable: 'page'
    });
    res.writeHead(404, {
        "Content-Type": "text/html; charset=utf-8"
    });
    res.end(self.webserver[sid].template.errorHtml);
};

/* URL API CALL METHODS */

// File download stream serve
Chuppy.Apps.App["com.files"].Main.Private.Webserver.prototype.downloadFileDirect = function(req, res, match) {
    var self = this;
    var sid = req.socket.localPort.toString();
    var reqAbsolute = match.params.path;
    console.info("Downloading direct file:", reqAbsolute);
    var filename = path.basename(reqAbsolute);
    var mimetype = mime.lookup(reqAbsolute);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);
    // this could take a while
    res.connection.setTimeout(0); 

    var filestream = fs.createReadStream(reqAbsolute);
    filestream.pipe(res);
};
// File download stream serve for our assets (CSS, JS etc..)
Chuppy.Apps.App["com.files"].Main.Private.Webserver.prototype.serverStaticAssets = function(req, res, match) {
    var self = this;
    var sid = req.socket.localPort.toString();

    res.statusCode = 200;
    res.end('static files');
};
// API to check user credentials if password required
Chuppy.Apps.App["com.files"].Main.Private.Webserver.prototype.authentificatePublicUser = function(req, res, match) {
    if (1 === 1) {
        match = match.next();
        if (match) {
            match.fn(req, res, match);
        }
        return;
    }
};

Chuppy.Apps.App["com.files"].Main.Public.Webserver = new Chuppy.Apps.App["com.files"].Main.Private.Webserver();
