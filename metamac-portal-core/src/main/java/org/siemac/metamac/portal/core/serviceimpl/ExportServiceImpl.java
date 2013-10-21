package org.siemac.metamac.portal.core.serviceimpl;

import java.io.OutputStream;

import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.portal.core.conf.PortalConfiguration;
import org.siemac.metamac.portal.core.domain.DatasetSelectionForExcel;
import org.siemac.metamac.portal.core.domain.DatasetSelectionForTsv;
import org.siemac.metamac.portal.core.exporters.ExcelExporter;
import org.siemac.metamac.portal.core.exporters.ImageExporter;
import org.siemac.metamac.portal.core.exporters.PxExporter;
import org.siemac.metamac.portal.core.exporters.TsvExporter;
import org.siemac.metamac.portal.core.serviceapi.validators.ExportServiceInvocationValidator;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("exportService")
public class ExportServiceImpl extends ExportServiceImplBase {

    @Autowired
    private ExportServiceInvocationValidator exportServiceInvocationValidator;

    @Autowired
    private PortalConfiguration              portalConfiguration;

    @Override
    public void exportDatasetToExcel(ServiceContext ctx, Dataset dataset, DatasetSelectionForExcel datasetSelection, String lang, OutputStream resultOutputStream) throws MetamacException {
        exportServiceInvocationValidator.checkExportDatasetToExcel(ctx, dataset, datasetSelection, lang, resultOutputStream);

        String langDefault = portalConfiguration.retrieveLanguageDefault();
        if (lang == null) {
            lang = langDefault;
        }
        ExcelExporter exporter = new ExcelExporter(dataset, datasetSelection, lang, langDefault);
        exporter.write(resultOutputStream);
    }

    @Override
    public void exportDatasetToTsv(ServiceContext ctx, Dataset dataset, DatasetSelectionForTsv datasetSelection, String lang, OutputStream resultObservationsOutputStream,
            OutputStream resultAttributesOutputStream) throws MetamacException {
        exportServiceInvocationValidator.checkExportDatasetToTsv(ctx, dataset, datasetSelection, lang, resultObservationsOutputStream, resultAttributesOutputStream);

        String langDefault = portalConfiguration.retrieveLanguageDefault();
        if (lang == null) {
            lang = langDefault;
        }
        TsvExporter exporter = new TsvExporter(dataset, datasetSelection, lang, langDefault);
        exporter.writeObservationsAndAttributesWithObservationAttachmentLevel(resultObservationsOutputStream);
        exporter.writeAttributesWithDatasetAndDimensionAttachmentLevel(resultAttributesOutputStream);
    }

    @Override
    public void exportDatasetToPx(ServiceContext ctx, Dataset dataset, String lang, OutputStream resultOutputStream) throws MetamacException {
        exportServiceInvocationValidator.checkExportDatasetToPx(ctx, dataset, lang, resultOutputStream);

        String langDefault = portalConfiguration.retrieveLanguageDefault();
        if (lang == null) {
            lang = langDefault;
        }
        PxExporter exporter = new PxExporter(dataset, lang, langDefault);
        exporter.write(resultOutputStream);

    }

    @Override
    public void exportSvgToImage(ServiceContext ctx, String svg, Float width, String mimeType, OutputStream resultOutputStream) throws MetamacException {
        exportServiceInvocationValidator.checkExportSvgToImage(ctx, svg, width, mimeType, resultOutputStream);

        ImageExporter exporter = new ImageExporter(svg, width, mimeType);
        exporter.write(resultOutputStream);
    }
}