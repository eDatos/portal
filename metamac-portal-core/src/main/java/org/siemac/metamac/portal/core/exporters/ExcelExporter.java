package org.siemac.metamac.portal.core.exporters;

import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Stack;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.ClientAnchor;
import org.apache.poi.ss.usermodel.Comment;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Drawing;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.RichTextString;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.core.common.lang.LocaleUtil;
import org.siemac.metamac.portal.core.domain.CellCommentDetails;
import org.siemac.metamac.portal.core.domain.DatasetAccessForExcel;
import org.siemac.metamac.portal.core.domain.DatasetSelectionDimension;
import org.siemac.metamac.portal.core.domain.DatasetSelectionForExcel;
import org.siemac.metamac.portal.core.enume.LabelVisualisationModeEnum;
import org.siemac.metamac.portal.core.error.ServiceExceptionType;
import org.siemac.metamac.portal.core.messages.MessageKeyType;
import org.siemac.metamac.portal.core.utils.PortalUtils;
import org.siemac.metamac.rest.common.v1_0.domain.Resource;
import org.siemac.metamac.rest.common.v1_0.domain.Resources;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Attribute;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.AttributeAttachmentLevelType;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ExcelExporter {

    private static final int               ROW_ACCESS_WINDOW_SIZE              = 100;
    private static final int               COLUM_OF_BODY_NOTES_START           = 2;
    private final String                   HEADER_SUFIX_CODE_WHEN_EXPORT_TITLE = "_CODE";

    private static final XSSFColor         COLOR_BLUE_STRONG                   = getXSSFColor("538DD5");
    private static final XSSFColor         COLOR_BLUE_MEDIUM                   = getXSSFColor("8DB4E2");
    private static final XSSFColor         COLOR_BLUE_LIGHT                    = getXSSFColor("C5D9F1");
    private static final XSSFColor         COLOR_WHITE                         = getXSSFColor("000000");                      // Setting to black but is interpreted as white
    private static final XSSFColor         COLOR_BLACK                         = getXSSFColor("FFFFFF");                      // Setting to white but is interpreted as black

    private final DatasetAccessForExcel    datasetAccess;
    private final DatasetSelectionForExcel datasetSelection;
    private Sheet                          sheet;

    private int                            rowsOfData;
    private int                            columnsOfData;
    private int                            leftHeaderSizeOfData;

    private int                            currentRowCount                     = 0;
    private SXSSFWorkbook                  workbook;
    private CreationHelper                 creationHelper;
    private int                            maxRightColumnIndexWithContent      = 0;

    private static Logger                  log                                 = LoggerFactory.getLogger(ExcelExporter.class);

    public ExcelExporter(Dataset dataset, DatasetSelectionForExcel datasetSelection, String lang, String langAlternative) throws MetamacException {
        this.datasetAccess = new DatasetAccessForExcel(dataset, datasetSelection, lang, langAlternative);
        this.datasetSelection = datasetSelection;
    }

    private void initialize() {
        workbook = new SXSSFWorkbook(ROW_ACCESS_WINDOW_SIZE);
        sheet = workbook.createSheet();
        rowsOfData = datasetSelection.getRows();
        columnsOfData = datasetSelection.getColumns();
        leftHeaderSizeOfData = datasetSelection.getLeftDimensions().size();
        creationHelper = workbook.getCreationHelper();
    }

    private void header() {
        int headerRow = 0;

        // Title
        String title = PortalUtils.getLabel(datasetAccess.getDataset().getName(), datasetAccess.getLang(), datasetAccess.getLangAlternative());
        if (StringUtils.isEmpty(title)) {
            Row rowTitle = sheet.createRow(headerRow++);
            addStringCell(rowTitle, 0, title, createStyleSolid(COLOR_BLUE_STRONG, COLOR_WHITE, true));
            sheet.addMergedRegion(new CellRangeAddress(headerRow - 1, headerRow - 1, 0, 4));
        }

        // Subject area
        Resources subjectAreas = datasetAccess.getDataset().getMetadata().getSubjectAreas();
        StringBuilder valueName = new StringBuilder();
        if (subjectAreas == null) {
            valueName.append(PortalUtils.getLabel(datasetAccess.getDataset().getName(), datasetAccess.getLang(), datasetAccess.getLangAlternative()));
        } else {
            for (Iterator<Resource> iterator = subjectAreas.getResources().iterator(); iterator.hasNext();) {
                Resource subjectArea = iterator.next();
                valueName.append(PortalUtils.getLabel(subjectArea.getName(), datasetAccess.getLang(), datasetAccess.getLangAlternative()));
                if (iterator.hasNext()) {
                    valueName.append("; ");
                }
            }
        }

        if (valueName.length() > 0) {
            Row rowSubjectArea = sheet.createRow(headerRow++);
            addStringCell(rowSubjectArea, 0, valueName.toString(), createStyleSolid(COLOR_BLUE_MEDIUM, COLOR_WHITE, true));
            sheet.addMergedRegion(new CellRangeAddress(headerRow - 1, headerRow - 1, 0, 4));
        }

        headerRow += 2;
        currentRowCount = headerRow;
    }

    private void contentHeader() {
        int headerRow = currentRowCount;
        for (DatasetSelectionDimension dimension : datasetSelection.getTopDimensions()) {
            Row row = sheet.createRow(headerRow);
            List<String> selectedDimensionValues = dimension.getSelectedDimensionValues();
            int headerColumn = leftHeaderSizeOfData;
            int multiplier = datasetSelection.getMultiplierForDimension(dimension);
            int repeat = columnsOfData / (multiplier * selectedDimensionValues.size());
            for (int i = 0; i < repeat; i++) {
                for (String selectedDimensionValue : selectedDimensionValues) {
                    String dimensionValueLabel = toDimensionValueLabel(dimension.getId(), selectedDimensionValue);

                    Cell cell = initializeCell(row, headerColumn);
                    cell.setCellValue(dimensionValueLabel);
                    cell.setCellType(Cell.CELL_TYPE_STRING);
                    cell.setCellStyle(createStyleSolid(COLOR_BLUE_STRONG, COLOR_WHITE, true));
                    headerColumn += multiplier;
                }
            }
            headerRow++;
        }
        currentRowCount = headerRow;
    }

    private void content() {
        int observationsStartRow = currentRowCount;
        for (int i = 0; i < rowsOfData; i++) {
            Row row = sheet.createRow(observationsStartRow + i);
            leftHeaderAtRow(i, row);
            observationsAtRow(i, row);
        }
        currentRowCount += rowsOfData;
    }

    private void footer() {
        int footerRow = currentRowCount + 2;
        int footerTitleRow = footerRow++; // For "Notes" title increment
        boolean tableTitleSet = false;

        // Dataset Notes
        int footerTableTitleRow = footerRow++; // For "Table Notes" title increment
        footerRow = addBodyOfDatasetAttributes(footerRow);
        if (footerRow != footerTitleRow + 1) {
            if (!tableTitleSet) {
                addFootNotesTittle(footerTitleRow);
                tableTitleSet = true;
            }
            String messageForCode = LocaleUtil.getMessageForCode(MessageKeyType.MESSAGE_NOTES_TABLE, LocaleUtil.getLocaleFromLocaleString(datasetAccess.getLang()));
            addFootNotesSecundaryTittle(footerTableTitleRow, messageForCode);
        }

        footerRow++; // Space

        // Dimensions
        int footerDimensionTitleRow = footerRow++; // For "Table Notes" title increment
        footerRow = addHeaderOfAttributesDimension(footerRow);
        footerRow = addBodyAttributesDimensions(footerRow);
        if (footerRow != footerDimensionTitleRow + 1) {
            if (!tableTitleSet) {
                addFootNotesTittle(footerTitleRow);
                tableTitleSet = true;
            }
            String messageForCode = LocaleUtil.getMessageForCode(MessageKeyType.MESSAGE_NOTES_CATEGORY, LocaleUtil.getLocaleFromLocaleString(datasetAccess.getLang()));
            addFootNotesSecundaryTittle(footerDimensionTitleRow, messageForCode);
        }

        footerRow += 2;

        // Other
        // Rights Holder
        Resource resource = datasetAccess.getDataset().getMetadata().getRightsHolder();
        if (resource != null) {
            String rightsHolder = PortalUtils.getLabel(resource.getName(), datasetAccess.getLang(), datasetAccess.getLangAlternative());

            Row row = sheet.createRow(footerRow++);
            String messageForCode = LocaleUtil.getMessageForCode(MessageKeyType.MESSAGE_RIGHTS_HOLDER, LocaleUtil.getLocaleFromLocaleString(datasetAccess.getLang()));
            addStringCell(row, 0, messageForCode, null);
            addStringCell(row, 1, rightsHolder, null);
        }

        Integer copyrightDate = datasetAccess.getDataset().getMetadata().getCopyrightDate();
        if (copyrightDate != null) {
            Row row = sheet.createRow(footerRow++);
            String messageForCode = LocaleUtil.getMessageForCode(MessageKeyType.MESSAGE_COPYRIGHT, LocaleUtil.getLocaleFromLocaleString(datasetAccess.getLang()));
            addStringCell(row, 0, messageForCode, null);
            addStringCell(row, 1, copyrightDate.toString(), null);
        }

        currentRowCount = footerRow;
    }
    private int addBodyOfDatasetAttributes(int footerRow) {
        int numberOfDatasetNotes = 1;
        for (Attribute attribute : datasetAccess.getAttributesMetadata()) {
            if (!AttributeAttachmentLevelType.DATASET.equals(attribute.getAttachmentLevel())) {
                continue;
            }
            String attributeId = attribute.getId();
            String[] attributeValues = datasetAccess.getAttributeValues(attributeId);

            if (attributeValues == null) {
                continue;
            }

            String attributeValue = datasetAccess.obtainAttributeValue(attributeId, 0);
            if (StringUtils.isNotBlank(attributeValue)) {
                attributeValue = attributeValue.trim();

                // Data table cell
                Row row = sheet.createRow(footerRow++);
                addStringCell(row, COLUM_OF_BODY_NOTES_START, numberOfDatasetNotes++ + ".-", createStyleSolid(COLOR_BLUE_MEDIUM, COLOR_BLACK, true));
                addStringCell(row, COLUM_OF_BODY_NOTES_START + 1, attributeValue, createStyleSolid(COLOR_BLUE_LIGHT, null, null));
            }
        }
        return footerRow;
    }

    private int addBodyAttributesDimensions(int footerRow) {
        int numberOfDimensionNotes = 1;
        for (Attribute attribute : datasetAccess.getAttributesMetadata()) {
            if (!AttributeAttachmentLevelType.DIMENSION.equals(attribute.getAttachmentLevel())) {
                continue;
            }

            String attributeId = attribute.getId();
            String[] attributeValues = datasetAccess.getAttributeValues(attributeId);

            if (attributeValues == null) {
                continue;
            }

            List<String> dimensionsAttributeOrderedForData = datasetAccess.getDimensionsAttributeOrderedForData(attribute);

            int footerRowPrevious = footerRow;
            footerRow = addBodyAttributeForOneDimension(footerRow, numberOfDimensionNotes, attributeId, attributeValues, dimensionsAttributeOrderedForData);
            numberOfDimensionNotes += footerRow - footerRowPrevious;
        }
        return footerRow;
    }

    private int addHeaderOfAttributesDimension(int footerRow) {
        int columIterator = 3;
        Row row = sheet.createRow(footerRow++);
        for (String dimensionId : datasetAccess.getDimensionsOrderedForData()) {
            LabelVisualisationModeEnum labelVisualisation = datasetAccess.getDimensionLabelVisualisationMode(dimensionId);
            if (labelVisualisation.isLabel() || labelVisualisation.isCode()) {
                addStringCell(row, columIterator++, dimensionId, createStyleSolid(COLOR_BLUE_MEDIUM, COLOR_BLACK, true));
            }
            if (labelVisualisation.isCode() && labelVisualisation.isLabel()) {
                addStringCell(row, columIterator++, dimensionId + HEADER_SUFIX_CODE_WHEN_EXPORT_TITLE, createStyleSolid(COLOR_BLUE_MEDIUM, COLOR_BLACK, true));
            }
        }
        return footerRow;
    }

    private int addBodyAttributeForOneDimension(int footerRow, int numberOfDimensionNotes, String attributeId, String[] attributeValues, List<String> dimensionsAttributeOrderedForData) {

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
                    // Dimensions
                    int columnCount = COLUM_OF_BODY_NOTES_START;
                    Row row = sheet.createRow(footerRow++);
                    addStringCell(row, columnCount++, numberOfDimensionNotes++ + ".- ", createStyleSolid(COLOR_BLUE_MEDIUM, COLOR_BLACK, true));

                    // Add keys
                    for (String dimensionId : datasetAccess.getDimensionsOrderedForData()) {
                        String dimensionValueId = dimensionValuesForAttributeValue.get(dimensionId);
                        dimensionValueId = datasetAccess.applyLabelVisualizationModeForDimension(dimensionId, dimensionValueId);
                        addStringCell(row, columnCount++, dimensionValueId, createStyleSolid(COLOR_BLUE_LIGHT, null, null));
                    }

                    // Attribute value
                    attributeValue = datasetAccess.applyLabelVisualizationModeForAttribute(attributeId, attributeValue);
                    addStringCell(row, columnCount, attributeValue, createStyleSolid(COLOR_BLUE_LIGHT, null, null));
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

        return footerRow;
    }

    private void addStringCell(Row row, int column, String cellValue, CellStyle cellStyle) {
        Cell cell = initializeCell(row, column);
        cell.setCellValue(cellValue);
        cell.setCellType(Cell.CELL_TYPE_STRING);
        cell.setCellStyle(cellStyle);
    }

    private void addFootNotesTittle(int footerRow) {
        Row row = sheet.createRow(footerRow);
        Cell cell = initializeCell(row, 0);
        String messageForCode = LocaleUtil.getMessageForCode(MessageKeyType.MESSAGE_NOTES, LocaleUtil.getLocaleFromLocaleString(datasetAccess.getLang()));
        cell.setCellValue(messageForCode);
        cell.setCellType(Cell.CELL_TYPE_STRING);
    }

    private void addFootNotesSecundaryTittle(int footerRow, String title) {
        Row row = sheet.createRow(footerRow);
        Cell cell = initializeCell(row, 1);
        cell.setCellValue(title);
        cell.setCellType(Cell.CELL_TYPE_STRING);
    }

    private void leftHeaderAtRow(int observationRowIndex, Row row) {
        List<DatasetSelectionDimension> leftDimensions = datasetSelection.getLeftDimensions();
        for (int leftDimensionIndex = 0; leftDimensionIndex < leftDimensions.size(); leftDimensionIndex++) {
            DatasetSelectionDimension dimension = leftDimensions.get(leftDimensionIndex);
            String dimensionId = dimension.getId();
            int multiplier = datasetSelection.getMultiplierForDimension(dimension);
            if (observationRowIndex % multiplier == 0) {
                String dimensionValueId = dimension.getSelectedDimensionValues().get((observationRowIndex / multiplier) % dimension.getSelectedDimensionValues().size());
                String dimensionValueLabel = toDimensionValueLabel(dimensionId, dimensionValueId);

                Cell cell = initializeCell(row, leftDimensionIndex);
                cell.setCellValue(dimensionValueLabel);
                cell.setCellType(Cell.CELL_TYPE_STRING);
                cell.setCellStyle(createStyleSolid(COLOR_BLUE_STRONG, COLOR_WHITE, true));
            } else {
                // Empty Cells
                Cell cell = initializeCell(row, leftDimensionIndex);
                cell.setCellType(Cell.CELL_TYPE_STRING);
                cell.setCellStyle(createStyleSolid(COLOR_BLUE_STRONG, COLOR_WHITE, true));
            }
        }
    }

    private void observationsAtRow(int observationRowIndex, Row row) {
        for (int j = 0; j < columnsOfData; j++) {
            Map<String, String> permutationAtCell = datasetSelection.permutationAtCell(observationRowIndex, j);
            String observation = datasetAccess.observationAtPermutation(permutationAtCell);
            Cell cell = initializeCell(row, leftHeaderSizeOfData + j);

            addCellComment(datasetAccess.observationAttributesAtPermutation(permutationAtCell), cell);

            if (observation != null) {
                if (NumberUtils.isNumber(observation)) {
                    cell.setCellValue(NumberUtils.createDouble(observation));
                    cell.setCellType(Cell.CELL_TYPE_NUMERIC);
                } else {
                    cell.setCellValue(observation);
                    cell.setCellType(Cell.CELL_TYPE_STRING);
                }
            }
            cell.setCellStyle(createStyleSolid(COLOR_BLUE_LIGHT, null, null));
        }
    }

    private void addCellComment(CellCommentDetails cellCommentDetails, Cell cell) {
        String commentString = cellCommentDetails.getValue();
        if (commentString == null) {
            return;
        }

        // Create the comment
        Drawing drawing = sheet.createDrawingPatriarch();

        // When the comment box is visible, have it show in a box
        ClientAnchor anchor = creationHelper.createClientAnchor();
        anchor.setCol1(cell.getColumnIndex());

        anchor.setCol2(cell.getColumnIndex() + cellCommentDetails.calculateNumberOfColumnsToAccomodateComment());
        anchor.setRow1(cell.getRowIndex());
        anchor.setRow2(cell.getRowIndex() + cellCommentDetails.calculateNumberOfRowsToAccomodateComment());

        Comment comment = drawing.createCellComment(anchor);
        RichTextString str = creationHelper.createRichTextString(commentString);
        comment.setString(str);

        cell.setCellComment(comment);
    }

    private String toDimensionValueLabel(String dimensionId, String dimensionValueId) {
        LabelVisualisationModeEnum labelVisualisation = datasetAccess.getDimensionLabelVisualisationMode(dimensionId);
        String dimensionValueLabel = null;
        if (labelVisualisation.isLabel() && labelVisualisation.isCode()) {
            dimensionValueLabel = datasetAccess.getDimensionValueLabel(dimensionId, dimensionValueId) + " (" + dimensionValueId + ")";
        } else if (labelVisualisation.isLabel()) {
            dimensionValueLabel = datasetAccess.getDimensionValueLabel(dimensionId, dimensionValueId);
        } else if (labelVisualisation.isCode()) {
            dimensionValueLabel = dimensionValueId;
        }
        return dimensionValueLabel;
    }

    public void write(OutputStream os) throws MetamacException {
        initialize();
        header();
        contentHeader();
        content();
        footer();

        // Adjust column width
        for (int i = 0; i < maxRightColumnIndexWithContent; i++) {
            sheet.setColumnWidth(i, 16 * 256); // 15 characters of width
        }

        try {
            workbook.write(os);
        } catch (IOException e) {
            log.error("Error writing excel to OutputStream", e);
            throw new MetamacException(e, ServiceExceptionType.UNKNOWN, "Error writing excel to OutputStream");
        }
        workbook.dispose();
    }

    private static XSSFColor getXSSFColor(String RGB) {

        int red = Integer.parseInt(RGB.substring(0, 2), 16);
        int green = Integer.parseInt(RGB.substring(2, 4), 16);
        int blue = Integer.parseInt(RGB.substring(4, 6), 16);

        return new XSSFColor(new byte[]{(byte) red, (byte) green, (byte) blue});
    }

    /**
     * Create a cellStyle with solid foreground color and font color
     * 
     * @param foregroundColor required
     * @param fontColor optional
     * @return
     */
    private CellStyle createStyleSolid(XSSFColor foregroundColor, XSSFColor fontColor, Boolean bold) {
        if (foregroundColor == null && fontColor == null) {
            return null;
        }

        CellStyle style = workbook.createCellStyle();

        // We work with XLSX -> SXSSFWorkbook
        XSSFCellStyle styleXSSF = (XSSFCellStyle) style;

        if (foregroundColor != null) {
            styleXSSF.setFillPattern(XSSFCellStyle.SOLID_FOREGROUND);
            styleXSSF.setFillForegroundColor(foregroundColor);
        }

        if (fontColor != null) {
            Font font = workbook.createFont();
            // We work with XLSX -> SXSSFWorkbook
            XSSFFont fontXSSF = (XSSFFont) font;
            fontXSSF.setColor(fontColor);
            fontXSSF.setBold(bold);
            styleXSSF.setFont(fontXSSF);
        }

        return style;
    }

    private Cell initializeCell(Row row, int headerColumn) {
        if (headerColumn > maxRightColumnIndexWithContent) {
            maxRightColumnIndexWithContent = headerColumn;
        }
        return row.createCell(headerColumn);
    }
}