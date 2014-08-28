/* 
 * @Author: LogIN
 * @Date:   2014-08-07 10:00:57
 * @Email:  unicoart@gmail.com
 * @URL:    https://github.com/LogIN-/chuppy
 * @Last Modified by:   login
 * @Last Modified time: 2014-08-28 10:04:53
 * Use of this source code is governed by a license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-08-07 10:00:57 The Chuppy Authors
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
/* global dbORM:true, dbLocation:true, knex:true, Chuppy */

/* 
 * Database management models based on Knex and Bookshelf
 * http://bookshelfjs.org/#Model
 *
 */

Chuppy.Database.connect = function() {
    var database_name;

    // If app is on 1. RUN let assign DB name
    if (!Chuppy.Settings.getLocal('firstRun') || Chuppy.Settings.getLocal('firstRun') === "0") {
        database_name = Chuppy.Settings.getLocal('install_uuid');
        Chuppy.Settings.setLocal('DBLocation', database_name);
    } else {
        database_name = Chuppy.Settings.getLocal('DBLocation');
    }

    dbLocation = path.join(gui.Chuppy.dataPath, database_name);

    // If app is on 1. RUN and database already exists this shouldn't happen lets delete it!!
    if (!Chuppy.Settings.getLocal('firstRun') || Chuppy.Settings.getLocal('firstRun') === "0" && fs.existsSync(dbLocation)) {
        fs.unlinkSync(dbLocation);
    } else if (!fs.existsSync(dbLocation)) {
        fs.openSync(dbLocation, 'w');
    }

    // knexjs SQL query builder 
    // Initializing
    knex = require('knex')({
        client: 'sqlite3',
        debug: false,
        connection: {
            filename: dbLocation
        },
        pool: {
            min: 0,
            max: 1
        }
    });
    // Bookshelf - ORM - initialization
    dbORM = require('bookshelf')(knex);
};

Chuppy.Database.createSchema = function() {
    // Drops a table conditionally if the table exists, specified by tableName

    dbORM.knex.schema.dropTableIfExists('users');
    dbORM.knex.schema.dropTableIfExists('users_details');
    dbORM.knex.schema.dropTableIfExists('users_apps');
    dbORM.knex.schema.dropTableIfExists('users_organizations');
    dbORM.knex.schema.dropTableIfExists('organizations');
    console.log("System: Chuppy.Database.createSchema Tables dropped");

    // Creates a new table on the database, with a callback function
    dbORM.knex.schema.hasTable('users').then(function(exists) {
        if (!exists) {
            return dbORM.knex.schema.createTable('users', function(users) {
                users.bigIncrements('id').primary().unsigned();
                users.string('username').unique().index();
                users.string('password');
                users.timestamps(); // created_at and updated_at
            }).then(function() {
                console.log('Database: users table created!');
            }).catch(function(err) {
                console.log('Database: ERROR: ', err);
            });
        } else {
            console.log("TABLE users exists!!!");
        }
    });

    dbORM.knex.schema.hasTable('users_details').then(function(exists) {
        if (!exists) {
            return dbORM.knex.schema.createTable('users_details', function(users_details) {
                users_details.bigIncrements('id').primary().unsigned();
                users_details.integer('uid').unique().index();
                users_details.string('first_name');
                users_details.string('last_name');
                users_details.string('email');
                users_details.binary('profile_picture');
                users_details.string('phone_number');
                users_details.integer('usage_type');
                users_details.boolean('encryption');
                users_details.boolean('autologin');
                users_details.string('root_folder');
                users_details.timestamps(); // created_at and updated_at
            }).then(function() {
                console.log('Database: users_details table created!');
            }).catch(function(err) {
                console.log('Database: ERROR: ', err);
            });
        }
    });
    dbORM.knex.schema.hasTable('users_apps').then(function(exists) {
        if (!exists) {
            return dbORM.knex.schema.createTable('users_apps', function(users_apps) {
                users_apps.bigIncrements('id').primary().unsigned();
                users_apps.integer('uid').index();
                users_apps.string('name-space').index();
                users_apps.integer('order');
                users_apps.boolean('default');
                users_apps.boolean('enabled');
                users_apps.timestamps(); // created_at and updated_at
            }).then(function() {
                console.log('Database: users_details table created!');
            }).catch(function(err) {
                console.log('Database: ERROR: ', err);
            });
        }
    });
    dbORM.knex.schema.hasTable('users_organizations').then(function(exists) {
        if (!exists) {
            return dbORM.knex.schema.createTable('users_organizations', function(users_organizations) {
                users_organizations.bigIncrements('id').primary().unsigned();
                users_organizations.integer('uid').index();
                users_organizations.integer('org_id').index();
                users_organizations.string('password');
                users_organizations.string('server_api');
                users_organizations.string('root_folder');
                users_organizations.timestamps(); // created_at and updated_at
            }).then(function() {
                console.log('Database: users_organizations table created!');
            }).catch(function(err) {
                console.log('Database: ERROR: ', err);
            });
        }
    });

    dbORM.knex.schema.hasTable('organizations').then(function(exists) {
        if (!exists) {
            return dbORM.knex.schema.createTable('organizations', function(organizations) {
                organizations.bigIncrements('id').primary().unsigned();
                organizations.string('name');
                organizations.binary('profile_picture');
                organizations.timestamps(); // created_at and updated_at
            }).then(function() {
                console.log('Database: organizations table created!');
            }).catch(function(err) {
                console.log('Database: ERROR: ', err);
            });
        }
    });

};

// Lets connect to our Database
Chuppy.Database.connect();

// On first application run create database and SCHEMA
if (!Chuppy.Settings.getLocal('firstRun') || Chuppy.Settings.getLocal('firstRun') === "0") {
    Chuppy.Database.createSchema();
}
Chuppy.Database.User = dbORM.Model.extend({
    tableName: 'users',
    hasTimestamps: ['created_at', 'updated_at'],

    userDetails: function() {
        return this.hasOne(Chuppy.Database.UserDetails, 'uid');
    },
    userOrganizations: function() {
        return this.hasMany(Chuppy.Database.UserOrganizations, 'uid');
    },
    userApps: function() {
        return this.hasMany(Chuppy.Database.UserApps, 'uid');
    }
});


Chuppy.Database.UserDetails = dbORM.Model.extend({
    tableName: 'users_details',
    hasTimestamps: ['created_at', 'updated_at'],

    outputVirtuals: false,
    virtuals: {
        full_name: function() {
            return this.get('first_name') + ' ' + this.get('last_name');
        }
    },

});
Chuppy.Database.UserApps = dbORM.Model.extend({
    tableName: 'users_apps',
    hasTimestamps: ['created_at', 'updated_at']
});

Chuppy.Database.UserOrganizations = dbORM.Model.extend({
    tableName: 'users_organizations',
    hasTimestamps: ['created_at', 'updated_at'],
    orgDetails: function() {
        return this.hasOne(Chuppy.Database.Organizations, 'id', 'org_id');
    },
});

Chuppy.Database.Organizations = dbORM.Model.extend({
    tableName: 'organizations',
    hasTimestamps: ['created_at', 'updated_at'],
    orgUsers: function() {
        return this.hasMany(Chuppy.Database.UserOrganizations, 'org_id');
    },
});

/* vim: set ts=4 sw=4 tw=80 noet : */