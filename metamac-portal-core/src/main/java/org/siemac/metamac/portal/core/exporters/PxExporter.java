package org.siemac.metamac.portal.core.exporters;

import static org.siemac.metamac.portal.core.constants.PortalConstants.COMMA;
import static org.siemac.metamac.portal.core.constants.PortalConstants.EQUALS;
import static org.siemac.metamac.portal.core.constants.PortalConstants.LEFT_BRACE;
import static org.siemac.metamac.portal.core.constants.PortalConstants.LEFT_PARENTHESES;
import static org.siemac.metamac.portal.core.constants.PortalConstants.NEW_LINE;
import static org.siemac.metamac.portal.core.constants.PortalConstants.QUOTE;
import static org.siemac.metamac.portal.core.constants.PortalConstants.RIGHT_BRACE;
import static org.siemac.metamac.portal.core.constants.PortalConstants.RIGHT_PARENTHESES;
import static org.siemac.metamac.portal.core.constants.PortalConstants.SEMICOLON;
import static org.siemac.metamac.portal.core.constants.PortalConstants.SPACE;

import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Stack;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.joda.time.DateTime;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.portal.core.domain.DatasetAccessForPx;
import org.siemac.metamac.portal.core.error.ServiceExceptionType;
import org.siemac.metamac.portal.core.exporters.px.PxKeysEnum;
import org.siemac.metamac.portal.core.exporters.px.PxLineContainer;
import org.siemac.metamac.portal.core.exporters.px.PxLineContainerBuilder;
import org.siemac.metamac.portal.core.utils.PortalUtils;
import org.siemac.metamac.rest.common.v1_0.domain.InternationalString;
import org.siemac.metamac.rest.common.v1_0.domain.LocalisedString;
import org.siemac.metamac.rest.common.v1_0.domain.Resource;
import org.siemac.metamac.rest.common.v1_0.domain.ResourceLink;
import org.siemac.metamac.rest.common.v1_0.domain.Resources;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Attribute;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.AttributeAttachmentLevelType;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.AttributeValues;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DataStructureDefinition;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dimension;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DimensionValues;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.EnumeratedAttributeValue;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.EnumeratedAttributeValues;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.EnumeratedDimensionValue;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.EnumeratedDimensionValues;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.MeasureQuantity;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.NextVersionType;

public class PxExporter {

    private final DatasetAccessForPx datasetAccess;
    private final String             ATTRIBUTE_LINE_SEPARATOR = "#";
    private Set<String>              languages                = null;
    private Map<String, Integer>     languageOrder            = null;

    public PxExporter(Dataset dataset, String lang, String langAlternative) throws MetamacException {
        this.datasetAccess = new DatasetAccessForPx(dataset, lang, langAlternative);
    }

    public void write(OutputStream os) throws MetamacException {
        PrintWriter printWriter = null;
        try {
            /**
             * PX-Axis documentation says:
             * "If the keyword CHARSET is missing it means that all texts are in DOS text format, so that the same files can be used both in the DOS
             * and the Windows version of PC-AXIS. In the Windows version the texts are translated into Windows format when read. When a file is
             * saved in PC-AXIS file format it is always saved in DOS text format in versions prior to 2000.
             * Starting with version 2000 the files can be either in DOS or Windows texts. If they are in Windows texts this information is added: CHARSET="ANSI";".
             */
            printWriter = new PrintWriter(new OutputStreamWriter(os, Charset.forName("ISO-8859-1"))); // charset for ANSI
            writePx(printWriter);
        } catch (Exception e) {
            throw new MetamacException(e, ServiceExceptionType.UNKNOWN, "Error exporting to px");
        } finally {
            if (printWriter != null) {
                printWriter.flush();
            }
        }
    }

    private void writePx(PrintWriter printWriter) throws MetamacException {
        // Recommended order of the keywords
        writeCharset(printWriter);
        writeAxisVersion(printWriter);
        writeLanguage(printWriter);
        writeLanguages(printWriter);
        writeCreationDate(printWriter);
        writeNextUpdate(printWriter);
        writeUpdateFrequency(printWriter);
        writeTableId(printWriter);
        writeDecimals(printWriter);
        writeShowDecimals(printWriter);
        writeMatrix(printWriter);
        writeAggregallowed(printWriter);
        writeAutopen(printWriter);
        writeSubjectAreaAndSubjectCode(printWriter);
        writeCopyRight(printWriter);
        writeDescriptions(printWriter);
        writeContents(printWriter);
        writeUnits(printWriter);
        writeStub(printWriter);
        writeHeading(printWriter);
        writeContVariable(printWriter);
        writeValues(printWriter);
        writeCodes(printWriter);
        writeLastUpdated(printWriter);
        writeContact(printWriter);
        writeSource(printWriter);
        writeSurvey(printWriter);
        writeLink(printWriter);
        writeAttributes(printWriter);
        writePrecision(printWriter);
        writeData(printWriter);
    }

    /**
     * @param printWriter
     * @throws MetamacException
     */
    private void writeCharset(PrintWriter printWriter) throws MetamacException {
        // Always export in Windows charset compliant, then always set to ANSI
        PxLineContainer line = PxLineContainerBuilder.pxLineContainer().withPxKey(PxKeysEnum.CHARSET).withValue("ANSI").build();
        writeLine(printWriter, line);
    }

