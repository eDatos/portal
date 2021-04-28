package org.siemac.metamac.portal.rest.external.filter.v1_0.service;

import org.apache.cxf.jaxrs.client.WebClient;
import org.codehaus.jackson.map.ObjectMapper;
import org.siemac.metamac.portal.rest.external.permalink.v1_0.mapper.PermalinksDo2RestMapperV10;
import org.siemac.metamac.portal.rest.external.permalink.v1_0.mapper.PermalinksRest2DoMapperV10;
import org.siemac.metamac.portal.rest.external.service.PortalRestExternalCommonService;
import org.siemac.metamac.rest.permalinks.v1_0.domain.Permalink;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.io.Serializable;
import java.time.Instant;

import static org.siemac.metamac.portal.rest.external.service.utils.PortalRestExternalUtils.manageException;

@Service("filterRestExternalFacadeV10")
public class FilterRestExternalFacadeV10Impl implements FiltersV1_0 {

    @Autowired
    private PortalRestExternalCommonService commonService;

    @Autowired
    private PermalinksDo2RestMapperV10 permalinksDo2RestMapper;

    @Autowired
    private PermalinksRest2DoMapperV10 permalinksRest2DoMapperV10;

    @Override
    public Response saveFilter(Permalink permalink) throws IOException {
        try {
            org.siemac.metamac.portal.core.domain.Permalink permalinkEntity = permalinksRest2DoMapperV10.toPermalink(permalink);
            permalinkEntity = commonService.createPermalink(permalinkEntity);

            WebClient client = WebClient.create("http://localhost:8083/api/filtersPublic").type(MediaType.APPLICATION_JSON);
            Filter filter = new Filter(
                    null,
                    "Mi primer filtro",
                    "Mi primer filtro",
                    null, permalinksDo2RestMapper.toPermalink(permalinkEntity).getSelfLink().getHref(),
                    null,
                    "");
            client.post(new ObjectMapper().writer().withDefaultPrettyPrinter().writeValueAsString(filter));
            return client.getResponse().getStatus() >= 200 && client.getResponse().getStatus() <= 300 ? Response.ok(filter).build() : client.getResponse();
        } catch (Exception e) {
            throw manageException(e);
        }
    }

    static class Filter implements Serializable {

        private static final long serialVersionUID = 1L;

        public Long id;
        public String name;
        public String resourceName;
        public Object externalUser;
        public String permalink;
        public Instant lastAccessDate;
        public String notes;

        public Filter(Long id, String name, String resourceName, Object externalUser, String permalink, Instant lastAccessDate, String notes) {
            this.id = id;
            this.name = name;
            this.resourceName = resourceName;
            this.externalUser = externalUser;
            this.permalink = permalink;
            this.lastAccessDate = lastAccessDate;
            this.notes = notes;
        }
    }
}
