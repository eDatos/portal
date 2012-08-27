package com.stat4you.transformation.conf;

import java.io.File;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.configuration.ConfigurationUtils;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.springframework.util.ResourceUtils;

import com.stat4you.common.configuration.Stat4YouConfiguration;
import com.stat4you.common.io.FileUtils;
import com.stat4you.transformation.domain.TransformationExceptionCodeEnum;

public class TransformationDataloader {

    private static TransformationDataloader instance = null;
    
    private List<String> dimensionTimeNomenclatures = null;
    private List<String> dimensionGeographicNomenclatures = null;
    private Map<String,String> languages = null;

    public static TransformationDataloader instance() {
        if (instance == null) {
            instance = new TransformationDataloader();
        }
        return instance;
    }
    
    public List<String> getDimensionTimeNomenclatures() throws ApplicationException {
        if (dimensionTimeNomenclatures == null) {
            dimensionTimeNomenclatures = loadFile(TransformationConstants.FILE_PX_TIME_DIMENSIONS);
        }
        return dimensionTimeNomenclatures;
    }
    
    
    public Map<String, String> getLanguages() throws ApplicationException {
        if (languages == null) {
            List<String> languagesValues = loadFile(TransformationConstants.FILE_PX_LANGUAGES);
            languages = new HashMap<String, String>();
            for (String languageValue : languagesValues) {
                String[] languageValueSplit = languageValue.split(TransformationConstants.FILES_SEPARATORS);
                languages.put(languageValueSplit[0], languageValueSplit[1]);
            }
        }
        return languages;
    }
    
    
    public List<String> getDimensionGeographicNomenclatures() throws ApplicationException {
        if (dimensionGeographicNomenclatures == null) {
            dimensionGeographicNomenclatures = loadFile(TransformationConstants.FILE_PX_GEOGRAPHIC_DIMENSIONS);
        }
        return dimensionGeographicNomenclatures;
    }
    
    private static List<String> loadFile(String filename) throws ApplicationException {
        try {
            String pathFile = Stat4YouConfiguration.instance().getDataDirectory() + "/" + TransformationConstants.DATA_TRANSFORMATION + "/conf/static/" + filename;
            URL url = ConfigurationUtils.locate(pathFile);
            File file = ResourceUtils.getFile(url);
            return FileUtils.readLines(file);
        } catch (Exception e) {
            throw new ApplicationException(TransformationExceptionCodeEnum.UNKNOWN.getName(), "Error reading file: " + filename, e);
        }
    }
}
