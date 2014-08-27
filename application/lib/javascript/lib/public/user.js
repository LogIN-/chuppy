/* 
 * @Author: LogIN
 * @Date:   2014-08-08 13:30:12
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   LogIN
 * @Last Modified time: 2014-08-27 09:58:26
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-08-08 13:30:12 The Chuppy Authors
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

/* Our user class, unique per login session
 * all user main details are saved here
 * STRUCTURE of user object:
 *      userMain: userMainData,
 *      userDetails: userDetailsData,
 *      userOrganizations: userOrganizationsData  
 */

App.Private.User = function() {
    var self = this;
    self.user = {};

    self.defaultValues = {
        userMain: {
            logged_in: false,
            login_attempts: 0
        },
        userDetails: {},
        userOrganizations: {}

    };

    self.user = _.extend(self.user, self.defaultValues);

    // Extends current user properties
    // _.extend({name: 'moe'}, {age: 50});
    // => {name: 'moe', age: 50}
    self.setUserKeys = function(values) {
        if (isDebug === 5) {
            console.log("USER PUBLIC: setUserKeys", values);
        }
        self.user = _.extend(self.user, values);
    };
    self.getUserKeysAll = function() {
        return self.user;
    };
    // Return user properties by keys
    // _.pick({name: 'moe', age: 50, userid: 'moe1'}, 'name', 'age');
    // => {name: 'moe', age: 50}
    self.getUserKeys = function(keys) {
        if (isDebug === 5) {
            console.log("USER PUBLIC: getUserKeys", keys);
        }
        var results = _.pick(self.user, keys);
        return results;

    };
    /* Reset user values to its defaults
     * usage: logout
     */
    self.resetValues = function() {
        if (isDebug === 5) {
            console.log("USER PUBLIC: resetValues");
        }
        self.user = {};
        self.user = _.extend(self.user, self.defaultValues);
    };
};

App.Public.User = new App.Private.User();