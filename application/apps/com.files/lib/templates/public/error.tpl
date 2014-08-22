<!DOCTYPE html>
<html>
    <head>
        <title><%- page.title %></title>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="Chuppy error page">
        <meta name="author" content="Chuppy">
        <link rel="icon" href="data:;base64,iVBORw0KGgo=">
        <link rel="stylesheet" type="text/css" media="screen" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" />
        <link rel="stylesheet" type="text/css" media="screen" href="//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" />        
        <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!--[if lt IE 9]>
          <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
          <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->
        <style type="text/css">
            * {
                margin: 0;
                padding: 0;
            }
            /* Links */
            a,
            a:focus,
            a:hover {
              color: #fff;
            }
            /* Custom default button */
            .btn-default,
            .btn-default:hover,
            .btn-default:focus {
              color: #333;
              text-shadow: none; /* Prevent inheritence from `body` */
              background-color: #fff;
              border: 1px solid #fff;
            }
            /*
             * Base structure
             */
            html,
            body {
                background-color: #333;
                height: 100%;
                min-height: 100%;
                min-width: 100%;
                width: 100%;
            }
            body {
              color: #fff;
              text-align: center;
              text-shadow: 0 1px 3px rgba(0,0,0,.5);
            }
            /* Extra markup and styles for table-esque vertical and horizontal centering */
            .site-wrapper {
              display: table;
              width: 100%;
              height: 100%; /* For at least Firefox */
              min-height: 100%;
              -webkit-box-shadow: inset 0 0 100px rgba(0,0,0,.5);
                      box-shadow: inset 0 0 100px rgba(0,0,0,.5);
            }
            .site-wrapper-inner {
              display: table-cell;
              vertical-align: top;
            }
            .cover-container {
              margin-right: auto;
              margin-left: auto;
            }
            /* Padding for spacing */
            .inner {
              padding: 30px;
            }
            .lead {
                clear: both;
                height: 50px;
                line-height: 50px;
            }
            /*
             * Cover
             */
            .cover {
              padding: 0 20px;
            }
            .cover .btn-lg {
                clear: both;
                display: block;
                font-size: 18px;
                font-weight: bold;
                height: 50px;
                line-height: 50px;
                margin: 0 auto;
                width: 100px;
                padding: 0;
            }

            .cover-heading {
                font-size: 48px;
            }
            /*
             * Footer
             */
            .mastfoot {
              color: #999; /* IE8 proofing */
              color: rgba(255,255,255,.5);
            }
            /*
             * Affix and center
             */
            @media (min-width: 768px) {
              /* Pull out the header and footer */
              .mastfoot {
                position: fixed;
                bottom: 0;
              }
              /* Start the vertical centering */
              .site-wrapper-inner {
                vertical-align: middle;
              }
              /* Handle the widths */
              .masthead,
              .mastfoot,
              .cover-container {
                width: 100%; /* Must be percentage or pixels for horizontal alignment */
              }
            }
            @media (min-width: 992px) {
              .masthead,
              .mastfoot,
              .cover-container {
                width: 800px;
              }
            }
        </style>
    </head>
    <body>

    <div class="site-wrapper">

      <div class="site-wrapper-inner">

        <div class="cover-container">

          <div class="inner cover">
            <h1 class="cover-heading">404 Page</h1>
            <p class="lead">
            Sorry the page you are requesting doesn't exist please go back and try again!
            </p>
            <p class="lead">
              <a href="#" onclick="history.go(-1);" class="btn btn-lg btn-default">Back!</a>
            </p>
          </div>

          <div class="mastfoot">
            <div class="inner">
              <p>Created by <a href="https://github.com/LogIN-/chuppy">Chuppy</a></p>
            </div>
          </div>

        </div>

      </div>

    </div>



    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script type="text/javascript" src="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min.js"></script>
    </body>
</html>