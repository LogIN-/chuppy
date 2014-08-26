<!-- Application first run setup from 
TODO: add import functions -->
<div id="chuppy-firstrun" class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="chuppyConfiguration" aria-hidden="true" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog modal-lg">
        <form id="userSetupForm" class="form-horizontal">
            <div class="modal-content"> 
                <div class="modal-header">
                    <h4 class="modal-title" id="chuppyConfiguration"><%= i18n.__('Welcome to Chuppy! Lets take a minute to configure it...') %></h4>
                </div>
                <div class="modal-body">
                    <div id="setupModalTab">
                        <div class="tab-content"> 
                        <!-- STEP 1: Create new user 
                        TODO: existing user login -->
                            <div class="tab-pane fade in active" id="setup-step1">
                                <!-- Form Name --> 
                                <div class="setup_legend"><%= i18n.__('Please enter your details') %></div>
                                <!-- Text input-->
                                <div class="form-group">
                                    <label class="col-md-3 control-label"><%= i18n.__('Full name') %></label>
                                    <div class="col-md-4">
                                        <input type="text" class="form-control" name="configuration-user-firstname" placeholder="<%= i18n.__('First name') %>"
                                            <% if(isDebug) { %>
                                                value="<%= i18n.__('configuration-user-firstname') %>"
                                            <% } %> 
                                            data-bv-notempty="true"
                                            data-bv-notempty-message="<%= i18n.__('The first name is required and cannot be empty') %>" />
                                    </div>
                                    <div class="col-md-4">
                                        <input type="text" class="form-control" name="configuration-user-lastname" placeholder="<%= i18n.__('Last name') %>"
                                            <% if(isDebug) { %>
                                                value="<%= i18n.__('configuration-user-lastname') %>"
                                            <% } %> 
                                            data-bv-notempty="true"
                                            data-bv-notempty-message="<%= i18n.__('The last name is required and cannot be empty') %>" />
                                    </div>
                                </div>
                                <!-- Text input-->
                                <div class="form-group">
                                    <label class="col-md-3 control-label"><%= i18n.__('Username') %></label>
                                    <div class="col-md-4">
                                        <input type="text" class="form-control" name="configuration-user-username"
                                            <% if(isDebug) { %>
                                                value="<%= i18n.__('configuration-user-username') %>"
                                            <% } %> 
                                            data-bv-message="<%= i18n.__('The username is not valid') %>"

                                            data-bv-notempty="true"
                                            data-bv-notempty-message="<%= i18n.__('The username is required and cannot be empty') %>"

                                            data-bv-regexp="true"
                                            data-bv-regexp-regexp="^[a-zA-Z0-9_\.]+$"
                                            data-bv-regexp-message="<%= i18n.__('The username can only consist of alphabetical, number, dot and underscore') %>"

                                            data-bv-stringlength="true"
                                            data-bv-stringlength-min="6"
                                            data-bv-stringlength-max="30"
                                            data-bv-stringlength-message="<%= i18n.__('The username must be more than 6 and less than 30 characters long') %>"

                                            data-bv-different="true"
                                            data-bv-different-field="configuration-user-password"
                                            data-bv-different-message="<%= i18n.__('The username and password cannot be the same as each other') %>" />
                                    </div>
                                </div>

                                <!-- Text input-->
                                <div class="form-group">
                                    <label class="col-md-3 control-label"><%= i18n.__('Email address') %></label>
                                    <div class="col-md-4">
                                        <input class="form-control" name="configuration-user-email" type="email"
                                            <% if(isDebug) { %>
                                            value="<%= i18n.__('configuration-user-email') %>"
                                            <% } %> 
                                            data-bv-emailaddress="true"
                                            data-bv-emailaddress-message="<%= i18n.__('The input is not a valid email address') %>" />
                                    </div>
                                </div>

                                <!-- File Avatar Button --> 
                                <!-- Multiple Radios -->
                                <div class="form-group">
                                    <label class="col-md-4 control-label"><%= i18n.__('Profile Picture') %></label>
                                    <!-- File Action Select --> 
                                    <div class="col-md-3">
                                        <div class="radio">
                                            <label for="configuration-user-avatar-0">
                                                <input name="configuration-user-avatar" id="configuration-user-avatar-0" value="1" type="radio">
                                                <%= i18n.__('Select from PC') %>
                                            </label>
                                        </div>
                                        <div class="radio">
                                            <label for="configuration-user-avatar-1">
                                                <input name="configuration-user-avatar" id="configuration-user-avatar-1" value="2" type="radio">
                                                <%= i18n.__('Camera Snapshot') %>
                                            </label>
                                        </div>
                                    </div>
                                    <!-- Image Preview Area --> 
                                    <div class="col-md-5">
                                        <div class="croppic-avatar">
                                            <canvas id="configuration-user-avatar-canvas" width="150" height="115" class="thumbnail display-none"></canvas>
                                            <video id="configuration-user-avatar-video"   class="thumbnail display-none" autoplay></video>
                                        </div>
                                    </div>
                                    <input id="configuration-user-avatar-file-pc" name="configuration-user-avatar-file-pc" class="input-file hiddenfile" type="file" accept="image/jpeg,image/jpg,image/gif,image/png" /> 
                                    <input id="configuration-user-avatar-base64" name="configuration-user-avatar-base64" value="<%= i18n.__('configuration-user-avatar') %>" type="hidden" />
                                </div>

                                <!-- User root storage folder --> 
                                <div class="form-group">
                                    <label class="col-md-3 control-label" for="configuration-user-root-folder"><%= i18n.__('Workspace folder') %></label>
                                    <div class="col-md-4">
                                        <input id="configuration-user-root-folder" name="configuration-user-root-folder" class="input-file" type="file" nwdirectory />                     
                                    </div>
                                </div>


                                <div class="form-group">
                                    <label class="col-md-3 control-label"><%= i18n.__('Phone number') %></label>
                                    <div class="col-md-4">
                                        <input type="text" class="form-control" name="configuration-user-phone" 
                                            <% if(isDebug) { %>
                                            value="<%= i18n.__('configuration-user-phone') %>"
                                            <% } %> />
                                    </div>
                                </div>

                                <!-- Password input-->
                                <div class="form-group">
                                    <label class="col-md-3 control-label"><%= i18n.__('Password') %></label>
                                    <div class="col-md-4">
                                        <input type="password" class="form-control" name="configuration-user-password"
                                            <% if(isDebug) { %>
                                            value="<%= i18n.__('configuration-user-password') %>"
                                            <% } %> 
                                            data-bv-notempty="true"
                                            data-bv-notempty-message="<%= i18n.__('The password is required and cannot be empty') %>"

                                            data-bv-identical="true"
                                            data-bv-identical-field="configuration-user-repassword"
                                            data-bv-identical-message="<%= i18n.__('The password and its confirm are not the same') %>"

                                            data-bv-different="true"
                                            data-bv-different-field="configuration-user-username"
                                            data-bv-different-message="<%= i18n.__('The password cannot be the same as username') %>" />
                                    </div>
                                </div>

                                <!-- Re-Password input-->
                                <div class="form-group">
                                    <label class="col-md-3 control-label"><%= i18n.__('Retype password') %></label>
                                    <div class="col-md-4">
                                        <input type="password" class="form-control" name="configuration-user-repassword"
                                            <% if(isDebug) { %>
                                            value="<%= i18n.__('configuration-user-repassword') %>"
                                            <% } %> 
                                            data-bv-notempty="true"
                                            data-bv-notempty-message="<%= i18n.__('The confirm password is required and cannot be empty') %>"

                                            data-bv-identical="true"
                                            data-bv-identical-field="configuration-user-password"
                                            data-bv-identical-message="<%= i18n.__('The password and its confirm are not the same') %>"

                                            data-bv-different="true"
                                            data-bv-different-field="configuration-user-username"
                                            data-bv-different-message="<%= i18n.__('The password cannot be the same as username') %>" />
                                    </div>
                                </div>

                                <!-- Multiple Radios -->
                                <div class="form-group">
                                  <label class="col-md-4 control-label" for="configuration-user-autologin">Auto login</label>
                                  <div class="col-md-4">
                                  <div class="radio">
                                    <label for="configuration-user-autologin-0">
                                      <input name="configuration-user-autologin" id="configuration-user-autologin-0" value="0" checked="checked" type="radio">
                                      No
                                    </label>
                                    </div>
                                  <div class="radio">
                                    <label for="configuration-user-autologin-1">
                                      <input name="configuration-user-autologin" id="configuration-user-autologin-1" value="1" type="radio">
                                      Yes
                                    </label>
                                    </div>
                                  </div>
                                </div>
                                
                                <!-- Multiple Radios -->
                                <div class="form-group">
                                    <label class="col-md-3 control-label"><%= i18n.__('Usage Type') %></label>
                                    <div class="col-md-4">
                                        <div class="radio">
                                            <label for="configuration-user-usage-0">
                                                <input name="configuration-user-usage" id="configuration-user-usage-0" value="1" data-addon="<%= i18n.__('Finish') %>" type="radio">
                                                <%= i18n.__('Personal (stand-alone use)') %>
                                            </label>
                                        </div>
                                        <div class="radio">
                                            <label for="configuration-user-usage-1">
                                                <input name="configuration-user-usage" id="configuration-user-usage-1" value="2" data-addon="<%= i18n.__('Next') %>" type="radio">
                                                <%= i18n.__('Create new organization') %>
                                            </label>
                                        </div>
                                        <div class="radio">
                                            <label for="configuration-user-usage-2">
                                                <input name="configuration-user-usage" id="configuration-user-usage-2" value="3" data-addon="<%= i18n.__('Next') %>" type="radio">
                                                <%= i18n.__('Join an existing organization') %>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <!-- Multiple Radios -->
                                <div class="form-group">
                                    <label class="col-md-3 control-label"><%= i18n.__('Utilize encryption') %></label>
                                        <div class="col-md-6">
                                            <div class="radio">
                                                <label for="configuration-user-encryption-0">
                                                    <input name="configuration-user-encryption" id="configuration-user-encryption-0" value="1" type="radio">
                                                        <%= i18n.__('Dont use encryption (faster but less secure)') %>
                                                </label>
                                            </div>
                                        <div class="radio">
                                            <label for="configuration-user-encryption-1">
                                                <input name="configuration-user-encryption" id="configuration-user-encryption-1" value="2" type="radio">
                                                    <%= i18n.__('Utilize full encryption (slower but much more secure)') %>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div> <!-- STEP 1 div END -->

                            <!-- STEP 2: Create new organization
                            TODO: existing organization import -->
                            <div class="tab-pane fade" id="setup-step2">
                                <!-- Form Name -->
                                <div class="setup_legend"><%= i18n.__('Please enter here details to create new organization') %></div>

                                <!-- Text input-->
                                <div class="form-group">
                                    <label class="col-md-3 control-label" for="configuration-organization-name"><%= i18n.__('Organization Name') %></label>  
                                    <div class="col-md-4">
                                        <input id="configuration-organization-name" name="configuration-organization-name" placeholder="<%= i18n.__('Organization name') %>" class="form-control input-md" type="text" 
                                            <% if(isDebug) { %>
                                            value="<%= i18n.__('configuration-organization-name') %>"
                                            <% } %> 
                                            data-bv-notempty="true"
                                            data-bv-notempty-message="<%= i18n.__('Organization name is required and cannot be empty') %>" />
                                    </div>
                                </div>

                                <!-- File Button --> 
                                <div class="form-group">
                                    <label class="col-md-3 control-label" for="configuration-organization-avatar"><%= i18n.__('Organization Picture') %></label>
                                    <div class="col-md-4">
                                        <input id="configuration-organization-avatar" name="configuration-organization-avatar" class="input-file" type="file" accept="image/jpeg,image/jpg,image/gif,image/png" />
                                        <input id="configuration-organization-avatar-base64" name="configuration-organization-avatar-base64" value="<%= i18n.__('configuration-organization-avatar') %>" type="hidden" />  
                                    </div>
                                    <!-- Image Preview Area --> 
                                    <div class="col-md-5">
                                        <div class="croppic-avatar">
                                            <img class="configuration-organization-avatar" src="<%= i18n.__('configuration-organization-avatar') %>" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Password input-->
                                <div class="form-group">
                                    <label class="col-md-3 control-label" for="configuration-organization-password"><%= i18n.__('Password') %></label>
                                    <div class="col-md-4">
                                        <input id="configuration-organization-password" name="configuration-organization-password" class="form-control input-md" type="password" 
                                            <% if(isDebug) { %>
                                            value="<%= i18n.__('configuration-organization-password') %>"
                                            <% } %> 
                                            data-bv-notempty="true"
                                            data-bv-notempty-message="<%= i18n.__('The password is required and cannot be empty') %>"

                                            data-bv-identical="true"
                                            data-bv-identical-field="configuration-organization-repassword"
                                            data-bv-identical-message="<%= i18n.__('The password and its confirm are not the same') %>"

                                            data-bv-different="true"
                                            data-bv-different-field="configuration-organization-name"
                                            data-bv-different-message="<%= i18n.__('The password cannot be the same as organization name') %>" />
                                    </div>
                                </div>

                                <!-- Re Password input-->
                                <div class="form-group">
                                    <label class="col-md-3 control-label" for="configuration-organization-repassword"><%= i18n.__('Retype password') %></label>
                                    <div class="col-md-4">
                                        <input id="configuration-organization-repassword" name="configuration-organization-repassword" class="form-control input-md" type="password" 
                                            <% if(isDebug) { %>
                                            value="<%= i18n.__('configuration-organization-repassword') %>"
                                            <% } %> 
                                            data-bv-notempty="true"
                                            data-bv-notempty-message="<%= i18n.__('The confirm password is required and cannot be empty') %>"

                                            data-bv-identical="true"
                                            data-bv-identical-field="configuration-organization-password"
                                            data-bv-identical-message="<%= i18n.__('The password and its confirm are not the same') %>"

                                            data-bv-different="true"
                                            data-bv-different-field="configuration-organization-name"
                                            data-bv-different-message="<%= i18n.__('The password cannot be the same as organization name') %>" />
                                    </div>
                                </div>
                                <!-- Multiple Radios -->
                                <div class="form-group">
                                    <label class="col-md-4 control-label"><%= i18n.__('Organization server') %></label>
                                    <div class="col-md-4">
                                        <div class="radio">
                                            <label for="configuration-organization-server-0">
                                                <input name="configuration-organization-server" id="configuration-organization-server-0" data-addon="#configuration-organization-server-private-fields" value="1" type="radio">
                                                <%= i18n.__('Default server') %>
                                            </label>
                                        </div>
                                        <div class="radio">
                                            <label for="configuration-organization-server-1">
                                                <input name="configuration-organization-server" id="configuration-organization-server-1" data-addon="#configuration-organization-server-private-fields" value="2" type="radio">
                                                <%= i18n.__('Use private server') %>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <!-- Text input-->
                                <!-- http://bootstrapvalidator.com/validators/uri/ -->
                                <div id="configuration-organization-server-private-fields" class="form-group display-none">
                                    <label class="col-md-4 control-label" for="configuration-organization-server-private"><%= i18n.__('Server URL') %></label>  
                                    <div class="col-md-4">
                                        <input id="configuration-organization-server-private" name="configuration-organization-server-private" placeholder="http://api.example.com" class="form-control input-md" type="url"
                                        data-bv-uri-message="<%= i18n.__('The address is not valid') %>" />
                                    </div>
                                </div>

                            </div> <!-- STEP 2 div END -->
                            <!-- STEP 3: Jain existing organization  -->
                            <div class="tab-pane fade" id="setup-step3">
                                <!-- Form Name -->
                                <div class="setup_legend"><%= i18n.__('Please enter existing details to join existing organization') %></div>

                                <!-- Text input-->
                                <div class="form-group">
                                    <label class="col-md-3 control-label" for="configuration-organization-join-name"><%= i18n.__('Organization name') %></label>  
                                    <div class="col-md-4">
                                        <input id="configuration-organization-join-name" name="configuration-organization-join-name" placeholder="<%= i18n.__('configuration-organization-name') %>" class="form-control input-md" type="text" 
                                            <% if(isDebug) { %>
                                            value="<%= i18n.__('configuration-organization-name') %>"
                                            <% } %> 
                                            />
                                        <span class="help-block"><%= i18n.__('Full name of your organization') %></span>  
                                    </div>
                                </div>

                                <!-- Password input-->
                                <div class="form-group">
                                    <label class="col-md-3 control-label" for="configuration-organization-join-password"><%= i18n.__('Password') %></label>
                                    <div class="col-md-4">
                                        <input id="configuration-organization-join-password" name="configuration-organization-join-password" placeholder="<%= i18n.__('********') %>" class="form-control input-md" required=""   type="password" 
                                            <% if(isDebug) { %>
                                            value="<%= i18n.__('configuration-organization-password') %>"
                                            <% } %> 
                                            />
                                        <span class="help-block"><%= i18n.__('Please enter password that will be used to join your organization') %></span>
                                    </div>
                                </div>

                                <!-- Re-Password input-->
                                <div class="form-group">
                                    <label class="col-md-3 control-label" for="configuration-organization-join-repassword"><%= i18n.__('Retype password') %></label>
                                    <div class="col-md-4">
                                        <input id="configuration-organization-join-repassword" name="configuration-organization-join-repassword" placeholder="<%= i18n.__('********') %>" class="form-control input-md" required="" type="password" 
                                            <% if(isDebug) { %>
                                            value="<%= i18n.__('configuration-organization-repassword') %>"
                                            <% } %> 
                                            />
                                        <span class="help-block"><%= i18n.__('Please retype your password') %></span>
                                    </div>
                                </div>
                                <!-- Multiple Radios -->
                                <div class="form-group">
                                    <label class="col-md-4 control-label"><%= i18n.__('Organization server') %></label>
                                    <div class="col-md-4">
                                        <div class="radio">
                                            <label for="configuration-organization-join-server-0">
                                                <input name="configuration-organization-join-server" id="configuration-organization-join-server-0" data-addon="#configuration-organization-join-server-private-fields" value="1" type="radio">
                                                <%= i18n.__('Default server') %>
                                            </label>
                                        </div>
                                        <div class="radio">
                                            <label for="configuration-organization-join-server-1">
                                                <input name="configuration-organization-join-server" id="configuration-organization-join-server-1" data-addon="#configuration-organization-join-server-private-fields" value="2" type="radio">
                                                <%= i18n.__('Use private server') %>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <!-- Text input-->
                                <!-- http://bootstrapvalidator.com/validators/uri/ -->
                                <div id="configuration-organization-join-server-private-fields" class="form-group display-none">
                                    <label class="col-md-4 control-label" for="configuration-organization-join-server-private"><%= i18n.__('Server URL') %></label>  
                                    <div class="col-md-4">
                                        <input id="configuration-organization-join-server-private" name="configuration-organization-join-server-private" placeholder="http://api.example.com" class="form-control input-md" type="url"
                                        data-bv-uri-message="<%= i18n.__('The address is not valid') %>" />
                                    </div>
                                </div>   
                            </div> <!-- STEP 3 div END -->
                        </div> <!-- .tab-content END -->
                    </div> <!-- #setupModalTab END -->
                </div> <!-- .modal-body END -->
                <div class="modal-footer">
                    <button type="button" name="configuration-button-exit" class="btn btn-lg btn-danger" data-dismiss="modal" data-id="0"><%= i18n.__('Quit') %></button>
                    <button type="submit" name="configuration-button-success" class="btn btn-lg btn-success" data-id="1"><%= i18n.__('Finish') %></button>
                </div>
            </div> <!-- .modal-content END -->
        </form> <!-- #userSetupForm FORM END -->    
    </div> <!-- modal-dialog -->
</div> <!-- #chuppy-first-run END -->