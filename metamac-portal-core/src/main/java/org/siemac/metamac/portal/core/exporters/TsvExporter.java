package org.siemac.metamac.portal.core.exporters;

import static org.siemac.metamac.portal.core.utils.PortalUtils.calculateConfigurationDimensionLabelVisualisation;

import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Stack;

import org.apache.commons.lang.StringUtils;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.portal.core.domain.ExportPersonalisation;
import org.siemac.metamac.portal.core.enume.LabelVisualisationModeEnum;
import org.siemac.metamac.portal.core.error.ServiceExceptionType;
import org.siemac.metamac.portal.core.utils.PortalUtils;
import org.siemac.metamac.rest.common.v1_0.domain.InternationalString;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Attribute;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.AttributeAttachmentLevelType;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.CodeRepresentation;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DataAttribute;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dimension;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DimensionRepresentation;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.EnumeratedDimensionValue;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.EnumeratedDimensionValues;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.NonEnumeratedDimensionValue;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.NonEnumeratedDimensionValues;
import org.siemac.metamac.statistical_resources.rest.common.StatisticalResourcesRestConstants;

public class TsvExporter {

    // Metadata
    private List<Dimension>                         dimensionsMetadata;
    private Map<String, LabelVisualisationModeEnum> dimensionsLabelVisualisationMode;
    private Map<String, Map<String, String>>        dimensionValuesTitles;                                       // indexed by dimensionId and dimensionValueId
    private List<String>                            attributesIdObservationLevelAttachment;

    private final String                            lang;
    private final String                            langAlternative;

    // Data
    private List<String>                            dimensionsOrderedForData;
    private Map<String, List<String>>               dimensionValuesOrderedForDataByDimensionId;
    private String[]                                observationsData;
    private Map<String, String[]>                   attributesValuesByAttributeId;

    private final String                            SEPARATOR                                      = "\t";
    private final String                            HEADER_OBSERVATION                             = "OBS_VALUE";
    private final String                            HEADER_SUFIX_DIMENSION_VALUE_WITH_EXPORT_TITLE = "_CODE";

    public TsvExporter(Dataset dataset, ExportPersonalisation exportPersonalisation, String lang, String langAlternative) throws MetamacException {
        this.lang = lang;
        this.langAlternative = langAlternative;

        initDimensions(dataset, exportPersonalisation);
        initObservations(dataset);
        initAttributesWithObservationAttachmentLevel(dataset);
    }

