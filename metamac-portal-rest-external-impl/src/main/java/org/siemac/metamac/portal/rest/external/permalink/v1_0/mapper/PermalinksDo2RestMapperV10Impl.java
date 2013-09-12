package org.siemac.metamac.portal.rest.external.permalink.v1_0.mapper;

import org.siemac.metamac.rest.permalink.v1_0.domain.Permalink;
import org.springframework.stereotype.Component;

@Component
public class PermalinksDo2RestMapperV10Impl implements PermalinksDo2RestMapperV10 {

    @Override
    public Permalink toPermalink(org.siemac.metamac.portal.core.domain.Permalink source) throws Exception {
        if (source == null) {
            return null;
        }
        Permalink target = new Permalink();
        // target.setKind(StatisticalResourcesRestExternalConstants.KIND_DATASET);
        // target.setId(source.getSiemacMetadataStatisticalResource().getCode());
        // target.setUrn(source.getSiemacMetadataStatisticalResource().getUrn());
        // target.setSelfLink(toDatasetSelfLink(source));
        // target.setName(commonDo2RestMapper.toInternationalString(source.getSiemacMetadataStatisticalResource().getTitle(), selectedLanguages));
        // target.setDescription(commonDo2RestMapper.toInternationalString(source.getSiemacMetadataStatisticalResource().getDescription(), selectedLanguages));
        // target.setParentLink(toDatasetParentLink(source));
        // target.setChildLinks(toDatasetChildLinks(source));
        // target.setSelectedLanguages(commonDo2RestMapper.toLanguages(selectedLanguages));
        //
        // DsdProcessorResult dsdProcessorResult = null;
        // if (includeMetadata || includeData) {
        // dsdProcessorResult = commonDo2RestMapper.processDataStructure(source.getRelatedDsd().getUrn());
        // }
        // if (includeMetadata) {
        // target.setMetadata(toDatasetMetadata(source, dsdProcessorResult, selectedLanguages));
        // }
        // if (includeData) {
        // target.setData(commonDo2RestMapper.toData(source, dsdProcessorResult, selectedDimensions, selectedLanguages));
        // }
        return target;
    }

}