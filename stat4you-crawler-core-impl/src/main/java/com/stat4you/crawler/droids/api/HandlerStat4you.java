package com.stat4you.crawler.droids.api;

import java.io.IOException;

import org.apache.droids.api.ContentEntity;
import org.apache.droids.api.Link;
import org.apache.droids.exception.DroidsException;

public interface HandlerStat4you {

    void handle(Link baseLink, ContentEntity entity) throws IOException, DroidsException;
}