    /**
     * @param printWriter
     * @throws MetamacException
     */
    private void writeAxisVersion(PrintWriter printWriter) throws MetamacException {
        PxLineContainer line = PxLineContainerBuilder.pxLineContainer().withPxKey(PxKeysEnum.AXIS_VERSION).withValue("2000").build();
        writeLine(printWriter, line);
    }

    /**
     * @param printWriter
     * @throws MetamacException
     */
    private void writeLanguage(PrintWriter printWriter) throws MetamacException {
        PxLineContainer line = PxLineContainerBuilder.pxLineContainer().withPxKey(PxKeysEnum.LANGUAGE).withValue(datasetAccess.getLangEffective().toLowerCase()).build();
        writeLine(printWriter, line);
    }

    /**
     * @param printWriter
     * @throws MetamacException
     */
    private void writeLanguages(PrintWriter printWriter) throws MetamacException {
        Resources languages = datasetAccess.getDataset().getMetadata().getLanguages();
        if (languages.getResources().size() <= 1) {
            return; // Only default language
        }

        List<String> resourcesToResourcesId = resourcesToResourcesId(languages.getResources());
        this.languages = new HashSet<String>(resourcesToResourcesId);
        this.languageOrder = new HashMap<String, Integer>();
        int i = 1;
        String defaultLang = datasetAccess.getLangEffective();
        for (String lang : resourcesToResourcesId) {
            if (defaultLang.equals(lang)) {
                languageOrder.put(lang, 0);
            } else {
                languageOrder.put(lang, i++);
            }
        }

        PxLineContainer line = PxLineContainerBuilder.pxLineContainer().withPxKey(PxKeysEnum.LANGUAGES).withValue(resourcesToResourcesId).build();
        writeLine(printWriter, line);
    }

    private List<String> resourcesToResourcesId(List<Resource> sources) {
        if (CollectionUtils.isEmpty(sources)) {
            return null;
        }
        List<String> targets = new ArrayList<String>();
        for (Resource source : sources) {
            targets.add(source.getId().toLowerCase());
        }
        return targets;
    }

    /**
     * @param printWriter
     * @throws MetamacException
     */
    private void writeCreationDate(PrintWriter printWriter) throws MetamacException {
        PxLineContainer line = PxLineContainerBuilder.pxLineContainer().withPxKey(PxKeysEnum.CREATION_DATE).withValue(datasetAccess.getDataset().getMetadata().getCreatedDate()).build();
        writeLine(printWriter, line);
    }

    /**
     * @param printWriter
     * @throws MetamacException
     */
    private void writeNextUpdate(PrintWriter printWriter) throws MetamacException {
        PxLineContainer line = PxLineContainerBuilder.pxLineContainer().withPxKey(PxKeysEnum.NEXT_UPDATE).withValue(datasetAccess.getDataset().getMetadata().getDateNextUpdate()).build();
        writeLine(printWriter, line);
    }

    /**
     * @param printWriter
     * @throws MetamacException
     */
    private void writeUpdateFrequency(PrintWriter printWriter) throws MetamacException {
        StringBuilder value = new StringBuilder();
        NextVersionType nextVersion = datasetAccess.getDataset().getMetadata().getNextVersion();
        if (NextVersionType.SCHEDULED_UPDATE.equals(nextVersion)) {
            Resource updateFrequency = datasetAccess.getDataset().getMetadata().getUpdateFrequency();
            String label = PortalUtils.getLabel(updateFrequency.getName(), datasetAccess.getLang(), datasetAccess.getLangAlternative());
            value.append(label).append(SPACE).append(LEFT_PARENTHESES).append(updateFrequency.getId()).append(RIGHT_PARENTHESES);
        } else {
            value.append(nextVersion.name());
        }

        PxLineContainer line = PxLineContainerBuilder.pxLineContainer().withPxKey(PxKeysEnum.UPDATE_FREQUENCY).withValue(value.toString()).build();
        writeLine(printWriter, line);
    }

    /**
     * @param printWriter
     * @throws MetamacException
     */
    private void writeTableId(PrintWriter printWriter) throws MetamacException {
        PxLineContainer line = PxLineContainerBuilder.pxLineContainer().withPxKey(PxKeysEnum.TABLEID).withValue(datasetAccess.getDataset().getUrn()).build();
        writeLine(printWriter, line);
    }

    /**
     * @param printWriter
     * @throws MetamacException
     */
    private void writeDecimals(PrintWriter printWriter) throws MetamacException {
        // Filled with the same value of showdecimals
        PxLineContainer line = PxLineContainerBuilder.pxLineContainer().withPxKey(PxKeysEnum.DECIMALS).withValue(datasetAccess.getDataset().getMetadata().getRelatedDsd().getShowDecimals()).build();
        writeLine(printWriter, line);
    }

    /**
     * @param printWriter
     * @throws MetamacException
     */
    private void writeShowDecimals(PrintWriter printWriter) throws MetamacException {
        PxLineContainer line = PxLineContainerBuilder.pxLineContainer().withPxKey(PxKeysEnum.SHOWDECIMALS).withValue(datasetAccess.getDataset().getMetadata().getRelatedDsd().getShowDecimals())
                .build();
        writeLine(printWriter, line);
    }

    /**
     * @param printWriter
     * @throws MetamacException
     */
    private void writeMatrix(PrintWriter printWriter) throws MetamacException {
        PxLineContainer line = PxLineContainerBuilder.pxLineContainer().withPxKey(PxKeysEnum.MATRIX).withValue(datasetAccess.getDataset().getId()).build();
        writeLine(printWriter, line);
    }

