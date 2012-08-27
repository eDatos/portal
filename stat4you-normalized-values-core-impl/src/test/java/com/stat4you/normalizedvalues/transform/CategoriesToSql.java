package com.stat4you.normalizedvalues.transform;

import java.util.ArrayList;
import java.util.List;


public class CategoriesToSql {
    
    /**
     * Source:
     *       http://sdmx.org/wp-content/uploads/2009/01/03_sdmx_cog_annex_3_smd_2009.pdf
     *       http://sdmx.org/wp-content/uploads/2009/01/05_sdmx_cog_annex_5_xml_2009.zip 
     *       
     * This source is transform into a file with this format:
     *      One line of each category:
     *      CODE;LANGUAGE_1=LABEL_LANGUAGE_1;LANGUAGE_2=LABEL_LANGUAGE_2;...;LANGUAGE_N=LABEL_LANGUAGE_N
     *      
     * The categories must appear before their subcategories in file
     *  
     * Output:
     *  INSERT INTO TBL_INTERNATIONAL_STRINGS (ID) values (1);
     *  INSERT INTO TBL_LOCALISED_STRINGS (ID, LABEL, LOCALE, NTERNATIONAL_STRING_FK) values (1, "lab", "loc", 1);
     *  INSERT INTO TBL_CATEGORIES (ID, CODE, VALUE_FK, PARENT_FK) values (1, "code", 1, null);
     */
    public static void main(String[] args) throws Exception {
        
        // Read file
        List<String> categoriesLines = NormalizedValuesToSqlUtils.readFile("classpath:transform/categories.txt");
        
        // Generate insert sentences
        long categoryIdCount = 1;
        if (categoryIdCount == 1) {
            throw new Exception("This exception is thrown to remember put last id in following sentences (internationalStringIdCount and localisedStringIdCount) if other normalized values were inserted before (example: languages). Then, remove this exception");
        }
        // PUT CORRECT ID'S!!
        long internationalStringIdCount = 121;  
        long localisedStringIdCount = 125;
        List<String> insertSentences = new ArrayList<String>();
        insertSentences.add("-- To regenerate this sql, execute CategoriesToSql.java");
        insertSentences.add("");
        
        List<String> categoriesCodes = new ArrayList<String>();
        
        for (String categoryLine : categoriesLines) {
            
            String[] lineSplit = categoryLine.split(";");
            String categoryCode = lineSplit[0].replace("\"", "");
            Long parentFk = getParentCategory(categoriesCodes, categoryCode);
            
            if (categoriesCodes.contains(categoryCode)) {
                throw new IllegalArgumentException("Duplicated category code: " + categoryCode);
            }            
            categoriesCodes.add(categoryCode);
            
            // TBL_INTERNATIONAL_STRINGS
            insertSentences.add(getInsertSentenceToInternationalString(internationalStringIdCount));
            // TBL_LOCALISED_VALUES
            for (int i = 1; i < lineSplit.length; i++) {
                String labelWithLanguage = lineSplit[i].replace("\"", "");
                String[] labelWithLanguageSplit = labelWithLanguage.split("=");
                String language = labelWithLanguageSplit[0];
                String label = labelWithLanguageSplit[1];
                insertSentences.add(getInsertSentenceToLocalisedString(localisedStringIdCount, language, label, internationalStringIdCount));
                localisedStringIdCount++;
            }
            // TBL_CATEGORIES
            insertSentences.add(getInsertSentenceToCategory(categoryIdCount, categoryCode, internationalStringIdCount, parentFk));
            
            insertSentences.add("");
            categoryIdCount++;
            internationalStringIdCount++;
        }
        
        // Save into file
        NormalizedValuesToSqlUtils.saveFile(insertSentences, "target/categories-out.sql");
    }
    
    private static Long getParentCategory(List<String> categoriesCodes, String categoryCode) {
        // top to bottom because can occurs this: 1 // 1.1 // 1.1.1 : parent of 1.1.1 is 1.1, non 1
        if (categoriesCodes.size() != 0) {
            for (int i = categoriesCodes.size() - 1; i >= 0; i--) {
                String categoryCodeBefore = categoriesCodes.get(i);
                if (categoryCode.startsWith(categoryCodeBefore + ".")) {
                    return new Long(i + 1);
                }
            }
        }
        return null;
    }

    private static String getInsertSentenceToCategory(long id, String code, long internationalStringFk, Long parentFk) {
        String parentFkInsert = parentFk != null ? parentFk.toString() : "null";
        return "INSERT INTO TBL_CATEGORIES (ID, CODE, VALUE_FK, PARENT_FK) values (" + id + ", \"" + code + "\", " + internationalStringFk + ", " + parentFkInsert + ");";
    }
    
    private static String getInsertSentenceToInternationalString(long id) {
        return "INSERT INTO TBL_INTERNATIONAL_STRINGS (ID) values (" + id + ");";
    }
    
    private static String getInsertSentenceToLocalisedString(long id, String locale, String label, long internationalStringFk) {
        return "INSERT INTO TBL_LOCALISED_STRINGS (ID, LABEL, LOCALE, INTERNATIONAL_STRING_FK) values (" + id + ", \"" + label + "\", \"" + locale + "\", " + internationalStringFk + ");";
    }
}
