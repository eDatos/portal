package com.stat4you.statistics.dsd.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang3.RandomStringUtils;
import org.fornax.cartridges.sculptor.framework.accessapi.ConditionalCriteria;
import org.fornax.cartridges.sculptor.framework.domain.PagedResult;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.joda.time.DateTime;
import org.quartz.DateBuilder;
import org.quartz.DateBuilder.IntervalUnit;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SimpleScheduleBuilder;
import org.quartz.SimpleTrigger;
import org.quartz.TriggerBuilder;
import org.quartz.impl.SchedulerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.arte.statistic.dataset.repository.dto.DatasetRepositoryDto;
import com.stat4you.common.Stat4YouConstants;
import com.stat4you.common.criteria.SculptorCriteria;
import com.stat4you.common.criteria.Stat4YouCriteria;
import com.stat4you.common.criteria.Stat4YouCriteriaResult;
import com.stat4you.common.uri.UriData;
import com.stat4you.statistics.dsd.domain.AttributeAttachmentLevelEnum;
import com.stat4you.statistics.dsd.domain.AttributeDefinitionEntity;
import com.stat4you.statistics.dsd.domain.CodeDimensionEntity;
import com.stat4you.statistics.dsd.domain.DatasetEntity;
import com.stat4you.statistics.dsd.domain.DatasetStateEnum;
import com.stat4you.statistics.dsd.domain.DatasetVersionEntity;
import com.stat4you.statistics.dsd.domain.DatasetVersionEntityProperties;
import com.stat4you.statistics.dsd.domain.DatasetVersionInformation;
import com.stat4you.statistics.dsd.domain.DimensionEntity;
import com.stat4you.statistics.dsd.domain.DsdExceptionCodeEnum;
import com.stat4you.statistics.dsd.domain.PrimaryMeasureEntity;
import com.stat4you.statistics.dsd.domain.ProviderEntity;
import com.stat4you.statistics.dsd.dto.AttributeDefinitionDto;
import com.stat4you.statistics.dsd.dto.CodeDimensionDto;
import com.stat4you.statistics.dsd.dto.DatasetBasicDto;
import com.stat4you.statistics.dsd.dto.DatasetDto;
import com.stat4you.statistics.dsd.dto.DimensionBasicDto;
import com.stat4you.statistics.dsd.dto.DimensionDto;
import com.stat4you.statistics.dsd.dto.PrimaryMeasureDto;
import com.stat4you.statistics.dsd.dto.ProviderDto;
import com.stat4you.statistics.dsd.job.DsdJob;
import com.stat4you.statistics.dsd.mapper.Do2DtoMapper;
import com.stat4you.statistics.dsd.mapper.Dto2DoMapper;
import com.stat4you.statistics.dsd.mapper.SculptorCriteria2Stat4YouCriteriaMapper;
import com.stat4you.statistics.dsd.mapper.Stat4YouCriteria2SculptorCriteriaMapper;
import com.stat4you.statistics.dsd.service.DsdService;
import com.stat4you.statistics.dsd.service.util.DsdUtils;
import com.stat4you.statistics.dsd.service.util.InvocationValidator;
import com.stat4you.statistics.dsd.service.util.UriDataUtils;

/**
 * Implementation of DsdService.
 */
@Service("dsdService")
public class DsdServiceImpl extends DsdServiceImplBase {

    @Resource(name = "dto2DoMapperDsd")
    private Dto2DoMapper                            dto2DoMapper;

    @Resource(name = "do2DtoMapperDsd")
    private Do2DtoMapper                            do2DtoMapper;

    @Autowired
    private Stat4YouCriteria2SculptorCriteriaMapper stat4YouCriteria2SculptorCriteriaMapper;

    @Autowired
    private SculptorCriteria2Stat4YouCriteriaMapper sculptorCriteria2Stat4YouCriteriaMapper;

    private static Logger                           LOGGER = LoggerFactory.getLogger(DsdService.class);

    public DsdServiceImpl() {
    }

    public String createProvider(ServiceContext ctx, ProviderDto providerDto) throws ApplicationException {

        // Validation
        InvocationValidator.validateCreateProvider(providerDto);
        validateAcronymUnique(providerDto.getAcronym(), null); // Acronym not duplicated

        // Transform
        ProviderEntity providerEntity = dto2DoMapper.providerDtoToDo(providerDto);

        // Create
        providerEntity = getProviderRepository().save(providerEntity);
        String uri = UriDataUtils.createUriProvider(providerEntity.getUuid());

        return uri;
    }

    public ProviderDto retrieveProvider(ServiceContext ctx, String uri) throws ApplicationException {

        // Validation
        InvocationValidator.validateRetrieveProvider(uri);

        // Retrieve
        ProviderEntity provider = retrieveProviderByUri(uri);
        ProviderDto providerDto = do2DtoMapper.providerDoToDto(provider);
        return providerDto;
    }

