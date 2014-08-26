<div id="loginBox" class="container">
    <div class="container_row">
        <div class="container bounceIn" id="loginContainerUserList">
            <h4>Please login:</h4>
            <div class="loginUserContainer">
                <% _.each( users_models, function( user ){ %>
                    <div class="loginUserChooser clearfix" data-id="1" data-username="<%- user.attributes.username %>" data-password-login="<%- user.relations.userDetails.attributes.autologin %>"> 
                        <div class="loginUserAvatar pull-left">
                            <img 
                            onerror="$(this).avatar();" 
                            data-width="32"  
                            data-height="32" 
                            data-fontSize="20"
                            data-name="<%- user.relations.userDetails.attributes.first_name %>"
                            width="85" 
                            height="85" 
                            src="<%- user.relations.userDetails.attributes.profile_picture %>" 
                            alt="<%- user.relations.userDetails.attributes.first_name %>" 
                            class="animated swing img-circle" />
                        </div>
                        <div class="username pull-left"><%- user.relations.userDetails.attributes.first_name %> <%- user.relations.userDetails.attributes.last_name %></div>
                        <span class="glyphicon glyphicon-play-circle pull-right"></span> 
                    </div>
                <% }); %>
            </div>
            <!-- /col-md-12 -->
        </div>
        <!-- /container -->
        <div class="container bounceIn" id="loginContainerPrompt">
            <div class="loginUserAvatar clearfix">
                <img src="http://placehold.it/150/8e44ad/FFF&amp;text=J" class="img-rounded">
            </div>
            <h4>Please enter login details:</h4>
            <div class="loginUserPromptInput">
                <input id="loginUserPromptUsername" type="text" placeholder="username" value="">
                <input id="loginUserPromptpassword" type="password" placeholder="password" value="">
                <button class="btn btn-default btn-login">
                    <span class="glyphicon glyphicon-ok"></span>
                </button>
            </div>
            <span data-id="2" class="back glyphicon glyphicon-remove"></span>
        </div>

    </div>
</div>
