package com.stat4you.users.mapper;

import com.stat4you.users.domain.UserEntity;
import com.stat4you.users.dto.UserDto;

/**
 * IMPORTANT!
 * Do not use Dozer because can copy non modifiable attributes from Dto to Do
 * by "update" method. Example: createdBy, removedDate, state
 * publishingDate... These attributes must be modified by
 * specific operation.
 */
public class Dto2DoMapperImpl implements Dto2DoMapper {
	
	public UserEntity userDtoToDo(UserDto source) {
		UserEntity target = new UserEntity();
		userDtoToDo(source, target);
		return target;
	}

	public void userDtoToDo(UserDto source, UserEntity target) {
        target.setUsername(source.getUsername());
        target.setPassword(source.getPassword());
        target.setName(source.getName());
        target.setSurname(source.getSurname());
        target.setMail(source.getMail());
        target.setSex(source.getSex());
        target.setEducationLevel(source.getEducationLevel());
        target.setBirthplace(source.getBirthplace());
        target.setPermanentAddress(source.getPermanentAddress());
        target.setBirthday(source.getBirthday());
        target.setMaritalStatus(source.getMaritalStatus());
        target.setOccupation(source.getOccupation());
	}
	
}
