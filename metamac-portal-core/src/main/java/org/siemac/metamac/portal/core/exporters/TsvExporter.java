package org.siemac.metamac.portal.core.exporters;

import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Stack;

import org.apache.commons.lang.StringUtils;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.portal.core.domain.DatasetAccessForTsv;
import org.siemac.metamac.portal.core.domain.DatasetSelectionForTsv;
import org.siemac.metamac.portal.core.enume.LabelVisualisationModeEnum;
import org.siemac.metamac.portal.core.error.ServiceExceptionType;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Attribute;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.AttributeAttachmentLevelType;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;

public class TsvExporter {

    private final DatasetAccessForTsv datasetAccess;

    private final String              SEPARATOR                           = "\t";
    private final String              HEADER_OBSERVATION                  = "OBS_VALUE";
    private final String              HEADER_ATTRIBUTE_ID                 = "ATTRIBUTE";
    private final String              HEADER_ATTRIBUTE_VALUE              = "ATTRIBUTE_VALUE";
    private final String              HEADER_ATTRIBUTE_VALUE_CODE         = "ATTRIBUTE_VALUE_CODE";
    private final String              HEADER_SUFIX_CODE_WHEN_EXPORT_TITLE = "_CODE";

    public TsvExporter(Dataset dataset, DatasetSelectionForTsv datasetSelection, String lang, String langAlternative) throws MetamacException {
        this.datasetAccess = new DatasetAccessForTsv(dataset, datasetSelection, lang, langAlternative);
    }

    public void writeObservationsAndAttributesWithObservationAttachmentLevel(OutputStream os) throws MetamacException {
        PrintWriter printWriter = null;
        try {
            printWriter = new PrintWriter(new OutputStreamWriter(os, Charset.forName("UTF-8")));
            writeHeaderForTsvObservations(printWriter);
            writeBodyForTsvObservations(printWriter);
        } catch (Exception e) {
            throw new MetamacException(e, ServiceExceptionType.UNKNOWN, "Error exporting to tsv");
        } finally {
            if (printWriter != null) {
                printWriter.flush();
            }
        }
    }

    public void writeAttributesWithDatasetAndDimensionAttachmentLevel(OutputStream os) throws MetamacException {
        PrintWriter printWriter = null;
        try {
            printWriter = new PrintWriter(new OutputStreamWriter(os, Charset.forName("UTF-8")));

            int numberOfColumnsToAttributeValue = guessNumberOfColumnsToAttributeValue();
            writeHeaderForTsvAttributes(printWriter, numberOfColumnsToAttributeValue);
            writeBodyForTsvAttributesDataset(printWriter, datasetAccess.getAttributesMetadata(), numberOfColumnsToAttributeValue);
            writeBodyForTsvAttributesDimensions(printWriter, datasetAccess.getAttributesMetadata(), numberOfColumnsToAttributeValue);
            // NOTE: Attributes observations are exported another tsv
        } catch (Exception e) {
            throw new MetamacException(e, ServiceExceptionType.UNKNOWN, "Error exporting to tsv");
        } finally {
            if (printWriter != null) {
                printWriter.flush();
            }
        }
    }

    private void writeHeaderForTsvObservations(PrintWriter printWriter) {
        StringBuilder header = new StringBuilder();
        for (String dimensionId : datasetAccess.getDimensionsOrderedForData()) {
            LabelVisualisationModeEnum labelVisualisation = datasetAccess.getDimensionLabelVisualisationMode(dimensionId);
            if (labelVisualisation.isLabel() || labelVisualisation.isCode()) {
                header.append(dimensionId + SEPARATOR);
            }
            if (labelVisualisation.isCode() && labelVisualisation.isLabel()) {
                header.append(dimensionId + HEADER_SUFIX_CODE_WHEN_EXPORT_TITLE + SEPARATOR);
            }
        }
        header.append(HEADER_OBSERVATION);
        for (Attribute attribute : datasetAccess.getAttributesMetadata()) {
            if (!AttributeAttachmentLevelType.PRIMARY_MEASURE.equals(attribute.getAttachmentLevel())) {
                continue; // only observation attachment level
            }
            String attributeId = attribute.getId();
            LabelVisualisationModeEnum labelVisualisation = datasetAccess.getAttributeLabelVisualisationMode(attributeId);
            if (labelVisualisation.isLabel() || labelVisualisation.isCode()) {
                header.append(SEPARATOR + attributeId);
            }
            if (labelVisualisation.isCode() && labelVisualisation.isLabel()) {
                header.append(SEPARATOR + attributeId + HEADER_SUFIX_CODE_WHEN_EXPORT_TITLE);
            }
        }
        printWriter.println(header);
    }