    public ProviderDto retrieveProviderByAcronym(ServiceContext ctx, String acronym) throws ApplicationException {

        // Validation
        InvocationValidator.validateRetrieveProviderByAcronym(acronym);

        // Retrieve
        ProviderEntity provider = getProviderRepository().findProviderByAcronym(acronym);
        if (provider == null) {
            throw new ApplicationException(DsdExceptionCodeEnum.PROVIDER_NOT_EXISTS_WITH_ACRONYM.getName(), "Provider not exists with acronym " + acronym);
        }

        // Transform
        ProviderDto providerDto = do2DtoMapper.providerDoToDto(provider);
        return providerDto;
    }

    public void updateProvider(ServiceContext ctx, ProviderDto providerDto) throws ApplicationException {

        // Retrieve
        ProviderEntity providerEntity = retrieveProviderByUri(providerDto.getUri());

        // Validation
        InvocationValidator.validateUpdateProvider(providerDto, providerEntity);
        validateAcronymUnique(providerDto.getAcronym(), providerEntity.getUuid()); // Acronym not duplicated

        // Transform and update
        dto2DoMapper.providerDtoToDo(providerDto, providerEntity);
        getProviderRepository().save(providerEntity);
    }

    public void removeProvider(ServiceContext ctx, String uri) throws ApplicationException {

        // Retrieve
        ProviderEntity providerEntity = retrieveProviderByUri(uri);

        // Validation
        InvocationValidator.validateRemoveProvider(providerEntity);

        // Remove
        providerEntity.setRemovedDate(new DateTime());
        getProviderRepository().save(providerEntity);
    }

    @Override
    public List<ProviderDto> retrieveProviders(ServiceContext ctx) throws ApplicationException {

        // Retrieve
        List<ProviderEntity> providerEntities = getProviderRepository().findAllProviders();

        // Transform
        List<ProviderDto> providerDtos = new ArrayList<ProviderDto>();
        for (ProviderEntity providerEntity : providerEntities) {
            providerDtos.add(do2DtoMapper.providerDoToDto(providerEntity));
        }

        // Response
        return providerDtos;
    }

    @Override
    public String generateDatasetIdentifier(ServiceContext ctx, String providerUri, String identifierOriginal) throws ApplicationException {

        // Validation
        InvocationValidator.validateGenerateDatasetIdentifier(providerUri, identifierOriginal);

        // Generate unique identifier
        String providerUuid = UriDataUtils.getUriDataProvider(providerUri).getUuid();
        Integer count = Integer.valueOf(2);
        String identifier = null;
        String identifierProposed = identifierOriginal;
        do {
            DatasetEntity datasetEntity = getDatasetRepository().findDatasetByIdentifierAndProviderUuid(providerUuid, identifierProposed);
            if (datasetEntity == null) {
                identifier = identifierProposed;
            } else {
                identifierProposed = (new StringBuilder(identifierOriginal).append("_").append(count)).toString();
                count = Integer.valueOf(count + 1);
            }
        } while (identifier == null);

        return identifier;
    }

    @Override
    public String createDataset(ServiceContext ctx, DatasetDto datasetDto) throws ApplicationException {

        // Validation
        InvocationValidator.validateCreateDataset(datasetDto);

        // Retrieve provider and validate can be modified
        ProviderEntity providerEntity = retrieveProviderByUri(datasetDto.getProviderUri());
        InvocationValidator.validateProviderCanBeModified(providerEntity);

        // Check dataset does not exist with same identifier
        validateDatasetIdentifierUnique(datasetDto.getProviderUri(), datasetDto.getIdentifier());

        // Transform
        DatasetEntity datasetEntity = new DatasetEntity();
        datasetEntity.setProvider(providerEntity);
        datasetEntity.setPublishedVersion(null);
        dto2DoMapper.datasetDtoToDo(datasetDto, datasetEntity);

        DatasetVersionEntity draftDatasetVersionEntity = dto2DoMapper.datasetDtoToDo(datasetDto);
        draftDatasetVersionEntity.setState(DatasetStateEnum.DRAFT);
        draftDatasetVersionEntity.setVersionNumber(1);
        draftDatasetVersionEntity.setIsLastVersion(Boolean.TRUE);
        draftDatasetVersionEntity.setPublishingDate(null);
        draftDatasetVersionEntity.setUnpublishingDate(null);

        // Create dataset
        datasetEntity = getDatasetRepository().save(datasetEntity);

        // Create datasetVersion
        draftDatasetVersionEntity.setDataset(datasetEntity);
        draftDatasetVersionEntity = getDatasetVersionRepository().save(draftDatasetVersionEntity);

        // Update dataset with datasetVersion
        datasetEntity.getVersions().add(draftDatasetVersionEntity);
        datasetEntity.setDraftVersion(new DatasetVersionInformation(draftDatasetVersionEntity.getId(), draftDatasetVersionEntity.getVersionNumber()));
        datasetEntity.setPublishedVersion(null);
        datasetEntity = getDatasetRepository().save(datasetEntity);

        String uri = UriDataUtils.createUriDataset(datasetEntity.getUuid(), draftDatasetVersionEntity.getVersionNumber());

        // Create dataset repository
        createDatasetRepository(ctx, draftDatasetVersionEntity);

        return uri;
    }

