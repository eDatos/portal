package com.stat4you.rest.dataset;

import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;

public class RestBaseService {

    protected ServiceContext getServiceContext() {
        ServiceContext ctx = new ServiceContext("user", null, null, null); // TODO ADD SECURITY
        return ctx;
    }

}
