/* 
 * @Author: LogIN
 * @Date:   2014-08-07 09:33:15
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   login
 * @Last Modified time: 2014-08-28 10:05:25
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-08-07 09:33:15 The Chuppy Authors
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
/* global bcrypt, Chuppy */

// Global application user related operations
Chuppy.Utils.User = {
 
    user: {},

    // Create new user in system with associated details
    createUser: function(userData, loginView) {
        var self = this;
        // Copy userData in user object
        self.user = userData;
        self.user.password_hash = bcrypt.hashSync(self.user["configuration-user-password"]);

        // 1. Create user in main user details table
        new Chuppy.Database.User({
            username: self.user["configuration-user-username"],
            password: self.user.password_hash
        }).save().then(function(user) {

            if (user === null) {
                self.loginStatus(false, "Sorry an error has accrued!", loginView);
                return;
            }

            self.user.id = user.get('id');
            // 2. Create user details in user_details_table
            new Chuppy.Database.UserDetails({
                uid: self.user.id,
                first_name: self.user["configuration-user-firstname"] || 'John',
                last_name: self.user["configuration-user-lastname"] || 'Doe',
                email: self.user["configuration-user-email"],
                profile_picture: self.user["configuration-user-avatar-base64"],
                phone_number: self.user["configuration-user-phone"],
                usage_type: self.user["configuration-user-usage"],
                encryption: self.user["configuration-user-encryption"] || 0,
                autologin: self.user["configuration-user-autologin"] || 0,
                root_folder: self.user["configuration-user-root-folder"]
            }).save().then(function(userDetails) {

                self.user.details_id = userDetails.get('id');
                // Try to login user
                // TODO: Add checks for user organizations
                if (userDetails.get('usage_type') !== 1) {
                    console.log("Create or add user to organization!!");
                }
                self.loginUser(self.user["configuration-user-username"], self.user["configuration-user-password"], loginView);

                if (isDebug) {
                    console.log("System, Chuppy.Utils.User.createUser: ", self.user.details_id);
                }

            });

            if (isDebug) {
                console.log("System, Chuppy.Utils.User.createUser: ", self.user.id);
            }
            return true;
        });
    },
    // Check if given user-name password is valid??
    loginUser: function(username, password, loginView) {
        loginView = typeof loginView !== 'undefined' ? loginView : null;
        var self = this;
        self.user.username = username;
        self.user.password = password;
        // Select user by Username
        new Chuppy.Database.User({
            username: self.user.username
        }).fetch({
            withRelated: ['userDetails']
        }).then(function(model) {

            if (model === null) {
                self.loginStatus(false, "Wrong credentials! Please try again!", loginView);
                return;
            }
            self.user.id = model.get('id');
            self.user.password_hash = model.get('password');
            self.user.autologin = model.related('userDetails').get('autologin');

            // Load hash from DB and compare it
            bcrypt.compare(self.user.password, self.user.password_hash, function(err, res) {
                // Password compare successful
                if (res === true) {
                    // Initialize userDetails object
                    self.userDetails();
                    // Login is successful so remove view
                    self.loginStatus(true, "Welcome " + self.user.username + "!", loginView);
                    console.log("System: Chuppy.Utils.User.loginUser SUCCESS", self.user.username);

                } else {
                    // Check if user has auto-login feature?
                    if (self.user.autologin === 1) {
                        // Initialize userDetails object
                        self.userDetails();
                        // Login is successful so remove view
                        self.loginStatus(true, "Welcome " + self.user.username + "!", loginView);
                        console.log("System: Chuppy.Utils.User.loginUser SUCCESS", self.user.username);

                    } else {
                        Chuppy.Public.User.setUserKeys({
                            username: self.user.username,
                            login_attempts: 1
                        });
                        self.loginStatus(false, "Wrong credentials! Please try again!", loginView);
                        console.log("System: Chuppy.Utils.User.loginUser FAILED");
                        console.log(self.user);
                    }
                }
            });

        });
    },
    loginStatus: function(action, message, loginView) {
        // User is logged-in successful lets remove view
        if (action === true && loginView !== null) {
            loginView.removeView();
        }
        if (message) {
            Chuppy.Utils.Template.globalNotify('info', i18n.__(message), 'body', '', '', 2000);
        }

    },
    /* Fetch userDetails from database and activate user object
     * Function is called upon successful login it sets all user details from DB to public class Chuppy.Public.User
     */
    userDetails: function() {
        var self = this;
        // Select user details by Username
        new Chuppy.Database.User({
            id: self.user.id
        }).fetch({
            withRelated: ['userDetails', 'userOrganizations']
        }).then(function(user) {
            var userMainData = {},
                userDetailsData = {},
                userOrganizationsData = {},
                userData = {};

            userMainData = _.extend(userMainData, user.attributes, {
                logged_in: true
            });
            userDetailsData = user.related('userDetails').attributes;
            userOrganizationsData = user.related('userOrganizations').attributes;

            userData = {
                userMain: userMainData,
                userDetails: userDetailsData,
                userOrganizations: userOrganizationsData
            };

            Chuppy.Public.User.setUserKeys(userData);

            console.log("System: Chuppy.Utils.User.activateUserObject SUCCESS", self.user.id);

            if (isDebug) {
                console.log("System: Chuppy.Utils.User.userDetails SUCCESS", self.user.id);
            }

            // After user activation lets init system
            Chuppy.Public.System.initilize();

        });
    }
};
