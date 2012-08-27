package com.stat4you.statistics.dsd.service.util;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;

import com.stat4you.common.criteria.Stat4YouCriteria;
import com.stat4you.common.utils.ValidationUtils;
import com.stat4you.statistics.dsd.domain.AttributeAttachmentLevelEnum;
import com.stat4you.statistics.dsd.domain.CodeDimensionEntity;
import com.stat4you.statistics.dsd.domain.DatasetEntity;
import com.stat4you.statistics.dsd.domain.DatasetSourceEnum;
import com.stat4you.statistics.dsd.domain.DatasetStateEnum;
import com.stat4you.statistics.dsd.domain.DimensionEntity;
import com.stat4you.statistics.dsd.domain.DsdExceptionCodeEnum;
import com.stat4you.statistics.dsd.domain.PrimaryMeasureEntity;
import com.stat4you.statistics.dsd.domain.ProviderEntity;
import com.stat4you.statistics.dsd.dto.AttributeDefinitionDto;
import com.stat4you.statistics.dsd.dto.CodeDimensionDto;
import com.stat4you.statistics.dsd.dto.DatasetBasicDto;
import com.stat4you.statistics.dsd.dto.DatasetDto;
import com.stat4you.statistics.dsd.dto.DimensionDto;
import com.stat4you.statistics.dsd.dto.PrimaryMeasureDto;
import com.stat4you.statistics.dsd.dto.ProviderDto;

public class InvocationValidator {
       
    public static void validateRetrieveByUri(String uri) throws ApplicationException {
        ValidationUtils.validateParameterRequired(uri, "uri");
    }
    
    public static void validateCreateProvider(ProviderDto providerDto) throws ApplicationException {
    	ValidationUtils.validateParameterEmpty(providerDto.getUri(), "providerDto.uri");
        validateProvider(providerDto);
    }
    
    public static void validateRetrieveProvider(String uri) throws ApplicationException {
        ValidationUtils.validateParameterRequired(uri, "uri");
    }
    
    public static void validateRetrieveProviderByAcronym(String acronym) throws ApplicationException {
        ValidationUtils.validateParameterRequired(acronym, "acronym");
    }

    public static void validateUpdateProvider(ProviderDto providerDto, ProviderEntity providerEntity) throws ApplicationException {

        // Can be modified
        validateProviderCanBeModified(providerEntity);

        // Data
        validateProvider(providerDto);
    }
    
    public static void validateProviderCanBeModified(ProviderEntity providerEntity) throws ApplicationException {

    	// Not removed
        if (providerEntity.getRemovedDate() != null) {
            throw new ApplicationException(DsdExceptionCodeEnum.PROVIDER_INCORRECT_STATUS.name(), "Provider is removed and can not be modified");
        }
    }    

	public static void validateRemoveProvider(ProviderEntity providerEntity) throws ApplicationException {
		// Can be modified
        validateProviderCanBeModified(providerEntity);
	}    
	
    public static void validateGenerateDatasetIdentifier(String providerUri, String identifierOriginal) throws ApplicationException {
        ValidationUtils.validateParameterRequired(providerUri, "providerUri");
        ValidationUtils.validateParameterRequired(identifierOriginal, "identifierOriginal");
    }

    public static void validateRetrieveDataset(String uri) throws ApplicationException {
        ValidationUtils.validateParameterRequired(uri, "uri");
    }
    
    public static void validateRetrieveDatasetPublished(String uri) throws ApplicationException {
        ValidationUtils.validateParameterRequired(uri, "uri");
    }
    
    public static void validateRetrieveDatasetByIdentifier(String providerAcronym, String uri) throws ApplicationException {
        ValidationUtils.validateParameterRequired("providerAcronym", providerAcronym);
        ValidationUtils.validateParameterRequired(uri, "uri");
    }
    
    public static void validateRetrieveDatasetPublishedByIdentifier(String providerAcronym, String uri) throws ApplicationException {
        ValidationUtils.validateParameterRequired("providerAcronym", providerAcronym);
        ValidationUtils.validateParameterRequired(uri, "uri");
    }
    
