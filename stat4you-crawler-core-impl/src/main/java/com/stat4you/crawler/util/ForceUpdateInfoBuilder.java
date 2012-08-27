// CHECKSTYLE:OFF
/**
 * Source code generated by Fluent Builders Generator
 * Do not modify this file
 * See generator home page at: http://code.google.com/p/fluent-builders-generator-eclipse-plugin/
 */

package com.stat4you.crawler.util;

public class ForceUpdateInfoBuilder extends ForceUpdateInfoBuilderBase<ForceUpdateInfoBuilder> {

    public static ForceUpdateInfoBuilder forceUpdateInfo() {
        return new ForceUpdateInfoBuilder();
    }

    public ForceUpdateInfoBuilder() {
        super(new ForceUpdateInfo());
    }

    public ForceUpdateInfo build() {
        return getInstance();
    }
}

class ForceUpdateInfoBuilderBase<GeneratorT extends ForceUpdateInfoBuilderBase<GeneratorT>> {

    private ForceUpdateInfo instance;

    protected ForceUpdateInfoBuilderBase(ForceUpdateInfo aInstance) {
        instance = aInstance;
    }

    protected ForceUpdateInfo getInstance() {
        return instance;
    }

    @SuppressWarnings("unchecked")
    public GeneratorT withCategory(String aValue) {
        instance.setCategory(aValue);

        return (GeneratorT) this;
    }

    @SuppressWarnings("unchecked")
    public GeneratorT withStartUrl(String aValue) {
        instance.setStartUrl(aValue);

        return (GeneratorT) this;
    }

    @SuppressWarnings("unchecked")
    public GeneratorT withRegion(String aValue) {
        instance.setRegion(aValue);

        return (GeneratorT) this;
    }

    @SuppressWarnings("unchecked")
    public GeneratorT withPeriod(String aValue) {
        instance.setPeriod(aValue);

        return (GeneratorT) this;
    }
}
