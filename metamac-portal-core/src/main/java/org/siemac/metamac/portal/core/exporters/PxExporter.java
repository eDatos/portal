package org.siemac.metamac.portal.core.exporters;

import static org.siemac.metamac.portal.core.constants.PortalConstants.COMMA;
import static org.siemac.metamac.portal.core.constants.PortalConstants.EQUALS;
import static org.siemac.metamac.portal.core.constants.PortalConstants.QUOTE;
import static org.siemac.metamac.portal.core.constants.PortalConstants.SEMICOLON;
import static org.siemac.metamac.portal.core.constants.PortalConstants.SPACE;

import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Stack;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.joda.time.DateTime;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.portal.core.domain.DatasetAccessForPx;
import org.siemac.metamac.portal.core.error.ServiceExceptionType;
import org.siemac.metamac.portal.core.utils.PortalUtils;
import org.siemac.metamac.rest.common.v1_0.domain.InternationalString;
import org.siemac.metamac.rest.common.v1_0.domain.LocalisedString;
import org.siemac.metamac.rest.common.v1_0.domain.Resource;
import org.siemac.metamac.rest.common.v1_0.domain.Resources;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Attribute;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.AttributeAttachmentLevelType;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.AttributeDimension;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DataStructureDefinition;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;

public class PxExporter {

    private final DatasetAccessForPx datasetAccess;
    private final String             ATTRIBUTE_LINE_SEPARATOR = "#";

    public PxExporter(Dataset dataset, String lang, String langAlternative) throws MetamacException {
        this.datasetAccess = new DatasetAccessForPx(dataset, lang, langAlternative);
    }

    public void write(OutputStream os) throws MetamacException {
        PrintWriter printWriter = null;
        try {
            printWriter = new PrintWriter(new OutputStreamWriter(os, Charset.forName("ISO-8859-1"))); // charset ANSI
            writePx(printWriter);
        } catch (Exception e) {
            throw new MetamacException(e, ServiceExceptionType.UNKNOWN, "Error exporting to px");
        } finally {
            if (printWriter != null) {
                printWriter.flush();
            }
        }
    }

    private void writePx(PrintWriter printWriter) {
        writeField(printWriter, "CHARSET", "ANSI");
        writeField(printWriter, "AXIS-VERSION", "2000");
        writeField(printWriter, "LANGUAGE", datasetAccess.getLangEffective()); // TODO o languages?
        writeFieldResourceId(printWriter, "LANGUAGES", datasetAccess.getDataset().getMetadata().getLanguages());

        writeField(printWriter, "CREATION-DATE", datasetAccess.getDataset().getMetadata().getCreatedDate());
        writeField(printWriter, "NEXT-UPDATE", datasetAccess.getDataset().getMetadata().getDateNextUpdate());
        writeFieldResourceName(printWriter, "UPDATE-FREQUENCY", datasetAccess.getDataset().getMetadata().getUpdateFrequency());
        writeField(printWriter, "SHOWDECIMALS", datasetAccess.getDataset().getMetadata().getRelatedDsd().getShowDecimals());
        writeField(printWriter, "MATRIX", datasetAccess.getDataset().getId());
        writeField(printWriter, "AUTOPEN", datasetAccess.getDataset().getMetadata().getRelatedDsd().getAutoOpen());
        writeSubjectAreas(printWriter);
        writeField(printWriter, "COPYRIGHT", datasetAccess.getDataset().getMetadata().getCopyrightDate() != null);
        writeField(printWriter, "DESCRIPTION", datasetAccess.getDataset().getDescription() != null ? datasetAccess.getDataset().getDescription() : datasetAccess.getDataset().getName()); // TODO si no,
                                                                                                                                                                                          // el PX-Edit
                                                                                                                                                                                          // lo
                                                                                                                                                                                          // construye
        writeField(printWriter, "TITLE", datasetAccess.getDataset().getName());
        writeField(printWriter, "DESCRIPTIONDEFAULT", Boolean.TRUE);
        writeField(printWriter, "CONTENTS", "TODO-CONTENTS"); // TODO Content
        writeField(printWriter, "UNITS", "TODO-UNITS"); // TODO Units
        writeField(printWriter, "DECIMALS", Integer.valueOf(2)); // TODO Decimals

        writeDimensions(printWriter);
        writeDimensionValuesLabels(printWriter);
        writeDimensionValues(printWriter);

        writeField(printWriter, "LAST-UPDATED", datasetAccess.getDataset().getMetadata().getLastUpdate());
        writeFieldResourceName(printWriter, "CONTACT", datasetAccess.getDataset().getMetadata().getRightsHolder());
        writeFieldResourceName(printWriter, "SOURCE", datasetAccess.getDataset().getMetadata().getMaintainer());

        writeAttributes(printWriter);
        writeData(printWriter);
    }

