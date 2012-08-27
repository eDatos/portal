package com.stat4you.users.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.fornax.cartridges.sculptor.framework.accessapi.ConditionalCriteria;
import org.fornax.cartridges.sculptor.framework.domain.PagedResult;
import org.fornax.cartridges.sculptor.framework.domain.PagingParameter;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.joda.time.DateTime;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.stat4you.users.domain.UserEntity;
import com.stat4you.users.domain.UserEntityProperties;
import com.stat4you.users.domain.UsersExceptionCodeEnum;
import com.stat4you.users.dto.UserDto;
import com.stat4you.users.mapper.Do2DtoMapper;
import com.stat4you.users.mapper.Dto2DoMapper;
import com.stat4you.users.service.util.InvocationValidator;
import com.stat4you.users.service.util.UriDataUtils;

/**
 * Implementation of UserService.
 */
@Service("userService")
public class UserServiceImpl extends UserServiceImplBase {

    @Resource(name = "dto2DoMapperUsers")
    private Dto2DoMapper dto2DoMapper;

    @Resource(name = "do2DtoMapperUsers")
    private Do2DtoMapper do2DtoMapper;

    public UserServiceImpl() {}

    public String createUser(ServiceContext ctx, UserDto userDto) throws ApplicationException {
        // Validation
        InvocationValidator.validateCreateUser(userDto);
        validateUsernameUnique(userDto.getUsername(), null); // Username not duplicated

        // Transform
        UserEntity userEntity = dto2DoMapper.userDtoToDo(userDto);

        // Create
        userEntity = getUserRepository().save(userEntity);
        String uri = UriDataUtils.createUriUser(userEntity.getUuid());

        return uri;
    }

    @Cacheable(value = "users", key = "#uri")
    public UserDto retrieveUser(ServiceContext ctx, String uri) throws ApplicationException {
        // Validation
        InvocationValidator.validateRetrieveUser(uri);

        // Retrieve
        UserEntity userEntity = retrieveUserByUri(uri);
        UserDto userDto = do2DtoMapper.userDoToDto(userEntity);
        return userDto;
    }

    @CacheEvict(value = "users", key = "#userDto.uri")
    public void updateUser(ServiceContext ctx, UserDto userDto) throws ApplicationException {
        // Retrieve
        UserEntity userEntity = retrieveUserByUri(userDto.getUri());

        // Validation
        InvocationValidator.validateUpdateUser(userDto, userEntity);
        validateUsernameUnique(userDto.getUsername(), userEntity.getUuid()); // Username not duplicated

        // Transform and update
        dto2DoMapper.userDtoToDo(userDto, userEntity);
        getUserRepository().save(userEntity);
    }

    @CacheEvict(value = "users", key = "#uri")
    public void removeUser(ServiceContext ctx, String uri) throws ApplicationException {
        // Retrieve
        UserEntity userEntity = retrieveUserByUri(uri);

        // Validation
        InvocationValidator.validateRemoveUser(userEntity);

        // Remove
        userEntity.setRemovedDate(new DateTime());
        getUserRepository().save(userEntity);
    }

    /**
     * Check not exists another user with the same username
     */
    private void validateUsernameUnique(String username, String uuid) throws ApplicationException {
        List<ConditionalCriteria> condition = new ArrayList<ConditionalCriteria>();
        condition.add(ConditionalCriteria.ignoreCaseEqual(UserEntityProperties.username(), username));
        if (uuid != null) {
            condition.add(ConditionalCriteria.not(ConditionalCriteria.equal(UserEntityProperties.uuid(), uuid)));
        }

        PagedResult<UserEntity> userEntities = getUserRepository().findByCondition(condition, PagingParameter.pageAccess(1, 1, false));
        if (userEntities.getRowCount() > 0) {
            throw new ApplicationException(UsersExceptionCodeEnum.USER_ALREADY_EXISTS.getName(), "User already exists with username " + username);
        }
    }

    private UserEntity retrieveUserByUri(String uri) throws ApplicationException {
        InvocationValidator.validateRetrieveByUri(uri);
        String uuid = UriDataUtils.getUriDataUser(uri).getUuid();
        UserEntity user = getUserRepository().findUserByUuid(uuid);
        if (user == null) {
            throw new ApplicationException(UsersExceptionCodeEnum.USER_NOT_EXISTS.getName(), "User not exists with uri " + uri);
        }
        return user;
    }
}
