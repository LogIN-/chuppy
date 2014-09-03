/* 
 * @Author: LogIN
 * @Date:   2014-08-21 18:22:30
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   login
 * @Last Modified time: 2014-08-28 10:06:04
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-08-21 18:22:30 The Chuppy Authors
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
/* global localtunnel, ftpd, staticWeb, http, util, crypt, async, freeport */
Chuppy.Utils.Share.LocalTunel = {

    /* Creates local tunnel 
     * {parm} host - upstream server providing forwarding
     * {parm} port - internal http server port
     * {parm} local_host - tunnel traffic to this host instead of localhost, override Host header to this host
     * {parm} subdomain - request this subdomain
     */
    createTunnel: function(host, port, local_host, subdomain) {
        console.log('createTunnel');
        var opt = {
            host: host,
            port: port,
            local_host: local_host,
            subdomain: subdomain,
        };
        localtunnel(port, opt, function(err, tunnel) {
            if (err) {
                Chuppy.Utils.Template.globalNotify('error', i18n.__('Error: Chuppy could not share {{name}}. Please report bug.', {
                    name: 'Other'
                }), 'body', '', '', 30000);
                console.log(err);
                // Stop activated server
                Chuppy.Apps.App["com.files"].Main.Public.Webserver.stopServer(port);
            } else {
                // the assigned public url for your tunnel
                // {"_closed":false,"_opt":{"port":42756,"host":"https://localtunnel.me"},"url":"https://tjbsdobkwh.localtunnel.me","tunnel_cluster":{"_opt":{"remote_host":"localtunnel.me","remote_port":34255,"name":"tjbsdobkwh","url":"https://tjbsdobkwh.localtunnel.me","max_conn":10,"local_host":null,"local_port":42756},"domain":null,"_events":{"open":[{"listener":{}},{}],"dead":{}},"_maxListeners":10}}
                Chuppy.Utils.Template.globalNotify('success', i18n.__('Public share {{name}} is publicly accessible from: <br /> {{link}}', {
                    name: 'Other',
                    link: tunnel.url
                }), 'body', '', '', 30000);
                // Set active URL in current web-server object
                Chuppy.Apps.App["com.files"].Main.Public.Webserver.setKeys(tunnel._opt.port, {
                    system: {
                        publicURL: tunnel.url
                    }
                });
            }

        });
    },
    // Server path from FTP protocol on custom port
    startFTPServer: function(path, port) {
        // Path to your FTP root
        ftpd.fsOptions.root = path;
        // Start listening on port 21 (you need to be root for ports < 1024)
        ftpd.listen(port);
    },
    // Start web server and server directory contains
    startHttpServer: function(itemPath, port) {
        Chuppy.Apps.App["com.files"].Main.Public.Webserver.createServer(itemPath, port);
    },
    registerShare: function(itemPath) {
        // Get first free port and start server
        freeport(function(er, port) {
            Chuppy.Utils.Share.LocalTunel.startHttpServer(itemPath, port);
            // Create tunnel to this service
            Chuppy.Utils.Share.LocalTunel.createTunnel('http://chuppy.cu.cc', port, 'localhost', null);
        });
    }

};