    private String formatValue(String value) {
        if (value == null) {
            return null;
        }
        return value.replace("\"", "'");
    }

    private void writeField(PrintWriter printWriter, String name, Object value) {
        writeField(printWriter, name, value, null);
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    private void writeField(PrintWriter printWriter, String name, Object value, String lang) {
        if (value == null) {
            return;
        }
        String valueString = null;
        if (value instanceof String) {
            valueString = QUOTE + formatValue((String) value) + QUOTE;
        } else if (value instanceof Integer) {
            valueString = String.valueOf(value);
        } else if (value instanceof Boolean) {
            valueString = (Boolean) value ? "YES" : "NO";
        } else if (value instanceof Date) {
            valueString = QUOTE + new DateTime(value).toString("yyyyMMdd HH:mm") + QUOTE;
        } else if (value instanceof List) { // List<String>
            valueString = listToValue((List) value);
        } else {
            throw new IllegalArgumentException("Type unsupported: " + value.getClass().getCanonicalName());
        }

        if (lang != null) {
            printWriter.println(name + "[" + lang + "]=" + valueString + SEMICOLON);
        } else {
            printWriter.println(name + EQUALS + valueString + SEMICOLON);
        }
    }

    private void writeField(PrintWriter printWriter, String name, InternationalString value) {
        if (value == null) {
            return;
        }
        String defaultLang = datasetAccess.getLangEffective();
        for (LocalisedString localisedString : value.getTexts()) {
            String lang = localisedString.getLang();
            if (defaultLang.equals(lang)) {
                writeField(printWriter, name, localisedString.getValue());
            } else {
                writeField(printWriter, name, localisedString.getValue(), lang);
            }
        }
    }

    private void writeFieldResourceId(PrintWriter printWriter, String name, Resources values) {
        if (values == null) {
            return;
        }
        List<String> valuesString = resourcesToResourcesId(values.getResources());
        writeField(printWriter, name, valuesString);
    }

    private void writeFieldResourceName(PrintWriter printWriter, String name, Resource value) {
        if (value == null) {
            return;
        }
        writeField(printWriter, name, value.getName());
    }

    private void writeSubjectAreas(PrintWriter printWriter) {
        Resources subjectAreas = datasetAccess.getDataset().getMetadata().getSubjectAreas();
        if (subjectAreas == null) {
            writeField(printWriter, "SUBJECT-AREA", datasetAccess.getDataset().getName()); // TODO (en px es obligatorio)
            writeField(printWriter, "SUBJECT-CODE", datasetAccess.getDataset().getId()); // TODO (en px es obligatorio)
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
        writeField(printWriter, "SUBJECT-AREA", valueName.toString());
        writeField(printWriter, "SUBJECT-CODE", valueName.toString());
    }

    private void writeDimensions(PrintWriter printWriter) {
        DataStructureDefinition relatedDsd = datasetAccess.getDataset().getMetadata().getRelatedDsd();
        writeField(printWriter, "STUB", relatedDsd.getStub().getDimensionIds());
        writeField(printWriter, "HEADING", relatedDsd.getHeading().getDimensionIds());
    }

    private void writeDimensionValuesLabels(PrintWriter printWriter) {
        for (String dimensionId : datasetAccess.getDimensionsOrderedForData()) {
            List<String> dimensionValuesId = datasetAccess.getDimensionValuesOrderedForData(dimensionId);
            List<String> dimensionValuesLabels = new ArrayList<String>(dimensionValuesId.size());
            for (String dimensionValueId : dimensionValuesId) {
                dimensionValuesLabels.add(datasetAccess.getDimensionValueLabel(dimensionId, dimensionValueId));
            }
            String value = listToValue(dimensionValuesLabels);
            printWriter.println("VALUES(\"" + dimensionId + "\")" + EQUALS + value + SEMICOLON);
        }
    }

    private void writeDimensionValues(PrintWriter printWriter) {
        for (String dimensionId : datasetAccess.getDimensionsOrderedForData()) {
            String value = listToValue(datasetAccess.getDimensionValuesOrderedForData(dimensionId));
            printWriter.println("CODES(\"" + dimensionId + "\")" + EQUALS + value + SEMICOLON);
        }
    }

    /**
     * If exist more than one attribute for a same key (example: pair dimensionId-dimensionValueId for VALUENOTE) concat values with <br/>
     * (# in PX)
     */
    private void writeAttributes(PrintWriter printWriter) {
        List<Attribute> attributes = datasetAccess.getAttributesMetadata();
        if (CollectionUtils.isEmpty(attributes)) {
            return;
        }
        writeAttributesNote(printWriter, attributes);
        writeAttributesValueNote(printWriter, attributes);
        writeAttributesCellNote(printWriter, attributes);
    }

    /**
     * Builds NOTE and NOTEX attributes: attributes with dataset attachment level
     */
    private void writeAttributesNote(PrintWriter printWriter, List<Attribute> attributes) {
        String notexName = "NOTEX";
        String noteName = "NOTE";
        StringBuilder notex = new StringBuilder();
        StringBuilder note = new StringBuilder();
        for (Attribute attribute : attributes) {
            if (AttributeAttachmentLevelType.DATASET.equals(attribute.getAttachmentLevel())) {
                String attributeId = attribute.getId();
                String[] attributeValues = datasetAccess.getAttributeValues(attributeId);
                if (attributeValues != null) {
                    StringBuilder value = notexName.equals(attributeId) ? notex : note;
                    addAttributeValue(value, attributeValues[0]);
                }
            }
        }
        if (notex.length() != 0) {
            writeField(printWriter, notexName, notex.toString());
        }
        if (note.length() != 0) {
            writeField(printWriter, noteName, note.toString());
        }
    }

    /**
     * Builds VALUENOTE and VALUENOTEX attributes: attributes with dimension attachment level but only one dimension
     */
    private void writeAttributesValueNote(PrintWriter printWriter, List<Attribute> attributes) {
        String valueNotexName = "VALUENOTEX";
        String valueNoteName = "VALUENOTE";

        // Attribute values indexed by dimensionId and dimensionValueId
        Map<String, Map<String, StringBuilder>> valueNotex = new HashMap<String, Map<String, StringBuilder>>();
        Map<String, Map<String, StringBuilder>> valueNote = new HashMap<String, Map<String, StringBuilder>>();

        // Builds attribute values
        for (Attribute attribute : attributes) {
            if (AttributeAttachmentLevelType.DIMENSION.equals(attribute.getAttachmentLevel()) && attribute.getDimensions().getDimensions().size() == 1) {
                String attributeId = attribute.getId();
                String[] attributeValues = datasetAccess.getAttributeValues(attributeId);
                if (attributeValues == null) {
                    continue;
                }
                String dimensionId = attribute.getDimensions().getDimensions().get(0).getDimensionId();
                Map<String, Map<String, StringBuilder>> attributeValuesByDimensionId = valueNotexName.equals(attributeId) ? valueNotex : valueNote;
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
        }

        // Print in stream
        writeAttributeValueNoteField(printWriter, valueNotexName, valueNotex);
        writeAttributeValueNoteField(printWriter, valueNoteName, valueNote);
    }

    private void writeAttributeValueNoteField(PrintWriter printWriter, String name, Map<String, Map<String, StringBuilder>> valueNote) {
        for (String dimensionId : datasetAccess.getDimensionsOrderedForData()) {
            if (valueNote.containsKey(dimensionId)) {
                List<String> dimensionValuesId = datasetAccess.getDimensionValuesOrderedForData(dimensionId);
                for (String dimensionValueId : dimensionValuesId) {
                    if (valueNote.get(dimensionId).containsKey(dimensionValueId)) {
                        writeField(printWriter, name + "(\"" + dimensionId + "\",\"" + dimensionValueId + "\")", valueNote.get(dimensionId).get(dimensionValueId).toString());
                    }
                }
            }
        }
    }

    /**
     * Builds CELLNOTE and CELLNOTEX attributes: attributes with observationa attachment level or dimension attachment level but more than one dimension
     */
    private void writeAttributesCellNote(PrintWriter printWriter, List<Attribute> attributes) {
        String cellNotexName = "CELLNOTEX";
        String cellNoteName = "CELLNOTE";

        // Attribute values indexed by all dimension values of attribute. Dimensions ordered: First stub and then heading
        Map<String, StringBuilder> cellNotex = new HashMap<String, StringBuilder>();
        Map<String, StringBuilder> cellNote = new HashMap<String, StringBuilder>();
        List<String> allDimensionsDatasetOrderedForPx = getPxDimensionsDatasetOrdered();

        // Builds attribute values
        for (Attribute attribute : attributes) {
            if (AttributeAttachmentLevelType.PRIMARY_MEASURE.equals(attribute.getAttachmentLevel())
                    || (AttributeAttachmentLevelType.DIMENSION.equals(attribute.getAttachmentLevel()) && attribute.getDimensions().getDimensions().size() > 1)) {
                String attributeId = attribute.getId();
                String[] attributeValues = datasetAccess.getAttributeValues(attributeId);
                if (attributeValues == null) {
                    continue;
                }

                Map<String, StringBuilder> cellNoteToAttribute = cellNotexName.equals(attributeId) ? cellNotex : cellNote;
                List<String> dimensionsAttributeOrderedForExtractData = getPxDimensionsAttributeOrderedForExtractData(attribute);
                writeAttributeCellNote(printWriter, attributeId, attributeValues, dimensionsAttributeOrderedForExtractData, allDimensionsDatasetOrderedForPx, cellNoteToAttribute);
            }
        }

        // Print in stream
        writeAttributeCellNoteField(printWriter, cellNotexName, cellNotex);
        writeAttributeCellNoteField(printWriter, cellNoteName, cellNote);
    }

    private void writeAttributeCellNote(PrintWriter printWriter, String attributeId, String[] attributeValues, List<String> dimensionsAttributeOrderedForExtractData,
            List<String> dimensionsDatasetOrderedForPx, Map<String, StringBuilder> cellNote) {

        Stack<OrderingStackElement> stack = new Stack<OrderingStackElement>();
        stack.push(new OrderingStackElement(null, -1, null));
        Map<String, String> dimensionValuesForAttributeValue = new HashMap<String, String>(dimensionsAttributeOrderedForExtractData.size());

        int lastDimensionPosition = dimensionsAttributeOrderedForExtractData.size() - 1;
        int attributeValueIndex = 0;
        while (stack.size() > 0) {
            // POP
            OrderingStackElement elem = stack.pop();
            int dimensionPosition = elem.getDimensionPosition();
            String dimensionCodeId = elem.getDimensionCodeId();

            if (dimensionPosition != -1) {
                String dimensionId = elem.getDimensionId();
                dimensionValuesForAttributeValue.put(dimensionId, dimensionCodeId);
            }

            if (dimensionPosition == lastDimensionPosition) {
                // We have all dimensions here
                String attributeValue = attributeValues[attributeValueIndex++];
                if (!StringUtils.isEmpty(attributeValue)) {
                    StringBuilder key = new StringBuilder();
                    key.append(QUOTE);
                    for (Iterator<String> iterator = dimensionsDatasetOrderedForPx.iterator(); iterator.hasNext();) {
                        String dimensionDatasetId = iterator.next();
                        if (dimensionValuesForAttributeValue.containsKey(dimensionDatasetId)) {
                            key.append(dimensionValuesForAttributeValue.get(dimensionDatasetId));
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
                String dimensionId = dimensionsAttributeOrderedForExtractData.get(dimensionPosition + 1);
                List<String> dimensionValues = datasetAccess.getDimensionValuesOrderedForData(dimensionId);
                for (int i = dimensionValues.size() - 1; i >= 0; i--) {
                    OrderingStackElement temp = new OrderingStackElement(dimensionId, dimensionPosition + 1, dimensionValues.get(i));
                    stack.push(temp);
                }
            }
        }
    }

    private void writeAttributeCellNoteField(PrintWriter printWriter, String name, Map<String, StringBuilder> cellNote) {
        if (cellNote.size() == 0) {
            return;
        }
        // Get keys ordered to obtain same result to same dataset
        List<String> keys = new ArrayList<String>(cellNote.keySet());
        Collections.sort(keys);

        for (String key : keys) {
            writeField(printWriter, name + "(" + key + ")", cellNote.get(key).toString());
        }
    }

    private class OrderingStackElement {

        private final String dimensionId;
        private final int    dimensionPosition;
        private final String dimensionCodeId;

        public OrderingStackElement(String dimensionId, int dimensionPosition, String dimensionCodeId) {
            super();
            this.dimensionId = dimensionId;
            this.dimensionPosition = dimensionPosition;
            this.dimensionCodeId = dimensionCodeId;
        }

        public String getDimensionId() {
            return dimensionId;
        }

        public int getDimensionPosition() {
            return dimensionPosition;
        }

        public String getDimensionCodeId() {
            return dimensionCodeId;
        }
    }

    private void writeData(PrintWriter printWriter) {
        printWriter.println("DATA" + EQUALS);
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

    private List<String> resourcesToResourcesId(List<Resource> sources) {
        if (CollectionUtils.isEmpty(sources)) {
            return null;
        }
        List<String> targets = new ArrayList<String>();
        for (Resource source : sources) {
            targets.add(source.getId());
        }
        return targets;
    }

    private String listToValue(List<String> sources) {
        StringBuilder target = new StringBuilder(256);
        for (Iterator<String> iterator = sources.iterator(); iterator.hasNext();) {
            String source = iterator.next();
            target.append(QUOTE);
            target.append(formatValue(source));
            target.append(QUOTE);
            if (iterator.hasNext()) {
                target.append(COMMA);
            }
        }
        return target.toString();
    }

    private List<String> getPxDimensionsDatasetOrdered() {
        List<String> dimensionsOrderedToAttributes = new ArrayList<String>();
        dimensionsOrderedToAttributes.addAll(datasetAccess.getDataset().getMetadata().getRelatedDsd().getStub().getDimensionIds());
        dimensionsOrderedToAttributes.addAll(datasetAccess.getDataset().getMetadata().getRelatedDsd().getHeading().getDimensionIds());
        return dimensionsOrderedToAttributes;
    }

    private List<String> getPxDimensionsAttributeOrderedForExtractData(Attribute attribute) {
        List<String> allDimensionsOrderedForData = datasetAccess.getDimensionsOrderedForData();
        if (AttributeAttachmentLevelType.DIMENSION.equals(attribute.getAttachmentLevel())) {
            List<String> dimensionsAttribute = new ArrayList<String>();
            for (AttributeDimension attributeDimension : attribute.getDimensions().getDimensions()) {
                dimensionsAttribute.add(attributeDimension.getDimensionId());
            }
            List<String> dimensionsAttributeOrdered = new ArrayList<String>(dimensionsAttribute.size());
            for (String dimensionDatasetId : datasetAccess.getDimensionsOrderedForData()) {
                if (dimensionsAttribute.contains(dimensionDatasetId)) {
                    dimensionsAttributeOrdered.add(dimensionDatasetId);
                }
            }
            return dimensionsAttributeOrdered;
        } else if (AttributeAttachmentLevelType.PRIMARY_MEASURE.equals(attribute.getAttachmentLevel())) {
            return allDimensionsOrderedForData;
        } else {
            throw new IllegalArgumentException("Attribute attachement level unsupported in this operation: " + attribute.getAttachmentLevel());
        }
    }

    private void addAttributeValue(StringBuilder attributeGlobalValue, String attributeValue) {
        if (attributeGlobalValue.length() != 0) {
            attributeGlobalValue.append(ATTRIBUTE_LINE_SEPARATOR);
        }
        attributeValue = formatValue(attributeValue);
        attributeGlobalValue.append(attributeValue);
    }
}