[#ftl]
[#include "/inc/includes.ftl"]
[@template.base]

<script>
	$(document).ready(function(){
		
		$("#userForm").validate({
			rules: {
				confirmPassword : {
					equalTo: "#user\\.password"
				}
			}
		});
		
		
		// Username validation logic
        var validateUsername = $('#validateUsername');
        $('#user\\.userName').keyup(function () {
            // cache the 'this' instance as we need access to it within a setTimeout, where 'this' is set to 'window'
            var t = this; 
            
            // only run the check if the username has actually changed - also means we skip meta keys
            if (this.value != this.lastValue) {
                
                // the timeout logic means the ajax doesn't fire with *every* key press, i.e. if the user holds down
                // a particular key, it will only fire when the release the key.
                                
                if (this.timer) clearTimeout(this.timer);
                
                // show our holding text in the validation message space
                validateUsername.removeClass('error').html(' checking availability...');
                
                // fire an ajax request in 1/5 of a second
                this.timer = setTimeout(function () {
                    $.ajax({
                        url: 'user-validation',
                        data: 'action=check_username&username=' + t.value,
                        dataType: 'json',
                        type: 'post',
                        success: function (j) {
                        	alert(j);
                            // put the 'msg' field from the $resp array from check_username (php code) in to the validation message
                            validateUsername.html(j.msg);
                        }
                    });
                }, 200);
                
                // copy the latest value to avoid sending requests when we don't need to
                this.lastValue = this.value;
            }
        });
		
		$("input.button, a.button").button();
	});  
  </script>
  
<div id="content-right">

	<h3>[@spring.message 'page.user-management.title' /]: [#if !creating ]${userForm.user.name} ${userForm.user.firstSurname} ${userForm.user.secondSurname}[/#if]</h3>
		
	
	<form id="userForm" name="userForm" class="form" action="" method="POST">
		<input type="hidden" name="_method" value="[#if creating ]POST[#else]PUT[/#if]">
		
		[@fieldInputHidden value="userForm.user.id" /]

		<fieldset>
			[@fieldInputText     label="entity.user.userName"         value="userForm.user.userName"        required=true  minlength=5 maxlength=10 /]
			<div id="validateUsername"></div>
			[@fieldInputText     label="entity.user.name"             value="userForm.user.name"            required=true  /]
			[@fieldInputPassword label="entity.user.password"         value="userForm.user.password"        required=true  minlength=5 rendered=creating /]
			[@fieldInputPassword label="entity.user.confirmPassword"  value="userForm.confirmPassword"      required=true  minlength=5 rendered=creating /]
			[@fieldInputText     label="entity.user.firstSurname"     value="userForm.user.firstSurname"    required=true  /]
			[@fieldInputText     label="entity.user.secondSurname"    value="userForm.user.secondSurname"   required=false /]
			[@fieldInputText     label="entity.user.email"            value="userForm.user.email"           required=true  class="email"/]
						
			<div class="clearfix"></div>
			
			<div class="container-center"> 
				[#if creating ]<input id="action_create" name="action_create" class="button" type="submit" value="[@spring.message 'page.user-management.create' /]" />[/#if]
				[#if !creating ]<input id="action_update" name="action_update" class="button" type="submit" value="[@spring.message 'page.user-management.update' /]" />[/#if]
				<a class="button" href="[@spring.url '/administration/users' /]" >[@spring.message 'page.user-management.cancel' /]</a>
			</div>
			
	</fieldset>
	</form>
</div>


[/@template.base]