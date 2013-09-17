package org.siemac.metamac.portal.core.serviceimpl;

import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Stack;

import org.apache.commons.lang.StringUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.portal.core.domain.DatasetAccess;
import org.siemac.metamac.portal.core.domain.DatasetSelection;
import org.siemac.metamac.portal.core.domain.DatasetSelectionDimension;
import org.siemac.metamac.portal.core.domain.SvgExportSupportedMimeType;
import org.siemac.metamac.portal.core.error.ServiceExceptionParameters;
import org.siemac.metamac.portal.core.error.ServiceExceptionType;
import org.siemac.metamac.portal.core.serviceapi.ExportService;
import org.siemac.metamac.portal.core.serviceapi.validators.ExportServiceInvocationValidator;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Attribute;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.AttributeAttachmentLevelType;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.CodeRepresentation;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DataAttribute;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DimensionRepresentation;
import org.siemac.metamac.statistical_resources.rest.common.StatisticalResourcesRestConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("exportService")
public class ExportServiceImpl extends ExportServiceImplBase {

    private static Logger                    log = LoggerFactory.getLogger(ExportService.class);

    @Autowired
    private ExportServiceInvocationValidator exportServiceInvocationValidator;

    @Override
    public void exportDatasetToExcel(ServiceContext ctx, Dataset dataset, DatasetSelection datasetSelection, String lang, OutputStream resultOutputStream) throws MetamacException {
        exportServiceInvocationValidator.checkExportDatasetToExcel(ctx, dataset, datasetSelection, lang, resultOutputStream);

        ExcelExporter exporter = new ExcelExporter(dataset, datasetSelection, lang);
        exporter.write(resultOutputStream);
    }

    @Override
    public void exportDatasetToTsv(ServiceContext ctx, Dataset dataset, OutputStream resultOutputStream) throws MetamacException {
        exportServiceInvocationValidator.checkExportDatasetToTsv(ctx, dataset, resultOutputStream);

        TsvExporter exporter = new TsvExporter(dataset);
        exporter.write(resultOutputStream);
    }

    @Override
    public void exportSvgToImage(ServiceContext ctx, String svg, Float width, String mimeType, OutputStream resultOutputStream) throws MetamacException {
        exportServiceInvocationValidator.checkExportSvgToImage(ctx, svg, width, mimeType, resultOutputStream);

        ImageExporter exporter = new ImageExporter(svg, width, mimeType);
        exporter.write(resultOutputStream);
    }

    private class ExcelExporter {

        private static final int       ROW_ACCESS_WINDOW_SIZE = 100;

        private final DatasetAccess    datasetAccess;
        private final DatasetSelection datasetSelection;
        private Sheet                  sheet;
        private int                    rows;
        private int                    columns;
        private int                    leftHeaderSize;
        private int                    topHeaderSize;
        private SXSSFWorkbook          workbook;

        private ExcelExporter(Dataset dataset, DatasetSelection datasetSelection, String lang) {
            this.datasetAccess = new DatasetAccess(dataset, lang);
            this.datasetSelection = datasetSelection;
        }

        private void initialize() {
            workbook = new SXSSFWorkbook(ROW_ACCESS_WINDOW_SIZE);
            sheet = workbook.createSheet();
            rows = datasetSelection.getRows();
            columns = datasetSelection.getColumns();
            leftHeaderSize = datasetSelection.getLeftDimensions().size();
        }

        private void topHeader() {
            int headerRow = 0;
            for (DatasetSelectionDimension dimension : datasetSelection.getTopDimensions()) {
                Row row = sheet.createRow(headerRow);
                List<String> selectedCategories = dimension.getSelectedCategories();
                int headerColumn = leftHeaderSize;
                int multiplier = datasetSelection.getMultiplierForDimension(dimension);
                int repeat = columns / (multiplier * selectedCategories.size());
                for (int i = 0; i < repeat; i++) {
                    for (String selectedCategory : selectedCategories) {
                        String categoryLabel = datasetAccess.representationLabel(dimension.getId(), selectedCategory);
                        Cell cell = row.createCell(headerColumn);
                        cell.setCellValue(categoryLabel);
                        headerColumn += multiplier;
                    }
                }
                headerRow++;
            }
            topHeaderSize = headerRow;
        }