    @Override
    public DatasetBasicDto retrieveDataset(ServiceContext ctx, String uri) throws ApplicationException {

        // Validation of parameters
        InvocationValidator.validateRetrieveDataset(uri);

        // Retrieve asked version or, if not provided, current version
        DatasetVersionEntity datasetVersionEntity = retrieveDatasetVersionByUri(uri, Boolean.TRUE);
        DatasetBasicDto datasetDto = do2DtoMapper.datasetVersionDoToBasicDto(datasetVersionEntity);
        return datasetDto;
    }

    @Override
    public DatasetBasicDto retrieveDatasetPublished(ServiceContext ctx, String uri) throws ApplicationException {

        // Validation of parameters
        InvocationValidator.validateRetrieveDatasetPublished(uri);

        // Retrieve published version
        DatasetVersionEntity publishedDatasetVersionEntity = retrieveDatasetPublished(uri);

        // Transform
        DatasetBasicDto datasetDto = do2DtoMapper.datasetVersionDoToBasicDto(publishedDatasetVersionEntity);
        return datasetDto;
    }

    @Override
    public DatasetDto retrieveDatasetByIdentifier(ServiceContext ctx, String providerAcronym, String identifier) throws ApplicationException {

        // Validation of parameters
        InvocationValidator.validateRetrieveDatasetByIdentifier(providerAcronym, identifier);

        // Retrieve last version of dataset by identifier
        DatasetVersionEntity datasetVersionEntity = getDatasetVersionRepository().retrieveDatasetByIdentifier(providerAcronym, identifier, Boolean.FALSE);
        if (datasetVersionEntity == null) {
            throw new ApplicationException(DsdExceptionCodeEnum.DATASET_NOT_EXISTS_WITH_IDENTIFIER.getName(), "Dataset not exists with identifier " + identifier + " in provider with acronym "
                    + providerAcronym);
        }
        DatasetDto datasetDto = do2DtoMapper.datasetVersionDoToDto(datasetVersionEntity);
        return datasetDto;
    }

    @Override
    public DatasetBasicDto retrieveDatasetBasicByIdentifier(ServiceContext ctx, String providerAcronym, String identifier) throws ApplicationException {

        // Validation of parameters
        InvocationValidator.validateRetrieveDatasetByIdentifier(providerAcronym, identifier);

        // Retrieve last version of dataset by identifier
        DatasetVersionEntity datasetVersionEntity = getDatasetVersionRepository().retrieveDatasetByIdentifier(providerAcronym, identifier, Boolean.FALSE);
        if (datasetVersionEntity == null) {
            throw new ApplicationException(DsdExceptionCodeEnum.DATASET_NOT_EXISTS_WITH_IDENTIFIER.getName(), "Dataset not exists with identifier " + identifier + " in provider with acronym "
                    + providerAcronym);
        }
        DatasetBasicDto datasetBasicDto = do2DtoMapper.datasetVersionDoToBasicDto(datasetVersionEntity);
        return datasetBasicDto;
    }

    @Override
    public DatasetDto retrieveDatasetPublishedByIdentifier(ServiceContext ctx, String providerAcronym, String identifier) throws ApplicationException {

        // Validation of parameters
        InvocationValidator.validateRetrieveDatasetPublishedByIdentifier(providerAcronym, identifier);

        // Retrieve published version of dataset by identifier
        DatasetVersionEntity datasetVersionEntity = getDatasetVersionRepository().retrieveDatasetByIdentifier(providerAcronym, identifier, Boolean.TRUE);
        if (datasetVersionEntity == null) {
            throw new ApplicationException(DsdExceptionCodeEnum.DATASET_NOT_EXISTS_WITH_IDENTIFIER.getName(), "Dataset not exists with identifier " + identifier + " in provider with acronym "
                    + providerAcronym);
        }
        DatasetDto datasetDto = do2DtoMapper.datasetVersionDoToDto(datasetVersionEntity);
        return datasetDto;
    }

    @Override
    public DatasetBasicDto retrieveDatasetBasicPublishedByIdentifier(ServiceContext ctx, String providerAcronym, String identifier) throws ApplicationException {

        // Validation of parameters
        InvocationValidator.validateRetrieveDatasetPublishedByIdentifier(providerAcronym, identifier);

        // Retrieve published version of dataset by identifier
        DatasetVersionEntity datasetVersionEntity = getDatasetVersionRepository().retrieveDatasetByIdentifier(providerAcronym, identifier, Boolean.TRUE);
        if (datasetVersionEntity == null) {
            throw new ApplicationException(DsdExceptionCodeEnum.DATASET_NOT_EXISTS_WITH_IDENTIFIER.getName(), "Dataset not exists with identifier " + identifier + " in provider with acronym "
                    + providerAcronym);
        }
        DatasetBasicDto datasetBasicDto = do2DtoMapper.datasetVersionDoToBasicDto(datasetVersionEntity);
        return datasetBasicDto;
    }