    /**
     * @param printWriter
     * @throws MetamacException
     */
    private void writeAggregallowed(PrintWriter printWriter) throws MetamacException {
        // Always fixed to NO
        PxLineContainer line = PxLineContainerBuilder.pxLineContainer().withPxKey(PxKeysEnum.AGGREGALLOWED).withValue("NO").build();
        writeLine(printWriter, line);
    }

    /**
     * @param printWriter
     * @throws MetamacException
     */
    private void writeAutopen(PrintWriter printWriter) throws MetamacException {
        PxLineContainer line = PxLineContainerBuilder.pxLineContainer().withPxKey(PxKeysEnum.AUTOPEN).withValue(datasetAccess.getDataset().getMetadata().getRelatedDsd().getAutoOpen()).build();
        writeLine(printWriter, line);
    }

    /**
     * @param printWriter
     * @throws MetamacException
     */
    private void writeSubjectAreaAndSubjectCode(PrintWriter printWriter) throws MetamacException {
        Resources subjectAreas = datasetAccess.getDataset().getMetadata().getSubjectAreas();
        if (subjectAreas == null) {
            writeLinesForLocalisedValues(printWriter, PxKeysEnum.SUBJECT_AREA, datasetAccess.getDataset().getName());
            PxLineContainer subjectCodeLine = PxLineContainerBuilder.pxLineContainer().withPxKey(PxKeysEnum.SUBJECT_CODE).withValue(datasetAccess.getDataset().getId()).build();
            writeLine(printWriter, subjectCodeLine);
            return;
        }
        StringBuilder valueName = new StringBuilder();
        StringBuilder valueCode = new StringBuilder();
        for (Iterator<Resource> iterator = subjectAreas.getResources().iterator(); iterator.hasNext();) {
            Resource subjectArea = iterator.next();
            valueName.append(PortalUtils.getLabel(subjectArea.getName(), datasetAccess.getLang(), datasetAccess.getLangAlternative()));
            valueCode.append(subjectArea.getId());
            if (iterator.hasNext()) {
                valueName.append("; ");
                valueCode.append("; ");
            }
        }
        PxLineContainer subjectAreaLine = PxLineContainerBuilder.pxLineContainer().withPxKey(PxKeysEnum.SUBJECT_AREA).withValue(valueName.toString()).build();
        PxLineContainer subjectCodeLine = PxLineContainerBuilder.pxLineContainer().withPxKey(PxKeysEnum.SUBJECT_CODE).withValue(valueName.toString()).build();
        writeLine(printWriter, subjectAreaLine);
        writeLine(printWriter, subjectCodeLine);
    }
    /**
     * @param printWriter
     * @throws MetamacException
     */
    private void writeCopyRight(PrintWriter printWriter) throws MetamacException {
        PxLineContainer pxLineContainer = PxLineContainerBuilder.pxLineContainer().withPxKey(PxKeysEnum.COPYRIGHT).withValue(datasetAccess.getDataset().getMetadata().getCopyrightDate() != null)
                .build();
        writeLine(printWriter, pxLineContainer);
    }

    /**
     * @param printWriter
     * @throws MetamacException
     */
    private void writeDescriptions(PrintWriter printWriter) throws MetamacException {
        writeLinesForLocalisedValues(printWriter, PxKeysEnum.DESCRIPTION, datasetAccess.getDataset().getDescription() != null ? datasetAccess.getDataset().getDescription() : datasetAccess
                .getDataset().getName());

        writeLinesForLocalisedValues(printWriter, PxKeysEnum.TITLE, datasetAccess.getDataset().getDescription() != null ? datasetAccess.getDataset().getDescription() : datasetAccess.getDataset()
                .getName());

        PxLineContainer descriptionDefaultPxLineContainer = PxLineContainerBuilder.pxLineContainer().withPxKey(PxKeysEnum.DESCRIPTIONDEFAULT).withValue(Boolean.TRUE).build();

        writeLine(printWriter, descriptionDefaultPxLineContainer);
    }

    /**
     * @param printWriter
     * @throws MetamacException
     */
    private void writeContents(PrintWriter printWriter) throws MetamacException {
        // TODO Content (METAMAC-1927)
        InternationalString value = null;
        if (existsContVariable()) {
            // Exists the CONTVARIABLE in the PX
            Dimension measureDimension = datasetAccess.getMeasureDimension();
            value = measureDimension.getName(); // Concept associated to measure
        } else {
            Attribute measureAttribute = datasetAccess.getMeasureAttribute();
            if (measureAttribute != null) {
                // By Metamac Constraints, the measure attribute has dataset attachment and enumerated representation.
                String[] attributeValues = datasetAccess.getAttributeValues(measureAttribute.getId()); // Enumerated representation
                if (attributeValues == null || attributeValues.length != 1) {
                    throw new RuntimeException("No instances of measure attribute type in the dataset. This is a Metamac error.");
                }
                value = datasetAccess.getAttributeValue(measureAttribute.getId(), attributeValues[0]); // Translated enumerated representation, One value = Dataset Attachment
            } else {
                throw new RuntimeException("No attribute of type Measure or Measure Dimension found in the dataset. This is a Metamac error.");
            }
        }
        writeLinesForLocalisedValues(printWriter, PxKeysEnum.CONTENTS, value);
    }

