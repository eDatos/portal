package com.stat4you.crawler.droids.helper.factories;

import java.io.IOException;

import org.apache.droids.LinkTask;
import org.apache.droids.api.ContentEntity;
import org.apache.droids.exception.DroidsException;
import org.apache.droids.helper.factories.GenericFactory;

import com.stat4you.crawler.droids.api.HandlerStat4you;

public class HandlerFactoryStat4you extends GenericFactory<HandlerStat4you> {

    /**
     * Will traverse all registered handler and execute them. If we encounter a
     * problem we directly return false and leave.
     */
    public boolean handle(LinkTask linkTask, ContentEntity entity) throws DroidsException, IOException {
        for (HandlerStat4you handler : getMap().values()) {
            handler.handle(linkTask, entity);
        }
        return true;
    }

}
