package com.stat4you.crawler.droids.protocol.http;

import org.apache.droids.protocol.http.DroidsHttpClient;
import org.apache.http.params.HttpParams;

public class PxDroidsHttpClient extends DroidsHttpClient {

    public PxDroidsHttpClient() {
        super();
    }

    public PxDroidsHttpClient(HttpParams params) {
        super(params);
    }

    @Override
    protected HttpParams createHttpParams() {
        HttpParams httpParams = super.createHttpParams();

        // Overwrite resources length
        httpParams.setLongParameter(MAX_BODY_LENGTH, 10485760l); // 100 MB = 104857600l, 10 MB = 10485760, 500k = 512000

        return httpParams;
    }
}