    /**
     * @param printWriter
     * @throws MetamacException
     */
    private void writeUnits(PrintWriter printWriter) throws MetamacException {
        // Is obtained from the concept representation used in the quantity metadata of the dimension or attribute of measure type.
        Dimension measureDimension = datasetAccess.getMeasureDimension();
        InternationalString value = null;
        if (measureDimension != null) {
            DimensionValues dimensionValues = measureDimension.getDimensionValues();
            if (dimensionValues != null) {
                if (dimensionValues instanceof EnumeratedDimensionValues) {
                    EnumeratedDimensionValue enumeratedAttributeValue = ((EnumeratedDimensionValues) dimensionValues).getValues().iterator().next();
                    value = extractUnitCode(enumeratedAttributeValue.getMeasureQuantity());
                }
            }
        } else {
            Attribute measureAttribute = datasetAccess.getMeasureAttribute();
            if (measureAttribute != null) {
                // By Metamac Constraints, the measure attribute has dataset attachment and enumerated representation.
                // Quantity
                AttributeValues attributeValues = measureAttribute.getAttributeValues();
                if (attributeValues != null) {
                    if (attributeValues instanceof EnumeratedAttributeValues) {
                        EnumeratedAttributeValue enumeratedAttributeValue = ((EnumeratedAttributeValues) attributeValues).getValues().iterator().next();
                        value = extractUnitCode(enumeratedAttributeValue.getMeasureQuantity());
                    }
                }
            } else {
                throw new RuntimeException("No attribute of type Measure or Measure Dimension found in the dataset. This is a Metamac error.");
            }
        }

        writeLinesForLocalisedValues(printWriter, PxKeysEnum.UNITS, value);
    }

    private InternationalString extractUnitCode(MeasureQuantity measureQuantity) {
        if (measureQuantity.getUnitCode() != null) {
            return measureQuantity.getUnitCode().getName();
        }
        return null;
    }

    /**
     * @param printWriter
     * @throws MetamacException
     */
    private void writeStub(PrintWriter printWriter) throws MetamacException {
        DataStructureDefinition relatedDsd = datasetAccess.getDataset().getMetadata().getRelatedDsd();

        PxLineContainer pxLineContainer = PxLineContainerBuilder.pxLineContainer().withPxKey(PxKeysEnum.STUB).withValue(relatedDsd.getStub().getDimensionIds()).build();
        writeLine(printWriter, pxLineContainer);
    }

    /**
     * @param printWriter
     * @throws MetamacException
     */
    private void writeHeading(PrintWriter printWriter) throws MetamacException {
        DataStructureDefinition relatedDsd = datasetAccess.getDataset().getMetadata().getRelatedDsd();

        PxLineContainer pxLineContainer = PxLineContainerBuilder.pxLineContainer().withPxKey(PxKeysEnum.HEADING).withValue(relatedDsd.getHeading().getDimensionIds()).build();
        writeLine(printWriter, pxLineContainer);
    }

    /**
     * @param printWriter
     */
    private void writeContVariable(PrintWriter printWriter) {
        // TODO METAMAC-1927

    }

    /**
     * @param printWriter
     * @throws MetamacException
     */
    private void writeValues(PrintWriter printWriter) throws MetamacException {
        // For dimensions with enumerated representation, the values are the labels of each code
        // For dimensions with non enumerated representation, the values are the text
        for (String dimensionId : datasetAccess.getDimensionsOrderedForData()) {
            List<String> dimensionValuesId = datasetAccess.getDimensionValuesOrderedForData(dimensionId);
            List<String> dimensionValuesLabels = new ArrayList<String>(dimensionValuesId.size());
            for (String dimensionValueId : dimensionValuesId) {
                dimensionValuesLabels.add(datasetAccess.getDimensionValueLabelCurrentLocale(dimensionId, dimensionValueId));
            }
            PxLineContainer pxLineContainer = PxLineContainerBuilder.pxLineContainer().withPxKey(PxKeysEnum.VALUES).withIndexedValue(Arrays.asList(dimensionId)).withValue(dimensionValuesLabels)
                    .build();
            writeLine(printWriter, pxLineContainer);
        }
    }

    /**
     * @param printWriter
     * @throws MetamacException
     */
    private void writeCodes(PrintWriter printWriter) throws MetamacException {
        for (String dimensionId : datasetAccess.getDimensionsOrderedForData()) {
            // If is a dimension with non enumerated representation, skip the codes
            if (!PortalUtils.isDimensionWithEnumeratedRepresentation(datasetAccess.getDimensionsMetadataMap().get(dimensionId))) {
                continue;
            }
            PxLineContainer pxLineContainer = PxLineContainerBuilder.pxLineContainer().withPxKey(PxKeysEnum.CODES).withIndexedValue(Arrays.asList(dimensionId))
                    .withValue(datasetAccess.getDimensionValuesOrderedForData(dimensionId)).build();
            writeLine(printWriter, pxLineContainer);
        }
    }

    /**
     * @param printWriter
     * @throws MetamacException
     */
    private void writeLastUpdated(PrintWriter printWriter) throws MetamacException {
        PxLineContainer pxLineContainer = PxLineContainerBuilder.pxLineContainer().withPxKey(PxKeysEnum.LAST_UPDATED).withValue(datasetAccess.getDataset().getMetadata().getLastUpdate()).build();
        writeLine(printWriter, pxLineContainer);
    }

