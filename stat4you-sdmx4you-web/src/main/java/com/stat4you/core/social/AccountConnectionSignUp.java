package com.stat4you.core.social;

import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.social.connect.Connection;
import org.springframework.social.connect.ConnectionSignUp;
import org.springframework.social.connect.UserProfile;
import org.springframework.stereotype.Component;

import com.stat4you.users.dto.UserDto;
import com.stat4you.users.service.UserService;

@Component
public class AccountConnectionSignUp implements ConnectionSignUp {

    private UserService userService;
    
    @Autowired
    public AccountConnectionSignUp(UserService userRepository) {
        this.userService = userRepository;
    }

    public String execute(Connection<?> connection) {
        try {
            UserDto user = userDtoFromConnection(connection);
            ServiceContext serviceContext = new ServiceContext(null, null, null);
            userService.createUser(serviceContext, user);
			return user.getUsername();
		} catch (Exception e) {
			return null;
		}
    }

    private UserDto userDtoFromConnection(Connection<?> connection) {
        UserProfile profile = connection.fetchUserProfile();        
        UserDto userDto = new UserDto();
        
        //userDto.setMail(profile.getEmail());
        //No viene el mail en la connection
        userDto.setMail("provider");
        
        userDto.setUsername(profile.getUsername());
        
        //TODO los usuarios de proveedores no deberían tener contraseña
        userDto.setPassword("provider");
        
        userDto.setName(profile.getFirstName());
        userDto.setSurname(profile.getLastName());
        return userDto;
    }	
}