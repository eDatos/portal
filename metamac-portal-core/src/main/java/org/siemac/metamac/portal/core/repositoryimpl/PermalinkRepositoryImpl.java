package org.siemac.metamac.portal.core.repositoryimpl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.siemac.metamac.portal.core.domain.Permalink;
import org.springframework.stereotype.Repository;

/**
 * Repository implementation for Permalink
 */
@Repository("permalinkRepository")
public class PermalinkRepositoryImpl extends PermalinkRepositoryBase {

    public PermalinkRepositoryImpl() {
    }

    @Override
    public Permalink findByCode(String code) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("code", code);
        List<Permalink> result = findByQuery("from Permalink where code = :code", parameters, 1);
        if (result == null || result.isEmpty()) {
            return null;
        } else {
            return result.get(0);
        }

    }
}