    /**
     * @param printWriter
     * @throws MetamacException
     */
    private void writeContact(PrintWriter printWriter) throws MetamacException {
        Resources publishers = datasetAccess.getDataset().getMetadata().getPublishers();
        StringBuilder valueName = new StringBuilder();
        for (Iterator<Resource> iterator = publishers.getResources().iterator(); iterator.hasNext();) {
            Resource publisher = iterator.next();
            valueName.append(PortalUtils.getLabel(publisher.getName(), datasetAccess.getLang(), datasetAccess.getLangAlternative()));
            if (iterator.hasNext()) {
                valueName.append(". ");
            }
        }

        PxLineContainer pxLineContainer = PxLineContainerBuilder.pxLineContainer().withPxKey(PxKeysEnum.CONTACT).withValue(valueName.toString()).build();
        writeLine(printWriter, pxLineContainer);
    }

    /**
     * @param printWriter
     * @throws MetamacException
     */
    private void writeSource(PrintWriter printWriter) throws MetamacException {
        writeFieldResourceName(printWriter, PxKeysEnum.SOURCE, datasetAccess.getDataset().getMetadata().getMaintainer());
    }

    /**
     * @param printWriter
     * @throws MetamacException
     */
    private void writeSurvey(PrintWriter printWriter) throws MetamacException {
        // Value = TITLE statistical operation (CODE statistical operation)
        InternationalString statisticalOperationName = datasetAccess.getDataset().getMetadata().getStatisticalOperation().getName();
        String statisticalOperationCode = extractStatisticalOperationCodeFromLink(datasetAccess.getDataset().getMetadata().getStatisticalOperation().getSelfLink());

        String defaultLang = datasetAccess.getLangEffective();
        for (LocalisedString localisedString : statisticalOperationName.getTexts()) {
            if (filterLanguagesToApply(localisedString)) {
                String lang = localisedString.getLang();
                StringBuilder valueBuilder = new StringBuilder(localisedString.getValue());
                if (defaultLang.equals(lang)) {
                    if (!StringUtils.isEmpty(statisticalOperationCode)) {
                        valueBuilder.append(SPACE).append(LEFT_PARENTHESES).append(statisticalOperationCode).append(RIGHT_PARENTHESES);
                    }
                    PxLineContainer line = PxLineContainerBuilder.pxLineContainer().withPxKey(PxKeysEnum.SURVEY).withValue(valueBuilder.toString()).build();
                    writeLine(printWriter, line);
                } else {
                    PxLineContainer line = PxLineContainerBuilder.pxLineContainer().withPxKey(PxKeysEnum.SURVEY).withValue(valueBuilder.toString()).withLang(lang).build();
                    writeLine(printWriter, line);
                }
            }
        }
    }

    /**
     * @param printWriter
     * @throws MetamacException
     */
    private void writeLink(PrintWriter printWriter) throws MetamacException {
        // TODO METAMAC 1927 url del dataset en en visualizador, ¿cómo cogemos esto?
        PxLineContainer pxLineContainer = PxLineContainerBuilder.pxLineContainer().withPxKey(PxKeysEnum.LINK).withValue(null).build();
        writeLine(printWriter, pxLineContainer);
    }

    /**
     * If exist more than one attribute for a same key (example: pair dimensionId-dimensionValueId for VALUENOTE) concat values with <br/>
     * (# in PX)
     * 
     * @throws MetamacException
     */
    private void writeAttributes(PrintWriter printWriter) throws MetamacException {
        List<Attribute> attributes = datasetAccess.getAttributesMetadata();
        if (CollectionUtils.isEmpty(attributes)) {
            return;
        }
        writeAttributesNote(printWriter, attributes);
        writeAttributesValueNote(printWriter, attributes);
        // writeAttributesCellNote(printWriter, attributes); // TODO CELLNOTES
    }

    private void writePrecision(PrintWriter printWriter) throws MetamacException {
        if (existsContVariable()) {
            // TODO METAMAC-1927, por cada visualizacion
            // TODO CONTVARIABLE
        } else {
            return; // Nothing
        }
    }

    /**
     * Builds NOTE and NOTEX attributes: attributes with dataset attachment level
     * 
     * @throws MetamacException
     */
    private void writeAttributesNote(PrintWriter printWriter, List<Attribute> attributes) throws MetamacException {
        StringBuilder notex = new StringBuilder();
        StringBuilder note = new StringBuilder();
        for (Attribute attribute : attributes) {
            if (!AttributeAttachmentLevelType.DATASET.equals(attribute.getAttachmentLevel())) {
                continue;
            }
            String attributeId = attribute.getId();
            String[] attributeValues = datasetAccess.getAttributeValues(attributeId);
            if (attributeValues == null) {
                continue;
            }
            StringBuilder value = PxKeysEnum.NOTEX.getKeyword().equals(attributeId) ? notex : note;
            addAttributeValue(value, attributeValues[0]);
        }
        if (notex.length() != 0) {
            PxLineContainer pxLineContainer = PxLineContainerBuilder.pxLineContainer().withPxKey(PxKeysEnum.NOTEX).withValue(notex.toString()).build();
            writeLine(printWriter, pxLineContainer);
        }
        if (note.length() != 0) {
            PxLineContainer pxLineContainer = PxLineContainerBuilder.pxLineContainer().withPxKey(PxKeysEnum.NOTE).withValue(note.toString()).build();
            writeLine(printWriter, pxLineContainer);
        }
    }

