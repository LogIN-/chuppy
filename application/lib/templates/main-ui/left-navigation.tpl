<!-- Main View Side bar Left START -->
<div id="left-navigation" data-id="3" class="col-sm-3 col-md-2 affix-sidebar">
    <div class="sidebar-nav">
        <div class="navbar" role="navigation">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".sidebar-navbar-collapse">
                    <span class="sr-only"><%= i18n.__('Toggle navigation') %></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <span class="visible-xs navbar-brand"><%= i18n.__('Sidebar') %></span>
            </div>
            <div class="navbar-collapse collapse sidebar-navbar-collapse">
                <ul class="nav navbar-nav" id="nav-side-left">
                    <% _.each(menuItems, function( menuItem ){ %>
                        <% if(menuItem.visible === true && menuItem.enabled === true){ %>
                        <li data-href="<%- menuItem['name-space'] %>">
                                <div class="menuItemIcon pull-left">
                                    <img 
                                    onerror="$(this).avatar();" 
                                    data-width="40"  
                                    data-height="40" 
                                    data-fontSize="20"
                                    data-name="<%- menuItem.name %>"
                                    width="40" 
                                    height="40" 
                                    src="<%- menuItem.icon %>" 
                                    alt="<%- menuItem.name %>" 
                                    class="animated swing img-circle" />
                                </div>
                                <div class="menuItemName pull-left"><%= i18n.__(menuItem.name) %></div>
                        </li>
                        <% } %>
                    <% }); %>
                    <!-- 
                    <li class="nav-expand">
                        <a href="#" data-toggle="collapse" data-target="#item-toogle" data-parent="#nav-side-left" class="collapsed">
                            <i class="fa fa-random"></i> Decode <i class="fa fa-plus pull-right"></i>
                        </a>
                        <div class="collapse" id="item-toogle" style="height: 0px;">
                          <ul class="nav navbar-nav">
                            <li><a href="#">decode in image</a></li>
                            <li><a href="#">decode in video</a></li>
                            <li><a href="#">decode in audio</a></li>
                          </ul>
                        </div>
                    </li> -->
                </ul>
            </div>
            <!--/.nav-collapse -->
        </div>
    </div>
</div>
<!-- Main View Side-bar-left END -->