    @Override
    public void updateDatasetDraft(ServiceContext ctx, DatasetBasicDto datasetBasicDto) throws ApplicationException {

        // Retrieve version and check it is draft
        DatasetVersionEntity draftEntity = retrieveDatasetVersionByUri(datasetBasicDto.getUri(), Boolean.FALSE);
        if (!DatasetStateEnum.DRAFT.equals(draftEntity.getState())) {
            throw new ApplicationException(DsdExceptionCodeEnum.DATASET_INCORRECT_STATUS.getName(), "Dataset is not DRAFT with uri " + datasetBasicDto.getUri());
        }

        // Validation
        DatasetEntity datasetEntity = retrieveDatasetByUri(datasetBasicDto.getUri());
        InvocationValidator.validateUpdateDatasetDraft(datasetBasicDto, datasetEntity);

        // Transform and update
        dto2DoMapper.datasetDtoToDo(datasetBasicDto, draftEntity);
        dto2DoMapper.datasetDtoToDo(datasetBasicDto, draftEntity.getDataset());
        getDatasetVersionRepository().save(draftEntity);
    }

    @Override
    public void discardDatasetDraft(ServiceContext ctx, String uri) throws ApplicationException {

        // Retrieve
        DatasetEntity datasetEntity = retrieveDatasetByUri(uri);
        DatasetVersionEntity datasetVersionToDiscard = retrieveDatasetDraft(uri);

        // Delete data of current draft version
        String datasetUri = UriDataUtils.createUriDataset(datasetEntity.getUuid(), datasetEntity.getDraftVersion().getVersionNumber());
        try {
            getDataService().deleteDatasetRepository(ctx, datasetUri);
        } catch (Exception e) {
            // do nothing
            LOGGER.warn("Dataset repository could not be deleted: " + datasetUri);
        }

        if (datasetEntity.getReleaseDate() == null) {
            // never was published: delete whole dataset entity
            getDatasetRepository().delete(datasetEntity);
        } else {
            // delete only draft version

            // update published version
            DatasetVersionEntity datasetVersionPublished = retrieveDatasetPublished(uri);
            datasetVersionPublished.setIsLastVersion(Boolean.TRUE);
            getDatasetVersionRepository().save(datasetVersionPublished);

            datasetEntity.setDraftVersion(null);
            datasetEntity.getVersions().remove(datasetVersionToDiscard);
            getDatasetRepository().save(datasetEntity);

            // Delete draft version
            getDatasetVersionRepository().delete(datasetVersionToDiscard);
        }
    }

    @Override
    public void publishDataset(ServiceContext ctx, String uri) throws ApplicationException {

        // Retrieve
        DatasetEntity datasetEntity = retrieveDatasetByUri(uri);

        // Validation
        InvocationValidator.validatePublishDataset(datasetEntity);

        DatasetVersionEntity draftToPublish = retrieveDatasetDraft(uri);

        // If exists, remove actual published version (metadata and data)
        if (datasetEntity.getPublishedVersion() != null) {
            // Delete metadata
            DatasetVersionEntity datasetVersionEntityPublished = retrieveDatasetPublished(uri);
            datasetEntity.getVersions().remove(datasetVersionEntityPublished);
            getDatasetRepository().save(datasetEntity);
            getDatasetVersionRepository().delete(datasetVersionEntityPublished);

            // Delete data
            String datasetUri = UriDataUtils.createUriDataset(datasetEntity.getUuid(), datasetVersionEntityPublished.getVersionNumber());
            try {
                getDataService().deleteDatasetRepository(ctx, datasetUri);
            } catch (Exception e) {
                // do nothing
                LOGGER.warn("Dataset repository could not be deleted: " + datasetUri);
            }
        }
        // Publish current version
        draftToPublish.setState(DatasetStateEnum.PUBLISHED);
        draftToPublish.setPublishingDate(new DateTime());
        if (datasetEntity.getPublishedVersion() == null) {
            // First published
            datasetEntity.setReleaseDate(draftToPublish.getPublishingDate());
        }

        datasetEntity.setPublishedVersion(new DatasetVersionInformation(draftToPublish.getId(), draftToPublish.getVersionNumber()));
        datasetEntity.setDraftVersion(null);

        getDatasetRepository().save(datasetEntity);

        // Index
        String datasetPublishedUri = UriDataUtils.createUriDataset(datasetEntity.getUuid(), null);
        updateIndexDataset(datasetPublishedUri, DatasetStateEnum.PUBLISHED);
    }

    @Override
    public void unpublishDataset(ServiceContext ctx, String uri) throws ApplicationException {

        // Retrieve
        DatasetEntity datasetEntity = retrieveDatasetByUri(uri);

        // Validation
        InvocationValidator.validateUnpublishDataset(datasetEntity);

        // Unpublish
        datasetEntity.setPublishedVersion(null);
        datasetEntity.setDraftVersion(null);
        for (DatasetVersionEntity datasetVersionEntity : datasetEntity.getVersions()) {
            if (datasetVersionEntity.getPublishingDate() != null && datasetVersionEntity.getUnpublishingDate() == null) {
                datasetVersionEntity.setUnpublishingDate(new DateTime());
            }
            if (!DatasetStateEnum.UNPUBLISHED.equals(datasetVersionEntity.getState())) {
                datasetVersionEntity.setState(DatasetStateEnum.UNPUBLISHED);
            }
        }
        getDatasetRepository().save(datasetEntity);
        
        // Remove index
        String datasetUnpublishedUri = UriDataUtils.createUriDataset(datasetEntity.getUuid(), null);
        updateIndexDataset(datasetUnpublishedUri, DatasetStateEnum.UNPUBLISHED);
    }

