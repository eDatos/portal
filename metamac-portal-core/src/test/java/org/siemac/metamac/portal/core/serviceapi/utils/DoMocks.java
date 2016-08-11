package org.siemac.metamac.portal.core.serviceapi.utils;

import org.siemac.metamac.common.test.utils.MetamacMocks;
import org.siemac.metamac.portal.core.domain.Permalink;

public class DoMocks {

    // ------------------------------------------------------------------------------------
    // PERMALINKS
    // ------------------------------------------------------------------------------------

    public static Permalink mockPermalink() {
        Permalink target = new Permalink();
        target.setContent(MetamacMocks.mockString(1000));
        return target;
    }
}