    /**
     * Builds VALUENOTE and VALUENOTEX attributes: attributes with dimension attachment level but only one dimension
     * 
     * @throws MetamacException
     */
    private void writeAttributesValueNote(PrintWriter printWriter, List<Attribute> attributes) throws MetamacException {
        // Attribute values indexed by dimensionId and dimensionValueId
        Map<String, Map<String, StringBuilder>> valueNotex = new HashMap<String, Map<String, StringBuilder>>();
        Map<String, Map<String, StringBuilder>> valueNote = new HashMap<String, Map<String, StringBuilder>>();

        // Builds attribute values
        for (Attribute attribute : attributes) {
            if (!AttributeAttachmentLevelType.DIMENSION.equals(attribute.getAttachmentLevel()) || attribute.getDimensions().getDimensions().size() != 1) {
                continue;
            }
            String attributeId = attribute.getId();
            String[] attributeValues = datasetAccess.getAttributeValues(attributeId);
            if (attributeValues == null) {
                continue;
            }
            String dimensionId = attribute.getDimensions().getDimensions().get(0).getDimensionId();
            Map<String, Map<String, StringBuilder>> attributeValuesByDimensionId = PxKeysEnum.VALUENOTEX.equals(attributeId) ? valueNotex : valueNote;
            if (!attributeValuesByDimensionId.containsKey(dimensionId)) {
                attributeValuesByDimensionId.put(dimensionId, new HashMap<String, StringBuilder>());
            }
            List<String> dimensionValuesId = datasetAccess.getDimensionValuesOrderedForData(dimensionId);
            Map<String, StringBuilder> attributeValuesByDimensionValueId = attributeValuesByDimensionId.get(dimensionId);
            for (int i = 0; i < dimensionValuesId.size(); i++) {
                String dimensionValueId = dimensionValuesId.get(i);
                String attributeValue = attributeValues[i];
                if (StringUtils.isEmpty(attributeValue)) {
                    continue;
                }
                if (!attributeValuesByDimensionValueId.containsKey(dimensionValueId)) {
                    attributeValuesByDimensionValueId.put(dimensionValueId, new StringBuilder());
                }
                StringBuilder value = attributeValuesByDimensionValueId.get(dimensionValueId);
                addAttributeValue(value, attributeValue);
            }
        }

        // Print in stream
        writeAttributeValueNoteField(printWriter, PxKeysEnum.VALUENOTEX, valueNotex);
        writeAttributeValueNoteField(printWriter, PxKeysEnum.VALUENOTE, valueNote);
    }

    private void writeAttributeValueNoteField(PrintWriter printWriter, PxKeysEnum pxKey, Map<String, Map<String, StringBuilder>> valueNote) throws MetamacException {
        for (String dimensionId : datasetAccess.getDimensionsOrderedForData()) {
            if (valueNote.containsKey(dimensionId)) {
                List<String> dimensionValuesId = datasetAccess.getDimensionValuesOrderedForData(dimensionId);
                for (String dimensionValueId : dimensionValuesId) {
                    if (valueNote.get(dimensionId).containsKey(dimensionValueId)) {
                        String dimensionValueLabel = datasetAccess.getDimensionValueLabelCurrentLocale(dimensionId, dimensionValueId);

                        PxLineContainer pxLineContainer = PxLineContainerBuilder.pxLineContainer().withPxKey(pxKey).withValue(valueNote.get(dimensionId).get(dimensionValueId).toString())
                                .withIndexedValue(Arrays.asList(dimensionId, dimensionValueLabel)).build();
                        writeLine(printWriter, pxLineContainer);
                    }
                }
            }
        }
    }

    /**
     * Builds CELLNOTE and CELLNOTEX attributes: attributes with observation attachment level or dimension attachment level but more than one dimension
     * 
     * @throws MetamacException
     */
    private void writeAttributesCellNote(PrintWriter printWriter, List<Attribute> attributes) throws MetamacException {

        // Attribute values indexed by all dimension values of attribute. Dimensions ordered: First stub and then heading
        Map<String, StringBuilder> cellNotex = new HashMap<String, StringBuilder>();
        Map<String, StringBuilder> cellNote = new HashMap<String, StringBuilder>();
        List<String> allDimensionsDatasetOrderedForPx = getPxDimensionsDatasetOrdered();

        // Builds attribute values
        for (Attribute attribute : attributes) {
            if (!AttributeAttachmentLevelType.PRIMARY_MEASURE.equals(attribute.getAttachmentLevel())
                    && !(AttributeAttachmentLevelType.DIMENSION.equals(attribute.getAttachmentLevel()) && attribute.getDimensions().getDimensions().size() > 1)) {
                continue;
            }
            String attributeId = attribute.getId();
            String[] attributeValues = datasetAccess.getAttributeValues(attributeId);
            if (attributeValues == null) {
                continue;
            }

            Map<String, StringBuilder> cellNoteToAttribute = PxKeysEnum.CELLNOTEX.equals(attributeId) ? cellNotex : cellNote;
            List<String> dimensionsAttributeOrderedForData = datasetAccess.getDimensionsAttributeOrderedForData(attribute);
            writeAttributeCellNote(attributeId, attributeValues, dimensionsAttributeOrderedForData, allDimensionsDatasetOrderedForPx, cellNoteToAttribute);
        }

        // Print in stream
        writeAttributeCellNoteField(printWriter, PxKeysEnum.CELLNOTEX, cellNotex);
        writeAttributeCellNoteField(printWriter, PxKeysEnum.CELLNOTE, cellNote);
    }

