package com.stat4you.crawler.conf;

import java.io.File;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.configuration.ConfigurationUtils;
import org.apache.commons.lang3.StringUtils;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.springframework.util.ResourceUtils;

import com.stat4you.common.configuration.Stat4YouConfiguration;
import com.stat4you.common.exception.CommonExceptionCodeEnum;
import com.stat4you.common.io.FileUtils;

public class CrawlerDataloader {

    private static CrawlerDataloader instance = null;
    
    private Map<String,Map<String, String>> categories = null;

    public static CrawlerDataloader instance() {
        if (instance == null) {
            instance = new CrawlerDataloader();
        }
        return instance;
    }
    
    public String getCategory(String provider, String categoryInProvider) throws ApplicationException {
        categoryInProvider = StringUtils.strip(categoryInProvider);
        
        Map<String, String> categoriesByProvider = getCategories().get(provider);
        if (categoriesByProvider == null || !categoriesByProvider.containsKey(categoryInProvider)) {
            throw new ApplicationException(CommonExceptionCodeEnum.ILLEGAL_ARGUMENT.getName(), "Category not found: " + categoryInProvider + " for provider: " + provider);
        }
        return categoriesByProvider.get(categoryInProvider);
    }
    
    /**
     * Map where the key is provider uri and value is another map, where the key
     * is name of category in provider and value is code of category on Stat4You 
     */
    private Map<String,Map<String, String>> getCategories() throws ApplicationException {
        if (categories == null) {
            List<String> values = loadFile(CrawlerConstants.FILE_PX_CATEGORIES);
            categories = new HashMap<String, Map<String,String>>();
            
            // Find providers and categories
            String provider = null;
            for (int i = 0; i < values.size(); i++) {
                String value = values.get(i);
                if (StringUtils.isBlank(value)) {
                    continue;
                }
                if (value.startsWith(CrawlerConstants.FILE_PX_CATEGORIES_COMMENT)) {
                    continue;
                }
                String[] valuesSplit = value.split(CrawlerConstants.FILE_PX_CATEGORIES_SEPARATOR);
                if (valuesSplit[0].equals(CrawlerConstants.FILE_PX_CATEGORIES_PROVIDER) && !valuesSplit[1].equals(provider)) {
                    provider = valuesSplit[1];
                    categories.put(provider, new HashMap<String, String>());
                } else {
                    String categoryInProvider = valuesSplit[0];
                    String categoryInStat4You = valuesSplit[1];
                    categories.get(provider).put(categoryInProvider, categoryInStat4You);
                }
            }
        }
        return categories;
    }
    
    private static List<String> loadFile(String filename) throws ApplicationException {
        try {
            String pathFile = Stat4YouConfiguration.instance().getDataDirectory() + "/" + CrawlerConstants.DATA_CRAWLER + "/conf/static/" + filename;
            URL url = ConfigurationUtils.locate(pathFile);
            File file = ResourceUtils.getFile(url);
            return FileUtils.readLines(file);
        } catch (Exception e) {
            throw new ApplicationException(CommonExceptionCodeEnum.UNKNOWN.getName(), "Error reading file: " + filename, e);
        }
    }
}
