<!DOCTYPE html>
<html> 
    <head>
        <!--
            /*
             * @Author: LogIN
             * @Date:   2014-08-23 13:00:14
             * @Email:  unicoart@gmail.com
             * @URL:    https://github.com/LogIN-/chuppy
             * @Last Modified by:   LogIN
             * @Last Modified time: 2014-08-23 13:33:00
             * Use of this source code is governed by a license: 
             * The MIT License (MIT)
             * 
             * Copyright (c) 2014-08-23 13:00:14 The Chuppy Authors
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
        --> 
        <meta charset="utf-8">  
        <title><%- page.title %></title>        
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="Chuppy share">
        <meta name="author" content="Chuppy">
        <link rel="icon" href="data:;base64,iVBORw0KGgo=">
        <link rel="stylesheet" type="text/css" media="screen" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" />
        <link rel="stylesheet" type="text/css" media="screen" href="//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" />        
        <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!--[if lt IE 9]>
          <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
          <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->
    </head>
    <body>
     <% if( page.type === 'directory' && page.items.length > 0){ %>
    <table class="table table-hover">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Details</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
          <% _.each( page.items, function( item ){ %>
            <tr>
              <td>1</td>
              <td><%- item.name %></td>
              <td><%- item.file_stats.size %></td>
              <td><%- item.fileType %></td>
            </tr>
           <% }); %>
      </tbody>
      <% } else if( page.type === 'file' && page.items.length > 0 ){ %>
        File Download!!
      <% } else { %>
        Empty directory
      <% } %>
    </table>
    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script type="text/javascript" src="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min.js"></script>

    </body>
</html>