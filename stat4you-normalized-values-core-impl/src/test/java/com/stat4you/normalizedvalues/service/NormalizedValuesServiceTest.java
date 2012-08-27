package com.stat4you.normalizedvalues.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.fail;

import java.util.ArrayList;
import java.util.List;

import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.stat4you.common.Stat4YouConstants;
import com.stat4you.common.dto.InternationalStringDto;
import com.stat4you.common.test.Stat4YouBaseTests;
import com.stat4you.normalizedvalues.domain.NormalizedValuesExceptionCodeEnum;
import com.stat4you.normalizedvalues.dto.CategoryDto;
import com.stat4you.normalizedvalues.dto.LanguageDto;

/**
 * NormalizedValuesService Tests
 * Spring based transactional test with DbUnit support.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring/normalized-values-applicationContext-test.xml"})
public class NormalizedValuesServiceTest extends Stat4YouBaseTests implements NormalizedValuesServiceTestBase {

    @Autowired
    protected NormalizedValuesService normalizedValuesService;

    @BeforeClass
    public static void setUpBeforeClass() throws Exception {
        System.setProperty(Stat4YouConstants.PROP_DATA_URL, "./data/");
    }

    private static String NOT_EXISTS = "not-exists";

    @Before
    public void setUp() throws Exception {
    }

    @AfterClass
    public static void tearDownAfterClass() throws Exception {
    }

    @Test
    public void testRetrieveLanguage() throws Exception {

        LanguageDto languageDto = normalizedValuesService.retrieveLanguage(getServiceContext(), "es");

        assertEquals("es", languageDto.getCode());
        assertEqualsInternationalString(languageDto.getValue(), "es", "Español", "en", "Spanish");
    }

    @Test
    public void testRetrieveLanguageErrorNotExists() throws Exception {
        try {
            normalizedValuesService.retrieveLanguage(getServiceContext(), NOT_EXISTS);
            fail("No exists");
        } catch (ApplicationException e) {
            assertEquals(NormalizedValuesExceptionCodeEnum.LANGUAGE_NOT_EXISTS.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testRetrieveLanguages() throws Exception {
        // Find all
        List<LanguageDto> languagesDto = normalizedValuesService.retrieveLanguages(getServiceContext());
        assertEquals(4, languagesDto.size());

        assertEquals("es", languagesDto.get(0).getCode());
        assertEqualsInternationalString(languagesDto.get(0).getValue(), "es", "Español", "en", "Spanish");
        assertEquals("en", languagesDto.get(1).getCode());
        assertEqualsInternationalString(languagesDto.get(1).getValue(), "es", "Inglés", "en", "English");
        assertEquals("it", languagesDto.get(2).getCode());
        assertEqualsInternationalString(languagesDto.get(2).getValue(), "es", "Italiano", "en", "Italian");
        assertEquals("fr", languagesDto.get(3).getCode());
        assertEqualsInternationalString(languagesDto.get(3).getValue(), "es", "Francés", "en", "French");
    }

    /**
     * Category without parent
     */
    @Test
    public void testRetrieveCategory() throws Exception {

        CategoryDto categoryDto = normalizedValuesService.retrieveCategory(getServiceContext(), "category2");

        // Validate
        assertNotNull(categoryDto);
        assertEquals("category2", categoryDto.getCode());
        assertEqualsInternationalString(categoryDto.getValue(), "es", "Categoría 2", "en", "Category 2");
        // Subcategories
        assertEquals(2, categoryDto.getSubcategories().size());
        {
            CategoryDto subcategoryDto = categoryDto.getSubcategories().get(0);
            assertEquals("subcategory2A", subcategoryDto.getCode());
            assertEqualsInternationalString(subcategoryDto.getValue(), "es", "Subcategoría 2A", "en", "Subcategory 2A");
            assertEquals(0, subcategoryDto.getSubcategories().size());
        }
        {
            CategoryDto subcategoryDto = categoryDto.getSubcategories().get(1);
            assertEquals("subcategory2B", subcategoryDto.getCode());
            assertEqualsInternationalString(subcategoryDto.getValue(), "es", "Subcategoría 2B", "en", "Subcategory 2B");
            // Subcategory
            assertEquals(1, subcategoryDto.getSubcategories().size());
            {
                CategoryDto subsubcategoryDto = subcategoryDto.getSubcategories().get(0);
                assertEquals("subcategory2BA", subsubcategoryDto.getCode());
                assertEqualsInternationalString(subsubcategoryDto.getValue(), "es", "Subcategoría 2BA", "en", "Subcategory 2BA");
                assertEquals(0, subsubcategoryDto.getSubcategories().size());
            }
        }
    }

    @Test
    public void testRetrieveCategoryWithParent() throws Exception {

        CategoryDto categoryDto = normalizedValuesService.retrieveCategory(getServiceContext(), "subcategory2A");

        // Validate
        assertNotNull(categoryDto);
        assertEquals("subcategory2A", categoryDto.getCode());
        assertEqualsInternationalString(categoryDto.getValue(), "es", "Subcategoría 2A", "en", "Subcategory 2A");
        // Subcategories
        assertEquals(0, categoryDto.getSubcategories().size());
    }
    
    @Test
    public void testRetrieveCategoryErrorNotExists() throws Exception {
        try {
            normalizedValuesService.retrieveCategory(getServiceContext(), NOT_EXISTS);
            fail("No exists");
        } catch (ApplicationException e) {
            assertEquals(NormalizedValuesExceptionCodeEnum.CATEGORY_NOT_EXISTS.getName(), e.getErrorCode());
        }
    }

    @Test
    public void testRetrieveCategories() throws Exception {
        // Find all
        List<CategoryDto> categoriesDto = normalizedValuesService.retrieveCategories(getServiceContext());
        assertEquals(3, categoriesDto.size());

        // Category 1
        {
            CategoryDto categoryDto = categoriesDto.get(0);
            assertEquals("category1", categoryDto.getCode());
            assertEqualsInternationalString(categoryDto.getValue(), "es", "Categoría 1", "en", "Category 1");
            // Subcategories
            assertEquals(1, categoryDto.getSubcategories().size());
            {
                CategoryDto subcategoryDto = categoryDto.getSubcategories().get(0);
                assertEquals("subcategory1A", subcategoryDto.getCode());
                assertEqualsInternationalString(subcategoryDto.getValue(), "es", "Subcategoría 1A", "en", "Subcategory 1A");
                assertEquals(0, subcategoryDto.getSubcategories().size());
            }
        }

        // Category 2
        {
            CategoryDto categoryDto = categoriesDto.get(1);
            assertEquals("category2", categoryDto.getCode());
            assertEqualsInternationalString(categoryDto.getValue(), "es", "Categoría 2", "en", "Category 2");
            // Subcategories
            assertEquals(2, categoryDto.getSubcategories().size());
            {
                CategoryDto subcategoryDto = categoryDto.getSubcategories().get(0);
                assertEquals("subcategory2A", subcategoryDto.getCode());
                assertEqualsInternationalString(subcategoryDto.getValue(), "es", "Subcategoría 2A", "en", "Subcategory 2A");
                assertEquals(0, subcategoryDto.getSubcategories().size());
            }
            {
                CategoryDto subcategoryDto = categoryDto.getSubcategories().get(1);
                assertEquals("subcategory2B", subcategoryDto.getCode());
                assertEqualsInternationalString(subcategoryDto.getValue(), "es", "Subcategoría 2B", "en", "Subcategory 2B");
                // Subcategory
                assertEquals(1, subcategoryDto.getSubcategories().size());
                {
                    CategoryDto subsubcategoryDto = subcategoryDto.getSubcategories().get(0);
                    assertEquals("subcategory2BA", subsubcategoryDto.getCode());
                    assertEqualsInternationalString(subsubcategoryDto.getValue(), "es", "Subcategoría 2BA", "en", "Subcategory 2BA");
                    assertEquals(0, subsubcategoryDto.getSubcategories().size());
                }
            }
        }

        // Category 3
        {
            CategoryDto categoryDto = categoriesDto.get(2);
            assertEquals("category3", categoryDto.getCode());
            assertEqualsInternationalString(categoryDto.getValue(), "es", "Categoría 3", "en", "Category 3");
            assertEquals(0, categoryDto.getSubcategories().size());
        }
    }

    private void assertEqualsInternationalString(InternationalStringDto internationalStringDto, String locale1, String label1, String locale2, String label2) {
        assertEquals(2, internationalStringDto.getTexts().size());
        assertEquals(label1, internationalStringDto.getLocalisedLabel(locale1));
        assertEquals(label2, internationalStringDto.getLocalisedLabel(locale2));
    }

    @Override
    protected String getDataSetFile() {
        return "dbunit/NormalizedValuesServiceTest.xml";
    }

    @Override
    protected List<String> getTablesToRemoveContent() {
        List<String> tableNames = new ArrayList<String>();
        tableNames.add("TBL_LANGUAGES");
        tableNames.add("TBL_CATEGORIES");
        tableNames.add("TBL_LOCALISED_STRINGS");
        tableNames.add("TBL_INTERNATIONAL_STRINGS");
        return tableNames;
    }
}
