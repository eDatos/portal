package com.stat4you.normalizedvalues.transform;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


public class LanguagesToSql {
    
    /**
     * 
     * Source:
     *       http://msdn.microsoft.com/en-us/library/ms533052%28v=vs.85%29.aspx
     *       View Jira SFY-133 and SFY-202
     *       
     * This source is transform into a file with this format:
     *      One line of each language:
     *      CODE;LANGUAGE_1=LABEL_LANGUAGE_1;LANGUAGE_2=LABEL_LANGUAGE_2;...;LANGUAGE_N=LABEL_LANGUAGE_N
     * 
     * Output:
     *  INSERT INTO TBL_INTERNATIONAL_STRINGS (ID) values (1);
     *  INSERT INTO TBL_LOCALISED_STRINGS (ID, LABEL, LOCALE, INTERNATIONAL_STRING_FK) values (1, "lab", "loc", 1);
     *  INSERT INTO TBL_LANGUAGES (ID, CODE, VALUE_FK) values (1, "code", 1);
     */
    public static void main(String[] args) throws Exception {
        
        // Read file
        List<String> languagesLines = NormalizedValuesToSqlUtils.readFile("classpath:transform/languages.txt");
        
        // Generate insert sentences
        long languageIdCount = 1;
        if (languageIdCount == 1) {
            throw new Exception("This exception is thrown to remember put last id in following sentences (internationalStringIdCount and localisedStringIdCount) if other normalized values were inserted before (example: categories). Then, remove this exception");
        }
        // PUT CORRECT ID'S!!
        long internationalStringIdCount = 1;
        long localisedStringIdCount = 1;
        List<String> insertSentences = new ArrayList<String>();
        insertSentences.add("-- To regenerate this sql, execute LanguagesToSql.java");
        insertSentences.add("");

        Set<String> languagesCodes = new HashSet<String>();
        for (String languageLine : languagesLines) {
            
            String[] lineSplit = languageLine.split(";");
            String languageCode = lineSplit[0].replace("\"", "");
            if (languagesCodes.contains(languageCode)) {
                throw new IllegalArgumentException("Duplicated language code: " + languageCode);
            }
            languagesCodes.add(languageCode);
            
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
            // TBL_LANGUAGES
            insertSentences.add(getInsertSentenceToLanguage(languageIdCount, languageCode, internationalStringIdCount));
            insertSentences.add("");
            languageIdCount++;
            internationalStringIdCount++;
        }
        
        // Save into file
        NormalizedValuesToSqlUtils.saveFile(insertSentences, "target/languages-out.sql");
    }
    
    private static String getInsertSentenceToLanguage(long id, String code, long internationalStringFk) {
        return "INSERT INTO TBL_LANGUAGES (ID, CODE, VALUE_FK) values (" + id + ", \"" + code + "\", " + internationalStringFk + ");";
    }
    
    private static String getInsertSentenceToInternationalString(long id) {
        return "INSERT INTO TBL_INTERNATIONAL_STRINGS (ID) values (" + id + ");";
    }
    
    private static String getInsertSentenceToLocalisedString(long id, String locale, String label, long internationalStringFk) {
        return "INSERT INTO TBL_LOCALISED_STRINGS (ID, LABEL, LOCALE, INTERNATIONAL_STRING_FK) values (" + id + ", \"" + label + "\", \"" + locale + "\", " + internationalStringFk + ");";
    }
}
