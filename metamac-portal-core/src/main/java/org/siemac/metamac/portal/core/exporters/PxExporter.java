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
import java.util.Date;
import java.util.List;

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
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.DataStructureDefinition;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;

public class PxExporter {

    private final DatasetAccessForPx datasetAccess;

    public PxExporter(Dataset dataset, String lang, String langAlternative) throws MetamacException {
        this.datasetAccess = new DatasetAccessForPx(dataset, lang, langAlternative);
    }

    public void write(OutputStream os) throws MetamacException {
        PrintWriter printWriter = null;
        try {
            printWriter = new PrintWriter(new OutputStreamWriter(os, Charset.forName("UTF-8")));
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
        writeField(printWriter, "LANGUAGE", datasetAccess.getLangEffective());
        writeFieldResourceId(printWriter, "LANGUAGES", datasetAccess.getDataset().getMetadata().getLanguages());

        writeField(printWriter, "CREATION-DATE", datasetAccess.getDataset().getMetadata().getCreatedDate());
        writeField(printWriter, "NEXT-UPDATE", datasetAccess.getDataset().getMetadata().getDateNextUpdate());
        writeFieldResourceName(printWriter, "UPDATE-FREQUENCY", datasetAccess.getDataset().getMetadata().getUpdateFrequency());
        writeField(printWriter, "SHOWDECIMALS", datasetAccess.getDataset().getMetadata().getRelatedDsd().getShowDecimals());
        writeField(printWriter, "AUTOPEN", datasetAccess.getDataset().getMetadata().getRelatedDsd().getAutoOpen());
        writeField(printWriter, "COPYRIGHT", datasetAccess.getDataset().getMetadata().getCopyrightDate() != null);
        writeField(printWriter, "DESCRIPTION", datasetAccess.getDataset().getDescription());
        writeField(printWriter, "TITLE", datasetAccess.getDataset().getName());

        writeDimensions(printWriter);
        writeDimensionValuesLabels(printWriter);
        writeDimensionValues(printWriter);

        writeField(printWriter, "LAST-UPDATED", datasetAccess.getDataset().getMetadata().getLastUpdate());
        writeFieldResourceName(printWriter, "CONTACT", datasetAccess.getDataset().getMetadata().getRightsHolder());
        writeFieldResourceName(printWriter, "SOURCE", datasetAccess.getDataset().getMetadata().getMaintainer());

        // TODO atributos
        // NOTEX="Los datos corresponden a turistas entrados por vía aérea.";
        // NOTE="En las estimaciones para el total de Canarias se incluyen los turistas de "
        // "La Gomera y El Hierro.#(p) Dato provisional.#(*) Dato estimado con menos de 20 "
        // "observaciones muestrales.";
        // NOTEX("Motivos de la estancia")="Notex para motivos de la estancia";
        // NOTEX[en]("Reason for stay")="Notex para motivos de la estancia English";
        // NOTE("Motivos de la estancia")="Note para motivos de la estancia";
        // NOTE[en]("Reason for stay")="Note para motivos de la estancia English";
        // NOTEX("Islas de destino principal")="Notex para Islas de destino principal";
        // NOTEX[en]("Principal destination")="Notex para Islas de destino principal English";
        // NOTE("Islas de destino principal")="Note para Islas de destino principal";
        // NOTE[en]("Principal destination")="Note para Islas de destino principal English";
        // VALUENOTEX("Motivos de la estancia","TOTAL MOTIVOS")="Value notex 1";
        // VALUENOTEX[en]("Reason for stay","TOTAL")="Value notex 1 English";
        // VALUENOTEX("Motivos de la estancia","Trabajo o negocios")="Value notex 2";
        // VALUENOTEX("Islas de destino principal","CANARIAS")="Value notex Canarias";
        // VALUENOTEX[en]("Principal destination","CANARY ISLANDS")="Value notex Canary Islands";
        // VALUENOTE("Motivos de la estancia","Ocio o vacaciones")="Value note 1";
        // VALUENOTE("Islas de destino principal","CANARIAS")="Value note Canarias";
        // VALUENOTE[en]("Reason for stay","Work")="Value note Reason form stay - Work english";
        // CELLNOTEX("*","*","*")="Nota para todas las observaciones";
        // CELLNOTEX[en]("*","*","*")="Nota para todas las observaciones English";
        // CELLNOTEX("Trabajo o negocios","*","2010 Septiembre (p)")="Trabajo o negocios, todas las islas en 2010 Septiembre";
        // CELLNOTEX[en]("Work","*","2010 Septiembre (p)")="EN Trabajo o negocios, todas las islas en 2010 Septiembre";
        // CELLNOTEX("Trabajo o negocios","Lanzarote","2010 Septiembre (p)")="Cell notex 1";
        // CELLNOTEX("Ocio o vacaciones","La Palma","*")="Ocio o vacaciones en La Palma";
        // CELLNOTE("Trabajo o negocios","*","2010 Septiembre (p)")="Trabajo o negocios en 2010 Septiembre";
        // CELLNOTE("Trabajo o negocios","Lanzarote","2010 Septiembre (p)")="Trabajo o negocios en Lanzarote en 2010 Septiembre";
        // CELLNOTE[en]("Work","Lanzarote EN","2010 Septiembre (p)")="Work Lanzarote 2010 September";
        // CELLNOTEX("Trabajo o negocios","*","*")="Cellnotex Trabajo o negocios";
        // CELLNOTEX[en]("Work","*","*")="EN Cellnotex Trabajo o negocios";
        // DATANOTECELL("*","*","*")="Data note cell 4";
        // DATANOTECELL("Trabajo o negocios","ES708","2010 Noviembre (p)")="ES Data note cell 1";
        // DATANOTECELL("Trabajo o negocios","ES707","2010 Noviembre (p)")="ES Data note cell 2";
        // DATANOTECELL[en]("Trabajo o negocios","ES707","2010 Noviembre (p)")="EN Data note cell 2";
        // DATANOTECELL("Personal","ES708","2010 Septiembre (p)")="ES Data note cell 4";

        writeData(printWriter);
    }

    private void writeField(PrintWriter printWriter, String name, String value) {
        if (value == null) {
            return;
        }
        printWriter.println(name + EQUALS + QUOTE + value + QUOTE + SEMICOLON);
    }

    private void writeField(PrintWriter printWriter, String name, String lang, String value) {
        if (value == null) {
            return;
        }
        printWriter.println(name + "[" + lang + "]=\"" + value + QUOTE + SEMICOLON);
    }

    private void writeFieldWithoutQuote(PrintWriter printWriter, String name, String value) {
        if (value == null) {
            return;
        }
        printWriter.println(name + EQUALS + value + SEMICOLON);
    }

    private void writeField(PrintWriter printWriter, String name, Integer value) {
        if (value == null) {
            return;
        }
        String valueString = String.valueOf(value);
        writeFieldWithoutQuote(printWriter, name, valueString);
    }

    private void writeField(PrintWriter printWriter, String name, Boolean value) {
        if (value == null) {
            return;
        }
        String valueString = value ? "YES" : "NO";
        writeFieldWithoutQuote(printWriter, name, valueString);
    }

    /**
     * Write with date transformed to "yyyyMMdd HH:mm";
     */
    private void writeField(PrintWriter printWriter, String name, Date value) {
        if (value == null) {
            return;
        }
        String valueString = QUOTE + (new DateTime(value)).toString("yyyyMMdd HH:mm") + QUOTE;
        writeFieldWithoutQuote(printWriter, name, valueString);
    }

    private void writeField(PrintWriter printWriter, String name, List<String> values) {
        if (CollectionUtils.isEmpty(values)) {
            return;
        }
        String value = listToValue(values);
        writeFieldWithoutQuote(printWriter, name, value);
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
                writeField(printWriter, name, lang, localisedString.getValue());
            }
        }
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
        return QUOTE + StringUtils.join(sources, QUOTE + COMMA + QUOTE) + QUOTE;
    }

}