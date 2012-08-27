package com.stat4you.statistics.dsd.service.util;

import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;

import com.stat4you.common.uri.UriData;
import com.stat4you.common.uri.UriFactory;
import com.stat4you.statistics.dsd.Constants;
import com.stat4you.statistics.dsd.domain.DsdExceptionCodeEnum;

// TODO pasar a stat4you-common?
public class UriDataUtils {
    
    /************************************************************************************************************
     * Provider
     ************************************************************************************************************/
    
    public static String createUriProvider(String uuid) {
        return UriFactory.getUri(Constants.URI_RESOURCE_PROVIDER, uuid, null);
    }

    public static UriData getUriDataProvider(String uri) throws ApplicationException {
        UriData uriData = UriFactory.getUriData(uri);
        if (!Constants.URI_RESOURCE_PROVIDER.equalsIgnoreCase(uriData.getResource())) {
            throw new ApplicationException(DsdExceptionCodeEnum.ILLEGAL_ARGUMENT.getName(), "Incorrect ID. Id is not a Provider ID: " + uri);
        }
        return uriData;
    }
    
    /************************************************************************************************************
     * Dataset
     ************************************************************************************************************/
    
    public static String createUriDataset(String uuid, Integer version) {
        return UriFactory.getUri(Constants.URI_RESOURCE_DATASET, uuid, version);
    }

    public static UriData getUriDataDataset(String uri) throws ApplicationException {
        UriData uriData = UriFactory.getUriData(uri);
        if (!Constants.URI_RESOURCE_DATASET.equalsIgnoreCase(uriData.getResource())) {
            throw new ApplicationException(DsdExceptionCodeEnum.ILLEGAL_ARGUMENT.getName(), "Incorrect ID. Id is not a Dataset ID: " + uri);
        }
        return uriData;
    }
    
    /************************************************************************************************************
     * Dimension
     ************************************************************************************************************/
    
    public static String createUriDimension(String uuid) {
        return UriFactory.getUri(Constants.URI_RESOURCE_DIMENSION, uuid, null);
    }

    public static UriData getUriDataDimension(String uri) throws ApplicationException {
        UriData uriData = UriFactory.getUriData(uri);
        if (!Constants.URI_RESOURCE_DIMENSION.equalsIgnoreCase(uriData.getResource())) {
            throw new ApplicationException(DsdExceptionCodeEnum.ILLEGAL_ARGUMENT.getName(), "Incorrect ID. Id is not a Dimension ID: " + uri);
        }
        return uriData;
    }
    
    /************************************************************************************************************
     * Primary Measure
     ************************************************************************************************************/
    
    public static String createUriPrimaryMeasure(String uuid) {
        return UriFactory.getUri(Constants.URI_RESOURCE_PRIMARY_MEASURE, uuid, null);
    }

    public static UriData getUriDataPrimaryMeasure(String uri) throws ApplicationException {
        UriData uriData = UriFactory.getUriData(uri);
        if (!Constants.URI_RESOURCE_PRIMARY_MEASURE.equalsIgnoreCase(uriData.getResource())) {
            throw new ApplicationException(DsdExceptionCodeEnum.ILLEGAL_ARGUMENT.getName(), "Incorrect ID. Id is not a Primary Measure ID: " + uri);
        }
        return uriData;
    }
    
    /************************************************************************************************************
     * Attribute definition
     ************************************************************************************************************/
    
    public static String createUriAttributeDefinition(String uuid) {
        return UriFactory.getUri(Constants.URI_RESOURCE_ATTRIBUTE_DEFINITION, uuid, null);
    }

    public static UriData getUriDataAttributeDefinition(String uri) throws ApplicationException {
        UriData uriData = UriFactory.getUriData(uri);
        if (!Constants.URI_RESOURCE_ATTRIBUTE_DEFINITION.equalsIgnoreCase(uriData.getResource())) {
            throw new ApplicationException(DsdExceptionCodeEnum.ILLEGAL_ARGUMENT.getName(), "Incorrect ID. Id is not a Attribute Definition ID: " + uri);
        }
        return uriData;
    }
}