	public static void validateCreateDataset(DatasetDto datasetDto) throws ApplicationException {
		ValidationUtils.validateParameterEmpty(datasetDto.getUri(), "datasetDto.uri");
        ValidationUtils.validateParameterRequired(datasetDto.getIdentifier(), "datasetDto.identifier");
        validateSemanticIdentifier(datasetDto.getIdentifier(), "datasetDto.identifier");
		ValidationUtils.validateParameterEmpty(datasetDto.getPublishingDate(), "datasetDto.publishingDate");
		ValidationUtils.validateParameterEmpty(datasetDto.getUnpublishingDate(), "datasetDto.unpublishingDate");
		ValidationUtils.validateParameterEmpty(datasetDto.getState(), "datasetDto.state");
        validateDataset(datasetDto);
	}

	public static void validateDeleteDataset(DatasetEntity datasetEntity) throws ApplicationException {

	    // Never was published
	    if (datasetEntity.getReleaseDate() != null) {
        	throw new ApplicationException(DsdExceptionCodeEnum.DATASET_INCORRECT_STATUS.name(), "At least one version of dataset was published and can not be deleted");
		}
	    
        // Provider can be modified
        validateProviderCanBeModified(datasetEntity.getProvider()); 
	}
	
	public static void validatePublishDataset(DatasetEntity datasetEntity) throws ApplicationException {
        // Exists draft
        if (datasetEntity.getDraftVersion() == null) {
        	throw new ApplicationException(DsdExceptionCodeEnum.DATASET_INCORRECT_STATUS.name(), "Dataset hasn't version in draft");
        }

        // Provider can be modified
        validateProviderCanBeModified(datasetEntity.getProvider()); 
	}
	
	public static void validateUnpublishDataset(DatasetEntity datasetEntity) throws ApplicationException {
        // State
        if (datasetEntity.getPublishedVersion() == null) {
        	throw new ApplicationException(DsdExceptionCodeEnum.DATASET_INCORRECT_STATUS.name(), "Dataset has not published version");
        }
	}
	
    public static void validateUpdateDatasetDraft(DatasetBasicDto datasetBasicDto, DatasetEntity datasetEntity) throws ApplicationException {
    	validateUpdateDataset(datasetEntity);
        // Data
        validateDatasetBasic(datasetBasicDto);
        // Unmodifiable data
        ValidationUtils.validateUnmodifiableAttribute(datasetEntity.getProvider().getUuid(), UriDataUtils.getUriDataProvider(datasetBasicDto.getProviderUri()).getUuid(), "datasetDto.providerUri.uuid");
        ValidationUtils.validateUnmodifiableAttribute(datasetEntity.getIdentifier(), datasetBasicDto.getIdentifier(), "datasetDto.identifier");
    }
    
    public static void validateUpdateDataset(DatasetEntity datasetEntity) throws ApplicationException {

        // Exists draft
        if (datasetEntity.getDraftVersion() == null) {
        	throw new ApplicationException(DsdExceptionCodeEnum.DATASET_INCORRECT_STATUS.name(), "Dataset hasn't version in draft");
        }
        // Provider can be modified
        validateProviderCanBeModified(datasetEntity.getProvider()); 
    }
    
    public static void validateFindDatasets(Stat4YouCriteria criteria) throws ApplicationException {
        // criteria is optional            
    }
    
    public static void validateFindDatasetsPublished(Stat4YouCriteria criteria) throws ApplicationException {
        // criteria is optional        
    }
    
    public static void validateFindDatasetsLastPublished(Integer count) throws ApplicationException {
        ValidationUtils.validateParameterRequired(count, "count");
    }    
        
	public static void validateUpdateDatasetPublished(DatasetEntity datasetEntity) throws ApplicationException {
		 // Exists published but no draft
        if (datasetEntity.getPublishedVersion() == null) {
        	throw new ApplicationException(DsdExceptionCodeEnum.DATASET_INCORRECT_STATUS.name(), "Dataset hasn't version already published");
        }
        if (datasetEntity.getDraftVersion() != null) {
        	throw new ApplicationException(DsdExceptionCodeEnum.DATASET_INCORRECT_STATUS.name(), "Dataset has already version in draft");
        }
        
        // Provider can be modified
        validateProviderCanBeModified(datasetEntity.getProvider()); 
	}
	