        private void content() {
            int observationsStartRow = topHeaderSize;
            for (int i = 0; i < rows; i++) {
                Row row = sheet.createRow(observationsStartRow + i);
                leftHeaderAtRow(i, row);
                observationsAtRow(i, row);
            }
        }

        private void leftHeaderAtRow(int observationRowIndex, Row row) {
            List<DatasetSelectionDimension> leftDimensions = datasetSelection.getLeftDimensions();
            for (int leftDimensionIndex = 0; leftDimensionIndex < leftDimensions.size(); leftDimensionIndex++) {
                DatasetSelectionDimension dimension = leftDimensions.get(leftDimensionIndex);
                int multiplier = datasetSelection.getMultiplierForDimension(dimension);
                if (observationRowIndex % multiplier == 0) {
                    String categoryId = dimension.getSelectedCategories().get((observationRowIndex / multiplier) % dimension.getSelectedCategories().size());
                    String categoryLabel = datasetAccess.representationLabel(dimension.getId(), categoryId);
                    Cell cell = row.createCell(leftDimensionIndex);
                    cell.setCellValue(categoryLabel);
                }
            }
        }

        private void observationsAtRow(int observationRowIndex, Row row) {
            for (int j = 0; j < columns; j++) {
                Map<String, String> permutationAtCell = datasetSelection.permutationAtCell(observationRowIndex, j);
                Double observation = datasetAccess.observationAtPermutation(permutationAtCell);
                if (observation != null) {
                    Cell cell = row.createCell(leftHeaderSize + j);
                    cell.setCellValue(observation);
                }
            }
        }

        public void write(OutputStream os) throws MetamacException {
            initialize();
            topHeader();
            content();

            try {
                workbook.write(os);
            } catch (IOException e) {
                log.error("Error writing excel to OutputStream", e);
                throw new MetamacException(e, ServiceExceptionType.UNKNOWN, "Error writing excel to OutputStream");
            }
            workbook.dispose();
        }
    }

    private class TsvExporter {

        private final List<String>              dimensions;
        private final Map<String, List<String>> codesByDimensionId;
        private final List<String>              attributesIdObservationLevelAttachment;

        private final String[]                  observationsData;
        private final Map<String, String[]>     attributesDataByAttributeId;
        private final String                    SEPARATOR          = "\t";
        private final String                    HEADER_OBSERVATION = "OBS_VALUE";

