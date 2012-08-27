package com.stat4you.users.service.util;

import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;

import com.stat4you.common.uri.UriData;
import com.stat4you.common.uri.UriFactory;
import com.stat4you.users.domain.UsersExceptionCodeEnum;

//TODO pasar a stat4you-common?
public class UriDataUtils {
    
    /************************************************************************************************************
     * User
     ************************************************************************************************************/
    
    public static String createUriUser(String uuid) {
        return UriFactory.getUri(Constants.URI_RESOURCE_USER, uuid, null);
    }

    public static UriData getUriDataUser(String uri) throws ApplicationException {
        UriData uriData = UriFactory.getUriData(uri);
        if (!Constants.URI_RESOURCE_USER.equalsIgnoreCase(uriData.getResource())) {
            throw new ApplicationException(UsersExceptionCodeEnum.ILLEGAL_ARGUMENT.getName(), "Incorrect ID. Id is not a User ID: " + uri);
        }
        return uriData;
    }
    
}
