package com.stat4you.common.criteria.mapper;

import java.util.List;

import org.fornax.cartridges.sculptor.framework.accessapi.ConditionalCriteria;
import org.fornax.cartridges.sculptor.framework.accessapi.ConditionalCriteriaBuilder;
import org.fornax.cartridges.sculptor.framework.accessapi.ConditionalCriteriaBuilder.CondditionProperty;
import org.fornax.cartridges.sculptor.framework.accessapi.ConditionalCriteriaBuilder.ConditionRoot;
import org.fornax.cartridges.sculptor.framework.domain.PagingParameter;
import org.fornax.cartridges.sculptor.framework.domain.Property;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;

import com.stat4you.common.criteria.SculptorCriteria;
import com.stat4you.common.criteria.SculptorPropertyCriteria;
import com.stat4you.common.criteria.Stat4YouCriteria;
import com.stat4you.common.criteria.Stat4YouCriteriaConjunctionRestriction;
import com.stat4you.common.criteria.Stat4YouCriteriaDisjunctionRestriction;
import com.stat4you.common.criteria.Stat4YouCriteriaOrder;
import com.stat4you.common.criteria.Stat4YouCriteriaOrder.OrderTypeEnum;
import com.stat4you.common.criteria.Stat4YouCriteriaPropertyRestriction;
import com.stat4you.common.criteria.Stat4YouCriteriaRestriction;
import com.stat4you.common.exception.CommonExceptionCodeEnum;

@SuppressWarnings({"unchecked", "rawtypes"})
public class Stat4YouCriteria2SculptorCriteria<T> {

    private Class<T>              entityClass                  = null;

    private Class<? extends Enum> propertyOrderEnumClass       = null;
    private Class<? extends Enum> propertyRestrictionEnumClass = null;

    private CriteriaCallback      callback                     = null;

    private Integer               MAXIMUM_RESULT_SIZE_DEFAULT  = Integer.valueOf(25);
    private Integer               MAXIMUM_RESULT_SIZE_ALLOWED  = Integer.valueOf(1000);

    public Stat4YouCriteria2SculptorCriteria(Class<T> entityClass, Class<? extends Enum> propertyOrderEnumClass, Class<? extends Enum> propertyRestrictionEnumClass, CriteriaCallback callback)
            throws ApplicationException {

        this.entityClass = entityClass;
        this.propertyOrderEnumClass = propertyOrderEnumClass;
        this.propertyRestrictionEnumClass = propertyRestrictionEnumClass;
        this.callback = callback;
    }

    public SculptorCriteria stat4youCriteria2SculptorCriteria(Stat4YouCriteria stat4youCriteria) throws ApplicationException {

        if (stat4youCriteria == null) {
            stat4youCriteria = new Stat4YouCriteria();
        }

        ConditionRoot<T> criteria = ConditionalCriteriaBuilder.criteriaFor(entityClass);

        // Orders
        if (stat4youCriteria.getOrdersBy() == null || stat4youCriteria.getOrdersBy().isEmpty()) {
            Property defaultOrder = callback.retrievePropertyOrderDefault();
            if (defaultOrder != null) {
                criteria.orderBy(defaultOrder).ascending();
            }
        } else {
            for (Stat4YouCriteriaOrder order : stat4youCriteria.getOrdersBy()) {
                checkPropertyOrder(order);
                if (order.getType() == null || OrderTypeEnum.ASC.equals(order.getType())) {
                    criteria.orderBy(callback.retrievePropertyOrder(order)).ascending();
                } else {
                    criteria.orderBy(callback.retrievePropertyOrder(order)).descending();
                }
            }
        }

        // Restrictions
        if (stat4youCriteria.getRestriction() != null) {
            addRestriction(stat4youCriteria.getRestriction(), criteria);
        }

        List<ConditionalCriteria> conditions = criteria.distinctRoot().build();

        // Paging parameter
        Integer startRow = null;
        Integer maximumResultSize = null;
        Boolean countTotalResults = null;
        if (stat4youCriteria != null) {
            if (stat4youCriteria.getPaginator() != null) {
                if (stat4youCriteria.getPaginator().getFirstResult() != null) {
                    startRow = stat4youCriteria.getPaginator().getFirstResult().intValue();
                }
                if (stat4youCriteria.getPaginator().getMaximumResultSize() != null) {
                    maximumResultSize = stat4youCriteria.getPaginator().getMaximumResultSize();
                }
                if (stat4youCriteria.getPaginator().getCountTotalResults() != null) {
                    countTotalResults = stat4youCriteria.getPaginator().getCountTotalResults();
                }
            }
        }
        if (startRow == null || startRow < 0) {
            startRow = Integer.valueOf(0);
        }
        if (maximumResultSize == null) {
            maximumResultSize = MAXIMUM_RESULT_SIZE_DEFAULT;
        }
        if (maximumResultSize > MAXIMUM_RESULT_SIZE_ALLOWED) {
            maximumResultSize = MAXIMUM_RESULT_SIZE_ALLOWED;
        }
        if (countTotalResults == null) {
            countTotalResults = Boolean.FALSE;
        }
        PagingParameter pagingParameter = PagingParameter.rowAccess(startRow, startRow + maximumResultSize, countTotalResults);

        return new SculptorCriteria(conditions, pagingParameter, maximumResultSize);
    }

