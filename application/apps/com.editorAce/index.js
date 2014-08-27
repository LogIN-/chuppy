
// Define our app starting objects
// others are defined in lib/globals.js
App.Apps.App["com.editorAce"] = {Main: {}, Setup: null};

App.Apps.App["com.editorAce"].Setup = function(options){
    var self = this;
    self.AceEditor = null;

    self.options = {
        "name-space": "com.editorAce",
        // Name variable of app (same as in i18n variable ) 
        "name": "editorAce",
        // Path to the app folder default (/apps/{app.system.name})
        "path": "apps/com.editorAce",
        // Is app enabled or disabled
        "enabled": true,
        "default": true,
        "order": 0,
        "icon": "apps/com.editorAce/lib/images/favicon.png",
        // ID of parent application css container added dynamically from ApplicationBody.js main view
        // {container: "#application-tabs-" + uid}
        // But will always have #application-tabs[data-namespace='app.namespace']
        "uid": null,
        // Path to File/Directory if needed
        "filePath": null,
        // Path to File/Directory if needed
        "workspaceRoot": null
    };
    self.options = _.extend(this.options, options);
    console.info("App defaults editorAce initialized!");
    console.info(self.options);

    // Setup needed database for app and include needed files (js/css)
    self.setupDependencies = function () {
        console.info("Setting up app dependencies");
        // main application template
        // var template = _.template(App.Utils.FileSystem.readFileLocal('apps/com.editorAce/lib/templates/main.tpl', 'sync'));
        // $("#application-tabs-" + self.options.uid).html(template);
        self.setupIncludes();

    };
    // After successful app init this function is called
    // Here is a place where magic should happen
    self.initilizeAppUI = function () {
        var counter = 0;
        // Little Hack to display loading while waiting async operations
        var interval = setInterval(function() {
            if(counter === 100){
                console.log("App loading canceled");
                clearInterval(interval);
                return;
            }
            if (typeof App.Apps.App["com.editorAce"].Main.Private !== "undefined") {     
                 if (typeof App.Apps.App["com.editorAce"].Main.Private.Init === "function") {         
                    clearInterval(interval);
                    // Create our application object
                    self.AceEditor = new App.Apps.App["com.editorAce"].Main.Private.Init(self.options);
                    // Render application
                    self.AceEditor.initialize();
                }else{
                    console.log("com.editorAce Private.Init undefined");
                }
            }else{
                counter++;
                console.log("Loading application data");
            }
        }, 100);
    };
    // Remove current app dependencies 
    // Called from App.Utils.Apps
    self.removeView = function () {
        // Remove all HTML tags/includes by data-id
        App.Utils.Apps.resetValues(['com.editorAce']);
    };

};
// Any app scripts(depencies), CCS files that should be included in body
App.Apps.App["com.editorAce"].Setup.prototype.setupIncludes = function(){

    var self = this;
    var scripts = [];

    scripts.push('apps/com.editorAce/lib/javascript/globals.js');    
    scripts.push('apps/com.editorAce/lib/javascript/vendor/ace/ace.js');
    scripts.push('apps/com.editorAce/lib/javascript/main.js');

    // Needed Styles
    var styles = [
        'apps/com.editorAce/lib/stylesheets/main.css'
    ];
    // Actually include them:
    if(scripts.length > 0){ 
        // Create external script tags
        _.each(scripts, function(script){
            App.Utils.Template.createHTMLTag(script, self.options["name-space"], "script");
        });
    }
    if(styles.length > 0){ 
        // Create external style tags
        _.each(styles, function(style){
            App.Utils.Template.createHTMLTag(style, self.options["name-space"], "style");
        });
    }

};