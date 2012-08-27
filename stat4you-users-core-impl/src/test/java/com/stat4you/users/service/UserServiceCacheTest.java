package com.stat4you.users.service;

import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.List;

import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.stat4you.common.Stat4YouConstants;
import com.stat4you.common.test.MethodCallCounterAdvice;
import com.stat4you.common.test.Stat4YouBaseTests;
import com.stat4you.users.dto.UserDto;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring/users-applicationContext-test.xml", "classpath:spring/include/users-methodcallcounter-test.xml"})
public class UserServiceCacheTest extends Stat4YouBaseTests implements UserServiceCacheBase {

    private static final String SERVICE_CLASS = "com.stat4you.users.service.UserService";

    @Autowired
    private UserService   userService;

    @Autowired
    private MethodCallCounterAdvice methodCallCounterAdvice;
    
    private static String USER_1 = "stat4you:users:user:U-1";
    private static String USER_2 = "stat4you:users:user:U-2";
    
    @BeforeClass
    public static void setUpBeforeClass() throws Exception {
        System.setProperty(Stat4YouConstants.PROP_DATA_URL, "./data/");
    }
    
    @Test
    public void testUsersServiceCache() throws Exception {
        assertRetrieveUserMethodCallsCount(USER_1, 1);
        assertRetrieveUserMethodCallsCount(USER_1, 1);
        
        assertRetrieveUserMethodCallsCount(USER_2, 2);
        assertRetrieveUserMethodCallsCount(USER_2, 2);
        
        
        UserDto user = assertRetrieveUserMethodCallsCount(USER_1, 2);
        
        user.setName("LukeSkyWalker");
        userService.updateUser(getServiceContext(), user);

        assertRetrieveUserMethodCallsCount(USER_1, 3);
        assertRetrieveUserMethodCallsCount(USER_1, 3);
        
        assertRetrieveUserMethodCallsCount(USER_2, 3);
        
        user.setName("ObiWanKenobi");
        userService.updateUser(getServiceContext(), user);
        
        assertRetrieveUserMethodCallsCount(USER_1, 4);
        assertRetrieveUserMethodCallsCount(USER_1, 4);
        
        assertRetrieveUserMethodCallsCount(USER_2, 4);
        
        userService.removeUser(getServiceContext(), USER_1);
        UserDto user4 = assertRetrieveUserMethodCallsCount(USER_1, 5);
        assertNotNull(user4.getRemovedDate());
        assertRetrieveUserMethodCallsCount(USER_1, 5);
        
        assertRetrieveUserMethodCallsCount(USER_2, 5);
    }

    @Test
    public void testRetrieveDifferentInstancesFromCache() throws Exception {
        UserDto user = userService.retrieveUser(getServiceContext(), USER_1);
        UserDto user2 = userService.retrieveUser(getServiceContext(), USER_1);
        assertNotSame(user, user2);
    }
    
    private UserDto assertRetrieveUserMethodCallsCount(String userId, int methodCallsCountExpected) throws Exception {
        UserDto user = userService.retrieveUser(getServiceContext(), userId);
        assertNotNull(user);
        int methodCallsCounts = methodCallCounterAdvice.getMethodCallCounts(SERVICE_CLASS, "retrieveUser");
        assertEquals(methodCallsCountExpected, methodCallsCounts);
        return user;
    }
    
    @Override
    protected String getDataSetFile() {
        return "dbunit/UserServiceTest.xml";
    }

    @Override
    protected List<String> getTablesToRemoveContent() {
        List<String> tableNames = new ArrayList<String>();
        tableNames.add("TBL_USERS");
        return tableNames;
    }

}
