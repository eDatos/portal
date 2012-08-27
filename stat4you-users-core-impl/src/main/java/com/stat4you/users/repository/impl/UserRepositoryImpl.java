package com.stat4you.users.repository.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.stat4you.users.domain.UserEntity;
import com.stat4you.users.domain.UserEntityProperties;

/**
 * Repository implementation for User
 */
@Repository("userRepository")
public class UserRepositoryImpl extends UserRepositoryBase {
    public UserRepositoryImpl() {
    }

    @Override
    public UserEntity findUserByUuid(String uuid) {
        
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put(UserEntityProperties.uuid().getName(), uuid);
        List<UserEntity> result = findByQuery("from UserEntity u where u.uuid = :uuid", parameters);
        if (result == null || result.isEmpty()) {
            return null;
        } else {
            return result.get(0);
        }
    }
}
