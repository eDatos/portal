/*
 * Copyright 2011 the original author or authors.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.stat4you.web.signin;

import java.util.ArrayList;

import javax.inject.Inject;

import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.social.connect.web.ProviderSignInUtils;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.ModelAndView;

import com.stat4you.users.dto.UserDto;
import com.stat4you.users.service.UserService;
import com.stat4you.web.BaseController;
import com.stat4you.web.WebConstants;

@Controller
public class SignController extends BaseController {

    private final UserService userService;

    @Inject
    public SignController(UserService userService) {
        this.userService = userService;
    }
    
    @RequestMapping(value = "/signin", method = RequestMethod.GET)
    public ModelAndView signin() {
        ModelAndView mav = new ModelAndView(WebConstants.VIEW_NAME_SIGNIN);
        return mav;
    }

    @RequestMapping(value = "/signup", method = RequestMethod.POST)
    public String signup(SignupForm form, BindingResult formBinding, WebRequest request) {
        if (formBinding.hasErrors()) {
            return null;
        }
        UserDto user = createAccount(form, formBinding);
        if (user != null) {
            SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(user.getUsername(), null, new ArrayList<GrantedAuthority>()));
            ProviderSignInUtils.handlePostSignUp(user.getUsername(), request);
            return "redirect:/";
        }
        return null;
    }

    private UserDto createAccount(SignupForm form, BindingResult formBinding) {
        try {
            UserDto user = userDtoFromSignupForm(form);
            ServiceContext serviceContext = new ServiceContext(null, null, null);
            userService.createUser(serviceContext, user);
            return user;
        } catch (ApplicationException e) {
            logger.error("Error creando la cuenta de usuario", e);
        }
        return null;
    }
    
    private UserDto userDtoFromSignupForm(SignupForm form){
        UserDto user = new UserDto();
        user.setUsername(form.getUsername());
        user.setPassword(form.getPassword());
        user.setName(form.getFirstName());
        user.setSurname(form.getLastName());
        return user;
    }
}