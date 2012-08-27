package com.stat4you.users.mapper;

import com.stat4you.users.domain.UserEntity;
import com.stat4you.users.dto.UserDto;

public interface Do2DtoMapper {

	public UserDto userDoToDto(UserEntity userEntity);
}