    private void writeBodyForTsvObservations(PrintWriter printWriter) {
        Stack<DataOrderingStackElement> stack = new Stack<DataOrderingStackElement>();
        stack.push(new DataOrderingStackElement(null, -1, null));
        ArrayList<String> entryId = new ArrayList<String>(datasetAccess.getDimensionsMetadata().size());
        for (int i = 0; i < datasetAccess.getDimensionsMetadata().size(); i++) {
            entryId.add(i, StringUtils.EMPTY);
        }

        int dimensionLastPosition = datasetAccess.getDimensionsMetadata().size() - 1;
        int observationIndex = 0;
        while (stack.size() > 0) {
            DataOrderingStackElement elem = stack.pop();
            int dimensionPosition = elem.getDimensionPosition();
            String dimensionCodeId = elem.getDimensionCodeId();
            if (dimensionPosition != -1) {
                entryId.set(dimensionPosition, dimensionCodeId);
            }

            if (dimensionPosition == dimensionLastPosition) {
                // The observation is complete
                StringBuilder line = new StringBuilder();

                // Dimension values
                for (int i = 0, size = datasetAccess.getDimensionsOrderedForData().size(); i < size; i++) {
                    String dimensionId = datasetAccess.getDimensionsOrderedForData().get(i);
                    String dimensionValueId = entryId.get(i);
                    LabelVisualisationModeEnum labelVisualisation = datasetAccess.getDimensionLabelVisualisationMode(dimensionId);
                    if (labelVisualisation.isLabel()) {
                        String dimensionValueLabel = datasetAccess.getDimensionValueLabel(dimensionId, dimensionValueId);
                        line.append(dimensionValueLabel + SEPARATOR);
                    }
                    if (labelVisualisation.isCode()) {
                        line.append(dimensionValueId + SEPARATOR);
                    }
                }

                // Observation
                String observation = datasetAccess.getObservations()[observationIndex];
                if (observation == null) {
                    observation = StringUtils.EMPTY;
                }
                line.append(observation);

                // Attributes
                for (Attribute attribute : datasetAccess.getAttributesMetadata()) {
                    if (!AttributeAttachmentLevelType.PRIMARY_MEASURE.equals(attribute.getAttachmentLevel())) {
                        continue; // only observation attachment level
                    }
                    String attributeId = attribute.getId();
                    String[] attributeValues = datasetAccess.getAttributeValues(attributeId);
                    String attributeValue = null;
                    if (attributeValues != null) {
                        attributeValue = attributeValues[observationIndex];
                    }
                    if (attributeValue == null) {
                        attributeValue = StringUtils.EMPTY;
                        line.append(SEPARATOR + attributeValue);
                    } else {
                        LabelVisualisationModeEnum labelVisualisation = datasetAccess.getAttributeLabelVisualisationMode(attributeId);
                        if (labelVisualisation.isLabel()) {
                            String attributeValueLabel = datasetAccess.getAttributeValueLabel(attributeId, attributeValue);
                            line.append(attributeValueLabel != null ? SEPARATOR + attributeValueLabel : SEPARATOR + attributeValue);
                        }
                        if (labelVisualisation.isCode()) {
                            line.append(SEPARATOR + attributeValue);
                        }
                    }
                }
                printWriter.println(line);
                observationIndex++;
                entryId.set(dimensionPosition, StringUtils.EMPTY);
            } else {
                String dimensionId = datasetAccess.getDimensionsOrderedForData().get(dimensionPosition + 1);
                List<String> dimensionValues = datasetAccess.getDimensionValuesOrderedForData(dimensionId);
                for (int i = dimensionValues.size() - 1; i >= 0; i--) {
                    DataOrderingStackElement temp = new DataOrderingStackElement(dimensionId, dimensionPosition + 1, dimensionValues.get(i));
                    stack.push(temp);
                }
            }
        }
    }

    private void writeHeaderForTsvAttributes(PrintWriter printWriter, int numberOfColumnsToAttributeValue) {
        StringBuilder header = new StringBuilder();
        for (String dimensionId : datasetAccess.getDimensionsOrderedForData()) {
            LabelVisualisationModeEnum labelVisualisation = datasetAccess.getDimensionLabelVisualisationMode(dimensionId);
            if (labelVisualisation.isLabel() || labelVisualisation.isCode()) {
                header.append(dimensionId + SEPARATOR);
            }
            if (labelVisualisation.isCode() && labelVisualisation.isLabel()) {
                header.append(dimensionId + HEADER_SUFIX_CODE_WHEN_EXPORT_TITLE + SEPARATOR);
            }
        }
        header.append(HEADER_ATTRIBUTE_ID);
        header.append(SEPARATOR + HEADER_ATTRIBUTE_VALUE);
        if (numberOfColumnsToAttributeValue == 2) {
            header.append(SEPARATOR + HEADER_ATTRIBUTE_VALUE_CODE); // put this column only when it is necessary
        }
        printWriter.println(header);
    }