	public static void validateRetrieveDimension(String uri) throws ApplicationException {
		ValidationUtils.validateParameterRequired(uri, "uri");
	}
	
	public static void validateRetrieveDimensions(String datasetUri) throws ApplicationException {
		ValidationUtils.validateParameterRequired(datasetUri, "datasetUri");
	}
	
	public static void validateRetrieveCodesDimension(String dimensionUri) throws ApplicationException {
        ValidationUtils.validateParameterRequired(dimensionUri, "dimensionUri");
    }	

	public static void validateUpdateDimension(DimensionDto dimensionDto, DimensionEntity dimensionEntity) throws ApplicationException {
		
        // Check not modified values if source is not manual
        if (!DatasetSourceEnum.MANUAL.equals(dimensionEntity.getDatasetVersion().getSource())) {
            validateCodesDimensionUnmodifiable(dimensionEntity.getCodes(), dimensionDto.getCodes());
        }

		validateDimensionCanBeModified(dimensionEntity);
		
		// Data
        validateDimension(dimensionDto);
	}
	
	public static void validateCreatePrimaryMeasure(PrimaryMeasureDto primaryMeasureDto) throws ApplicationException {
        validatePrimaryMeasure(primaryMeasureDto);      
		ValidationUtils.validateParameterEmpty(primaryMeasureDto.getUri(), "primaryMeasureDto.uri");
	}
	
	public static void validateRetrievePrimaryMeasure(String uri) throws ApplicationException {
		ValidationUtils.validateParameterRequired("uri", uri);
	}
	
	public static void validateRetrieveDatasetPrimaryMeasure(String datasetUri) throws ApplicationException {
		ValidationUtils.validateParameterRequired(datasetUri, "datasetUri");
	}

	public static void validateUpdatePrimaryMeasure(PrimaryMeasureDto primaryMeasureDto, PrimaryMeasureEntity primaryMeasureEntity) throws ApplicationException {
		
		validatePrimaryMeasureCanBeModified(primaryMeasureEntity);
        // Data
        validatePrimaryMeasure(primaryMeasureDto);
	}
	
    public static void validateRetrieveAttributeDefinitions(String datasetUri) throws ApplicationException {
        ValidationUtils.validateParameterRequired(datasetUri, "datasetUri");
    }

    private static void validateSemanticIdentifier(String parameter, String parameterName) throws ApplicationException {
        if (!DsdUtils.isSemanticIdentifier(parameter)) {
            throw new ApplicationException(DsdExceptionCodeEnum.ILLEGAL_ARGUMENT.getName(), "Attribute \"" + parameterName + "\" is not a valid semantic identifier");
        }
    }
    
    private static void validateProvider(ProviderDto providerDto) throws ApplicationException {
        ValidationUtils.validateParameterRequired(providerDto, "providerDto");
        ValidationUtils.validateParameterRequired(providerDto.getAcronym(), "providerDto.acronym");
        validateSemanticIdentifier(providerDto.getAcronym(), "providerDto.acronym");
        ValidationUtils.validateParameterRequired(providerDto.getName(), "providerDto.name");
    }
    
    /**
     * Validate dataset, with dimensions (required), primary measure (required) and attributes definitions
     * TODO validar que venga sólo una measure dimension
     */
    private static void validateDataset(DatasetDto datasetDto) throws ApplicationException {
        validateDatasetBasic(datasetDto);
        validateCreateDimensions(datasetDto.getDimensions());
		validateCreatePrimaryMeasure(datasetDto.getPrimaryMeasure());
		validateCreateAttributesDefintions(datasetDto.getAttributeDefinitions());
    }
    
    private static void validateDatasetBasic(DatasetBasicDto datasetDto) throws ApplicationException {
        ValidationUtils.validateParameterRequired(datasetDto, "datasetDto");
        ValidationUtils.validateParameterRequired(datasetDto.getProviderUri(), "datasetDto.providerUri");
        ValidationUtils.validateInternationalString(datasetDto.getTitle(), "datasetDto.title");
        ValidationUtils.validateParameterRequired(datasetDto.getSource(), "datasetDto.source");
        // TODO fecha de publicación de provider requerida?
    }
	