        private TsvExporter(Dataset dataset) {
            // Dimensions and code dimensions
            List<DimensionRepresentation> dimensionRepresentations = dataset.getData().getDimensions().getDimensions();
            this.dimensions = new ArrayList<String>(dimensionRepresentations.size());
            this.codesByDimensionId = new HashMap<String, List<String>>(dimensionRepresentations.size());
            for (DimensionRepresentation dimensionRepresentation : dimensionRepresentations) {
                String dimensionId = dimensionRepresentation.getDimensionId();
                this.dimensions.add(dimensionId);

                List<CodeRepresentation> codesRepresentations = dimensionRepresentation.getRepresentations().getRepresentations();
                this.codesByDimensionId.put(dimensionId, new ArrayList<String>(codesRepresentations.size()));
                for (CodeRepresentation codeRepresentation : codesRepresentations) {
                    this.codesByDimensionId.get(dimensionId).add(codeRepresentation.getCode());
                }
            }
            // Observations
            this.observationsData = StringUtils.splitByWholeSeparatorPreserveAllTokens(dataset.getData().getObservations(), StatisticalResourcesRestConstants.DATA_SEPARATOR);

            // Attributes (observation attachment level)
            this.attributesIdObservationLevelAttachment = new ArrayList<String>();
            this.attributesDataByAttributeId = new HashMap<String, String[]>(attributesIdObservationLevelAttachment.size());
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
                                attributesDataByAttributeId.put(attributeId,
                                        StringUtils.splitByWholeSeparatorPreserveAllTokens(dataAttribute.getValue(), StatisticalResourcesRestConstants.DATA_SEPARATOR));
                            }
                        }
                    }
                }
            }
        }
        public void write(OutputStream os) throws MetamacException {
            PrintWriter printWriter = null;
            try {
                printWriter = new PrintWriter(os);

                // Header
                StringBuilder header = new StringBuilder();
                for (String dimension : dimensions) {
                    header.append(dimension + SEPARATOR);
                }
                header.append(HEADER_OBSERVATION);
                for (String attributeId : attributesIdObservationLevelAttachment) {
                    header.append(SEPARATOR + attributeId);
                }
                printWriter.println(header);

                // Observations
                Stack<OrderingStackElement> stack = new Stack<OrderingStackElement>();
                stack.push(new OrderingStackElement(StringUtils.EMPTY, -1));
                ArrayList<String> entryId = new ArrayList<String>(dimensions.size());
                for (int i = 0; i < dimensions.size(); i++) {
                    entryId.add(i, StringUtils.EMPTY);
                }

                int lastDimension = dimensions.size() - 1;
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
                        // Codes
                        for (String codeDimension : entryId) {
                            line.append(codeDimension + SEPARATOR);
                        }
                        // Observation
                        String observation = observationsData[observationIndex];
                        if (observation == null) {
                            observation = StringUtils.EMPTY;
                        }
                        line.append(observation);
                        // Attributes
                        for (String attributeId : attributesIdObservationLevelAttachment) {
                            String attributeValue = null;
                            if (attributesDataByAttributeId.containsKey(attributeId)) {
                                attributeValue = attributesDataByAttributeId.get(attributeId)[observationIndex];
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
                        String dimensionId = dimensions.get(elemDimension + 1);
                        List<String> codes = codesByDimensionId.get(dimensionId);
                        for (int i = codes.size() - 1; i >= 0; i--) {
                            OrderingStackElement temp = new OrderingStackElement(codes.get(i), elemDimension + 1);
                            stack.push(temp);
                        }
                    }
                }
            } finally {
                if (printWriter != null) {
                    printWriter.flush();
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

    private class ImageExporter {

        private static final String              FORBIDDEN_WORD = "<!ENTITY";

        private final String                     svg;
        private final SvgExportSupportedMimeType mimeType;
        private final Float                      width;

        private ImageExporter(String svg, Float width, String mimeType) throws MetamacException {
            validateSvg(svg);
            this.svg = svg;
            this.width = getWidth(width);
            this.mimeType = getMimeType(mimeType);
        }

        public void write(OutputStream os) throws MetamacException {
            try {
                if (!SvgExportSupportedMimeType.SVG.equals(mimeType)) {
                    SVGRasterizer.getInstance().transcode(os, svg, mimeType, width);
                } else {
                    os.write(svg.getBytes());
                }
            } catch (Exception e) {
                log.error("Error while transcoding svg file to an image", e);
                throw new MetamacException(e, ServiceExceptionType.UNKNOWN, "Error while transcoding svg file to an image");
            }
        }

        private void validateSvg(String svg) throws MetamacException {
            if (StringUtils.containsIgnoreCase(svg, FORBIDDEN_WORD)) {
                // The svg could contain a malicious attack
                throw new MetamacException(ServiceExceptionType.PARAMETER_INCORRECT, ServiceExceptionParameters.SVG);
            }
        }

        private Float getWidth(Float width) {
            if (width != null && width.compareTo(0.0F) > 0) {
                return width;
            }
            return null;
        }

        private SvgExportSupportedMimeType getMimeType(String mime) {
            if (mime != null) {
                SvgExportSupportedMimeType type = SvgExportSupportedMimeType.get(mime);
                if (type != null) {
                    return type;
                }
            }
            return SvgExportSupportedMimeType.PNG;
        }
    }

}