    private void writeAttributeCellNote(String attributeId, String[] attributeValues, List<String> dimensionsAttributeOrderedForData, List<String> dimensionsDatasetOrderedForPx,
            Map<String, StringBuilder> cellNote) {

        Stack<DataOrderingStackElement> stack = new Stack<DataOrderingStackElement>();
        stack.push(new DataOrderingStackElement(null, -1, null));
        Map<String, String> dimensionValuesForAttributeValue = new HashMap<String, String>(dimensionsAttributeOrderedForData.size());

        int dimensionLastPosition = dimensionsAttributeOrderedForData.size() - 1;
        int attributeValueIndex = 0;
        while (stack.size() > 0) {
            DataOrderingStackElement elem = stack.pop();
            int dimensionPosition = elem.getDimensionPosition();
            String dimensionCodeId = elem.getDimensionCodeId();

            if (dimensionPosition != -1) {
                String dimensionId = elem.getDimensionId();
                dimensionValuesForAttributeValue.put(dimensionId, dimensionCodeId);
            }

            if (dimensionPosition == dimensionLastPosition) {
                // We have all dimensions here
                String attributeValue = attributeValues[attributeValueIndex++];
                if (!StringUtils.isEmpty(attributeValue)) {
                    StringBuilder key = new StringBuilder();
                    key.append(QUOTE);
                    for (Iterator<String> iterator = dimensionsDatasetOrderedForPx.iterator(); iterator.hasNext();) {
                        String dimensionId = iterator.next();
                        if (dimensionValuesForAttributeValue.containsKey(dimensionId)) {
                            String dimensionValueId = dimensionValuesForAttributeValue.get(dimensionId);
                            key.append(datasetAccess.getDimensionValueLabelCurrentLocale(dimensionId, dimensionValueId));
                        } else {
                            key.append("*");
                        }
                        if (iterator.hasNext()) {
                            key.append(QUOTE + COMMA + QUOTE);
                        }
                    }
                    key.append(QUOTE);
                    String keyString = key.toString();
                    StringBuilder value = cellNote.get(keyString);
                    if (value == null) {
                        value = new StringBuilder();
                        cellNote.put(keyString, value);
                    }
                    addAttributeValue(value, attributeValue);
                }
            } else {
                String dimensionId = dimensionsAttributeOrderedForData.get(dimensionPosition + 1);
                List<String> dimensionValues = datasetAccess.getDimensionValuesOrderedForData(dimensionId);
                for (int i = dimensionValues.size() - 1; i >= 0; i--) {
                    DataOrderingStackElement temp = new DataOrderingStackElement(dimensionId, dimensionPosition + 1, dimensionValues.get(i));
                    stack.push(temp);
                }
            }
        }
    }

    private void writeAttributeCellNoteField(PrintWriter printWriter, PxKeysEnum pxKey, Map<String, StringBuilder> cellNote) throws MetamacException {
        if (cellNote.size() == 0) {
            return;
        }
        // Get keys ordered to obtain same result to same dataset
        List<String> keys = new ArrayList<String>(cellNote.keySet());
        Collections.sort(keys);

        for (String key : keys) {
            PxLineContainer pxLineContainer = PxLineContainerBuilder.pxLineContainer().withPxKey(pxKey).withValue(cellNote.get(key).toString()).withIndexedValue(Arrays.asList(key)).build();
            writeLine(printWriter, pxLineContainer);
        }
    }

    private void writeData(PrintWriter printWriter) {
        printWriter.println(PxKeysEnum.DATA.getKeyword() + EQUALS);
        String[] observations = PortalUtils.dataToDataArray(datasetAccess.getDataset().getData().getObservations());
        for (int i = 0; i < observations.length; i++) {
            String observation = observations[i];
            if (i == 0) {
                writeObservation(printWriter, StringUtils.EMPTY, observation);
            } else {
                writeObservation(printWriter, SPACE, observation);
            }
        }
        printWriter.print(SEMICOLON + SPACE);
    }

    private void writeObservation(PrintWriter printWriter, String character, String observation) {
        if (!StringUtils.isBlank(observation)) {
            printWriter.print(character + observation);
        } else {
            printWriter.print(character + QUOTE + "." + QUOTE);
        }
    }

