/**
 * @Stat4You Based on org.springframework.test.context.junit4.AbstractTransactionalJUnit4SpringContextTests  
 *           and org.fornax.cartridges.sculptor.framework.util.db.DbUnitDataSourceUtils
 * Base class for transactional spring-based DBUnit tests in a JPA environment.
 */
package com.stat4you.common.test;

import java.io.StringWriter;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Date;
import java.util.List;

import javax.sql.DataSource;

import org.dbunit.DataSourceDatabaseTester;
import org.dbunit.database.DatabaseConfig;
import org.dbunit.database.DatabaseConnection;
import org.dbunit.database.DatabaseSequenceFilter;
import org.dbunit.database.IDatabaseConnection;
import org.dbunit.dataset.FilteredDataSet;
import org.dbunit.dataset.IDataSet;
import org.dbunit.dataset.ReplacementDataSet;
import org.dbunit.dataset.filter.ITableFilter;
import org.dbunit.dataset.xml.FlatXmlDataSet;
import org.dbunit.dataset.xml.FlatXmlDataSetBuilder;
import org.dbunit.ext.mysql.MySqlDataTypeFactory;
import org.dbunit.operation.DatabaseOperation;
import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.fornax.cartridges.sculptor.framework.util.db.OrderedDeleteAllOperation;
import org.junit.After;
import org.junit.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

public abstract class Stat4YouBaseTests {

    private final Logger log = LoggerFactory.getLogger(Stat4YouBaseTests.class);
    
	private ApplicationContext applicationContext;
    private JdbcTemplate jdbcTemplate;
    
    private final ServiceContext serviceContext = new ServiceContext("junit", "junit", "app");
    private final ServiceContext serviceContext2 = new ServiceContext("junit2", "junit2", "app");

    private DataSourceDatabaseTester databaseTester = null;

    protected ServiceContext getServiceContext() {
        return serviceContext;
    }    
    protected ServiceContext getServiceContext2() {
        return serviceContext2;
    }
    
	@Autowired
	public void setDataSource(DataSource dataSource) {
		this.jdbcTemplate = new JdbcTemplate(dataSource);
	}
	
//  @Autowired
	protected ApplicationContext getApplicationContext() {
	    return applicationContext;
	}
  
	/**
	 *  Return the JdbcTemplate that this base class manages.
	 */
	public final JdbcTemplate getJdbcTemplate() {
	    return this.jdbcTemplate;
	}
    
    /**
     * Creates the dataset executes the dbunit setup operation
     */
    @Before
    public void setUpDatabaseTester() throws Exception {
        setUpDatabaseTester(getClass(), getJdbcTemplate().getDataSource(), getDataSetFile());
    }
    
    private void setUpDatabaseTester(Class<?> clazz, DataSource dataSource, String dataSetFileName) throws Exception {

        // Setup database tester
        if (databaseTester == null) {
            databaseTester = new MySqlDataSourceDatabaseTester(dataSource);
        }
        IDatabaseConnection dbUnitConnection = databaseTester.getConnection();
        try {
        
            // Create dataset
            ReplacementDataSet dataSetReplacement = new ReplacementDataSet((new FlatXmlDataSetBuilder()).build(clazz.getClassLoader().getResource(dataSetFileName)));
            dataSetReplacement.addReplacementObject("[NULL]", null);
            dataSetReplacement.addReplacementObject("[null]", null);
            dataSetReplacement.addReplacementObject("[UNIQUE_SEQUENCE]", (new Date()).getTime());
            
            // DbUnit inserts and updates rows in the order they are found in your dataset. You must therefore order your tables and rows appropriately in your datasets to prevent foreign keys constraint violation.
            // Since version 2.0, the DatabaseSequenceFilter can now be used to automatically determine the tables order using foreign/exported keys information.
            ITableFilter filter = new DatabaseSequenceFilter(dbUnitConnection);
            IDataSet dataset = new FilteredDataSet(filter, dataSetReplacement);
    
            // Delete all data (dbunit not delete TBL_LOCALISED_STRINGS...)
            removeDatabaseContent(dbUnitConnection.getConnection());
    
            databaseTester.setSetUpOperation(DatabaseOperation.INSERT);
            databaseTester.setTearDownOperation(new OrderedDeleteAllOperation());
            databaseTester.setDataSet(dataset);
            databaseTester.onSetup();
        } finally {
            dbUnitConnection.close();
        }
    }

    /**
     * Executes the dbunit teardown operation
     */
    @After
    public void tearDownDatabaseTester() throws Exception {
        if (databaseTester != null) {
            IDatabaseConnection dbUnitConnection = databaseTester.getConnection();
            try {
                removeDatabaseContent(dbUnitConnection.getConnection());
            } finally {
                dbUnitConnection.close();
            }
            databaseTester.onTearDown();
        }
    }
    
    protected IDatabaseConnection getConnection() throws Exception {
        IDatabaseConnection connection = new DatabaseConnection(getJdbcTemplate().getDataSource().getConnection());
        DatabaseConfig config = connection.getConfig();
        config.setProperty(DatabaseConfig.PROPERTY_DATATYPE_FACTORY, new MySqlDataTypeFactory());

        return connection;
    }

    protected void logDb() {
        IDatabaseConnection connection = null;
        try {
            connection = getConnection();
            
            ITableFilter filter = new DatabaseSequenceFilter(connection);
            IDataSet dataset = new FilteredDataSet(filter, connection.createDataSet());

            StringWriter out = new StringWriter();

            FlatXmlDataSet.write(dataset, out);
            log.info(out.getBuffer().toString());
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        } finally {
            if (connection != null) {
                try {
                    connection.close();
                } catch (SQLException ignore) {
                }
            }
        }
    }

    
    private void removeDatabaseContent(Connection connection) throws Exception {
        connection.prepareStatement("SET FOREIGN_KEY_CHECKS=0").execute();  // OJO!! Si no se desactivan las constraints no se puede borrar el contenido de las tablas
        
        // Remove tables content
        List<String> tableNamesToRemove = getTablesToRemoveContent();
        if (tableNamesToRemove != null) {
            for (String tableNameToRemove : tableNamesToRemove) {
                connection.prepareStatement("DELETE FROM " + tableNameToRemove).execute();        
            }
        }
        connection.prepareStatement("SET FOREIGN_KEY_CHECKS=1").execute();
    }
    
    /**
     * DatasourceTester with support for MySql data types.
     * 
     */
    private class MySqlDataSourceDatabaseTester extends DataSourceDatabaseTester {
        public MySqlDataSourceDatabaseTester(DataSource dataSource) {
            super(dataSource);
        }

        @Override
        public IDatabaseConnection getConnection() throws Exception {
            IDatabaseConnection connection = super.getConnection();

            connection.getConfig().setProperty(DatabaseConfig.PROPERTY_DATATYPE_FACTORY, new MySqlDataTypeFactory());
            return connection;
        }
    }
    
    /**
     * Override this method to specify the XML file with DBUnit test data
     */
    protected abstract String getDataSetFile();
    
    /**
     * Get table names to remove content when tear down database
     */
    protected abstract List<String> getTablesToRemoveContent();
}