    private static void validateDimension(DimensionDto dimensionDto) throws ApplicationException {
    	ValidationUtils.validateParameterRequired(dimensionDto, "dimensionDto");
    	ValidationUtils.validateParameterRequired(dimensionDto.getIdentifier(), "dimensionDto.identifier");
    	validateSemanticIdentifier(dimensionDto.getIdentifier(), "dimensionDto.identifier");
    	ValidationUtils.validateInternationalString(dimensionDto.getTitle(), "dimensionDto.title");
        ValidationUtils.validateParameterRequired(dimensionDto.getType(), "dimensionDto.type");
    	ValidationUtils.validateParameterRequired(dimensionDto.getCodes(), "dimensionDto.codes");
        validateCodesDimension(dimensionDto.getCodes());
	}

    /**
     * Note: no validate is a semantic identifier
     */
    private static void validateCodeDimension(CodeDimensionDto codeDimensionDto) throws ApplicationException {
    	ValidationUtils.validateParameterRequired(codeDimensionDto.getIdentifier(), "codeDimensionDto.identifier");
    	ValidationUtils.validateInternationalString(codeDimensionDto.getTitle(), "codeDimensionDto.title");
		validateCodesDimension(codeDimensionDto.getSubcodes());
    }
    
    private static void validateCodesDimension(List<CodeDimensionDto> codesDimensionDto) throws ApplicationException {
    	if (codesDimensionDto != null) {
	    	Set<String> codesCheckNotDuplicated = new HashSet<String>();
	    	for (CodeDimensionDto codeDimensionDto : codesDimensionDto) {
	    		validateCodeDimension(codeDimensionDto);
	    		if (codesCheckNotDuplicated.contains(codeDimensionDto.getIdentifier().toUpperCase())) {
	    			throw new ApplicationException(DsdExceptionCodeEnum.ILLEGAL_ARGUMENT.getName(), "Identifier of code of dimension duplicated: \"" + codeDimensionDto.getIdentifier() + "\"");	
	    		}
	    		codesCheckNotDuplicated.add(codeDimensionDto.getIdentifier().toUpperCase());
			}
    	}
    }    
    
    private static void validatePrimaryMeasure(PrimaryMeasureDto primaryMeasureDto) throws ApplicationException {
    	ValidationUtils.validateParameterRequired(primaryMeasureDto, "primaryMeasureDto");
    	ValidationUtils.validateParameterRequired(primaryMeasureDto.getIdentifier(), "primaryMeasureDto.identifier");
    	validateSemanticIdentifier(primaryMeasureDto.getIdentifier(), "primaryMeasureDto.identifier");
    	ValidationUtils.validateInternationalString(primaryMeasureDto.getTitle(), "primaryMeasureDto.title");
	}
	
	private static void validatePrimaryMeasureCanBeModified(PrimaryMeasureEntity primaryMeasureEntity) throws ApplicationException {
		
        // Dataset can be modified
		if (!DatasetStateEnum.DRAFT.equals(primaryMeasureEntity.getDatasetVersion().getState())) {
			throw new ApplicationException(DsdExceptionCodeEnum.DATASET_INCORRECT_STATUS.name(), "Dataset is not in Draft");
		}
		
		// Provider can be modified
		validateProviderCanBeModified(primaryMeasureEntity.getDatasetVersion().getDataset().getProvider());
	}
	
    private static void validateCreateDimensions(List<DimensionDto> dimensions) throws ApplicationException {
        ValidationUtils.validateParameterRequired(dimensions, "datasetDto.dimensions");
        Set<String> identifiers = new HashSet<String>();
        for (DimensionDto dimensionDto : dimensions) {
            if (identifiers.contains(dimensionDto.getIdentifier())) {
                throw new ApplicationException(DsdExceptionCodeEnum.ILLEGAL_ARGUMENT.getName(), "Identifier of dimension \"" + dimensionDto.getIdentifier() + "\" duplicated");   
            }
            validateCreateDimension(dimensionDto);
            identifiers.add(dimensionDto.getIdentifier());
        }
    }
    
