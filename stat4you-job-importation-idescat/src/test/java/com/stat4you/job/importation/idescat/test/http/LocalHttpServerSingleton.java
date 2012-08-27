package com.stat4you.job.importation.idescat.test.http;

import org.apache.http.localserver.LocalTestServer;

public class LocalHttpServerSingleton {

    private static LocalHttpServerSingleton INSTANCE        = new LocalHttpServerSingleton();
    private LocalTestServer                 localHttpServer = null;

    private LocalHttpServerSingleton() {
        localHttpServer = new LocalTestServer(null, null);
    }

    public static LocalTestServer getLocalHttpServer() {
        if (INSTANCE.localHttpServer == null) {
            INSTANCE.localHttpServer = new LocalTestServer(null, null);
        }
        return INSTANCE.localHttpServer;
    }

    public static void clearLocalHttpServer() {
        INSTANCE.localHttpServer = null;
    }
}