    private void writeBodyForTsvAttributesDataset(PrintWriter printWriter, List<Attribute> attributes, int numberOfColumnsToAttributeValue) {
        for (Attribute attribute : attributes) {
            if (!AttributeAttachmentLevelType.DATASET.equals(attribute.getAttachmentLevel())) {
                continue;
            }
            String attributeId = attribute.getId();
            String[] attributeValues = datasetAccess.getAttributeValues(attributeId);
            if (attributeValues == null) {
                continue;
            }
            StringBuilder line = new StringBuilder();
            // Dimensions
            for (String dimensionId : datasetAccess.getDimensionsOrderedForData()) {
                // Write empty code dimensions
                LabelVisualisationModeEnum labelVisualisation = datasetAccess.getDimensionLabelVisualisationMode(dimensionId);
                if (labelVisualisation.isLabel()) {
                    line.append(SEPARATOR);
                }
                if (labelVisualisation.isCode()) {
                    line.append(SEPARATOR);
                }
            }
            // Attribute Id
            line.append(attributeId + SEPARATOR);
            // Attribute value
            String attributeValue = attributeValues[0];
            writeBodyAttributeValueForTsvAttributes(line, attributeId, attributeValue, numberOfColumnsToAttributeValue);
            printWriter.println(line);
        }
    }

    private void writeBodyForTsvAttributesDimensions(PrintWriter printWriter, List<Attribute> attributes, int numberOfColumnsToAttributeValue) {
        for (Attribute attribute : attributes) {
            if (!AttributeAttachmentLevelType.DIMENSION.equals(attribute.getAttachmentLevel())) {
                continue;
            }
            String attributeId = attribute.getId();
            String[] attributeValues = datasetAccess.getAttributeValues(attributeId);
            if (attributeValues == null) {
                continue;
            }
            List<String> dimensionsAttributeOrderedForData = datasetAccess.getDimensionsAttributeOrderedForData(attribute);
            writeBodyForTsvAttributeDimensions(printWriter, attributeId, attributeValues, dimensionsAttributeOrderedForData, numberOfColumnsToAttributeValue);
        }
    }

    private void writeBodyForTsvAttributeDimensions(PrintWriter printWriter, String attributeId, String[] attributeValues, List<String> dimensionsAttributeOrderedForData,
            int numberOfColumnsToAttributeValue) {

        Stack<DataOrderingStackElement> stack = new Stack<DataOrderingStackElement>();
        stack.push(new DataOrderingStackElement(null, -1, null));
        Map<String, String> dimensionValuesForAttributeValue = new HashMap<String, String>(dimensionsAttributeOrderedForData.size());

        int lastDimensionPosition = dimensionsAttributeOrderedForData.size() - 1;
        int attributeValueIndex = 0;
        while (stack.size() > 0) {
            DataOrderingStackElement elem = stack.pop();
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
                    StringBuilder line = new StringBuilder();
                    // Dimensions
                    for (String dimensionId : datasetAccess.getDimensionsOrderedForData()) {
                        String dimensionValueId = dimensionValuesForAttributeValue.get(dimensionId);
                        LabelVisualisationModeEnum labelVisualisation = datasetAccess.getDimensionLabelVisualisationMode(dimensionId);
                        if (labelVisualisation.isLabel()) {
                            if (dimensionValuesForAttributeValue.containsKey(dimensionId)) {
                                String dimensionValueLabel = datasetAccess.getDimensionValueLabel(dimensionId, dimensionValueId);
                                line.append(dimensionValueLabel);
                            }
                            line.append(SEPARATOR);
                        }
                        if (labelVisualisation.isCode()) {
                            if (dimensionValuesForAttributeValue.containsKey(dimensionId)) {
                                line.append(dimensionValueId);
                            }
                            line.append(SEPARATOR);
                        }
                    }
                    // Attribute Id
                    line.append(attributeId + SEPARATOR);
                    // Attribute value
                    writeBodyAttributeValueForTsvAttributes(line, attributeId, attributeValue, numberOfColumnsToAttributeValue);
                    printWriter.println(line);
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

    private void writeBodyAttributeValueForTsvAttributes(StringBuilder line, String attributeId, String attributeValueCode, int numberOfColumnsToAttributeValue) {
        LabelVisualisationModeEnum labelVisualisation = datasetAccess.getAttributeLabelVisualisationMode(attributeId);
        if (labelVisualisation.isLabel()) {
            String attributeValueLabel = datasetAccess.getAttributeValueLabel(attributeId, attributeValueCode);
            line.append(attributeValueLabel != null ? attributeValueLabel : attributeValueCode);
            if (numberOfColumnsToAttributeValue == 2) {
                line.append(SEPARATOR);
            }
        } else if (numberOfColumnsToAttributeValue == 2) {
            line.append(SEPARATOR);
        }
        if (labelVisualisation.isCode()) {
            line.append(attributeValueCode);
        }
    }

    private int guessNumberOfColumnsToAttributeValue() {
        for (Attribute attribute : datasetAccess.getAttributesMetadata()) {
            if (!AttributeAttachmentLevelType.DATASET.equals(attribute.getAttachmentLevel()) && AttributeAttachmentLevelType.DIMENSION.equals(attribute.getAttachmentLevel())) {
                continue;
            }
            String attributeId = attribute.getId();
            LabelVisualisationModeEnum labelVisualisation = datasetAccess.getAttributeLabelVisualisationMode(attributeId);
            if (labelVisualisation.isCode() && labelVisualisation.isLabel()) {
                return 2;
            }
        }
        return 1;
    }
}