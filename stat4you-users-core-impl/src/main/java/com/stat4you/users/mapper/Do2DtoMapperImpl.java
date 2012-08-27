package com.stat4you.users.mapper;

import com.stat4you.users.domain.UserEntity;
import com.stat4you.users.dto.UserDto;
import com.stat4you.users.service.util.UriDataUtils;

/**
 * IMPORTANT!
 * Do not use Dozer because can copy non modifiable attributes from Dto to Do
 * by "update" method. Example: createdBy, removedDate, state
 * publishingDate... These attributes must be modified by
 * specific operation.
 */
public class Do2DtoMapperImpl implements Do2DtoMapper {
	
	public UserDto userDoToDto(UserEntity source) {
		UserDto target = new UserDto();
		
		target.setUri(UriDataUtils.createUriUser(source.getUuid()));
		
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
		
		target.setRemovedDate(source.getRemovedDate());
		
	    target.setCreatedBy(source.getCreatedBy());
	    target.setCreatedDate(source.getCreatedDate());
	    target.setLastUpdatedBy(source.getLastUpdatedBy());
	    target.setLastUpdated(source.getLastUpdated());
		
		return target;
	}
}

