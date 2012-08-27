package com.stat4you.users.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.util.ArrayList;
import java.util.List;

import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.joda.time.DateTime;
import org.joda.time.LocalDate;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.stat4you.common.Stat4YouConstants;
import com.stat4you.common.test.Stat4YouBaseTests;
import com.stat4you.users.domain.UsersExceptionCodeEnum;
import com.stat4you.users.dto.UserDto;

/**
 * UsersService Tests
 * Spring based transactional test with DbUnit support.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:spring/users-applicationContext-test.xml" })
public class UserServiceTest extends Stat4YouBaseTests implements UserServiceTestBase {
    
    @Autowired
    protected UserService usersService;
    
    private static String USER_NOT_EXISTS = "stat4you:users:user:9999-9999";
    
    // User 1
    private static String USER_1 = "stat4you:users:user:U-1";
//    // User 2
//    private static String USER_2 = "stat4you:users:user:U-2";
    // User 3   
    private static String USER_3_REMOVED = "stat4you:users:user:U-3";

    
    @BeforeClass
    public static void setUpBeforeClass() throws Exception {
        System.setProperty(Stat4YouConstants.PROP_DATA_URL, "./data/");
    }
    
    @Before
    public void setUp() throws Exception {          
    }
    
    @AfterClass
    public static void tearDownAfterClass() throws Exception {
    }
    
    
    @Test
    public void testCreateUser() throws Exception {
        
        // Create
        UserDto userDto = new UserDto();
        userDto.setUsername("1234");
        userDto.setPassword("4567");
        userDto.setName("Nombre usuario");
        userDto.setSurname(org.apache.commons.lang3.RandomStringUtils.randomAlphabetic(500));
        userDto.setMail("prueba@arte-consultores.com");
        String uri = usersService.createUser(getServiceContext(), userDto);
        
        // Validate
        assertNotNull(uri);
        UserDto userDtoCreated = usersService.retrieveUser(getServiceContext(), uri);
        assertEqualsUser(userDto, userDtoCreated);
        
        // Audit
        assertEquals(getServiceContext().getUserId(), userDtoCreated.getCreatedBy());
        assertEquals((new DateTime()).getDayOfYear(), userDtoCreated.getCreatedDate().getDayOfYear());
        assertEquals((new DateTime()).getDayOfYear(), userDtoCreated.getLastUpdated().getDayOfYear());
        assertEquals(getServiceContext().getUserId(), userDtoCreated.getLastUpdatedBy());
    } 

    
    @Test
    public void testCreateUserUsernameRequired() throws Exception {
        
        UserDto userDto = new UserDto();
        userDto.setUsername(null);
        userDto.setPassword("4567");
        userDto.setName("Nombre usuario");
        userDto.setSurname(org.apache.commons.lang3.RandomStringUtils.randomAlphabetic(500));
        userDto.setMail("prueba@arte-consultores.com");
        try {
            usersService.createUser(getServiceContext(), userDto);
            fail("username required");
        } catch (ApplicationException e) {
            assertEquals(UsersExceptionCodeEnum.REQUIRED_ATTRIBUTE.getName(), e.getErrorCode());
            assertTrue(e.getMessage().contains("username"));
        }
    }
    
    @Test
    public void testCreateUserUsernameDuplicated() throws Exception {
        
        UserDto userDto = new UserDto();
        userDto.setUsername("User1");
        userDto.setPassword("4567");
        userDto.setName("Nombre usuario");
        userDto.setSurname(org.apache.commons.lang3.RandomStringUtils.randomAlphabetic(500));
        userDto.setMail("prueba@arte-consultores.com");
        try {
            usersService.createUser(getServiceContext(), userDto);
            fail("username duplicated");
        } catch (ApplicationException e) {
            assertEquals(UsersExceptionCodeEnum.USER_ALREADY_EXISTS.getName(), e.getErrorCode());
            assertTrue(e.getMessage().contains("username"));
        }
    }
    
    @Test
    public void testCreateUserPasswordNotRequired() throws Exception {
        
        UserDto userDto = new UserDto();
        userDto.setUsername("1234");
        userDto.setPassword(null);
        userDto.setName("Nombre usuario");
        userDto.setSurname(org.apache.commons.lang3.RandomStringUtils.randomAlphabetic(500));
        userDto.setMail("prueba@arte-consultores.com");
        
        String uri = usersService.createUser(getServiceContext(), userDto);

        // Validate
        assertNotNull(uri);
        UserDto userDtoCreated = usersService.retrieveUser(getServiceContext(), uri);
        assertEqualsUser(userDto, userDtoCreated);

        // Audit
        assertEquals(getServiceContext().getUserId(), userDtoCreated.getCreatedBy());
        assertEquals((new DateTime()).getDayOfYear(), userDtoCreated.getCreatedDate().getDayOfYear());
        assertEquals((new DateTime()).getDayOfYear(), userDtoCreated.getLastUpdated().getDayOfYear());
        assertEquals(getServiceContext().getUserId(), userDtoCreated.getLastUpdatedBy());
    }
    
    @Test
    public void testCreateUserNameRequired() throws Exception {
        
        UserDto userDto = new UserDto();
        userDto.setUsername("1234");
        userDto.setPassword("456");
        userDto.setName(null);
        userDto.setSurname(org.apache.commons.lang3.RandomStringUtils.randomAlphabetic(500));
        userDto.setMail("prueba@arte-consultores.com");
        
        try {
            usersService.createUser(getServiceContext(), userDto);
            fail("name required");
        } catch (ApplicationException e) {
            assertEquals(UsersExceptionCodeEnum.REQUIRED_ATTRIBUTE.getName(), e.getErrorCode());
            assertTrue(e.getMessage().contains("name"));
        }
    }
    
    @Test
    public void testCreateUserSurnameRequired() throws Exception {
        
        UserDto userDto = new UserDto();
        userDto.setUsername("1234");
        userDto.setPassword("456");
        userDto.setName("Nombre usuario");
        userDto.setSurname(null);
        userDto.setMail("prueba@arte-consultores.com");
        
        try {
            usersService.createUser(getServiceContext(), userDto);
            fail("surname required");
        } catch (ApplicationException e) {
            assertEquals(UsersExceptionCodeEnum.REQUIRED_ATTRIBUTE.getName(), e.getErrorCode());
            assertTrue(e.getMessage().contains("surname"));
        }
    }
    
    @Test
    public void testCreateUserMailNotRequired() throws Exception {
        
        UserDto userDto = new UserDto();
        userDto.setUsername("1234");
        userDto.setPassword("456");
        userDto.setName("Nombre usuario");
        userDto.setSurname(org.apache.commons.lang3.RandomStringUtils.randomAlphabetic(500));
        userDto.setMail(null);
        
        String uri = usersService.createUser(getServiceContext(), userDto);

        // Validate
        assertNotNull(uri);
        UserDto userDtoCreated = usersService.retrieveUser(getServiceContext(), uri);
        assertEqualsUser(userDto, userDtoCreated);

        // Audit
        assertEquals(getServiceContext().getUserId(), userDtoCreated.getCreatedBy());
        assertEquals((new DateTime()).getDayOfYear(), userDtoCreated.getCreatedDate().getDayOfYear());
        assertEquals((new DateTime()).getDayOfYear(), userDtoCreated.getLastUpdated().getDayOfYear());
        assertEquals(getServiceContext().getUserId(), userDtoCreated.getLastUpdatedBy());
    }
    
    @Test
    public void testCreateUserErrorCodeDuplicatedInsensitive() throws Exception {
        
        UserDto userDto = new UserDto();
        userDto.setUsername("uSER1");
        userDto.setPassword("456");
        userDto.setName("Nombre usuario");
        userDto.setSurname(org.apache.commons.lang3.RandomStringUtils.randomAlphabetic(500));
        userDto.setMail("prueba@arte-consultores.com");
        
        try {
            usersService.createUser(getServiceContext(), userDto);
            fail("username duplicated");
        } catch (ApplicationException e) {
            assertEquals(UsersExceptionCodeEnum.USER_ALREADY_EXISTS.getName(), e.getErrorCode());
        }
    }
    
    @Test
    public void testRetrieveUser() throws Exception {
        
        String uri = USER_1;
        UserDto userDto = usersService.retrieveUser(getServiceContext(), uri);
        
        // Validate
        assertNotNull(userDto);
        assertEquals(uri, userDto.getUri());
        assertEquals("User1", userDto.getUsername());
        assertEquals("1234", userDto.getPassword());
        assertEquals("Rita", userDto.getName());
        assertEquals("Díaz Adán", userDto.getSurname());
        assertEquals("rdiaada@arte-consultores.com", userDto.getMail());
        assertEquals("F", userDto.getSex());
        assertEquals("ENGINEERING", userDto.getEducationLevel());
        assertEquals("TFE-LGN", userDto.getBirthplace());
        assertEquals("TFE-SC", userDto.getPermanentAddress());
        assertEquals("SINGLE", userDto.getMaritalStatus());
        assertEquals("IT", userDto.getOccupation());

        assertEquals(13, userDto.getBirthday().dayOfMonth().get());
        assertEquals(1, userDto.getBirthday().monthOfYear().get());
        assertEquals(1985, userDto.getBirthday().year().get());
        
        assertEquals("user1", userDto.getCreatedBy());
        assertEquals("user2", userDto.getLastUpdatedBy());
        
        assertEquals(22, userDto.getCreatedDate().dayOfMonth().get());
        assertEquals(7, userDto.getCreatedDate().monthOfYear().get());
        assertEquals(2010, userDto.getCreatedDate().year().get());

        assertEquals(24, userDto.getLastUpdated().dayOfMonth().get());
        assertEquals(8, userDto.getLastUpdated().monthOfYear().get());
        assertEquals(2011, userDto.getLastUpdated().year().get());
    }
    
    @Test
    public void testRetrieveUserErrorUriIncorrect() throws Exception {
        
        String uri = "stat4you:users:notValidToTest:1";
        try {
            usersService.retrieveUser(getServiceContext(), uri);
            fail("uri incorrect");
        } catch (ApplicationException e) {
            assertEquals(UsersExceptionCodeEnum.ILLEGAL_ARGUMENT.getName(), e.getErrorCode());
        }
    }
    
    @Test
    public void testRetrieveUserErrorNotExists() throws Exception  {
        try {
            usersService.retrieveUser(getServiceContext(), USER_NOT_EXISTS);
            fail("Not exists");
        } catch (ApplicationException e) {
            assertEquals(UsersExceptionCodeEnum.USER_NOT_EXISTS.getName(), e.getErrorCode());
        }
    }    
    
    @Test
    public void testUpdateUser() throws Exception {
        String uri = USER_1;
        UserDto userDto = usersService.retrieveUser(getServiceContext(), uri);
        userDto.setUsername("NewUsername");
        userDto.setPassword("NewPassword");
        userDto.setName("NewName");
        userDto.setSurname("NewSurname");
        userDto.setMail("newmail@arte-consultores.com");
        userDto.setSex("NewSex");
        userDto.setEducationLevel("NewEducationLevel");
        userDto.setBirthplace("NewBirthplace");
        userDto.setPermanentAddress("NewPermanentAddress");
        userDto.setBirthday(new LocalDate());
        userDto.setMaritalStatus("NewMaritalStatus");
        userDto.setOccupation("NewOccupation");

        // Update
        usersService.updateUser(getServiceContext(), userDto);

        // Validation
        UserDto userDtoUpdate = usersService.retrieveUser(getServiceContext(), uri);
        assertEqualsUser(userDto, userDtoUpdate);
        assertTrue(userDtoUpdate.getLastUpdated().isAfter(userDtoUpdate.getCreatedDate()));
    }

    
    @Test
    public void testUpdateUserIgnoreChangeNonModifiableAttributes() throws Exception {
        
        // Create
        UserDto userDto = new UserDto();
        userDto.setUsername("1234");
        userDto.setPassword("4567");
        userDto.setName("Nombre usuario");
        userDto.setSurname(org.apache.commons.lang3.RandomStringUtils.randomAlphabetic(500));
        userDto.setMail("prueba@arte-consultores.com");
        String uri = usersService.createUser(getServiceContext(), userDto);
        
        // Retrieve and change unmodifiable attributes
        UserDto userDtoToCompare = usersService.retrieveUser(getServiceContext(), uri);
        UserDto userDtoToUpdate = usersService.retrieveUser(getServiceContext(), uri);
        
      
        
        userDtoToUpdate.setCreatedBy("aa");
        userDtoToUpdate.setCreatedDate(new DateTime());
        userDtoToUpdate.setRemovedDate(new DateTime());
        
        // Update
        usersService.updateUser(getServiceContext(), userDtoToUpdate);
        
        // Retrieve
        UserDto userDtoUpdated = usersService.retrieveUser(getServiceContext(), uri);
        assertEquals(userDtoToCompare.getCreatedBy(), userDtoUpdated.getCreatedBy());
        assertEquals(userDtoToCompare.getCreatedDate(), userDtoUpdated.getCreatedDate());
        assertEquals(userDtoToCompare.getRemovedDate(), userDtoUpdated.getRemovedDate());
    }
    
    @Test
    public void testUpdateUserCheckUsers() throws Exception {

        String user1 = getServiceContext().getUserId();
        String user2 = getServiceContext2().getUserId();
        
        // Create user 1 and validate
        UserDto userDto = new UserDto();
        userDto.setUsername("1234");
        userDto.setPassword("4567");
        userDto.setName("Nombre usuario");
        userDto.setSurname(org.apache.commons.lang3.RandomStringUtils.randomAlphabetic(500));
        userDto.setMail("prueba@arte-consultores.com");
        
        String uri = usersService.createUser(getServiceContext(), userDto);
        
        UserDto userDtoCreated = usersService.retrieveUser(getServiceContext(), uri);
        assertEquals(user1, userDtoCreated.getCreatedBy());
        assertEquals(user1, userDtoCreated.getLastUpdatedBy());
        assertTrue(!userDtoCreated.getCreatedDate().isAfter(userDtoCreated.getLastUpdated()) && !userDtoCreated.getCreatedDate().isBefore(userDtoCreated.getLastUpdated()));
        
        // Update user 2 and validate        
        userDtoCreated.setName("newName");              // must update at least one attribute. If no, update into database not ocurr
        Thread.sleep(1000);                             // avoid createdDate and lastUpdate are equal
        usersService.updateUser(getServiceContext2(), userDtoCreated); 

        UserDto userDtoUpdated2 = usersService.retrieveUser(getServiceContext(), uri);
        assertEquals(user1, userDtoUpdated2.getCreatedBy());
        assertEquals(user2, userDtoUpdated2.getLastUpdatedBy());
        assertTrue(userDtoUpdated2.getLastUpdated().isAfter(userDtoUpdated2.getCreatedDate())); // sometimes retrieve incorrectly! 
    }
    
    
    @Test
    public void testUpdateUserErrorUsernameExists() throws Exception {
        
        String uri = USER_1;
        UserDto userDto = usersService.retrieveUser(getServiceContext(), uri);
        userDto.setUsername("User2");

        try {
            usersService.updateUser(getServiceContext(), userDto);
            fail("username exists");
        } catch (ApplicationException e) {
            assertEquals(UsersExceptionCodeEnum.USER_ALREADY_EXISTS.getName(), e.getErrorCode());
            assertTrue(e.getMessage().contains("username"));
        }
    }
    
    @Test
    public void testUpdateUserErrorRemoved() throws Exception {
        
        String uri = USER_3_REMOVED;        
        UserDto userDto = usersService.retrieveUser(getServiceContext(), uri);
        assertNotNull(userDto.getRemovedDate());
        
        try {
            usersService.updateUser(getServiceContext(), userDto);
            fail("removed");
        } catch (ApplicationException e) {
          assertEquals(UsersExceptionCodeEnum.USER_INCORRECT_STATUS.getName(), e.getErrorCode());
        }
    }
    
    @Test
    public void testUpdateUserErrorNotExists() throws Exception {
        
        UserDto userDto = new UserDto();
        userDto.setUri(USER_NOT_EXISTS);
        userDto.setUsername("User1");
        userDto.setPassword("4567");
        userDto.setName("Nombre usuario");
        userDto.setSurname(org.apache.commons.lang3.RandomStringUtils.randomAlphabetic(500));
        userDto.setMail("prueba@arte-consultores.com");
        
        try {
            usersService.updateUser(getServiceContext(), userDto);
            fail("not exists");
        } catch (ApplicationException e) {
          assertEquals(UsersExceptionCodeEnum.USER_NOT_EXISTS.getName(), e.getErrorCode());
        }
    }
    
    
    @Test
    public void testRemoveUser() throws Exception {
        
        String uri = USER_1;
        UserDto userDto = usersService.retrieveUser(getServiceContext(), uri);
        assertNull(userDto.getRemovedDate());
        
        // Remove
        usersService.removeUser(getServiceContext(), uri);
        
        // Validation
        UserDto userDtoRemoved = usersService.retrieveUser(getServiceContext(), uri);
        assertNotNull(userDtoRemoved.getRemovedDate());
    }
    
    @Test
    public void testRemoveUserErrorNotExists() throws Exception  {
        try {
            usersService.removeUser(getServiceContext(), USER_NOT_EXISTS);
            fail("Not exists");
        } catch (ApplicationException e) {
            assertEquals(UsersExceptionCodeEnum.USER_NOT_EXISTS.getName(), e.getErrorCode());
        }
    } 
    
    @Test
    public void testRemoveUserErrorRemoved() throws Exception  {
        try {
            usersService.removeUser(getServiceContext(), USER_3_REMOVED);
            fail("Already removed");
        } catch (ApplicationException e) {
            assertEquals(UsersExceptionCodeEnum.USER_INCORRECT_STATUS.getName(), e.getErrorCode());
        }
    } 
    
    
    @Override
    protected String getDataSetFile() {
        return "dbunit/UserServiceTest.xml";
    }
    
    private void assertEqualsUser(UserDto userDtoExpected, UserDto userDtoActual) {
        assertEquals(userDtoExpected.getUsername(), userDtoActual.getUsername());
        assertEquals(userDtoExpected.getPassword(), userDtoActual.getPassword());
        assertEquals(userDtoExpected.getName(), userDtoActual.getName());
        assertEquals(userDtoExpected.getSurname(), userDtoActual.getSurname());
        assertEquals(userDtoExpected.getMail(), userDtoActual.getMail());
        assertEquals(userDtoExpected.getSex(), userDtoActual.getSex());
        assertEquals(userDtoExpected.getEducationLevel(), userDtoActual.getEducationLevel());
        assertEquals(userDtoExpected.getBirthplace(), userDtoActual.getBirthplace());
        assertEquals(userDtoExpected.getPermanentAddress(), userDtoActual.getPermanentAddress());
        assertEqualsDate(userDtoExpected.getBirthday(), userDtoActual.getBirthday());
        assertEquals(userDtoExpected.getMaritalStatus(), userDtoActual.getMaritalStatus());
        assertEquals(userDtoExpected.getOccupation(), userDtoActual.getOccupation());
    }
    
    
    private void assertEqualsDate(LocalDate expectedDate, LocalDate actualDate) {
        if (expectedDate != null && actualDate != null) {
            assertEquals(expectedDate.compareTo(actualDate), 0);
        } else {
            assertNull(expectedDate);
            assertNull(actualDate);
        }
    }

    @Override
    protected List<String> getTablesToRemoveContent() {
        List<String> tableNames = new ArrayList<String>();
        tableNames.add("TBL_USERS");
        return tableNames;
    }
}
