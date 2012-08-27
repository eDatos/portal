package com.stat4you.users.mapper;

import com.stat4you.users.domain.UserEntity;
import com.stat4you.users.dto.UserDto;


public interface Dto2DoMapper {
	
	public UserEntity userDtoToDo(UserDto userDto);
	public void userDtoToDo(UserDto userDto, UserEntity userEntity);
	
}