    @Override
    public String updateDatasetPublished(ServiceContext ctx, String datasetUri, DatasetDto datasetDto) throws ApplicationException {

        // Retrieve dataset and validation
        DatasetEntity datasetEntity = retrieveDatasetByUri(datasetUri);
        InvocationValidator.validateUpdateDatasetPublished(datasetEntity);
        DatasetVersionEntity publishedDatasetVersionEntity = retrieveDatasetPublished(datasetUri);

        // Transform (important! ignore uris). Note: identifier is unmodifiable
        DatasetVersionEntity draftDatasetVersionEntity = dto2DoMapper.datasetDtoToDo(datasetDto);
        draftDatasetVersionEntity.setState(DatasetStateEnum.DRAFT);
        draftDatasetVersionEntity.setVersionNumber(publishedDatasetVersionEntity.getVersionNumber() + 1);
        draftDatasetVersionEntity.setIsLastVersion(Boolean.TRUE);
        draftDatasetVersionEntity.setPublishingDate(null);
        draftDatasetVersionEntity.setUnpublishingDate(null);
        draftDatasetVersionEntity.setDataset(datasetEntity);

        // Update published version
        publishedDatasetVersionEntity.setIsLastVersion(Boolean.FALSE);
        publishedDatasetVersionEntity = getDatasetVersionRepository().save(publishedDatasetVersionEntity);

        // Create draft version
        draftDatasetVersionEntity = getDatasetVersionRepository().save(draftDatasetVersionEntity);

        // Update dataset with DatasetVersion
        datasetEntity.getVersions().add(draftDatasetVersionEntity);
        datasetEntity.setDraftVersion(new DatasetVersionInformation(draftDatasetVersionEntity.getId(), draftDatasetVersionEntity.getVersionNumber()));
        getDatasetRepository().save(datasetEntity);

        String uriNewVersion = UriDataUtils.createUriDataset(datasetEntity.getUuid(), draftDatasetVersionEntity.getVersionNumber());

        // Create dataset repository
        createDatasetRepository(ctx, draftDatasetVersionEntity);

        return uriNewVersion;
    }

    @Override
    public Stat4YouCriteriaResult<DatasetBasicDto> findDatasets(ServiceContext ctx, Stat4YouCriteria stat4YouCriteria) throws ApplicationException {

        // Validation
        InvocationValidator.validateFindDatasets(stat4YouCriteria);

        // Transform
        SculptorCriteria sculptorCriteria = stat4YouCriteria2SculptorCriteriaMapper.getDatasetVersionCriteriaMapper().stat4youCriteria2SculptorCriteria(stat4YouCriteria);

        // Find only last versions
        sculptorCriteria.getConditions().add(ConditionalCriteria.equal(DatasetVersionEntityProperties.isLastVersion(), Boolean.TRUE));
        PagedResult<DatasetVersionEntity> result = getDatasetVersionRepository().findByCondition(sculptorCriteria.getConditions(), sculptorCriteria.getPagingParameter());

        // Transform
        Stat4YouCriteriaResult<DatasetBasicDto> dtoResult = sculptorCriteria2Stat4YouCriteriaMapper.pageResultToStat4YouCriteriaResultDatasetBasic(result, sculptorCriteria.getPageSize());
        return dtoResult;
    }

    @Override
    public Stat4YouCriteriaResult<DatasetBasicDto> findDatasetsPublished(ServiceContext ctx, Stat4YouCriteria stat4YouCriteria) throws ApplicationException {

        // Validation
        InvocationValidator.validateFindDatasetsPublished(stat4YouCriteria);

        // Transform
        SculptorCriteria sculptorCriteria = stat4YouCriteria2SculptorCriteriaMapper.getDatasetVersionCriteriaMapper().stat4youCriteria2SculptorCriteria(stat4YouCriteria);

        // Find only published
        sculptorCriteria.getConditions().add(ConditionalCriteria.equal(DatasetVersionEntityProperties.state(), DatasetStateEnum.PUBLISHED));
        PagedResult<DatasetVersionEntity> result = getDatasetVersionRepository().findByCondition(sculptorCriteria.getConditions(), sculptorCriteria.getPagingParameter());

        // Transform
        Stat4YouCriteriaResult<DatasetBasicDto> dtoResult = sculptorCriteria2Stat4YouCriteriaMapper.pageResultToStat4YouCriteriaResultDatasetBasic(result, sculptorCriteria.getPageSize());
        return dtoResult;
    }

    @Override
    public List<DatasetBasicDto> findDatasetsLastPublished(ServiceContext ctx, Integer count) throws ApplicationException {

        // Validation
        InvocationValidator.validateFindDatasetsLastPublished(count);

        // Retrieve
        List<DatasetVersionEntity> datasetVersionEntities = getDatasetVersionRepository().findDatasetsLastPublished(count);

        // Transform
        List<DatasetBasicDto> datasetDtos = new ArrayList<DatasetBasicDto>();
        for (DatasetVersionEntity datasetVersionPublishedEntity : datasetVersionEntities) {
            datasetDtos.add(do2DtoMapper.datasetVersionDoToBasicDto(datasetVersionPublishedEntity));
        }

        // Response
        return datasetDtos;
    }

