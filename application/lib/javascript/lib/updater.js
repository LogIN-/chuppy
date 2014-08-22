/* 
 * @Author: LogIN
 * @Date:   2014-07-15 11:26:04
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-08-22 16:48:50
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-07-15 11:26:04 The Chuppy Authors
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

App.Utils.Updater = {

    checkForUpdates: function() {
        var http = require('http');

        var currentOs = App.Utils.Helpers.getOperatingSystem();
        // We may want to change this in case the detection fails
        if (!currentOs) {
            return;
        }

        http.get(App.Settings.getLocal('updateNotificationUrl'), function(res) {
            var data = '';
            res.on('data', function(chunk) {
                data += chunk;
            });

            res.on('end', function() {
                var updateInfo;
                try {
                    updateInfo = JSON.parse(data);
                } catch (e) {
                    return;
                }

                if (!updateInfo) {
                    return;
                }

                if (updateInfo[currentOs].version > App.Settings.getLocal('version')) {
                    // Check if there's a newer version and show the update notification
                    $('#notification').html(
                        i18n.__('UpgradeVersionDescription', updateInfo[currentOs].versionName) +
                        '<a class="btn" href="#" onclick="gui.Shell.openExternal(\'' + updateInfo[currentOs].downloadUrl + '\');"> ' + i18n.__('UpgradeVersion') + '</a>'
                    );
                    $('body').addClass('has-notification');
                }
            });

        });
    }

};

// checkForUpdates();
