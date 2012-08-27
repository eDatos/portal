[#ftl]
[#include "/inc/includes.ftl"]
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <link href="http://twitter.github.com/bootstrap/assets/css/bootstrap.css" rel="stylesheet">
  </head>
<body>  
  
<div class="container">
	<center><h1>Stat4you</h1></center>
	<div class="row">
		<div class="span4 offset4 well" id="sign-container">
		</div>
	</div>
</div>

<script type="text/template" id="signin-tmpl">
	<div class="row">
		<form id="tw_form" class="span2" action="[@spring.url "/signin/twitter" /]" method="POST">
			<a href="#" id="tw_signin">
			<img src="[@spring.url "/theme/images/social/sign-in-with-twitter.png" /]" />
			</a>
		</form>

		<form id="fb_form" class="social-form span2" action="[@spring.url "/signin/facebook" /]" method="POST">
			<a href="#" id="fb_signin">
				<img src="[@spring.url "/theme/images/social/sign-in-with-facebook.png" /]" />
			</a>
		</form>
	</div>

	<hr>

	<form action="[@spring.url "/signin/authenticate" /]" method="post">
		<div class="control-group">
			<label class="control-label" for="login">Username</label>
			<div class="controls">
				<input type="text" class="input-xlarge" id="login"
					name="j_username">
			</div>
		</div>

		<div class="control-group">
			<label class="control-label" for="password">Password</label>
			<div class="controls">
				<input type="password" class="input-xlarge" id="password"
					name="j_password" type="password">
			</div>
		</div>

		<p>
			Don't have a login yet? <a href="#signup">Sign up for an account</a>
		</p>

		<button type="submit" class="btn btn-primary">Sign in</button>
	</form>
</script>

<script id="signup-tmpl" type="text/html">
	<form action="[@spring.url "/signup" /]" method="POST">
		<div class="control-group">
			<label class="control-label" for="firstName">First Name</label>
			<div class="controls">
				<input type="text" class="input-xlarge" id="firstName" name="firstName">
			</div>
		</div>
		<div class="control-group">
			<label class="control-label" for="lastName">Last Name</label>
			<div class="controls">
				<input type="text" class="input-xlarge" id="lastName" name="lastName">
			</div>
		</div>
		<div class="control-group">
			<label class="control-label" for="username">Username</label>
			<div class="controls">
				<input type="text" class="input-xlarge" id="username" name="username">
			</div>
		</div>
		<div class="control-group">
			<label class="control-label" for="password">Password</label>
			<div class="controls">
				<input type="password" class="input-xlarge" id="password" name="password">
			</div>
		</div>
	
		<div>
			<button type="submit" class="btn btn-primary">Sign Up</button>
		</div>
	</form>
	<p>Already on Stat4you? <a href="#sigin">Sign In</a></p>
</script>

<script src="http://cdnjs.cloudflare.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.1/underscore-min.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.1/backbone-min.js"></script>

<script>
	var Stat4you = {};

	//Módulo
	Stat4you.Signin = {};

	Stat4you.Signin.View = Backbone.View.extend({
		
		//template : _.template($('#template-name').html()),
		//no tiene interpolación de variables
		template : $('#signin-tmpl').html(),

		render : function() {
			$(this.el).html(this.template);
		}
	});
	
	Stat4you.Signup = {};
	Stat4you.Signup.View = Backbone.View.extend({
		template : $('#signup-tmpl').html(),
		events: {
            "click #tw_signin": "twitterSignIn",
            "click #fb_signin": "facebookSignIn"
        },
		render : function() {
			$(this.el).html(this.template);
		},
		twitterSignIn  : function(){
			$('#tw_form').submit();
		},
		facebookSignIn : function(){
			$('#fb_form').submit();	
		}		
	});
	
	
	var viewSignIn = new Stat4you.Signin.View({el : $('#sign-container')});
	var viewSignUp = new Stat4you.Signup.View({el : $('#sign-container')});
	
	var AppRouter = Backbone.Router.extend({
		routes : {
			"signin" : "signin",
			"signup" : "signup",
			"*actions": "defaultRoute"
		},
		defaultRoute : function(){
			this.signin();
		},
		signin : function() {
			viewSignIn.render();
		},
		signup : function() {
			viewSignUp.render();
		}
	});
	
	
	// Instantiate the router
	var app_router = new AppRouter;
	// Start Backbone history a neccesary step for bookmarkable URL's
	Backbone.history.start({});
</script>

</body>
</html>