    @Override
    public DimensionDto retrieveDimension(ServiceContext ctx, String uri) throws ApplicationException {
        // Retrieve
        DimensionEntity dimensionEntity = retrieveDimensionByUri(uri);
        DimensionDto dimensionDto = do2DtoMapper.dimensionDoToDto(dimensionEntity);
        return dimensionDto;
    }

    @Override
    public List<DimensionBasicDto> retrieveDatasetDimensionsBasics(ServiceContext ctx, String datasetUri) throws ApplicationException {
        // Validation
        InvocationValidator.validateRetrieveDimensions(datasetUri);

        // Retrieve dataset, asking for version provided
        DatasetVersionEntity datasetVersionEntity = retrieveDatasetVersionByUri(datasetUri, Boolean.TRUE);

        // Retrieve dimensions and transform
        List<DimensionEntity> dimensionEntities = datasetVersionEntity.getDimensions();
        List<DimensionBasicDto> dimensionsDtoList = new ArrayList<DimensionBasicDto>();
        for (DimensionEntity dimensionEntity : dimensionEntities) {
            dimensionsDtoList.add(do2DtoMapper.dimensionDoToBasicDto(dimensionEntity));
        }

        // Response
        return dimensionsDtoList;
    }
    
    @Override
    public List<CodeDimensionDto> retrieveCodesDimension(ServiceContext ctx, String dimensionUri) throws ApplicationException {
        // Validation
        InvocationValidator.validateRetrieveCodesDimension(dimensionUri);
        
        DimensionEntity dimensionEntity = retrieveDimensionByUri(dimensionUri);
        
        // Retrieve codes and transform
        List<CodeDimensionEntity> codeDimensionEntities = dimensionEntity.getCodes();
        List<CodeDimensionDto> codesDtoList = new ArrayList<CodeDimensionDto>();
        for (CodeDimensionEntity codeDimensionEntity : codeDimensionEntities) {
            codesDtoList.add(do2DtoMapper.codeDimensionDoToDto(codeDimensionEntity));
        }
        
        // Response
        return codesDtoList;
    }
    
    @Override
    public List<DimensionDto> retrieveDatasetDimensions(ServiceContext ctx, String datasetUri) throws ApplicationException {

        // Validation
        InvocationValidator.validateRetrieveDimensions(datasetUri);

        // Retrieve dataset, asking for version provided
        DatasetVersionEntity datasetVersionEntity = retrieveDatasetVersionByUri(datasetUri, Boolean.TRUE);

        // Retrieve dimensions and transform
        List<DimensionEntity> dimensionEntities = datasetVersionEntity.getDimensions();
        List<DimensionDto> dimensionsDtoList = new ArrayList<DimensionDto>();
        for (DimensionEntity dimensionEntity : dimensionEntities) {
            dimensionsDtoList.add(do2DtoMapper.dimensionDoToDto(dimensionEntity));
        }

        // Response
        return dimensionsDtoList;
    }

    @Override
    public void updateDimension(ServiceContext ctx, DimensionDto dimensionDto) throws ApplicationException {

        // Retrieve
        DimensionEntity dimensionEntity = retrieveDimensionByUri(dimensionDto.getUri());

        // Validation
        InvocationValidator.validateUpdateDimension(dimensionDto, dimensionEntity);

        // Transform and update
        dto2DoMapper.dimensionDtoToDo(dimensionDto, dimensionEntity);
        getDimensionRepository().save(dimensionEntity);
    }

    @Override
    public PrimaryMeasureDto retrievePrimaryMeasure(ServiceContext ctx, String uri) throws ApplicationException {
        // Retrieve
        PrimaryMeasureEntity primaryMeasureEntity = retrievePrimaryMeasureByUri(uri);
        PrimaryMeasureDto primaryMeasureDto = do2DtoMapper.primaryMeasureDoToDto(primaryMeasureEntity);
        return primaryMeasureDto;
    }

    @Override
    public PrimaryMeasureDto retrieveDatasetPrimaryMeasure(ServiceContext ctx, String datasetUri) throws ApplicationException {

        // Validation
        InvocationValidator.validateRetrieveDatasetPrimaryMeasure(datasetUri);

        // Retrieve dataset, asking for version provided
        DatasetVersionEntity datasetVersionEntity = retrieveDatasetVersionByUri(datasetUri, Boolean.TRUE);

        // Retrieve primary measure and transform
        PrimaryMeasureEntity primaryMeasureEntity = datasetVersionEntity.getPrimaryMeasure();
        PrimaryMeasureDto primaryMeasureDto = do2DtoMapper.primaryMeasureDoToDto(primaryMeasureEntity);

        // Response
        return primaryMeasureDto;
    }

    @Override
    public void updatePrimaryMeasure(ServiceContext ctx, PrimaryMeasureDto primaryMeasureDto) throws ApplicationException {

        // Retrieve
        PrimaryMeasureEntity primaryMeasureEntity = retrievePrimaryMeasureByUri(primaryMeasureDto.getUri());

        // Validation
        InvocationValidator.validateUpdatePrimaryMeasure(primaryMeasureDto, primaryMeasureEntity);

        // Transform and update
        dto2DoMapper.primaryMeasureDtoToDo(primaryMeasureDto, primaryMeasureEntity);
        getPrimaryMeasureRepository().save(primaryMeasureEntity);
    }