    private void writeLinesForLocalisedValues(PrintWriter printWriter, PxKeysEnum pxKey, InternationalString value) throws MetamacException {
        if (value == null) {
            return;
        }

        String defaultLang = datasetAccess.getLangEffective();

        // First, default lang
        List<PxLineContainer> lines = new ArrayList<PxLineContainer>((this.languages.size() > 0) ? this.languages.size() : 10);
        for (LocalisedString localisedString : value.getTexts()) {
            if (filterLanguagesToApply(localisedString)) {
                String lang = localisedString.getLang();
                if (defaultLang.equals(lang)) {
                    PxLineContainer line = PxLineContainerBuilder.pxLineContainer().withPxKey(pxKey).withValue(localisedString.getValue()).build();
                    lines.set(0, line);
                } else {
                    PxLineContainer line = PxLineContainerBuilder.pxLineContainer().withPxKey(pxKey).withValue(localisedString.getValue()).withLang(lang).build();
                    lines.set(languageOrder.get(lang), line);
                }
            }
        }

        for (PxLineContainer line : lines) {
            writeLine(printWriter, line);
        }

    }
    /**
     * Write one line, language dependent or not
     * 
     * @param printWriter
     * @param pxLineContainer
     * @throws MetamacException
     */
    @SuppressWarnings({"unchecked", "rawtypes"})
    private void writeLine(PrintWriter printWriter, PxLineContainer pxLineContainer) throws MetamacException {
        // General constraints
        checkIfKeywordIsMandatory(pxLineContainer);

        if (pxLineContainer.getValue() == null) {
            return;
        }
        StringBuilder line = new StringBuilder();

        // Left side
        line.append(pxLineContainer.getPxKey().getKeyword());
        if (pxLineContainer.getIndexedValue() != null && pxLineContainer.getIndexedValue().size() > 0) {
            line.append(LEFT_PARENTHESES).append(listToValue(pxLineContainer.getIndexedValue())).append(RIGHT_PARENTHESES);
        }

        if (pxLineContainer.getPxKey().isLanguageDependent() && pxLineContainer.getLang() != null) {
            line.append(LEFT_BRACE).append(QUOTE).append(pxLineContainer.getLang()).append(QUOTE).append(RIGHT_BRACE);
        }

        line.append(EQUALS);

        // Right side
        if (pxLineContainer.getValue() instanceof String) {
            line.append(QUOTE).append(formatValue((String) pxLineContainer.getValue())).append(QUOTE);
        } else if (pxLineContainer.getValue() instanceof Integer) {
            line.append(String.valueOf(pxLineContainer.getValue()));
        } else if (pxLineContainer.getValue() instanceof Boolean) {
            line.append((Boolean) pxLineContainer.getValue() ? "YES" : "NO");
        } else if (pxLineContainer.getValue() instanceof Date) {
            line.append(QUOTE).append(new DateTime(pxLineContainer.getValue()).toString("yyyyMMdd HH:mm")).append(QUOTE);
        } else if (pxLineContainer.getValue() instanceof List) { // List<String>
            line.append(listToValueRight((List) pxLineContainer.getValue(), line.length(), 1));
        } else {
            throw new IllegalArgumentException("Type unsupported: " + pxLineContainer.getValue().getClass().getCanonicalName());
        }

        line.append(SEMICOLON);

        printWriter.println(line);
    }

    private String formatValue(String value) {
        if (value == null) {
            return null;
        }
        return value.replace("\"", "'");
    }

    private void checkIfKeywordIsMandatory(PxLineContainer pxLineContainer) throws MetamacException {
        if (pxLineContainer.getPxKey().isMandatory() && pxLineContainer.getValue() == null) {
            throw new RuntimeException("No value for mandatory PC-Axis keyword");
        }
    }

    private boolean filterLanguagesToApply(LocalisedString localisedString) {
        // Checks if the locale is not the default and the PX is a language we support
        // (!datasetAccess.getLangEffective().equals(localisedString.getLang())) &&
        return this.languages.contains(localisedString.getLang());
    }

    private void writeFieldResourceName(PrintWriter printWriter, PxKeysEnum pxKey, Resource value) throws MetamacException {
        if (value == null) {
            return;
        }
        writeLinesForLocalisedValues(printWriter, pxKey, value.getName());
    }

    private String listToValue(List<String> sources) {
        return listToValueRight(sources, -1, -1);
    }

    /**
     * Lines of MAX 256 characters
     * 
     * @param sources
     * @return
     */
    private String listToValueRight(List<String> sources, int initialOffset, int lastOffset) {
        StringBuilder target = new StringBuilder(1024);
        int currentLineCharactersLength = initialOffset;
        boolean multilineAvalaible = initialOffset != -1;
        for (Iterator<String> iterator = sources.iterator(); iterator.hasNext();) {
            String source = iterator.next();
            StringBuilder valueBuilder = new StringBuilder(256);
            valueBuilder.append(QUOTE);
            valueBuilder.append(formatValue(source));
            valueBuilder.append(QUOTE);
            if (iterator.hasNext()) {
                valueBuilder.append(COMMA);
            }

            if (multilineAvalaible && (currentLineCharactersLength + valueBuilder.length() + lastOffset > 256)) {
                target.append(NEW_LINE);
                currentLineCharactersLength = valueBuilder.length();
            } else {
                currentLineCharactersLength += valueBuilder.length();
            }
            target.append(valueBuilder);
        }
        return target.toString();
    }

    private List<String> getPxDimensionsDatasetOrdered() {
        List<String> dimensionsOrderedToAttributes = new ArrayList<String>();
        dimensionsOrderedToAttributes.addAll(datasetAccess.getDataset().getMetadata().getRelatedDsd().getStub().getDimensionIds());
        dimensionsOrderedToAttributes.addAll(datasetAccess.getDataset().getMetadata().getRelatedDsd().getHeading().getDimensionIds());
        return dimensionsOrderedToAttributes;
    }

    private void addAttributeValue(StringBuilder attributeGlobalValue, String attributeValue) {
        if (attributeGlobalValue.length() != 0) {
            attributeGlobalValue.append(ATTRIBUTE_LINE_SEPARATOR);
        }
        attributeValue = formatValue(attributeValue);
        attributeGlobalValue.append(attributeValue);
    }

    private String extractStatisticalOperationCodeFromLink(ResourceLink selfLink) {
        if (selfLink != null && !StringUtils.isEmpty(selfLink.getHref())) {
            String[] splitted = selfLink.getHref().split("/");
            if (splitted.length > 0) {
                return splitted[splitted.length - 1];
            }
        }
        return null;
    }

    private boolean existsContVariable() {
        Dimension measureDimension = datasetAccess.getMeasureDimension();
        if (measureDimension != null) {
            return true;
        } else {
            return false;
        }
    }
}