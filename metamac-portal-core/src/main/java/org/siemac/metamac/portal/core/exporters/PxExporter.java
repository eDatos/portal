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
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

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

        // TODO atributos
        writeAttributes(printWriter);
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

    private String formatValue(String value) {
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

    private void writeAttributes(PrintWriter printWriter) {
        List<Attribute> attributes = datasetAccess.getAttributesMetadata();
        if (CollectionUtils.isEmpty(attributes)) {
            return;
        }
        writeAttributesDatasetAttachmentLevel(printWriter, attributes);
        writeAttributesDimensionAttachmentLevelOneDimension(printWriter, attributes);
        writeAttributesDimensionAttachmentLevelMoreThanOneDimensionOrObservation(printWriter, attributes);
        // TODO value note para los atributos que tengan más de una dimensión
        // TODO atributos de observación

        // TODO resto; añadir si colisionan
    }

    private void writeAttributesDatasetAttachmentLevel(PrintWriter printWriter, List<Attribute> attributes) {
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
                    if (value.length() != 0) {
                        value.append("#");
                    }
                    value.append(attributeValues[0]);
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

    private void writeAttributesDimensionAttachmentLevelOneDimension(PrintWriter printWriter, List<Attribute> attributes) {
        String valueNotexName = "VALUENOTEX";
        String valueNoteName = "VALUENOTE";

        // Attribute values indexed by dimensionId and dimensionValueId
        Map<String, Map<String, StringBuilder>> valueNotex = new HashMap<String, Map<String, StringBuilder>>();
        Map<String, Map<String, StringBuilder>> valueNote = new HashMap<String, Map<String, StringBuilder>>();

        // Builds attribute values. If exist more than one attribute to pair dimensionId-dimensionValueId concat values with <br/> (# in PX)
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
                    if (value.length() != 0) {
                        value.append("#");
                    }
                    value.append(attributeValue);
                }
            }
        }

        // Print in stream
        writeAttributeDimensionAttachmentLevelOneDimension(printWriter, valueNotexName, valueNotex);
        writeAttributeDimensionAttachmentLevelOneDimension(printWriter, valueNoteName, valueNote);
    }

    // TODO primero stub
    private void writeAttributesDimensionAttachmentLevelMoreThanOneDimensionOrObservation(PrintWriter printWriter, List<Attribute> attributes) {
        String cellNotexName = "CELLNOTEX";
        String cellNoteName = "CELLNOTE";

        // Attribute values indexed by dimensionId and dimensionValueId
        Map<String, Map<String, StringBuilder>> cellNotex = new HashMap<String, Map<String, StringBuilder>>();
        Map<String, Map<String, StringBuilder>> cellNote = new HashMap<String, Map<String, StringBuilder>>();

        // First stub and then heading
        List<String> dimensionsOrderedToAttributes = new ArrayList<String>();
        dimensionsOrderedToAttributes.addAll(datasetAccess.getDataset().getMetadata().getRelatedDsd().getStub().getDimensionIds());
        dimensionsOrderedToAttributes.addAll(datasetAccess.getDataset().getMetadata().getRelatedDsd().getHeading().getDimensionIds());

        // Builds attribute values. If exist more than one attribute to pair dimensionId-dimensionValueId concat values with <br/> (# in PX)
        for (Attribute attribute : attributes) {
            if (AttributeAttachmentLevelType.PRIMARY_MEASURE.equals(attribute.getAttachmentLevel())
                    || (AttributeAttachmentLevelType.DIMENSION.equals(attribute.getAttachmentLevel()) && attribute.getDimensions().getDimensions().size() > 1)) {
                String attributeId = attribute.getId();
                String[] attributeValues = datasetAccess.getAttributeValues(attributeId);
                if (attributeValues != null) {
                    continue;
                }
                String dimensionId = attribute.getDimensions().getDimensions().get(0).getDimensionId();

                Map<String, Map<String, StringBuilder>> attributeValuesByDimensionId = cellNotexName.equals(attributeId) ? cellNotex : cellNote;
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
                    if (value.length() != 0) {
                        value.append("#");
                    }
                    value.append(attributeValue);
                }
            }
        }

        // Print in stream TODO

    }

    private void writeAttributeDimensionAttachmentLevelOneDimension(PrintWriter printWriter, String name, Map<String, Map<String, StringBuilder>> valueNote) {
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
}