    @Override
    public List<AttributeDefinitionDto> retrieveDatasetAttributeDefinitions(ServiceContext ctx, String datasetUri) throws ApplicationException {

        // Validation
        InvocationValidator.validateRetrieveAttributeDefinitions(datasetUri);

        // Retrieve dataset, asking for version provided
        DatasetVersionEntity datasetVersionEntity = retrieveDatasetVersionByUri(datasetUri, Boolean.TRUE);

        // Retrieve attributes and transform
        List<AttributeDefinitionEntity> attributeDefinitionsEntities = datasetVersionEntity.getAttributeDefinitions();
        List<AttributeDefinitionDto> attributeDefinitionsDtoList = new ArrayList<AttributeDefinitionDto>();
        for (AttributeDefinitionEntity attributeDefinitionEntity : attributeDefinitionsEntities) {
            attributeDefinitionsDtoList.add(do2DtoMapper.attributeDefinitionDoToDto(attributeDefinitionEntity));
        }

        // Response
        return attributeDefinitionsDtoList;
    }

    private ProviderEntity retrieveProviderByUri(String uri) throws ApplicationException {

        InvocationValidator.validateRetrieveByUri(uri);
        String uuid = UriDataUtils.getUriDataProvider(uri).getUuid();
        ProviderEntity provider = getProviderRepository().findProviderByUuid(uuid);
        if (provider == null) {
            throw new ApplicationException(DsdExceptionCodeEnum.PROVIDER_NOT_EXISTS.getName(), "Provider not exists with uri " + uri);
        }
        return provider;
    }

    /**
     * Retrieve version provided. If no provided, retrieve last version
     */
    private DatasetVersionEntity retrieveDatasetVersionByUri(String uuid, Integer version) throws ApplicationException {
        DatasetVersionEntity datasetVersionEntity = getDatasetVersionRepository().retrieveDatasetVersion(uuid, version);
        if (datasetVersionEntity == null) {
            String uri = UriDataUtils.createUriDataset(uuid, version);
            throw new ApplicationException(DsdExceptionCodeEnum.DATASET_NOT_EXISTS.getName(), "Dataset not exists with uri " + uri);
        }
        return datasetVersionEntity;
    }

    /**
     * Retrieve version provided. If no provided, retrieve last version
     */
    private DatasetVersionEntity retrieveDatasetVersionByUri(String uri, Boolean retrieveLastIfVersionNotProvided) throws ApplicationException {

        InvocationValidator.validateRetrieveByUri(uri);

        UriData datasetUriData = UriDataUtils.getUriDataDataset(uri);
        if (datasetUriData.getVersion() != null) {
            return retrieveDatasetVersionByUri(datasetUriData.getUuid(), datasetUriData.getVersion());
        } else if (retrieveLastIfVersionNotProvided) {
            DatasetEntity dataset = retrieveDatasetByUri(uri);
            DatasetVersionEntity datasetVersionEntity = dataset.getVersions().get(dataset.getVersions().size() - 1);
            return datasetVersionEntity;
        } else {
            throw new ApplicationException(DsdExceptionCodeEnum.ILLEGAL_ARGUMENT.getName(), "Must specify version of dataset");
        }
    }

    private DatasetEntity retrieveDatasetByUri(String uri) throws ApplicationException {

        InvocationValidator.validateRetrieveByUri(uri);
        String uuid = UriDataUtils.getUriDataDataset(uri).getUuid();
        DatasetEntity dataset = getDatasetRepository().findDatasetByUuid(uuid);
        if (dataset == null) {
            throw new ApplicationException(DsdExceptionCodeEnum.DATASET_NOT_EXISTS.getName(), "Dataset not exists with uri " + uri);
        }
        return dataset;
    }

    private DimensionEntity retrieveDimensionByUri(String uri) throws ApplicationException {

        InvocationValidator.validateRetrieveByUri(uri);
        String uuid = UriDataUtils.getUriDataDimension(uri).getUuid();
        DimensionEntity dimension = getDimensionRepository().findDimensionByUuid(uuid);
        if (dimension == null) {
            throw new ApplicationException(DsdExceptionCodeEnum.DIMENSION_NOT_EXISTS.getName(), "Dimension not exists with uri " + uri);
        }
        return dimension;
    }

    private PrimaryMeasureEntity retrievePrimaryMeasureByUri(String uri) throws ApplicationException {

        InvocationValidator.validateRetrieveByUri(uri);
        String uuid = UriDataUtils.getUriDataPrimaryMeasure(uri).getUuid();
        PrimaryMeasureEntity primaryMeasure = getPrimaryMeasureRepository().findPrimaryMeasureByUuid(uuid);
        if (primaryMeasure == null) {
            throw new ApplicationException(DsdExceptionCodeEnum.PRIMARY_MEASURE_NOT_EXISTS.getName(), "Primary measure not exists with uri " + uri);
        }
        return primaryMeasure;
    }

