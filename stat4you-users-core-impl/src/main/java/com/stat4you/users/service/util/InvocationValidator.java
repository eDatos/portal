package com.stat4you.users.service.util;

import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;

import com.stat4you.common.utils.ValidationUtils;
import com.stat4you.users.domain.UserEntity;
import com.stat4you.users.domain.UsersExceptionCodeEnum;
import com.stat4you.users.dto.UserDto;

public class InvocationValidator {

    public static void validateRetrieveByUri(String uri) throws ApplicationException {
        ValidationUtils.validateParameterRequired(uri, "uri");
    }
    
    public static void validateCreateUser(UserDto userDto) throws ApplicationException {
        ValidationUtils.validateParameterEmpty(userDto.getUri(), "userDto.uri");
        validateUser(userDto);
    }

    public static void validateRetrieveUser(String uri) throws ApplicationException {
        ValidationUtils.validateParameterRequired(uri, "uri");
    }

    public static void validateUpdateUser(UserDto userDto, UserEntity userEntity) throws ApplicationException {

        // Can be modified
        validateUserCanBeModified(userEntity);

        // Data
        validateUser(userDto);
    }

    public static void validateUserCanBeModified(UserEntity userEntity) throws ApplicationException {

        // Not removed
        if (userEntity.getRemovedDate() != null) {
            throw new ApplicationException(UsersExceptionCodeEnum.USER_INCORRECT_STATUS.name(), "User is removed and can not be modified");
        }
    }

    public static void validateRemoveUser(UserEntity userEntity) throws ApplicationException {
        // Can be modified
        validateUserCanBeModified(userEntity);
    }

    private static void validateUser(UserDto userDto) throws ApplicationException {
        ValidationUtils.validateParameterRequired(userDto, "userDto");
        ValidationUtils.validateParameterRequired(userDto.getUsername(), "userDto.username");
        ValidationUtils.validateParameterRequired(userDto.getName(), "userDto.name");
        ValidationUtils.validateParameterRequired(userDto.getSurname(), "userDto.surname");
    }
}
