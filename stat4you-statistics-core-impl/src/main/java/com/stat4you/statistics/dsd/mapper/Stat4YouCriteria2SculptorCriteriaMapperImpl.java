package com.stat4you.statistics.dsd.mapper;

import org.fornax.cartridges.sculptor.framework.domain.Property; 
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.springframework.stereotype.Component;

import com.stat4you.common.criteria.SculptorPropertyCriteria;
import com.stat4you.common.criteria.Stat4YouCriteriaOrder;
import com.stat4you.common.criteria.Stat4YouCriteriaPropertyRestriction;
import com.stat4you.common.criteria.mapper.Stat4YouCriteria2SculptorCriteria;
import com.stat4you.common.criteria.mapper.Stat4YouCriteria2SculptorCriteria.CriteriaCallback;
import com.stat4you.statistics.dsd.criteria.DatasetCriteriaOrderEnum;
import com.stat4you.statistics.dsd.criteria.DatasetCriteriaPropertyEnum;
import com.stat4you.statistics.dsd.domain.DatasetVersionEntity;
import com.stat4you.statistics.dsd.domain.DatasetVersionEntityProperties;
import com.stat4you.statistics.dsd.domain.DsdExceptionCodeEnum;
import com.stat4you.statistics.dsd.service.util.UriDataUtils;

@Component
public class Stat4YouCriteria2SculptorCriteriaMapperImpl implements Stat4YouCriteria2SculptorCriteriaMapper {

    private Stat4YouCriteria2SculptorCriteria<DatasetVersionEntity> datasetVersionCriteriaMapper = null;

    public Stat4YouCriteria2SculptorCriteriaMapperImpl() throws ApplicationException {
        datasetVersionCriteriaMapper = new Stat4YouCriteria2SculptorCriteria<DatasetVersionEntity>(DatasetVersionEntity.class, DatasetCriteriaOrderEnum.class, DatasetCriteriaPropertyEnum.class,
                new DatasetVersionCriteriaCallback());
    }

    @Override
    public Stat4YouCriteria2SculptorCriteria<DatasetVersionEntity> getDatasetVersionCriteriaMapper() {
        return datasetVersionCriteriaMapper;
    }

    private class DatasetVersionCriteriaCallback implements CriteriaCallback {

        @Override
        public SculptorPropertyCriteria retrieveProperty(Stat4YouCriteriaPropertyRestriction propertyRestriction) throws ApplicationException {
            DatasetCriteriaPropertyEnum propertyNameCriteria = DatasetCriteriaPropertyEnum.fromValue(propertyRestriction.getPropertyName());
            switch (propertyNameCriteria) {
                case URL:
                    return new SculptorPropertyCriteria(DatasetVersionEntityProperties.url(), propertyRestriction.getStringValue());
                case PROVIDER_URI:
                    String uuidProvider = UriDataUtils.getUriDataProvider(propertyRestriction.getStringValue()).getUuid();
                    return new SculptorPropertyCriteria(DatasetVersionEntityProperties.dataset().provider().uuid(), uuidProvider);
                default:
                    throw new ApplicationException(DsdExceptionCodeEnum.ILLEGAL_ARGUMENT.getName(), propertyRestriction.getPropertyName());
            }
        }

        @Override
        public Property<DatasetVersionEntity> retrievePropertyOrder(Stat4YouCriteriaOrder order) throws ApplicationException {
            DatasetCriteriaOrderEnum propertyNameCriteria = DatasetCriteriaOrderEnum.fromValue(order.getPropertyName());
            switch (propertyNameCriteria) {
                case  CREATION_DATE:
                    return DatasetVersionEntityProperties.id(); // can not search by creationDate because is a joda time, and has two columns
                default:
                    throw new ApplicationException(DsdExceptionCodeEnum.ILLEGAL_ARGUMENT.getName(), order.getPropertyName());
            }
        }

        @Override
        public Property<DatasetVersionEntity> retrievePropertyOrderDefault() throws ApplicationException {
            return DatasetVersionEntityProperties.id();
        }
    }
}