    /**
     * Check not exists another provider with same acronym
     */
    private void validateAcronymUnique(String acronym, String uuid) throws ApplicationException {
        ProviderEntity providerEntity = getProviderRepository().findProviderByAcronym(acronym);
        if (providerEntity != null && !providerEntity.getUuid().equals(uuid)) {
            throw new ApplicationException(DsdExceptionCodeEnum.PROVIDER_ALREADY_EXISTS.getName(), "Provider already exists with acronym " + acronym);
        }
    }

    /**
     * Check not exists another dataset with same identifier in provider
     */
    private void validateDatasetIdentifierUnique(String providerUri, String identifier) throws ApplicationException {
        String providerUuid = UriDataUtils.getUriDataProvider(providerUri).getUuid();
        DatasetEntity datasetEntity = getDatasetRepository().findDatasetByIdentifierAndProviderUuid(providerUuid, identifier);
        if (datasetEntity != null) {
            throw new ApplicationException(DsdExceptionCodeEnum.DATASET_ALREADY_EXISTS.getName(), "Dataset already exists with identifier " + identifier + " in provider " + providerUri);
        }
    }

    private DatasetVersionEntity retrieveDatasetPublished(String uri) throws ApplicationException {
        DatasetEntity datasetEntity = retrieveDatasetByUri(uri);
        if (datasetEntity.getPublishedVersion() == null) {
            throw new ApplicationException(DsdExceptionCodeEnum.DATASET_INCORRECT_STATUS.getName(), "Dataset is not PUBLISHED with uri " + uri);
        }
        DatasetVersionEntity datasetPublishedEntity = retrieveDatasetVersionByUri(datasetEntity.getUuid(), datasetEntity.getPublishedVersion().getVersionNumber());
        return datasetPublishedEntity;
    }

    private DatasetVersionEntity retrieveDatasetDraft(String uri) throws ApplicationException {
        DatasetEntity datasetEntity = retrieveDatasetByUri(uri);
        if (datasetEntity.getDraftVersion() == null) {
            throw new ApplicationException(DsdExceptionCodeEnum.DATASET_INCORRECT_STATUS.getName(), "Dataset is not DRAFT with uri " + uri);
        }
        DatasetVersionEntity datasetDraftEntity = retrieveDatasetVersionByUri(datasetEntity.getUuid(), datasetEntity.getDraftVersion().getVersionNumber());
        return datasetDraftEntity;
    }

    private void createDatasetRepository(ServiceContext ctx, DatasetVersionEntity datasetVersionEntity) throws ApplicationException {

        String datasetUri = UriDataUtils.createUriDataset(datasetVersionEntity.getDataset().getUuid(), datasetVersionEntity.getVersionNumber());
        DatasetRepositoryDto datasetRepositoryDto = new DatasetRepositoryDto();
        datasetRepositoryDto.setDatasetId(datasetUri);
        for (DimensionEntity dimensionEntity : datasetVersionEntity.getDimensions()) {
            datasetRepositoryDto.getDimensions().add(dimensionEntity.getIdentifier());
        }
        datasetRepositoryDto.setLanguages(DsdUtils.doStringToDtoList(datasetVersionEntity.getLanguages()));
        int maxAttributesObservation = 0; 
        for (AttributeDefinitionEntity attributeDefinitionEntity : datasetVersionEntity.getAttributeDefinitions()) {
            if (AttributeAttachmentLevelEnum.OBSERVATION.equals(attributeDefinitionEntity.getAttachmentLevel())) {
                maxAttributesObservation++;
            }
        }
        datasetRepositoryDto.setMaxAttributesObservation(maxAttributesObservation);

        // Create dataset repository
        getDataService().createDatasetRepository(ctx, datasetRepositoryDto);
    }

    private void updateIndexDataset(String datasetUri, DatasetStateEnum datasetStateEnum) throws ApplicationException {
        try {
            Scheduler sched = SchedulerRepository.getInstance().lookup(Stat4YouConstants.JOB_SCHEDULER); // get a reference to a scheduler
            
            String jobName = RandomStringUtils.randomAlphabetic(10);
            String operation = null;
            switch (datasetStateEnum) {
                case PUBLISHED:
                    operation = DsdJob.PARAMETER_OPERATION_PUBLISH;
                    break;
                case UNPUBLISHED:
                    operation = DsdJob.PARAMETER_OPERATION_UNPUBLISH;
                    break;
            }
            JobDetail jobImportOffLine = JobBuilder.newJob(DsdJob.class).withIdentity(DsdJob.JOB_IDENTITY_PREFIX + jobName, DsdJob.JOB_DSD_GROUP)
                    .usingJobData(DsdJob.PARAMETER_DATASET_URI, datasetUri).usingJobData(DsdJob.PARAMETER_OPERATION, operation).build();

            SimpleTrigger trigger = TriggerBuilder.newTrigger().withIdentity(DsdJob.JOB_TRIGGER_PREFIX + jobName, DsdJob.JOB_DSD_GROUP).startAt(DateBuilder.futureDate(10, IntervalUnit.SECOND))
                    .withSchedule(SimpleScheduleBuilder.simpleSchedule()).build();

            sched.scheduleJob(jobImportOffLine, trigger);
        } catch (SchedulerException e) {
            throw new ApplicationException(DsdExceptionCodeEnum.UNKNOWN.name(), e.getMessage(), e);
        }
    }
}