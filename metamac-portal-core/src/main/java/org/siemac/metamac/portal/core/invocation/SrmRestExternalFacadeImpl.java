package org.siemac.metamac.portal.core.invocation;

import org.apache.cxf.jaxrs.client.WebClient;
import org.siemac.metamac.core.common.util.shared.UrnUtils;
import org.siemac.metamac.rest.exception.RestException;
import org.siemac.metamac.rest.exception.utils.RestExceptionUtils;
import org.siemac.metamac.rest.structural_resources.v1_0.domain.Agency;
import org.siemac.metamac.rest.structural_resources.v1_0.domain.Codelist;
import org.siemac.metamac.rest.structural_resources.v1_0.domain.Codes;
import org.siemac.metamac.rest.structural_resources.v1_0.domain.Concept;
import org.siemac.metamac.rest.structural_resources.v1_0.domain.Concepts;
import org.siemac.metamac.rest.structural_resources.v1_0.domain.DataStructure;
import org.siemac.metamac.rest.structural_resources.v1_0.domain.VariableElementsGeoInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Component("srmRestExternalFacade")
public class SrmRestExternalFacadeImpl implements SrmRestExternalFacade {

    private final Logger       logger = LoggerFactory.getLogger(SrmRestExternalFacadeImpl.class);

    @Autowired
    @Qualifier("metamacApisLocatorRestExternal")
    private MetamacApisLocator restApiLocator;

    @Override
    public DataStructure retrieveDataStructureByUrn(String urn) {
        try {
            String[] urnSplited = UrnUtils.splitUrnStructure(urn);
            String agencyID = urnSplited[0];
            String resourceID = urnSplited[1];
            String version = urnSplited[2];
            return restApiLocator.getSrmRestExternalFacadeV10().retrieveDataStructure(agencyID, resourceID, version);
        } catch (Exception e) {
            throw toRestException(e);
        }
    }

    @Override
    public Codelist retrieveCodelistByUrn(String urn) {
        try {
            String[] urnSplited = UrnUtils.splitUrnItemScheme(urn);
            String agencyID = urnSplited[0];
            String resourceID = urnSplited[1];
            String version = urnSplited[2];
            return restApiLocator.getSrmRestExternalFacadeV10().retrieveCodelist(agencyID, resourceID, version);
        } catch (Exception e) {
            throw toRestException(e);
        }
    }

    @Override
    public Codes retrieveCodesByCodelistUrn(String urn, String order, String openness) {
        try {
            String[] urnSplited = UrnUtils.splitUrnItemScheme(urn);
            String agencyID = urnSplited[0];
            String resourceID = urnSplited[1];
            String version = urnSplited[2];
            String fields = null;
            return restApiLocator.getSrmRestExternalFacadeV10().findCodes(agencyID, resourceID, version, null, null, null, null, order, openness, fields);
        } catch (Exception e) {
            throw toRestException(e);
        }
    }

    @Override
    public Concepts retrieveConceptsByConceptSchemeByUrn(String urn) {
        try {
            String[] urnSplited = UrnUtils.splitUrnItemScheme(urn);
            String agencyID = urnSplited[0];
            String resourceID = urnSplited[1];
            String version = urnSplited[2];
            return restApiLocator.getSrmRestExternalFacadeV10().findConcepts(agencyID, resourceID, version, null, null, null, null);
        } catch (Exception e) {
            throw toRestException(e);
        }
    }

    @Override
    public Concept retrieveConceptByUrn(String urn) {
        try {
            String[] urnSplited = UrnUtils.splitUrnItem(urn);
            String agencyID = urnSplited[0];
            String itemSchemeID = urnSplited[1];
            String version = urnSplited[2];
            String itemId = urnSplited[3];
            return restApiLocator.getSrmRestExternalFacadeV10().retrieveConcept(agencyID, itemSchemeID, version, itemId);
        } catch (Exception e) {
            throw toRestException(e);
        }
    }

    @Override
    public VariableElementsGeoInfo findVariableElementsGeoInfo(String urn) {
        String[] urnSplited = UrnUtils.splitUrnByDots(UrnUtils.splitUrnItem(urn)[0]);
        String variableID = urnSplited[0];
        String resourceID = urnSplited[1];
        return restApiLocator.getSrmRestExternalFacadeV10().findVariableElementsGeoInfoXml(variableID, resourceID, null, null, null, null, null);
    }

    @Override
    public Agency retrieveOrganization() {
        // urn:sdmx:org.sdmx.infomodel.base.Agency=SDMX:AGENCIES(1.0).ISTAC
        String[] urnSplited = UrnUtils.splitUrnByDots(UrnUtils.removePrefix(restApiLocator.getOrganisationUrn()));
        String tripletIdentifier = urnSplited[0];
        String organisationID = urnSplited[1];

        String[] identifier = UrnUtils.splitUrnWithoutPrefixItemScheme(tripletIdentifier);
        String agencyID = identifier[0];
        String resourceID = identifier[1];
        String version = identifier[2];
        return restApiLocator.getSrmRestExternalFacadeV10().retrieveAgency(agencyID, resourceID, version, organisationID);
    }

    private RestException toRestException(Exception e) {
        logger.error("Error", e);
        return RestExceptionUtils.toRestException(e, WebClient.client(restApiLocator.getSrmRestExternalFacadeV10()));
    }

}