	private static void validateCreateDimension(DimensionDto dimensionDto) throws ApplicationException {
        validateDimension(dimensionDto);		
        ValidationUtils.validateParameterEmpty(dimensionDto.getUri(), "dimensionDto.uri");
	}
	
	private static void validateCodesDimensionUnmodifiable(List<CodeDimensionEntity> codesDimensionEntities, List<CodeDimensionDto> codesDimensionDto) throws ApplicationException {
		if (codesDimensionDto.size() != codesDimensionEntities.size()) {
    		throw new ApplicationException(DsdExceptionCodeEnum.OPERATION_NOT_SUPPORTED.getName(), "Dataset structure can not be modified: codes of dimensions are changed");
    	} 
		for (int i = 0; i < codesDimensionEntities.size(); i++) {
			if (!codesDimensionEntities.get(i).getIdentifier().equals(codesDimensionDto.get(i).getIdentifier())) {
				throw new ApplicationException(DsdExceptionCodeEnum.OPERATION_NOT_SUPPORTED.getName(), "Dataset structure can not be modified: identifier of codes of dimensions are changed");
			}
			validateCodesDimensionUnmodifiable(codesDimensionEntities.get(i).getSubcodes(), codesDimensionDto.get(i).getSubcodes());
		}
	}
	
	private static void validateDimensionCanBeModified(DimensionEntity dimensionEntity) throws ApplicationException {
		
        // Dataset can be modified
		if (!DatasetStateEnum.DRAFT.equals(dimensionEntity.getDatasetVersion().getState())) {
			throw new ApplicationException(DsdExceptionCodeEnum.DATASET_INCORRECT_STATUS.name(), "Dataset is not in Draft");
		}
		
		// Provider can be modified
		validateProviderCanBeModified(dimensionEntity.getDatasetVersion().getDataset().getProvider());
	}
	
    private static void validateCreateAttributesDefintions(List<AttributeDefinitionDto> attributesDefinitions) throws ApplicationException {
        Set<String> identifiers = new HashSet<String>();
        for (AttributeDefinitionDto attributeDefinitionDto : attributesDefinitions) {
            if (identifiers.contains(attributeDefinitionDto.getIdentifier())) {
                throw new ApplicationException(DsdExceptionCodeEnum.ILLEGAL_ARGUMENT.getName(), "Attribute definition with identifier \"" + attributeDefinitionDto.getIdentifier() + "\" duplicated");   
            }
            validateCreateAttributeDefinition(attributeDefinitionDto);
            identifiers.add(attributeDefinitionDto.getIdentifier());
        }
    }

    private static void validateCreateAttributeDefinition(AttributeDefinitionDto attributeDefinitionDto) throws ApplicationException {
        ValidationUtils.validateParameterEmpty(attributeDefinitionDto.getUri(), "attributeDefinitionDto.uri");
        validateAttributeDefinition(attributeDefinitionDto);        
    }	
    
    private static void validateAttributeDefinition(AttributeDefinitionDto attributeDefinitionDto) throws ApplicationException {
        ValidationUtils.validateParameterRequired(attributeDefinitionDto, "attributeDefinitionDto");
        ValidationUtils.validateParameterRequired(attributeDefinitionDto.getIdentifier(), "attributeDefinitionDto.identifier");
        validateSemanticIdentifier(attributeDefinitionDto.getIdentifier(), "attributeDefinitionDto.identifier");
        ValidationUtils.validateParameterRequired(attributeDefinitionDto.getAttachmentLevel(), "attributeDefinitionDto.attachmentLevel");
        if (AttributeAttachmentLevelEnum.DIMENSION.equals(attributeDefinitionDto.getAttachmentLevel())) {
            ValidationUtils.validateParameterRequired(attributeDefinitionDto.getAttachmentDimensions(), "attributeDefinitionDto.attachmentDimensions");
        } else {
            ValidationUtils.validateParameterEmpty(attributeDefinitionDto.getAttachmentDimensions(), "attributeDefinitionDto.attachmentDimensions");
        }
    }
}