    public void write(OutputStream os) throws MetamacException {
        PrintWriter printWriter = null;
        try {
            printWriter = new PrintWriter(os);
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
        for (String dimensionId : dimensionsOrderedForData) {
            LabelVisualisationModeEnum labelVisualisation = dimensionsLabelVisualisationMode.get(dimensionId);
            switch (labelVisualisation) {
                case CODE_AND_LABEL:
                    header.append(dimensionId + SEPARATOR);
                    header.append(dimensionId + HEADER_SUFIX_DIMENSION_VALUE_WITH_EXPORT_TITLE + SEPARATOR);
                    break;
                case CODE:
                    header.append(dimensionId + SEPARATOR);
                    break;
                case LABEL:
                    header.append(dimensionId + SEPARATOR);
                    break;
            }
        }
        header.append(HEADER_OBSERVATION);
        for (String attributeId : attributesIdObservationLevelAttachment) {
            header.append(SEPARATOR + attributeId); // TODO label
        }
        printWriter.println(header);
    }

    private void writeObservations(PrintWriter printWriter) {
        Stack<OrderingStackElement> stack = new Stack<OrderingStackElement>();
        stack.push(new OrderingStackElement(StringUtils.EMPTY, -1));
        ArrayList<String> entryId = new ArrayList<String>(dimensionsMetadata.size());
        for (int i = 0; i < dimensionsMetadata.size(); i++) {
            entryId.add(i, StringUtils.EMPTY);
        }

        int lastDimension = dimensionsMetadata.size() - 1;
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
                for (int i = 0; i < dimensionsOrderedForData.size(); i++) {
                    String dimensionId = dimensionsOrderedForData.get(i);
                    String dimensionValueCode = entryId.get(i);
                    LabelVisualisationModeEnum labelVisualisation = dimensionsLabelVisualisationMode.get(dimensionId);
                    switch (labelVisualisation) {
                        case CODE_AND_LABEL: {
                            String dimensionValueLabel = dimensionValuesTitles.get(dimensionId).get(dimensionValueCode);
                            line.append(dimensionValueLabel + SEPARATOR);
                            line.append(dimensionValueCode + SEPARATOR);
                            break;
                        }
                        case CODE: {
                            line.append(dimensionValueCode + SEPARATOR);
                            break;
                        }
                        case LABEL: {
                            String dimensionValueLabel = dimensionValuesTitles.get(dimensionId).get(dimensionValueCode);
                            line.append(dimensionValueLabel + SEPARATOR);
                            break;
                        }
                    }
                }

                // Observation
                String observation = observationsData[observationIndex];
                if (observation == null) {
                    observation = StringUtils.EMPTY;
                }
                line.append(observation);

                // Attributes // TODO label
                for (String attributeId : attributesIdObservationLevelAttachment) {
                    String attributeValue = null;
                    if (attributesValuesByAttributeId.containsKey(attributeId)) {
                        attributeValue = attributesValuesByAttributeId.get(attributeId)[observationIndex];
                    }
                    if (attributeValue == null) {
                        attributeValue = StringUtils.EMPTY;
                    }
                    line.append(SEPARATOR + attributeValue);
                }
                printWriter.println(line);
                observationIndex++;
                entryId.set(elemDimension, StringUtils.EMPTY);
            } else {
                String dimensionId = dimensionsOrderedForData.get(elemDimension + 1);
                List<String> dimensionValues = dimensionValuesOrderedForDataByDimensionId.get(dimensionId);
                for (int i = dimensionValues.size() - 1; i >= 0; i--) {
                    OrderingStackElement temp = new OrderingStackElement(dimensionValues.get(i), elemDimension + 1);
                    stack.push(temp);
                }
            }
        }
    }

    /**
     * Inits dimensions and dimensions values.
     * 1) Builds a map with titles of dimensions values
     * 2) Builds another map with dimensions values to get order provided in DATA, because observations are retrieved in API with this order
     */
    private void initDimensions(Dataset dataset, ExportPersonalisation exportPersonalisation) throws MetamacException {
        // Dimensions and dimensions values to export titles
        this.dimensionsMetadata = dataset.getMetadata().getDimensions().getDimensions();
        this.dimensionValuesTitles = new HashMap<String, Map<String, String>>(this.dimensionsMetadata.size());
        this.dimensionsLabelVisualisationMode = new HashMap<String, LabelVisualisationModeEnum>(this.dimensionsMetadata.size());
        for (Dimension dimension : dimensionsMetadata) {
            String dimensionId = dimension.getId();

            // Visualisation configuration
            LabelVisualisationModeEnum labelVisualisation = calculateConfigurationDimensionLabelVisualisation(exportPersonalisation, dimensionId);
            dimensionsLabelVisualisationMode.put(dimensionId, labelVisualisation);

            // Titles of dimensions values
            Map<String, String> dimensionsValuesTitles = null;
            if (dimension.getDimensionValues() instanceof EnumeratedDimensionValues) {
                EnumeratedDimensionValues dimensionValues = (EnumeratedDimensionValues) dimension.getDimensionValues();
                dimensionsValuesTitles = new HashMap<String, String>(dimensionValues.getValues().size());
                for (EnumeratedDimensionValue dimensionValue : dimensionValues.getValues()) {
                    dimensionsValuesTitles.put(dimensionValue.getId(), getLabel(dimensionValue.getName()));
                }
            } else if (dimension.getDimensionValues() instanceof NonEnumeratedDimensionValues) {
                NonEnumeratedDimensionValues dimensionValues = (NonEnumeratedDimensionValues) dimension.getDimensionValues();
                dimensionsValuesTitles = new HashMap<String, String>(dimensionValues.getValues().size());
                for (NonEnumeratedDimensionValue dimensionValue : dimensionValues.getValues()) {
                    dimensionsValuesTitles.put(dimensionValue.getId(), getLabel(dimensionValue.getName()));
                }
            } else {
                throw new MetamacException(ServiceExceptionType.UNKNOWN, "Dimension values unexpected: " + dimension.getDimensionValues().getClass().getCanonicalName());
            }
            dimensionValuesTitles.put(dimensionId, dimensionsValuesTitles);
        }

        // Dimensions and dimensions values to export observations
        List<DimensionRepresentation> dimensionRepresentations = dataset.getData().getDimensions().getDimensions();
        this.dimensionsOrderedForData = new ArrayList<String>(dimensionRepresentations.size());
        this.dimensionValuesOrderedForDataByDimensionId = new HashMap<String, List<String>>(dimensionRepresentations.size());
        for (DimensionRepresentation dimensionRepresentation : dimensionRepresentations) {
            String dimensionId = dimensionRepresentation.getDimensionId();
            this.dimensionsOrderedForData.add(dimensionId);

            List<CodeRepresentation> codesRepresentations = dimensionRepresentation.getRepresentations().getRepresentations();
            this.dimensionValuesOrderedForDataByDimensionId.put(dimensionId, new ArrayList<String>(codesRepresentations.size()));
            for (CodeRepresentation codeRepresentation : codesRepresentations) {
                this.dimensionValuesOrderedForDataByDimensionId.get(dimensionId).add(codeRepresentation.getCode());
            }
        }
    }

    /**
     * Init observations values
     */
    private void initObservations(Dataset dataset) {
        this.observationsData = StringUtils.splitByWholeSeparatorPreserveAllTokens(dataset.getData().getObservations(), StatisticalResourcesRestConstants.DATA_SEPARATOR);
    }

    /**
     * Init definitions and values of attributes with observation attachment level
     */
    private void initAttributesWithObservationAttachmentLevel(Dataset dataset) {
        this.attributesIdObservationLevelAttachment = new ArrayList<String>();
        this.attributesValuesByAttributeId = new HashMap<String, String[]>(attributesIdObservationLevelAttachment.size());
        if (dataset.getMetadata().getAttributes() != null) {
            // Definition
            for (Attribute attribute : dataset.getMetadata().getAttributes().getAttributes()) {
                if (AttributeAttachmentLevelType.PRIMARY_MEASURE.equals(attribute.getAttachmentLevel())) {
                    this.attributesIdObservationLevelAttachment.add(attribute.getId());
                }
            }
            // Data
            for (String attributeId : attributesIdObservationLevelAttachment) {
                if (dataset.getData().getAttributes() != null) {
                    for (DataAttribute dataAttribute : dataset.getData().getAttributes().getAttributes()) {
                        if (dataAttribute.getId().equals(attributeId)) {
                            attributesValuesByAttributeId.put(attributeId,
                                    StringUtils.splitByWholeSeparatorPreserveAllTokens(dataAttribute.getValue(), StatisticalResourcesRestConstants.DATA_SEPARATOR));
                        }
                    }
                }
            }
        }
    }

    private String getLabel(InternationalString internationalString) {
        return PortalUtils.getLabel(internationalString, lang, langAlternative);
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