package org.siemac.metamac.portal.rest.external.permalink.v1_0.service;

import static org.siemac.metamac.portal.rest.external.service.utils.PortalRestExternalUtils.manageException;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.siemac.metamac.portal.rest.external.permalink.v1_0.mapper.PermalinksDo2RestMapperV10;
import org.siemac.metamac.portal.rest.external.service.PortalRestExternalCommonService;
import org.siemac.metamac.rest.permalinks.v1_0.domain.Permalink;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("permalinksRestExternalFacadeV10")
public class PermalinksRestExternalFacadeV10Impl implements PermalinksV1_0 {

    @Autowired
    private PortalRestExternalCommonService commonService;

    @Autowired
    private PermalinksDo2RestMapperV10      permalinksDo2RestMapper;

    @Override
    public Permalink retrievePermalinkByIdXml(String id) {
        try {
            org.siemac.metamac.portal.core.domain.Permalink permalinkEntity = commonService.retrievePermalink(id);
            Permalink permalink = permalinksDo2RestMapper.toPermalink(permalinkEntity);
            return permalink;
        } catch (Exception e) {
            throw manageException(e);
        }
    }

    @Override
    public Response retrievePermalinkByIdJson(String id) {
        try {
            org.siemac.metamac.portal.core.domain.Permalink permalinkEntity = commonService.retrievePermalink(id);
            return Response.status(Status.OK).type(MediaType.APPLICATION_JSON).entity(permalinkEntity.getContent()).build();
        } catch (Exception e) {
            throw manageException(e);
        }
    }
}