    private void addRestriction(Stat4YouCriteriaRestriction stat4youCriteriaRestriction, ConditionRoot criteria) throws ApplicationException {

        if (stat4youCriteriaRestriction instanceof Stat4YouCriteriaDisjunctionRestriction) {
            addRestriction((Stat4YouCriteriaDisjunctionRestriction) stat4youCriteriaRestriction, criteria);
        } else if (stat4youCriteriaRestriction instanceof Stat4YouCriteriaConjunctionRestriction) {
            addRestriction((Stat4YouCriteriaConjunctionRestriction) stat4youCriteriaRestriction, criteria);
        } else if (stat4youCriteriaRestriction instanceof Stat4YouCriteriaPropertyRestriction) {
            addRestriction((Stat4YouCriteriaPropertyRestriction) stat4youCriteriaRestriction, criteria);
        } else {
            throw new ApplicationException(CommonExceptionCodeEnum.PARAMETER_INCORRECT.getName(), "CRITERIA");
        }
    }

    private void addRestriction(Stat4YouCriteriaDisjunctionRestriction disjunction, ConditionRoot criteria) throws ApplicationException {
        criteria.lbrace();
        for (int i = 0; i < disjunction.getRestrictions().size(); i++) {
            Stat4YouCriteriaRestriction stat4youCriteriaSubrestriction = disjunction.getRestrictions().get(i);
            addRestriction(stat4youCriteriaSubrestriction, criteria);
            if (i < disjunction.getRestrictions().size() - 1) {
                criteria.or();
            }
        }
        criteria.rbrace();
    }

    private void addRestriction(Stat4YouCriteriaConjunctionRestriction conjunction, ConditionRoot criteria) throws ApplicationException {
        criteria.lbrace();
        for (int i = 0; i < conjunction.getRestrictions().size(); i++) {
            Stat4YouCriteriaRestriction stat4youCriteriaSubrestriction = conjunction.getRestrictions().get(i);
            addRestriction(stat4youCriteriaSubrestriction, criteria);
            if (i < conjunction.getRestrictions().size() - 1) {
                criteria.and();
            }
        }
        criteria.rbrace();
    }

    private void addRestriction(Stat4YouCriteriaPropertyRestriction stat4youCriteriaPropertyRestriction, ConditionRoot criteria) throws ApplicationException {
        checkPropertyRestriction(stat4youCriteriaPropertyRestriction);
        
        SculptorPropertyCriteria sculptorPropertyCriteria = callback.retrieveProperty(stat4youCriteriaPropertyRestriction);
        CondditionProperty condditionProperty = criteria.withProperty(sculptorPropertyCriteria.getProperty());
        switch (stat4youCriteriaPropertyRestriction.getOperationType()) {
            case EQ:
                condditionProperty.eq(sculptorPropertyCriteria.getValue());
                break;
            case IEQ:
                condditionProperty.ignoreCaseEq(sculptorPropertyCriteria.getValue());
                break;
            case LIKE:
                condditionProperty.like("%" + sculptorPropertyCriteria.getValue() + "%");
                break;
            case ILIKE:
                condditionProperty.ignoreCaseLike("%" + sculptorPropertyCriteria.getValue() + "%");
                break;
            case IS_NULL:
                condditionProperty.isNull();
                break;
            case IS_NOT_NULL:
                condditionProperty.isNotNull();
                break;
            case NE:
                condditionProperty.eq(sculptorPropertyCriteria.getValue()).not();
                break;
            case LT:
                condditionProperty.lessThan(sculptorPropertyCriteria.getValue());
                break;
            case LE:
                condditionProperty.lessThanOrEqual(sculptorPropertyCriteria.getValue());
                break;
            case GT:
                condditionProperty.greaterThan(sculptorPropertyCriteria.getValue());
                break;
            case GE:
                condditionProperty.greaterThanOrEqual(sculptorPropertyCriteria.getValue());
                break;
            default:
                throw new ApplicationException(CommonExceptionCodeEnum.PARAMETER_INCORRECT.getName(), "CRITERIA");
        }        
    }

    private void checkPropertyOrder(Stat4YouCriteriaOrder order) throws ApplicationException {
        try {
            Enum.valueOf(propertyOrderEnumClass, order.getPropertyName());
        } catch (Exception e) {
            throw new ApplicationException(CommonExceptionCodeEnum.PARAMETER_INCORRECT.getName(), order.getPropertyName());
        }
    }

    private void checkPropertyRestriction(Stat4YouCriteriaPropertyRestriction propertyRestriction) throws ApplicationException {
        try {
            Enum.valueOf(propertyRestrictionEnumClass, propertyRestriction.getPropertyName());
        } catch (Exception e) {
            throw new ApplicationException(CommonExceptionCodeEnum.PARAMETER_INCORRECT.getName(), propertyRestriction.getPropertyName());
        }
    }

    public static interface CriteriaCallback {

        public SculptorPropertyCriteria retrieveProperty(Stat4YouCriteriaPropertyRestriction propertyRestriction) throws ApplicationException;
        public Property retrievePropertyOrder(Stat4YouCriteriaOrder order) throws ApplicationException;
        public Property retrievePropertyOrderDefault() throws ApplicationException;
    }
}
