package org.siemac.metamac.portal.core.exporters;

import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;
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

    private final String              SEPARATOR                                      = "\t";
    private final String              HEADER_OBSERVATION                             = "OBS_VALUE";
    private final String              HEADER_SUFIX_DIMENSION_VALUE_WITH_EXPORT_TITLE = "_CODE";

    public TsvExporter(Dataset dataset, DatasetSelectionForTsv datasetSelection, String lang, String langAlternative) throws MetamacException {
        this.datasetAccess = new DatasetAccessForTsv(dataset, datasetSelection, lang, langAlternative);
    }

    public void write(OutputStream os) throws MetamacException {
        PrintWriter printWriter = null;
        try {
            printWriter = new PrintWriter(new OutputStreamWriter(os, Charset.forName("UTF-8")));
            writeHeader(printWriter);
            writeObservations(printWriter);
        } catch (Exception e) {
            throw new MetamacException(e, ServiceExceptionType.UNKNOWN, "Error exporting to tsv");
        } finally {
            if (printWriter != null) {
                printWriter.flush();
            }
        }
    }

    private void writeHeader(PrintWriter printWriter) {
        StringBuilder header = new StringBuilder();
        for (String dimensionId : datasetAccess.getDimensionsOrderedForData()) {
            LabelVisualisationModeEnum labelVisualisation = datasetAccess.getDimensionLabelVisualisationMode(dimensionId);
            if (labelVisualisation.isLabel() || labelVisualisation.isCode()) {
                header.append(dimensionId + SEPARATOR);
            }
            if (labelVisualisation.isCode() && labelVisualisation.isLabel()) {
                header.append(dimensionId + HEADER_SUFIX_DIMENSION_VALUE_WITH_EXPORT_TITLE + SEPARATOR);
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
                header.append(SEPARATOR + attributeId + HEADER_SUFIX_DIMENSION_VALUE_WITH_EXPORT_TITLE);
            }
        }
        printWriter.println(header);
    }

    private void writeObservations(PrintWriter printWriter) {
        Stack<OrderingStackElement> stack = new Stack<OrderingStackElement>();
        stack.push(new OrderingStackElement(StringUtils.EMPTY, -1));
        ArrayList<String> entryId = new ArrayList<String>(datasetAccess.getDimensionsMetadata().size());
        for (int i = 0; i < datasetAccess.getDimensionsMetadata().size(); i++) {
            entryId.add(i, StringUtils.EMPTY);
        }

        int lastDimension = datasetAccess.getDimensionsMetadata().size() - 1;
        int observationIndex = 0;
        while (stack.size() > 0) {
            OrderingStackElement elem = stack.pop();
            int elemDimension = elem.getDimNum();
            String elemCode = elem.getCodeId();
            if (elemDimension != -1) {
                entryId.set(elemDimension, elemCode);
            }

            if (elemDimension == lastDimension) {
                // The observation is complete
                StringBuilder line = new StringBuilder();

                // Dimension values
                for (int i = 0, size = datasetAccess.getDimensionsOrderedForData().size(); i < size; i++) {
                    String dimensionId = datasetAccess.getDimensionsOrderedForData().get(i);
                    String dimensionValueCode = entryId.get(i);
                    LabelVisualisationModeEnum labelVisualisation = datasetAccess.getDimensionLabelVisualisationMode(dimensionId);
                    if (labelVisualisation.isLabel()) {
                        String dimensionValueLabel = datasetAccess.getDimensionValueLabel(dimensionId, dimensionValueCode);
                        line.append(dimensionValueLabel + SEPARATOR);
                    }
                    if (labelVisualisation.isCode()) {
                        line.append(dimensionValueCode + SEPARATOR);
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
                            if (attributeValueLabel != null) {
                                line.append(SEPARATOR + attributeValueLabel);
                            } else {
                                line.append(SEPARATOR + attributeValue);
                            }
                        }
                        if (labelVisualisation.isCode()) {
                            line.append(SEPARATOR + attributeValue);
                        }
                    }
                }
                printWriter.println(line);
                observationIndex++;
                entryId.set(elemDimension, StringUtils.EMPTY);
            } else {
                String dimensionId = datasetAccess.getDimensionsOrderedForData().get(elemDimension + 1);
                List<String> dimensionValues = datasetAccess.getDimensionValuesOrderedForData(dimensionId);
                for (int i = dimensionValues.size() - 1; i >= 0; i--) {
                    OrderingStackElement temp = new OrderingStackElement(dimensionValues.get(i), elemDimension + 1);
                    stack.push(temp);
                }
            }
        }
    }

    private class OrderingStackElement {

        private String codeId = null;
        private int    dimNum = -1;

        public OrderingStackElement(String codeId, int dimNum) {
            super();
            this.codeId = codeId;
            this.dimNum = dimNum;
        }

        public String getCodeId() {
            return codeId;
        }

        public int getDimNum() {
            return dimNum;
        }
    }
}