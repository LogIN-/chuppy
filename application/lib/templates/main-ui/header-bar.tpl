<!-- Our main header tag in app -->
<header data-id="2" id="header-bar" class="row">
    <div class="col-sm-3 col-md-2">
      <div id="header-bar-logo">
        chuppy
      </div>
    </div>
    <div class="col-sm-9 col-md-10" style="padding-right: 0;">
      <div id="header-bar-content" class="pull-right">
        <div id="header-search" class="pull-left">
            <form role="form" class="form-horizontal">
              <div class="form-group has-feedback">                
                <input type="text" id="header-search-input" placeholder="type to search...">
                <span class="glyphicon glyphicon-search form-control-feedback"></span>
              </div>
            </form>
        </div>
        <div id="header-user-home" class="pull-right">
            <!-- Profile avatar -->
            <!-- <%- user.userMain %> -->
            <img class="avatar media-object pull-left animated swing img-circle" 
                  width="55"
                  height="55"
                  data-name="<%- user.userDetails.first_name %>"  
                  data-width="55"  
                  data-height="55"
                  data-fontSize="16" 
                  onerror="$(this).avatar();"
                  alt="<%- user.userDetails.first_name %>"
                  src="<%- user.userDetails.profile_picture %>" />

            <!-- Profile dropdown Split button -->
            <div class="btn-group" style="padding-left: 0px;">
              <button data-toggle="dropdown" type="button" class="dropdown-toggle"><span class="caret"></span></button>
              <ul id="header-user-panel" role="menu" class="dropdown-menu dropdown-menu-right">
                <li><a data-id="2" href="#">Settings</a></li>
                <li class="divider"></li>
                <li><a data-id="1"href="#">Logout</a></li>
                <li><a data-id="0"href="#">Exit</a></li>
              </ul>
            </div>
        </div>
      </div>
    </div>
</header>