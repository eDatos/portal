package com.stat4you.transformation.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.fail;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.joda.time.DateTime;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.arte.statistic.dataset.repository.dto.AttributeBasicDto;
import com.arte.statistic.dataset.repository.dto.AttributeDto;
import com.arte.statistic.dataset.repository.dto.ObservationExtendedDto;
import com.arte.statistic.parser.px.domain.PxData;
import com.stat4you.common.dto.InternationalStringDto;
import com.stat4you.common.dto.LocalisedStringDto;
import com.stat4you.common.test.utils.Stat4YouAsserts;
import com.stat4you.statistics.dsd.domain.AttributeAttachmentLevelEnum;
import com.stat4you.statistics.dsd.domain.DatasetSourceEnum;
import com.stat4you.statistics.dsd.domain.DimensionTypeEnum;
import com.stat4you.statistics.dsd.dto.CodeDimensionDto;
import com.stat4you.statistics.dsd.dto.DatasetDto;
import com.stat4you.statistics.dsd.dto.DimensionDto;
import com.stat4you.transformation.csv.daeurope.DigitalAgendaEuropeCsvConstants;
import com.stat4you.transformation.dto.DigitalAgendaEuropeCsvDto;
import com.stat4you.transformation.dto.PxImportDto;
import com.stat4you.transformation.dto.StatisticDto;
import com.stat4you.transformation.mapper.PxMapper;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring/transformation-applicationContext-test.xml"})
public class TransformationServiceTest {

    @Autowired
    protected TransformationService transformationService;

    @Autowired
    protected PxMapper pxMapper;

    private final ServiceContext    serviceContext = new ServiceContext("junit", "junit", "app");

    @Test
    public void testTransformPxToDataset() throws Exception {
        InputStream pxStream = TransformationServiceTest.class.getResourceAsStream("/px/E16028B_0008-attributes.px");
        PxImportDto pxImportDto = new PxImportDto();
        pxImportDto.setContent(pxStream);
        pxImportDto.setProviderUri("stat4you:dsd:provider:P-2");
        pxImportDto.setCategory("categoryMock");
        pxImportDto.setPxUrl("http://urlmock");

        // Transform
        StatisticDto statisticDto = transformationService.transformPxToStatistic(serviceContext, pxImportDto);
        DatasetDto datasetDto = statisticDto.getDataset();

        assertEquals("TURISTAS_MOTIVOS_ESTANCIA_LUGARES_RESIDENCIA_ISLAS", datasetDto.getIdentifier());
        assertEquals(pxImportDto.getProviderUri(), datasetDto.getProviderUri());
        assertNull(datasetDto.getPublisher());
        assertEquals(2, datasetDto.getTitle().getTexts().size());
        assertEquals(
                "Turistas según motivos de la estancia y lugares de residencia e islas de destino principal y periodos. FRONTUR-Canarias: Resultados mensuales de entrada de turistas. Enero 2011",
                datasetDto.getTitle().getLocalisedLabel("es"));
        assertEquals("Reason for stay, Principal destination, Periods", datasetDto.getTitle().getLocalisedLabel("en"));
        assertEquals(1, datasetDto.getDescription().getTexts().size());
        assertEquals("Turistas según motivos de la estancia y lugares de residencia e islas de destino principal y periodos. Descripción", datasetDto.getDescription().getLocalisedLabel("es"));;
        assertEquals(pxImportDto.getPxUrl(), datasetDto.getUrl());
        assertEquals("(M) Actualización mensual", datasetDto.getFrequency());
        assertEquals(2, datasetDto.getLanguages().size());
        assertEquals("es", datasetDto.getLanguages().get(0));
        assertEquals("en", datasetDto.getLanguages().get(1));
        assertEquals(1, datasetDto.getCategories().size());
        assertEquals(pxImportDto.getCategory(), datasetDto.getCategories().get(0));
        assertNull(datasetDto.getReleaseDate());
        assertEquals("20091123 12:00", datasetDto.getProviderReleaseDate().toString("yyyyMMdd HH:mm"));
        assertNull(datasetDto.getPublishingDate());
        assertNull(datasetDto.getUnpublishingDate());
        assertEquals("20110922 09:30", datasetDto.getProviderPublishingDate().toString("yyyyMMdd HH:mm"));
        assertEquals(DatasetSourceEnum.PX, datasetDto.getSource());

        // Primary measure
        assertEquals("OBS_VALUE", datasetDto.getPrimaryMeasure().getIdentifier());
        assertEquals(2, datasetDto.getPrimaryMeasure().getTitle().getTexts().size());
        assertEquals("Valor de la observación", datasetDto.getPrimaryMeasure().getTitle().getLocalisedLabel("es"));
        assertEquals("Observation value", datasetDto.getPrimaryMeasure().getTitle().getLocalisedLabel("en"));

        // Dimensions
        assertEquals(3, datasetDto.getDimensions().size());
        {
            DimensionDto dimensionDto = datasetDto.getDimensions().get(0);
            assertEquals("MOTIVOS_ESTANCIA", dimensionDto.getIdentifier());
            assertEquals(DimensionTypeEnum.MEASURE_DIMENSION, dimensionDto.getType());
            assertEquals("Motivos de la estancia", dimensionDto.getTitle().getLocalisedLabel("es"));
            assertEquals("Reason for stay", dimensionDto.getTitle().getLocalisedLabel("en"));
            assertEquals(5, dimensionDto.getCodes().size());
            assertEquals("000", dimensionDto.getCodes().get(0).getIdentifier());
            assertEquals("TOTAL MOTIVOS", dimensionDto.getCodes().get(0).getTitle().getLocalisedLabel("es"));
            assertEquals("TOTAL", dimensionDto.getCodes().get(0).getTitle().getLocalisedLabel("en"));
            assertEquals("001", dimensionDto.getCodes().get(1).getIdentifier());
            assertEquals("Ocio o vacaciones", dimensionDto.getCodes().get(1).getTitle().getLocalisedLabel("es"));
            assertEquals("Holidays", dimensionDto.getCodes().get(1).getTitle().getLocalisedLabel("en"));
            assertEquals("002", dimensionDto.getCodes().get(2).getIdentifier());
            assertEquals("Trabajo o negocios", dimensionDto.getCodes().get(2).getTitle().getLocalisedLabel("es"));
            assertEquals("Work", dimensionDto.getCodes().get(2).getTitle().getLocalisedLabel("en"));
            assertEquals("003", dimensionDto.getCodes().get(3).getIdentifier());
            assertEquals("Personal", dimensionDto.getCodes().get(3).getTitle().getLocalisedLabel("es"));
            assertEquals("Personal", dimensionDto.getCodes().get(3).getTitle().getLocalisedLabel("en"));
            assertEquals("004", dimensionDto.getCodes().get(4).getIdentifier());
            assertEquals("Otros motivos", dimensionDto.getCodes().get(4).getTitle().getLocalisedLabel("es"));
            assertEquals("Other", dimensionDto.getCodes().get(4).getTitle().getLocalisedLabel("en"));
        }
        {
            DimensionDto dimensionDto = datasetDto.getDimensions().get(1);
            assertEquals("ISLAS", dimensionDto.getIdentifier());
            assertEquals(DimensionTypeEnum.GEOGRAPHIC_DIMENSION, dimensionDto.getType());
            assertEquals("Islas", dimensionDto.getTitle().getLocalisedLabel("es"));
            assertEquals("Principal destination", dimensionDto.getTitle().getLocalisedLabel("en"));
            assertEquals(6, dimensionDto.getCodes().size());
            assertEquals("ES70", dimensionDto.getCodes().get(0).getIdentifier());
            assertEquals("CANARIAS", dimensionDto.getCodes().get(0).getTitle().getLocalisedLabel("es"));
            assertEquals("CANARY ISLANDS", dimensionDto.getCodes().get(0).getTitle().getLocalisedLabel("en"));
            assertEquals("ES708", dimensionDto.getCodes().get(1).getIdentifier());
            assertEquals("Lanzarote", dimensionDto.getCodes().get(1).getTitle().getLocalisedLabel("es"));
            assertEquals("Lanzarote EN", dimensionDto.getCodes().get(1).getTitle().getLocalisedLabel("en"));
            assertEquals("ES704", dimensionDto.getCodes().get(2).getIdentifier());
            assertEquals("Fuerteventura", dimensionDto.getCodes().get(2).getTitle().getLocalisedLabel("es"));
            assertEquals("Fuerteventura EN", dimensionDto.getCodes().get(2).getTitle().getLocalisedLabel("en"));
            assertEquals("ES705", dimensionDto.getCodes().get(3).getIdentifier());
            assertEquals("Gran Canaria", dimensionDto.getCodes().get(3).getTitle().getLocalisedLabel("es"));
            assertEquals("Gran Canaria EN", dimensionDto.getCodes().get(3).getTitle().getLocalisedLabel("en"));
            assertEquals("ES709", dimensionDto.getCodes().get(4).getIdentifier());
            assertEquals("Tenerife", dimensionDto.getCodes().get(4).getTitle().getLocalisedLabel("es"));
            assertEquals("Tenerife EN", dimensionDto.getCodes().get(4).getTitle().getLocalisedLabel("en"));
            assertEquals("ES707", dimensionDto.getCodes().get(5).getIdentifier());
            assertEquals("La Palma", dimensionDto.getCodes().get(5).getTitle().getLocalisedLabel("es"));
            assertEquals("La Palma EN", dimensionDto.getCodes().get(5).getTitle().getLocalisedLabel("en"));
        }
        {
            DimensionDto dimensionDto = datasetDto.getDimensions().get(2);
            assertEquals("PERIODOS", dimensionDto.getIdentifier());
            assertEquals(DimensionTypeEnum.TIME_DIMENSION, dimensionDto.getType());
            assertEquals("Periodos", dimensionDto.getTitle().getLocalisedLabel("es"));
            assertEquals("Periods", dimensionDto.getTitle().getLocalisedLabel("en"));
            assertEquals(24, dimensionDto.getCodes().size());
            assertEquals("2009M09", dimensionDto.getCodes().get(0).getIdentifier());
            assertEquals("2009 Septiembre (p)", dimensionDto.getCodes().get(0).getTitle().getLocalisedLabel("es"));
            assertEquals("2009 Septiembre (p)", dimensionDto.getCodes().get(0).getTitle().getLocalisedLabel("en"));
            // ...
        }

        // Attributes definitions
        assertEquals(13, datasetDto.getAttributeDefinitions().size());
        int j = -1;

        // NOTEX="Los datos corresponden a turistas entrados por vía aérea.";
        assertEquals("NOTEX_1", datasetDto.getAttributeDefinitions().get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DATASET, datasetDto.getAttributeDefinitions().get(j).getAttachmentLevel());
        // NOTE="En las estimaciones para el total de Canarias se incluyen los turistas de...";
        assertEquals("NOTE_1", datasetDto.getAttributeDefinitions().get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DATASET, datasetDto.getAttributeDefinitions().get(j).getAttachmentLevel());
        // CELLNOTEX("*","*","*")="Nota para todas las observaciones";
        assertEquals("NOTEX_2", datasetDto.getAttributeDefinitions().get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DATASET, datasetDto.getAttributeDefinitions().get(j).getAttachmentLevel());

        // VALUENOTE("Motivos de la estancia","Ocio o vacaciones")="Value note 1 ocio";
        // VALUENOTE("Motivos de la estancia","Personal")="Value note 1 personal";
        // VALUENOTE[en]("Reason for stay","Work")="Value note Reason form stay - Work english";
        assertEquals("VALUENOTE_1", datasetDto.getAttributeDefinitions().get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DIMENSION, datasetDto.getAttributeDefinitions().get(j).getAttachmentLevel());
        assertEquals(1, datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().size());
        assertEquals("MOTIVOS_ESTANCIA", datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().get(0).getIdentifier());
        // VALUENOTE("Islas","CANARIAS")="Value note Canarias";
        assertEquals("VALUENOTE_2", datasetDto.getAttributeDefinitions().get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DIMENSION, datasetDto.getAttributeDefinitions().get(j).getAttachmentLevel());
        assertEquals(1, datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().size());
        assertEquals("ISLAS", datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().get(0).getIdentifier());

        // VALUENOTEX("Motivos de la estancia","Ocio o vacaciones")="Value notex 1 ocio";
        // VALUENOTEX("Motivos de la estancia","TOTAL MOTIVOS")="Value notex 1";
        // VALUENOTEX[en]("Reason for stay","TOTAL")="Value notex 1 English";
        // VALUENOTEX("Motivos de la estancia","Trabajo o negocios")="Value notex 2";
        // VALUENOTEX[en]("Principal destination","CANARY ISLANDS")="Value notex Canary Islands";
        assertEquals("VALUENOTEX_1", datasetDto.getAttributeDefinitions().get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DIMENSION, datasetDto.getAttributeDefinitions().get(j).getAttachmentLevel());
        assertEquals(1, datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().size());
        assertEquals("MOTIVOS_ESTANCIA", datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().get(0).getIdentifier());
        // VALUENOTEX("Islas","CANARIAS")="Value notex Canarias";
        // VALUENOTEX("Islas","Lanzarote")="Value notex Lanzarote";
        assertEquals("VALUENOTEX_2", datasetDto.getAttributeDefinitions().get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DIMENSION, datasetDto.getAttributeDefinitions().get(j).getAttachmentLevel());
        assertEquals(1, datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().size());
        assertEquals("ISLAS", datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().get(0).getIdentifier());
        // CELLNOTEX("Trabajo o negocios","*","*")="Cellnotex para Trabajo o negocios";
        // CELLNOTEX("Personal","*","*")="Cellnotex para Personal";
        assertEquals("VALUENOTEX_3", datasetDto.getAttributeDefinitions().get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DIMENSION, datasetDto.getAttributeDefinitions().get(j).getAttachmentLevel());
        assertEquals(1, datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().size());
        assertEquals("MOTIVOS_ESTANCIA", datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().get(0).getIdentifier());
        // CELLNOTEX("Trabajo o negocios","*","2010 Septiembre (p)")="Trabajo o negocios, todas las islas en 2010 Septiembre";
        // CELLNOTEX[en]("Work","*","2010 Septiembre (p)")="EN Trabajo o negocios, todas las islas en 2010 Septiembre";
        assertEquals("VALUENOTEX_4", datasetDto.getAttributeDefinitions().get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DIMENSION, datasetDto.getAttributeDefinitions().get(j).getAttachmentLevel());
        assertEquals(2, datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().size());
        assertEquals("MOTIVOS_ESTANCIA", datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().get(0).getIdentifier());
        assertEquals("PERIODOS", datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().get(1).getIdentifier());
        // CELLNOTEX("Ocio o vacaciones","La Palma","*")="Ocio o vacaciones en La Palma";
        // CELLNOTEX("Ocio o vacaciones","Lanzarote","*")="Ocio o vacaciones en Lanzarote";
        assertEquals("VALUENOTEX_5", datasetDto.getAttributeDefinitions().get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DIMENSION, datasetDto.getAttributeDefinitions().get(j).getAttachmentLevel());
        assertEquals(2, datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().size());
        assertEquals("MOTIVOS_ESTANCIA", datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().get(0).getIdentifier());
        assertEquals("ISLAS", datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().get(1).getIdentifier());

        // CELLNOTEX("Trabajo o negocios","Lanzarote","2010 Septiembre (p)")="Cell notex 1";
        assertEquals("CELLNOTEX_1", datasetDto.getAttributeDefinitions().get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.OBSERVATION, datasetDto.getAttributeDefinitions().get(j).getAttachmentLevel());
        assertEquals(0, datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().size());
        // CELLNOTE("Trabajo o negocios","Lanzarote","2010 Septiembre (p)")="Trabajo o negocios en Lanzarote en 2010 Septiembre";
        // CELLNOTE[en]("Work","Lanzarote EN","2010 Septiembre (p)")="Work Lanzarote 2010 September";
        assertEquals("CELLNOTE_1", datasetDto.getAttributeDefinitions().get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.OBSERVATION, datasetDto.getAttributeDefinitions().get(j).getAttachmentLevel());
        assertEquals(0, datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().size());
        // DATANOTECELL("Trabajo o negocios","ES708","2010 Noviembre (p)")="ES Data note cell 1";
        // DATANOTECELL("Trabajo o negocios","ES707","2010 Noviembre (p)")="ES Data note cell 2";
        // DATANOTECELL("Personal","ES708","2010 Septiembre (p)")="ES Data note cell 4";
        assertEquals("DATANOTECELL_1", datasetDto.getAttributeDefinitions().get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.OBSERVATION, datasetDto.getAttributeDefinitions().get(j).getAttachmentLevel());
        assertEquals(0, datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().size());

        assertEquals(datasetDto.getAttributeDefinitions().size(), ++j);

        // Data (only attributes)
        List<AttributeDto> attributes = statisticDto.getAttributes();
        assertEquals(17, attributes.size());
        int i = 0;
        {
            // NOTEX="Los datos corresponden a turistas entrados por vía aérea.";
            AttributeDto attributeDto = attributes.get(i++);
            assertEquals("NOTEX_1", attributeDto.getAttributeId());
            assertEquals("Los datos corresponden a turistas entrados por vía aérea.", attributeDto.getValue().getLocalisedLabel("es"));
            assertEquals(0, attributeDto.getCodesDimension().size());
        }
        {
            // NOTE="En las estimaciones para el total de Canarias se incluyen los turistas de...
            AttributeDto attributeDto = attributes.get(i++);
            assertEquals("NOTE_1", attributeDto.getAttributeId());
            assertEquals("En las estimaciones para el total de Canarias se incluyen los turistas de...", attributeDto.getValue().getLocalisedLabel("es"));
            assertEquals(0, attributeDto.getCodesDimension().size());
        }
        {
            // CELLNOTEX("*","*","*")="Nota para todas las observaciones";
            AttributeDto attributeDto = attributes.get(i++);
            assertEquals("NOTEX_2", attributeDto.getAttributeId());
            assertEquals("Nota para todas las observaciones", attributeDto.getValue().getLocalisedLabel("es"));
            assertEquals(0, attributeDto.getCodesDimension().size());
        }
        {
            // VALUENOTE("Motivos de la estancia","Ocio o vacaciones")="Value note 1 ocio";
            AttributeDto attributeDto = attributes.get(i++);
            assertEquals("VALUENOTE_1", attributeDto.getAttributeId());
            assertEquals("Value note 1 ocio", attributeDto.getValue().getLocalisedLabel("es"));
            assertEquals(1, attributeDto.getCodesDimension().size());
            assertEquals("MOTIVOS_ESTANCIA", attributeDto.getCodesDimension().get(0).getDimensionId());
            assertEquals("001", attributeDto.getCodesDimension().get(0).getCodeDimensionId());
        }
        {
            // VALUENOTE("Motivos de la estancia","Personal")="Value note 1 personal";
            AttributeDto attributeDto = attributes.get(i++);
            assertEquals("VALUENOTE_1", attributeDto.getAttributeId());
            assertEquals("Value note 1 personal", attributeDto.getValue().getLocalisedLabel("es"));
            assertEquals(1, attributeDto.getCodesDimension().size());
            assertEquals("MOTIVOS_ESTANCIA", attributeDto.getCodesDimension().get(0).getDimensionId());
            assertEquals("003", attributeDto.getCodesDimension().get(0).getCodeDimensionId());
        }
        {
            // VALUENOTE("Islas","CANARIAS")="Value note Canarias";
            AttributeDto attributeDto = attributes.get(i++);
            assertEquals("VALUENOTE_2", attributeDto.getAttributeId());
            assertEquals("Value note Canarias", attributeDto.getValue().getLocalisedLabel("es"));
            assertEquals(1, attributeDto.getCodesDimension().size());
            assertEquals("ISLAS", attributeDto.getCodesDimension().get(0).getDimensionId());
            assertEquals("ES70", attributeDto.getCodesDimension().get(0).getCodeDimensionId());
        }
        {
            // VALUENOTE[en]("Reason for stay","Work")="Value note Reason form stay - Work english";
            AttributeDto attributeDto = attributes.get(i++);
            assertEquals("VALUENOTE_1", attributeDto.getAttributeId());
            assertEquals("Value note Reason form stay - Work english", attributeDto.getValue().getLocalisedLabel("en"));
            assertEquals(1, attributeDto.getCodesDimension().size());
            assertEquals("MOTIVOS_ESTANCIA", attributeDto.getCodesDimension().get(0).getDimensionId());
            assertEquals("002", attributeDto.getCodesDimension().get(0).getCodeDimensionId());
        }
        {
            // VALUENOTEX("Motivos de la estancia","Ocio o vacaciones")="Value notex 1 ocio";
            AttributeDto attributeDto = attributes.get(i++);
            assertEquals("VALUENOTEX_1", attributeDto.getAttributeId());
            assertEquals("Value notex 1 ocio", attributeDto.getValue().getLocalisedLabel("es"));
            assertEquals(1, attributeDto.getCodesDimension().size());
            assertEquals("MOTIVOS_ESTANCIA", attributeDto.getCodesDimension().get(0).getDimensionId());
            assertEquals("001", attributeDto.getCodesDimension().get(0).getCodeDimensionId());
        }
        {
            // VALUENOTEX("Motivos de la estancia","TOTAL MOTIVOS")="Value notex 1";
            // VALUENOTEX[en]("Reason for stay","TOTAL")="Value notex 1 English";
            AttributeDto attributeDto = attributes.get(i++);
            assertEquals("VALUENOTEX_1", attributeDto.getAttributeId());
            assertEquals("Value notex 1", attributeDto.getValue().getLocalisedLabel("es"));
            assertEquals("Value notex 1 English", attributeDto.getValue().getLocalisedLabel("en"));
            assertEquals(1, attributeDto.getCodesDimension().size());
            assertEquals("MOTIVOS_ESTANCIA", attributeDto.getCodesDimension().get(0).getDimensionId());
            assertEquals("000", attributeDto.getCodesDimension().get(0).getCodeDimensionId());
        }
        {
            // VALUENOTEX("Motivos de la estancia","Trabajo o negocios")="Value notex 2";
            AttributeDto attributeDto = attributes.get(i++);
            assertEquals("VALUENOTEX_1", attributeDto.getAttributeId());
            assertEquals("Value notex 2", attributeDto.getValue().getLocalisedLabel("es"));
            assertEquals(1, attributeDto.getCodesDimension().size());
            assertEquals("MOTIVOS_ESTANCIA", attributeDto.getCodesDimension().get(0).getDimensionId());
            assertEquals("002", attributeDto.getCodesDimension().get(0).getCodeDimensionId());
        }
        {
            // VALUENOTEX("Islas","CANARIAS")="Value notex Canarias";
            // VALUENOTEX[en]("Principal destination","CANARY ISLANDS")="Value notex Canary Islands";
            AttributeDto attributeDto = attributes.get(i++);
            assertEquals("VALUENOTEX_2", attributeDto.getAttributeId());
            assertEquals("Value notex Canarias", attributeDto.getValue().getLocalisedLabel("es"));
            assertEquals("Value notex Canary Islands", attributeDto.getValue().getLocalisedLabel("en"));
            assertEquals(1, attributeDto.getCodesDimension().size());
            assertEquals("ISLAS", attributeDto.getCodesDimension().get(0).getDimensionId());
            assertEquals("ES70", attributeDto.getCodesDimension().get(0).getCodeDimensionId());
        }
        {
            // VALUENOTEX("Islas","Lanzarote")="Value notex Lanzarote";
            AttributeDto attributeDto = attributes.get(i++);
            assertEquals("VALUENOTEX_2", attributeDto.getAttributeId());
            assertEquals("Value notex Lanzarote", attributeDto.getValue().getLocalisedLabel("es"));
            assertEquals(1, attributeDto.getCodesDimension().size());
            assertEquals("ISLAS", attributeDto.getCodesDimension().get(0).getDimensionId());
            assertEquals("ES708", attributeDto.getCodesDimension().get(0).getCodeDimensionId());
        }
        {
            // CELLNOTEX("Trabajo o negocios","*","*")="Cellnotex para Trabajo o negocios";
            AttributeDto attributeDto = attributes.get(i++);
            assertEquals("VALUENOTEX_3", attributeDto.getAttributeId());
            assertEquals("Cellnotex para Trabajo o negocios", attributeDto.getValue().getLocalisedLabel("es"));
            assertEquals(1, attributeDto.getCodesDimension().size());
            assertEquals("MOTIVOS_ESTANCIA", attributeDto.getCodesDimension().get(0).getDimensionId());
            assertEquals("002", attributeDto.getCodesDimension().get(0).getCodeDimensionId());
        }
        {
            // CELLNOTEX("Personal","*","*")="Cellnotex para Personal";
            AttributeDto attributeDto = attributes.get(i++);
            assertEquals("VALUENOTEX_3", attributeDto.getAttributeId());
            assertEquals("Cellnotex para Personal", attributeDto.getValue().getLocalisedLabel("es"));
            assertEquals(1, attributeDto.getCodesDimension().size());
            assertEquals("MOTIVOS_ESTANCIA", attributeDto.getCodesDimension().get(0).getDimensionId());
            assertEquals("003", attributeDto.getCodesDimension().get(0).getCodeDimensionId());
        }
        {
            // CELLNOTEX("Trabajo o negocios","*","2010 Septiembre (p)")="Trabajo o negocios, todas las islas en 2010 Septiembre";
            // CELLNOTEX[en]("Work","*","2010 Septiembre (p)")="EN Trabajo o negocios, todas las islas en 2010 Septiembre";
            AttributeDto attributeDto = attributes.get(i++);
            assertEquals("VALUENOTEX_4", attributeDto.getAttributeId());
            assertEquals("Trabajo o negocios, todas las islas en 2010 Septiembre", attributeDto.getValue().getLocalisedLabel("es"));
            assertEquals("EN Trabajo o negocios, todas las islas en 2010 Septiembre", attributeDto.getValue().getLocalisedLabel("en"));
            assertEquals(2, attributeDto.getCodesDimension().size());
            assertEquals("MOTIVOS_ESTANCIA", attributeDto.getCodesDimension().get(0).getDimensionId());
            assertEquals("002", attributeDto.getCodesDimension().get(0).getCodeDimensionId());
            assertEquals("PERIODOS", attributeDto.getCodesDimension().get(1).getDimensionId());
            assertEquals("2010M09", attributeDto.getCodesDimension().get(1).getCodeDimensionId());
        }
        {
            // CELLNOTEX("Ocio o vacaciones","La Palma","*")="Ocio o vacaciones en La Palma";
            AttributeDto attributeDto = attributes.get(i++);
            assertEquals("VALUENOTEX_5", attributeDto.getAttributeId());
            assertEquals("Ocio o vacaciones en La Palma", attributeDto.getValue().getLocalisedLabel("es"));
            assertEquals(2, attributeDto.getCodesDimension().size());
            assertEquals("MOTIVOS_ESTANCIA", attributeDto.getCodesDimension().get(0).getDimensionId());
            assertEquals("001", attributeDto.getCodesDimension().get(0).getCodeDimensionId());
            assertEquals("ISLAS", attributeDto.getCodesDimension().get(1).getDimensionId());
            assertEquals("ES707", attributeDto.getCodesDimension().get(1).getCodeDimensionId());
        }
        {
            // CELLNOTEX("Ocio o vacaciones","Lanzarote","*")="Ocio o vacaciones en Lanzarote";
            AttributeDto attributeDto = attributes.get(i++);
            assertEquals("VALUENOTEX_5", attributeDto.getAttributeId());
            assertEquals("Ocio o vacaciones en Lanzarote", attributeDto.getValue().getLocalisedLabel("es"));
            assertEquals(2, attributeDto.getCodesDimension().size());
            assertEquals("MOTIVOS_ESTANCIA", attributeDto.getCodesDimension().get(0).getDimensionId());
            assertEquals("001", attributeDto.getCodesDimension().get(0).getCodeDimensionId());
            assertEquals("ISLAS", attributeDto.getCodesDimension().get(1).getDimensionId());
            assertEquals("ES708", attributeDto.getCodesDimension().get(1).getCodeDimensionId());
        }

        assertEquals(attributes.size(), i);

        // Observations
        assertEquals(720, statisticDto.getObservationsExtended().size());
        // Note: observations are tested in testPxMapperData
        Map<String, ObservationExtendedDto> observationsByKey = new HashMap<String, ObservationExtendedDto>();
        for (ObservationExtendedDto observationExtendedDto : statisticDto.getObservationsExtended()) {
            observationsByKey.put(observationExtendedDto.getUniqueKey(), observationExtendedDto);
        }
        // Attribute observations
        {
            // CELLNOTEX("Trabajo o negocios","Lanzarote","2010 Septiembre (p)")="Cell notex 1";

            // CELLNOTE("Trabajo o negocios","Lanzarote","2010 Septiembre (p)")="Trabajo o negocios en Lanzarote en 2010 Septiembre";
            // CELLNOTE[en]("Work","Lanzarote EN","2010 Septiembre (p)")="Work Lanzarote 2010 September";
            ObservationExtendedDto observationExtendedDto = observationsByKey.get("002#ES708#2010M09");
            assertEquals(2, observationExtendedDto.getAttributes().size());
            {
                AttributeBasicDto attributeDto = observationExtendedDto.getAttributes().get(0);
                assertEquals("CELLNOTEX_1", attributeDto.getAttributeId());
                assertEquals("Cell notex 1", attributeDto.getValue().getLocalisedLabel("es"));
            }
            {
                AttributeBasicDto attributeDto = observationExtendedDto.getAttributes().get(1);
                assertEquals("CELLNOTE_1", attributeDto.getAttributeId());
                assertEquals("Trabajo o negocios en Lanzarote en 2010 Septiembre", attributeDto.getValue().getLocalisedLabel("es"));
                assertEquals("Work Lanzarote 2010 September", attributeDto.getValue().getLocalisedLabel("en"));
            }
        }
        {
            // DATANOTECELL("Trabajo o negocios","ES708","2010 Noviembre (p)")="ES Data note cell 1";
            ObservationExtendedDto observationExtendedDto = observationsByKey.get("002#ES708#2010M11");
            assertEquals(1, observationExtendedDto.getAttributes().size());
            {
                AttributeBasicDto attributeDto = observationExtendedDto.getAttributes().get(0);
                assertEquals("DATANOTECELL_1", attributeDto.getAttributeId());
                assertEquals("ES Data note cell 1", attributeDto.getValue().getLocalisedLabel("es"));
            }
        }
        {
            // DATANOTECELL("Trabajo o negocios","ES707","2010 Noviembre (p)")="ES Data note cell 2";
            ObservationExtendedDto observationExtendedDto = observationsByKey.get("002#ES707#2010M11");
            assertEquals(1, observationExtendedDto.getAttributes().size());
            {
                AttributeBasicDto attributeDto = observationExtendedDto.getAttributes().get(0);
                assertEquals("DATANOTECELL_1", attributeDto.getAttributeId());
                assertEquals("ES Data note cell 2", attributeDto.getValue().getLocalisedLabel("es"));
            }
        }
        {
            // DATANOTECELL("Personal","ES708","2010 Septiembre (p)")="ES Data note cell 4";
            ObservationExtendedDto observationExtendedDto = observationsByKey.get("003#ES708#2010M09");
            assertEquals(1, observationExtendedDto.getAttributes().size());
            {
                AttributeBasicDto attributeDto = observationExtendedDto.getAttributes().get(0);
                assertEquals("DATANOTECELL_1", attributeDto.getAttributeId());
                assertEquals("ES Data note cell 4", attributeDto.getValue().getLocalisedLabel("es"));
            }
        }
    }

    @Test
    public void testTransformPxToDatasetAttributesGlobalDuplicated() throws Exception {
        InputStream pxStream = TransformationServiceTest.class.getResourceAsStream("/px/I101003_0201-attributes-global-duplicated.px");
        PxImportDto pxImportDto = new PxImportDto();
        pxImportDto.setContent(pxStream);
        pxImportDto.setProviderUri("stat4you:dsd:provider:P-2");
        pxImportDto.setCategory("categoryMock");
        pxImportDto.setPxUrl("http://urlmock");

        // Transform
        StatisticDto statisticDto = transformationService.transformPxToStatistic(serviceContext, pxImportDto);
        DatasetDto datasetDto = statisticDto.getDataset();

        assertEquals("POBLACION_EDAD_ISLA_RESIDENCIA_SEXO_CENSOS_POBLACI", datasetDto.getIdentifier());
        assertEquals("Población por edad, isla de residencia y sexo. Censos de población y viviendas 2001. Unidades: Personas", datasetDto.getTitle().getLocalisedLabel("es"));
        assertEquals("Població per edat, illa de residència i sexe. Censos de població i habitatges 2001. Unitats: Persones", datasetDto.getTitle().getLocalisedLabel("ca"));

        // Attributes definitions
        assertEquals(3, datasetDto.getAttributeDefinitions().size());
        int j = -1;

        // NOTEX
        assertEquals("NOTEX_1", datasetDto.getAttributeDefinitions().get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DATASET, datasetDto.getAttributeDefinitions().get(j).getAttachmentLevel());
        // NOTE
        assertEquals("NOTE_1", datasetDto.getAttributeDefinitions().get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DATASET, datasetDto.getAttributeDefinitions().get(j).getAttachmentLevel());
        // CELLNOTEX("*","*","*")="Nota para todas las observaciones";
        assertEquals("NOTEX_2", datasetDto.getAttributeDefinitions().get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DATASET, datasetDto.getAttributeDefinitions().get(j).getAttachmentLevel());

        assertEquals(datasetDto.getAttributeDefinitions().size(), ++j);

        // Data (only attributes)
        List<AttributeDto> attributes = statisticDto.getAttributes();
        assertEquals(5, attributes.size());
        int i = 0;
        {
            // NOTEX="Notex español";
            // NOTEX[ca]="Notex ca";
            AttributeDto attributeDto = attributes.get(i++);
            assertEquals("NOTEX_1", attributeDto.getAttributeId());
            assertEquals("Notex español", attributeDto.getValue().getLocalisedLabel("es"));
            assertEquals("Notex ca", attributeDto.getValue().getLocalisedLabel("ca"));
            assertEquals(0, attributeDto.getCodesDimension().size());
        }
        {
            // NOTE="Note español";
            // NOTE[ca]="Note ca";
            AttributeDto attributeDto = attributes.get(i++);
            assertEquals("NOTE_1", attributeDto.getAttributeId());
            assertEquals("Note español", attributeDto.getValue().getLocalisedLabel("es"));
            assertEquals("Note ca", attributeDto.getValue().getLocalisedLabel("ca"));
            assertEquals(0, attributeDto.getCodesDimension().size());
        }
        {
            // NOTEX="Notex español repetida";
            AttributeDto attributeDto = attributes.get(i++);
            assertEquals("NOTEX_1", attributeDto.getAttributeId());
            assertEquals("Notex español repetida", attributeDto.getValue().getLocalisedLabel("es"));
            assertNull(attributeDto.getValue().getLocalisedLabel("ca"));
            assertEquals(0, attributeDto.getCodesDimension().size());
        }
        {
            // NOTE="Note español repetida";
            // NOTE[ca]="Note ca repetida";
            AttributeDto attributeDto = attributes.get(i++);
            assertEquals("NOTE_1", attributeDto.getAttributeId());
            assertEquals("Note español repetida", attributeDto.getValue().getLocalisedLabel("es"));
            assertEquals("Note ca repetida", attributeDto.getValue().getLocalisedLabel("ca"));
            assertEquals(0, attributeDto.getCodesDimension().size());

        }
        {
            // CELLNOTEX("*","*","*")="Nota para todas las observaciones";
            AttributeDto attributeDto = attributes.get(i++);
            assertEquals("NOTEX_2", attributeDto.getAttributeId());
            assertEquals("Nota para todas las observaciones", attributeDto.getValue().getLocalisedLabel("es"));
            assertEquals(0, attributeDto.getCodesDimension().size());
        }
    }

    @Test
    public void testTransformPxToDatasetMeasureDimensionAdHoc() throws Exception {
        PxImportDto pxImportDto = new PxImportDto();
        pxImportDto.setContent(TransformationServiceTest.class.getResourceAsStream("/px/E30245A_0002-without-contvariable.px"));
        pxImportDto.setProviderUri("stat4you:dsd:provider:P-3");
        pxImportDto.setCategory("categoryMock");
        pxImportDto.setPxUrl("http://urlmock");

        // Transform
        StatisticDto statisticDto = transformationService.transformPxToStatistic(serviceContext, pxImportDto);
        DatasetDto datasetDto = statisticDto.getDataset();

        // Dimensions
        assertEquals(3, datasetDto.getDimensions().size());
        {
            DimensionDto dimensionDto = datasetDto.getDimensions().get(0);
            assertEquals("MUNICIPIOS_ISLAS", dimensionDto.getIdentifier());
            assertEquals(DimensionTypeEnum.DIMENSION, dimensionDto.getType());
        }
        {
            DimensionDto dimensionDto = datasetDto.getDimensions().get(1);
            assertEquals("ANOS", dimensionDto.getIdentifier());
            assertEquals(DimensionTypeEnum.TIME_DIMENSION, dimensionDto.getType());
        }
        {
            DimensionDto dimensionDto = datasetDto.getDimensions().get(2);
            assertEquals("INDICADORES", dimensionDto.getIdentifier());
            assertEquals(DimensionTypeEnum.MEASURE_DIMENSION, dimensionDto.getType());
        }
    }

    @Test
    public void testTransformPxWithoutPeriodGeographicalValueInTitle() throws Exception {

        PxImportDto pxImportDto = new PxImportDto();
        pxImportDto.setContent(TransformationServiceTest.class.getResourceAsStream("/px/I101003_0201.px"));
        pxImportDto.setProviderUri("stat4you:dsd:provider:P-3");
        pxImportDto.setCategory("categoryMock");
        pxImportDto.setPxUrl("http://urlmock");
        pxImportDto.setPeriod("PERIOD EXPLICIT común para todos los idiomas");
        pxImportDto.setGeographicalValue(new InternationalStringDto());
        pxImportDto.getGeographicalValue().addText(new LocalisedStringDto("es", "VALOR GEOGRÁFICO EXPLÍCITO"));
        pxImportDto.getGeographicalValue().addText(new LocalisedStringDto("ca", "GEOGRAPHICAL VALUE EXPLICIT"));
        pxImportDto.setTitle(new InternationalStringDto());
        pxImportDto.getTitle().addText(new LocalisedStringDto("es", "Título adicional sólo en español"));
        pxImportDto.setForceAddContextInformation(Boolean.TRUE);

        // Transform
        StatisticDto statisticDto = transformationService.transformPxToStatistic(serviceContext, pxImportDto);
        DatasetDto datasetDto = statisticDto.getDataset();

        // Validate
        assertEquals("POBLACION_EDAD_ISLA_RESIDENCIA_SEXO_CENSOS_POBLACI", datasetDto.getIdentifier());
        assertEquals(
                "Población por edad, isla de residencia y sexo. Censos de población y viviendas 2001. Título adicional sólo en español. Población > Censos de población. VALOR GEOGRÁFICO EXPLÍCITO. PERIOD EXPLICIT común para todos los idiomas. Unidades: Personas",
                datasetDto.getTitle().getLocalisedLabel("es"));
        assertEquals(
                "Població per edat, illa de residència i sexe. Censos de població i habitatges 2001. Població > Censos de població. GEOGRAPHICAL VALUE EXPLICIT. PERIOD EXPLICIT común para todos los idiomas. Unitats: Persones",
                datasetDto.getTitle().getLocalisedLabel("ca"));
    }

    @Test
    public void testTransformPxEncoding() throws Exception {

        PxImportDto pxImportDto = new PxImportDto();
        pxImportDto.setProviderUri("stat4you:dsd:provider:P-3");
        pxImportDto.setCategory("categoryMock");
        pxImportDto.setPxUrl("http://urlmock");

        {
            // ISO
            pxImportDto.setContent(TransformationServiceTest.class.getResourceAsStream("/px/encoding/1YUwwZCV5G-ISO8859.px"));
            StatisticDto statisticDto = transformationService.transformPxToStatistic(serviceContext, pxImportDto);
            DatasetDto datasetDto = statisticDto.getDataset();
            assertEquals("NUMERO_MEDIO_ADMISIONES_HOSPITAL_DIA_ULTIMOS_12_ME", datasetDto.getIdentifier());
            assertEquals(
                    "Número medio de admisiones en el hospital de día en los últimos 12 meses según sexo y país de nacimiento. Media y desviación típica. Población de 16 y más años que ha utilizado algún hospital de día en los últimos 12 meses",
                    datasetDto.getTitle().getLocalisedLabel("es"));
        }
        {
            // MS-DOS
            pxImportDto.setContent(TransformationServiceTest.class.getResourceAsStream("/px/encoding/mt10001-msdos.px"));
            StatisticDto statisticDto = transformationService.transformPxToStatistic(serviceContext, pxImportDto);
            DatasetDto datasetDto = statisticDto.getDataset();
            assertEquals("DISTRIBUCION_POBLACION_CCAA_NATURALEZA_RETRIBUCION", datasetDto.getIdentifier());
            assertEquals(
                    "Distribución de la población por CCAA, naturaleza de las retribuciones, indicador, periodo y tipo de perceptor. Unidades: Retribución media:euros.Retribución/retención: miles de euros.Tipo:porcentaje",
                    datasetDto.getTitle().getLocalisedLabel("es"));
        }
    }

    @Test
    public void testPxMapperData() throws Exception {

        /**
         * 10 20 30
         * TENERIFE
         * STUDENT 1 2 3
         * WORKING 4 5 6
         * RETIRED 7 8 9
         * GRAN_CANARIA
         * STUDENT 10 11 12
         * WORKING 13 14 15
         * RETIRED 16 17 18
         * LA_PALMA
         * STUDENT 19 20 21
         * WORKING 22 23 24
         * RETIRED 25 26 27
         */

        // Observations
        PxData pxData = new PxData();
        for (int i = 1; i <= 27; i++) {
            pxData.getData().add(String.valueOf(i));
        }

        List<DimensionDto> dimensionsDto = new ArrayList<DimensionDto>();
        {
            DimensionDto dimensionDto = new DimensionDto();
            dimensionDto.setIdentifier("ISLAND");
            CodeDimensionDto codeDimensionDto1 = new CodeDimensionDto();
            codeDimensionDto1.setIdentifier("TENERIFE");
            dimensionDto.addCode(codeDimensionDto1);
            CodeDimensionDto codeDimensionDto2 = new CodeDimensionDto();
            codeDimensionDto2.setIdentifier("GRAN_CANARIA");
            dimensionDto.addCode(codeDimensionDto2);
            CodeDimensionDto codeDimensionDto3 = new CodeDimensionDto();
            codeDimensionDto3.setIdentifier("LA_PALMA");
            dimensionDto.addCode(codeDimensionDto3);
            dimensionsDto.add(dimensionDto);
        }
        {
            DimensionDto dimensionDto = new DimensionDto();
            dimensionDto.setIdentifier("OCCUPATION");
            CodeDimensionDto codeDimensionDto1 = new CodeDimensionDto();
            codeDimensionDto1.setIdentifier("STUDENT");
            dimensionDto.addCode(codeDimensionDto1);
            CodeDimensionDto codeDimensionDto2 = new CodeDimensionDto();
            codeDimensionDto2.setIdentifier("WORKING");
            dimensionDto.addCode(codeDimensionDto2);
            CodeDimensionDto codeDimensionDto3 = new CodeDimensionDto();
            codeDimensionDto3.setIdentifier("RETIRED");
            dimensionDto.addCode(codeDimensionDto3);
            dimensionsDto.add(dimensionDto);
        }
        {
            DimensionDto dimensionDto = new DimensionDto();
            dimensionDto.setIdentifier("AGE");
            CodeDimensionDto codeDimensionDto1 = new CodeDimensionDto();
            codeDimensionDto1.setIdentifier("10");
            dimensionDto.addCode(codeDimensionDto1);
            CodeDimensionDto codeDimensionDto2 = new CodeDimensionDto();
            codeDimensionDto2.setIdentifier("20");
            dimensionDto.addCode(codeDimensionDto2);
            CodeDimensionDto codeDimensionDto3 = new CodeDimensionDto();
            codeDimensionDto3.setIdentifier("30");
            dimensionDto.addCode(codeDimensionDto3);
            dimensionsDto.add(dimensionDto);
        }
        // Transform
        List<ObservationExtendedDto> observationsExtended = pxMapper.toObservations(pxData, null, dimensionsDto);

        // Validate
        assertEquals(27, observationsExtended.size());
        assertEqualsObservation("1", "TENERIFE#STUDENT#10", observationsExtended.get(0));
        assertEqualsObservation("2", "TENERIFE#STUDENT#20", observationsExtended.get(1));
        assertEqualsObservation("3", "TENERIFE#STUDENT#30", observationsExtended.get(2));
        assertEqualsObservation("4", "TENERIFE#WORKING#10", observationsExtended.get(3));
        assertEqualsObservation("5", "TENERIFE#WORKING#20", observationsExtended.get(4));
        assertEqualsObservation("6", "TENERIFE#WORKING#30", observationsExtended.get(5));
        assertEqualsObservation("7", "TENERIFE#RETIRED#10", observationsExtended.get(6));
        assertEqualsObservation("8", "TENERIFE#RETIRED#20", observationsExtended.get(7));
        assertEqualsObservation("9", "TENERIFE#RETIRED#30", observationsExtended.get(8));
        assertEqualsObservation("10", "GRAN_CANARIA#STUDENT#10", observationsExtended.get(9));
        assertEqualsObservation("11", "GRAN_CANARIA#STUDENT#20", observationsExtended.get(10));
        assertEqualsObservation("12", "GRAN_CANARIA#STUDENT#30", observationsExtended.get(11));
        assertEqualsObservation("13", "GRAN_CANARIA#WORKING#10", observationsExtended.get(12));
        assertEqualsObservation("14", "GRAN_CANARIA#WORKING#20", observationsExtended.get(13));
        assertEqualsObservation("15", "GRAN_CANARIA#WORKING#30", observationsExtended.get(14));
        assertEqualsObservation("16", "GRAN_CANARIA#RETIRED#10", observationsExtended.get(15));
        assertEqualsObservation("17", "GRAN_CANARIA#RETIRED#20", observationsExtended.get(16));
        assertEqualsObservation("18", "GRAN_CANARIA#RETIRED#30", observationsExtended.get(17));
        assertEqualsObservation("19", "LA_PALMA#STUDENT#10", observationsExtended.get(18));
        assertEqualsObservation("20", "LA_PALMA#STUDENT#20", observationsExtended.get(19));
        assertEqualsObservation("21", "LA_PALMA#STUDENT#30", observationsExtended.get(20));
        assertEqualsObservation("22", "LA_PALMA#WORKING#10", observationsExtended.get(21));
        assertEqualsObservation("23", "LA_PALMA#WORKING#20", observationsExtended.get(22));
        assertEqualsObservation("24", "LA_PALMA#WORKING#30", observationsExtended.get(23));
        assertEqualsObservation("25", "LA_PALMA#RETIRED#10", observationsExtended.get(24));
        assertEqualsObservation("26", "LA_PALMA#RETIRED#20", observationsExtended.get(25));
        assertEqualsObservation("27", "LA_PALMA#RETIRED#30", observationsExtended.get(26));
    }

    @Test
    public void testTransformPxToDatasetTitle() throws Exception {

        {
            InputStream pxStream = TransformationServiceTest.class.getResourceAsStream("/px/I312001_0909-refperiod-codes.px");
            PxImportDto pxImportDto = new PxImportDto();
            pxImportDto.setContent(pxStream);
            pxImportDto.setProviderUri("stat4you:dsd:provider:P-2");
            pxImportDto.setCategory("categoryMock");
            pxImportDto.setPxUrl("http://urlmock");

            // Transform
            StatisticDto statisticDto = transformationService.transformPxToStatistic(serviceContext, pxImportDto);
            DatasetDto datasetDto = statisticDto.getDataset();

            assertEquals("USO_INTERNET_ULTIMOS_3_MESES_CARACTERISTICAS_DEMOG", datasetDto.getIdentifier());
            assertEquals(pxImportDto.getProviderUri(), datasetDto.getProviderUri());
            assertNull(datasetDto.getPublisher());
            assertEquals(2, datasetDto.getTitle().getTexts().size());
            assertEquals(
                    "Uso de Internet en los últimos 3 meses por características demográficas y tipos de dispositivos móviles utilizados. Encuesta sobre equipamiento y uso de tecnologías de la información y comunicación en los hogares. 2009, 2008. Unidades: Según datos",
                    datasetDto.getTitle().getLocalisedLabel("es"));
            assertEquals(
                    "Ús d'Internet els últims 3 mesos per característiques demogràfiques i tipus de dispositius mòbils utilitzats. Enquesta sobre equipament i ús de tecnologies de la informació i comunicació a les llars. 2009, 2008. Unitats: Segons dades",
                    datasetDto.getTitle().getLocalisedLabel("ca"));
        }
        {
            InputStream pxStream = TransformationServiceTest.class.getResourceAsStream("/px/I312001_0909-refperiod.px");
            PxImportDto pxImportDto = new PxImportDto();
            pxImportDto.setContent(pxStream);
            pxImportDto.setProviderUri("stat4you:dsd:provider:P-2");
            pxImportDto.setCategory("categoryMock");
            pxImportDto.setPxUrl("http://urlmock");

            // Transform
            StatisticDto statisticDto = transformationService.transformPxToStatistic(serviceContext, pxImportDto);
            DatasetDto datasetDto = statisticDto.getDataset();

            assertEquals("USO_INTERNET_ULTIMOS_3_MESES_CARACTERISTICAS_DEMOG", datasetDto.getIdentifier());
            assertEquals(pxImportDto.getProviderUri(), datasetDto.getProviderUri());
            assertNull(datasetDto.getPublisher());
            assertEquals(2, datasetDto.getTitle().getTexts().size());
            assertEquals(
                    "Uso de Internet en los últimos 3 meses por características demográficas y tipos de dispositivos móviles utilizados. Encuesta sobre equipamiento y uso de tecnologías de la información y comunicación en los hogares. 2010. Unidades: Según datos",
                    datasetDto.getTitle().getLocalisedLabel("es"));
            assertEquals(
                    "Ús d'Internet els últims 3 mesos per característiques demogràfiques i tipus de dispositius mòbils utilitzats. Enquesta sobre equipament i ús de tecnologies de la informació i comunicació a les llars. 2010. Unitats: Segons dades",
                    datasetDto.getTitle().getLocalisedLabel("ca"));
        }
    }

    @Test
    public void testTransformDigitalAgendaEuropeCsvToDataset() throws Exception {
        InputStream dataStream = TransformationServiceTest.class.getResourceAsStream("/csv/data.csv");
        InputStream indicatorsStream = TransformationServiceTest.class.getResourceAsStream("/csv/indicators.csv");
        InputStream sourcesStream = TransformationServiceTest.class.getResourceAsStream("/csv/sources.csv");

        DigitalAgendaEuropeCsvDto csv = new DigitalAgendaEuropeCsvDto();
        csv.setData(dataStream);
        csv.setIndicators(indicatorsStream);
        csv.setSources(sourcesStream);
        // Dataset information
        csv.setUrl("http://scoreboard.lod2.eu/data/digital_scoreboard_19_april_2012.xls");
        csv.setLanguage("en");
        csv.getLanguages().add("en");
        csv.getLanguages().add("es");
        csv.setProviderUri("stat4you:dsd:provider:P-2");
        csv.setProviderReleaseDate(new DateTime(2012, 4, 19, 0, 0, 0, 0));
        csv.setProviderPublishingDate(new DateTime(2012, 4, 19, 0, 0, 0, 0));
        csv.setIdentifier("SCOREBOARD_INDICATORS");
        InternationalStringDto title = new InternationalStringDto();
        title.addText(new LocalisedStringDto("en", "Digital Agenda Scoreboard Indicators"));
        title.addText(new LocalisedStringDto("es", "Cuadro de Indicadores de la Agenda Digital"));
        csv.setTitle(title);
        InternationalStringDto description = new InternationalStringDto();
        description
                .addText(new LocalisedStringDto(
                        "en",
                        "European Commission services selected around 60 indicators, divided into thematic groups, which illustrate some key dimensions of the European information society. These indicators allow a comparison of progress across countries as well as over time"));
        description
                .addText(new LocalisedStringDto(
                        "es",
                        "Los servicios de la Comisión Europea han seleccionado alrededor de 60 indicadores, divididos en grupos temáticos, que ilustran algunas de las dimensiones clave de la sociedad de la información. Estos indicadores permiten una comparación del progreso en todos los países, así como el paso del tiempo"));
        csv.setDescription(description);
        csv.setCategory("3.3.3");

        // Transform
        StatisticDto statisticDto = transformationService.transformDigitalAgendaEuropeCsvToStatistic(serviceContext, csv);

        // Validate dataset
        DatasetDto datasetDto = statisticDto.getDataset();
        assertEquals("SCOREBOARD_INDICATORS", datasetDto.getIdentifier());
        assertEquals(csv.getProviderUri(), datasetDto.getProviderUri());
        assertNull(datasetDto.getPublisher());
        assertEquals(2, datasetDto.getTitle().getTexts().size());
        assertEquals("Digital Agenda Scoreboard Indicators", datasetDto.getTitle().getLocalisedLabel("en"));
        assertEquals("Cuadro de Indicadores de la Agenda Digital", datasetDto.getTitle().getLocalisedLabel("es"));
        assertEquals(2, datasetDto.getDescription().getTexts().size());
        assertEquals(
                "European Commission services selected around 60 indicators, divided into thematic groups, which illustrate some key dimensions of the European information society. These indicators allow a comparison of progress across countries as well as over time",
                datasetDto.getDescription().getLocalisedLabel("en"));;
        assertEquals(
                "Los servicios de la Comisión Europea han seleccionado alrededor de 60 indicadores, divididos en grupos temáticos, que ilustran algunas de las dimensiones clave de la sociedad de la información. Estos indicadores permiten una comparación del progreso en todos los países, así como el paso del tiempo",
                datasetDto.getDescription().getLocalisedLabel("es"));;
        assertEquals(csv.getUrl(), datasetDto.getUrl());
        assertNull(datasetDto.getFrequency());
        assertEquals(2, datasetDto.getLanguages().size());
        assertEquals("en", datasetDto.getLanguages().get(0));
        assertEquals("es", datasetDto.getLanguages().get(1));
        assertEquals(1, datasetDto.getCategories().size());
        assertEquals(csv.getCategory(), datasetDto.getCategories().get(0));
        assertNull(datasetDto.getReleaseDate());
        assertEquals("20120419 00:00", datasetDto.getProviderReleaseDate().toString("yyyyMMdd HH:mm"));
        assertNull(datasetDto.getPublishingDate());
        assertNull(datasetDto.getUnpublishingDate());
        assertEquals("20120419 00:00", datasetDto.getProviderPublishingDate().toString("yyyyMMdd HH:mm"));
        assertEquals(DatasetSourceEnum.CSV, datasetDto.getSource());

        // Primary measure
        assertEquals("OBS_VALUE", datasetDto.getPrimaryMeasure().getIdentifier());
        Stat4YouAsserts.assertEqualsInternationalString(datasetDto.getPrimaryMeasure().getTitle(), "en", "Observation value", "es", "Valor de la observación");

        // Dimensions
        assertEquals(3, datasetDto.getDimensions().size());
        {
            DimensionDto dimensionDto = datasetDto.getDimensions().get(0);
            assertEquals("Year", dimensionDto.getIdentifier());
            assertEquals(DimensionTypeEnum.TIME_DIMENSION, dimensionDto.getType());
            Stat4YouAsserts.assertEqualsInternationalString(dimensionDto.getTitle(), "en", "Year", null, null);
            assertEquals(11, dimensionDto.getCodes().size());
            assertEquals("2001", dimensionDto.getCodes().get(0).getIdentifier());
            Stat4YouAsserts.assertEqualsInternationalString(dimensionDto.getCodes().get(0).getTitle(), "en", "2001", null, null);
            assertEquals("2001", dimensionDto.getCodes().get(0).getTitle().getLocalisedLabel("en"));
            assertEquals("2002", dimensionDto.getCodes().get(1).getIdentifier());
            assertEquals("2004", dimensionDto.getCodes().get(2).getIdentifier());
            assertEquals("2005", dimensionDto.getCodes().get(3).getIdentifier());
            assertEquals("2006", dimensionDto.getCodes().get(4).getIdentifier());
            assertEquals("2007", dimensionDto.getCodes().get(5).getIdentifier());
            assertEquals("2008", dimensionDto.getCodes().get(6).getIdentifier());
            assertEquals("2009", dimensionDto.getCodes().get(7).getIdentifier());
            assertEquals("2010", dimensionDto.getCodes().get(8).getIdentifier());
            assertEquals("2011", dimensionDto.getCodes().get(9).getIdentifier());
            assertEquals("2003", dimensionDto.getCodes().get(10).getIdentifier());
        }
        {
            DimensionDto dimensionDto = datasetDto.getDimensions().get(1);
            assertEquals("Country", dimensionDto.getIdentifier());
            assertEquals(DimensionTypeEnum.GEOGRAPHIC_DIMENSION, dimensionDto.getType());
            assertEquals(1, dimensionDto.getTitle().getTexts().size());
            assertEquals("Country", dimensionDto.getTitle().getLocalisedLabel("en"));
            assertEquals(32, dimensionDto.getCodes().size());
            assertEquals("BE", dimensionDto.getCodes().get(0).getIdentifier());
            Stat4YouAsserts.assertEqualsInternationalString(dimensionDto.getCodes().get(0).getTitle(), "en", "Belgium", null, null);
            assertEquals("LU", dimensionDto.getCodes().get(1).getIdentifier());
            Stat4YouAsserts.assertEqualsInternationalString(dimensionDto.getCodes().get(1).getTitle(), "en", "Luxembourg", null, null);
            // ...
        }
        {
            DimensionDto dimensionDto = datasetDto.getDimensions().get(2);
            assertEquals("Indicator", dimensionDto.getIdentifier());
            assertEquals(DimensionTypeEnum.MEASURE_DIMENSION, dimensionDto.getType());
            Stat4YouAsserts.assertEqualsInternationalString(dimensionDto.getTitle(), "en", "Indicator", null, null);
            assertEquals(63, dimensionDto.getCodes().size());

            assertEquals("FOA_cit_Country", dimensionDto.getCodes().get(0).getIdentifier());
            Stat4YouAsserts.assertEqualsInternationalString(dimensionDto.getCodes().get(0).getTitle(), "en", "Availability of eGovernment services - citizens", null, null);
            assertEquals("FOA_ent_Country", dimensionDto.getCodes().get(1).getIdentifier());
            Stat4YouAsserts.assertEqualsInternationalString(dimensionDto.getCodes().get(1).getTitle(), "en", "Availability of eGovernment services - enterprises", null, null);
            assertEquals("bb_fcov_RURAL_POP", dimensionDto.getCodes().get(2).getIdentifier());
            Stat4YouAsserts.assertEqualsInternationalString(dimensionDto.getCodes().get(2).getTitle(), "en", "Rural fixed broadband coverage", null, null);
            
            // ...
        }

        // Attributes definitions
        assertEquals(13, datasetDto.getAttributeDefinitions().size());
        int j = -1;

        // Observations
        assertEquals(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_UNIT, datasetDto.getAttributeDefinitions().get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.OBSERVATION, datasetDto.getAttributeDefinitions().get(j).getAttachmentLevel());
        assertEquals(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_FLAGS, datasetDto.getAttributeDefinitions().get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.OBSERVATION, datasetDto.getAttributeDefinitions().get(j).getAttachmentLevel());
        assertEquals(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_NOTE, datasetDto.getAttributeDefinitions().get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.OBSERVATION, datasetDto.getAttributeDefinitions().get(j).getAttachmentLevel());
        // Dimensions
        assertEquals(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATOR_UNIT, datasetDto.getAttributeDefinitions().get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DIMENSION, datasetDto.getAttributeDefinitions().get(j).getAttachmentLevel());
        assertEquals(1, datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().size());
        assertEquals(DigitalAgendaEuropeCsvConstants.MEASURE_DIMENSION_IDENTIFIER, datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().get(0).getIdentifier());

        assertEquals(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATOR_VARIABLE_CAPTION, datasetDto.getAttributeDefinitions().get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DIMENSION, datasetDto.getAttributeDefinitions().get(j).getAttachmentLevel());
        assertEquals(1, datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().size());
        assertEquals(DigitalAgendaEuropeCsvConstants.MEASURE_DIMENSION_IDENTIFIER, datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().get(0).getIdentifier());

        assertEquals(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATOR_LONG_LABEL, datasetDto.getAttributeDefinitions().get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DIMENSION, datasetDto.getAttributeDefinitions().get(j).getAttachmentLevel());
        assertEquals(1, datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().size());
        assertEquals(DigitalAgendaEuropeCsvConstants.MEASURE_DIMENSION_IDENTIFIER, datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().get(0).getIdentifier());

        assertEquals(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATOR_SHORT_LABEL, datasetDto.getAttributeDefinitions().get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DIMENSION, datasetDto.getAttributeDefinitions().get(j).getAttachmentLevel());
        assertEquals(1, datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().size());
        assertEquals(DigitalAgendaEuropeCsvConstants.MEASURE_DIMENSION_IDENTIFIER, datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().get(0).getIdentifier());

        assertEquals(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATORS_GROUP, datasetDto.getAttributeDefinitions().get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DIMENSION, datasetDto.getAttributeDefinitions().get(j).getAttachmentLevel());
        assertEquals(1, datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().size());
        assertEquals(DigitalAgendaEuropeCsvConstants.MEASURE_DIMENSION_IDENTIFIER, datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().get(0).getIdentifier());

        assertEquals(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATOR_DEFINITION_SCOPE_NOTES, datasetDto.getAttributeDefinitions().get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DIMENSION, datasetDto.getAttributeDefinitions().get(j).getAttachmentLevel());
        assertEquals(1, datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().size());
        assertEquals(DigitalAgendaEuropeCsvConstants.MEASURE_DIMENSION_IDENTIFIER, datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().get(0).getIdentifier());

        assertEquals(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_SOURCE_CODE, datasetDto.getAttributeDefinitions().get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DIMENSION, datasetDto.getAttributeDefinitions().get(j).getAttachmentLevel());
        assertEquals(1, datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().size());
        assertEquals(DigitalAgendaEuropeCsvConstants.MEASURE_DIMENSION_IDENTIFIER, datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().get(0).getIdentifier());

        assertEquals(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_SOURCE_LABEL, datasetDto.getAttributeDefinitions().get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DIMENSION, datasetDto.getAttributeDefinitions().get(j).getAttachmentLevel());
        assertEquals(1, datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().size());
        assertEquals(DigitalAgendaEuropeCsvConstants.MEASURE_DIMENSION_IDENTIFIER, datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().get(0).getIdentifier());

        assertEquals(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_SOURCE_LINKS, datasetDto.getAttributeDefinitions().get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DIMENSION, datasetDto.getAttributeDefinitions().get(j).getAttachmentLevel());
        assertEquals(1, datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().size());
        assertEquals(DigitalAgendaEuropeCsvConstants.MEASURE_DIMENSION_IDENTIFIER, datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().get(0).getIdentifier());

        assertEquals(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_SOURCE_LAST_VERSION_USED, datasetDto.getAttributeDefinitions().get(++j).getIdentifier());
        assertEquals(AttributeAttachmentLevelEnum.DIMENSION, datasetDto.getAttributeDefinitions().get(j).getAttachmentLevel());
        assertEquals(1, datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().size());
        assertEquals(DigitalAgendaEuropeCsvConstants.MEASURE_DIMENSION_IDENTIFIER, datasetDto.getAttributeDefinitions().get(j).getAttachmentDimensions().get(0).getIdentifier());

        assertEquals(datasetDto.getAttributeDefinitions().size(), ++j);

        // Data (some validations)
        assertEquals(13837, statisticDto.getObservationsExtended().size());
        // 2001;BE;FOA_cit_Country;% of pub serv for citizens;0;;
        int k = 0;
        assertEquals("0", statisticDto.getObservationsExtended().get(k).getPrimaryMeasure());
        assertEquals(3, statisticDto.getObservationsExtended().get(k).getCodesDimension().size());
        assertEquals(DigitalAgendaEuropeCsvConstants.TIME_DIMENSION_IDENTIFIER, statisticDto.getObservationsExtended().get(k).getCodesDimension().get(0).getDimensionId());
        assertEquals("2001", statisticDto.getObservationsExtended().get(k).getCodesDimension().get(0).getCodeDimensionId());
        assertEquals(DigitalAgendaEuropeCsvConstants.GEOGRAPHIC_DIMENSION_IDENTIFIER, statisticDto.getObservationsExtended().get(k).getCodesDimension().get(1).getDimensionId());
        assertEquals("BE", statisticDto.getObservationsExtended().get(k).getCodesDimension().get(1).getCodeDimensionId());
        assertEquals(DigitalAgendaEuropeCsvConstants.MEASURE_DIMENSION_IDENTIFIER, statisticDto.getObservationsExtended().get(k).getCodesDimension().get(2).getDimensionId());
        assertEquals("FOA_cit_Country", statisticDto.getObservationsExtended().get(k).getCodesDimension().get(2).getCodeDimensionId());
        assertEquals(1, statisticDto.getObservationsExtended().get(k).getAttributes().size());
        assertEquals("Unit", statisticDto.getObservationsExtended().get(k).getAttributes().get(0).getAttributeId());
        assertEquals("% of pub serv for citizens", statisticDto.getObservationsExtended().get(k).getAttributes().get(0).getValue().getLocalisedLabel("en"));
        // 2006;BG;e_eturn_ENT_ALL_XFIN;% turn;0,001371148;;
        k = 13;
        assertEquals("0", statisticDto.getObservationsExtended().get(k).getPrimaryMeasure());
        assertEquals(3, statisticDto.getObservationsExtended().get(k).getCodesDimension().size());
        assertEquals(DigitalAgendaEuropeCsvConstants.TIME_DIMENSION_IDENTIFIER, statisticDto.getObservationsExtended().get(k).getCodesDimension().get(0).getDimensionId());
        assertEquals("2006", statisticDto.getObservationsExtended().get(k).getCodesDimension().get(0).getCodeDimensionId());
        assertEquals(DigitalAgendaEuropeCsvConstants.GEOGRAPHIC_DIMENSION_IDENTIFIER, statisticDto.getObservationsExtended().get(k).getCodesDimension().get(1).getDimensionId());
        assertEquals("FI", statisticDto.getObservationsExtended().get(k).getCodesDimension().get(1).getCodeDimensionId());
        assertEquals(DigitalAgendaEuropeCsvConstants.MEASURE_DIMENSION_IDENTIFIER, statisticDto.getObservationsExtended().get(k).getCodesDimension().get(2).getDimensionId());
        assertEquals("e_igovpr_ENT_ALL_XFIN", statisticDto.getObservationsExtended().get(k).getCodesDimension().get(2).getCodeDimensionId());
        assertEquals(2, statisticDto.getObservationsExtended().get(k).getAttributes().size());
        assertEquals(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_UNIT, statisticDto.getObservationsExtended().get(k).getAttributes().get(0).getAttributeId());
        assertEquals("% ent", statisticDto.getObservationsExtended().get(k).getAttributes().get(0).getValue().getLocalisedLabel("en"));
        assertEquals(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_NOTE, statisticDto.getObservationsExtended().get(k).getAttributes().get(1).getAttributeId());
        assertEquals("imputed value, not surveyed", statisticDto.getObservationsExtended().get(k).getAttributes().get(1).getValue().getLocalisedLabel("en"));
        // 2004;RO;i_iusell_IND_TOTAL;% ind;0,000555673;;
        k = 36;
        assertEquals("0,000555673", statisticDto.getObservationsExtended().get(k).getPrimaryMeasure());
        assertEquals(3, statisticDto.getObservationsExtended().get(k).getCodesDimension().size());
        assertEquals(DigitalAgendaEuropeCsvConstants.TIME_DIMENSION_IDENTIFIER, statisticDto.getObservationsExtended().get(k).getCodesDimension().get(0).getDimensionId());
        assertEquals("2004", statisticDto.getObservationsExtended().get(k).getCodesDimension().get(0).getCodeDimensionId());
        assertEquals(DigitalAgendaEuropeCsvConstants.GEOGRAPHIC_DIMENSION_IDENTIFIER, statisticDto.getObservationsExtended().get(k).getCodesDimension().get(1).getDimensionId());
        assertEquals("RO", statisticDto.getObservationsExtended().get(k).getCodesDimension().get(1).getCodeDimensionId());
        assertEquals(DigitalAgendaEuropeCsvConstants.MEASURE_DIMENSION_IDENTIFIER, statisticDto.getObservationsExtended().get(k).getCodesDimension().get(2).getDimensionId());
        assertEquals("i_iusell_IND_TOTAL", statisticDto.getObservationsExtended().get(k).getCodesDimension().get(2).getCodeDimensionId());
        assertEquals(1, statisticDto.getObservationsExtended().get(k).getAttributes().size());
        assertEquals(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_UNIT, statisticDto.getObservationsExtended().get(k).getAttributes().get(0).getAttributeId());
        assertEquals("% ind", statisticDto.getObservationsExtended().get(k).getAttributes().get(0).getValue().getLocalisedLabel("en"));
        // 2011;PL;e_esell_ENT_SM_XFIN;% ent;;u;
        k = 13836;
        assertEquals(null, statisticDto.getObservationsExtended().get(k).getPrimaryMeasure());
        assertEquals(DigitalAgendaEuropeCsvConstants.TIME_DIMENSION_IDENTIFIER, statisticDto.getObservationsExtended().get(k).getCodesDimension().get(0).getDimensionId());
        assertEquals("2011", statisticDto.getObservationsExtended().get(k).getCodesDimension().get(0).getCodeDimensionId());
        assertEquals(DigitalAgendaEuropeCsvConstants.GEOGRAPHIC_DIMENSION_IDENTIFIER, statisticDto.getObservationsExtended().get(k).getCodesDimension().get(1).getDimensionId());
        assertEquals("PL", statisticDto.getObservationsExtended().get(k).getCodesDimension().get(1).getCodeDimensionId());
        assertEquals(DigitalAgendaEuropeCsvConstants.MEASURE_DIMENSION_IDENTIFIER, statisticDto.getObservationsExtended().get(k).getCodesDimension().get(2).getDimensionId());
        assertEquals("e_esell_ENT_SM_XFIN", statisticDto.getObservationsExtended().get(k).getCodesDimension().get(2).getCodeDimensionId());
        assertEquals(2, statisticDto.getObservationsExtended().get(k).getAttributes().size());
        assertEquals(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_UNIT, statisticDto.getObservationsExtended().get(k).getAttributes().get(0).getAttributeId());
        assertEquals("% ent", statisticDto.getObservationsExtended().get(k).getAttributes().get(0).getValue().getLocalisedLabel("en"));
        assertEquals(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_FLAGS, statisticDto.getObservationsExtended().get(k).getAttributes().get(1).getAttributeId());
        assertEquals("u", statisticDto.getObservationsExtended().get(k).getAttributes().get(1).getValue().getLocalisedLabel("en"));

        // Attributes of dataset or dimension
        assertEquals(800, statisticDto.getAttributes().size());
        String dimension = DigitalAgendaEuropeCsvConstants.MEASURE_DIMENSION_IDENTIFIER;
        // bb_lines_TOTAL_FBB;nbr lines;Fixed broadband lines;Total number of fixed broadband lines;Fixed broadband lines;Broadband;Number of fixed broadband subscriptions (lines). Situation at 1st
        // July of the reference year.;COCOM;1
        // COCOM;Communications Committee (COCOM) - July reports.;http://ec.europa.eu/information_society/digital-agenda/scoreboard/pillars/broadband/index_en.htm;Extraction 2 December 2011
        String codeDimension = "bb_lines_TOTAL_FBB";
        int index = 0;
        assertEqualsAttributeOneDimension(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATOR_UNIT, dimension, codeDimension, "nbr lines", "en", statisticDto.getAttributes().get(index++));
        assertEqualsAttributeOneDimension(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATOR_VARIABLE_CAPTION, dimension, codeDimension, "Fixed broadband lines", "en", statisticDto.getAttributes().get(index++));
        assertEqualsAttributeOneDimension(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATOR_LONG_LABEL, dimension, codeDimension, "Total number of fixed broadband lines", "en", statisticDto.getAttributes()
                .get(index++));
        assertEqualsAttributeOneDimension(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATOR_SHORT_LABEL, dimension, codeDimension, "Fixed broadband lines", "en", statisticDto.getAttributes().get(index++));
        assertEqualsAttributeOneDimension(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATORS_GROUP, dimension, codeDimension, "Broadband", "en", statisticDto.getAttributes().get(index++));
        assertEqualsAttributeOneDimension(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATOR_DEFINITION_SCOPE_NOTES, dimension, codeDimension,
                "Number of fixed broadband subscriptions (lines). Situation at 1st July of the reference year.", "en", statisticDto.getAttributes().get(index++));
        assertEqualsAttributeOneDimension(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_SOURCE_CODE, dimension, codeDimension, "COCOM", "en", statisticDto.getAttributes().get(index++));
        assertEqualsAttributeOneDimension(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_SOURCE_LABEL, dimension, codeDimension, "Communications Committee (COCOM) - July reports.", "en", statisticDto.getAttributes()
                .get(index++));
        assertEqualsAttributeOneDimension(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_SOURCE_LINKS, dimension, codeDimension,
                "http://ec.europa.eu/information_society/digital-agenda/scoreboard/pillars/broadband/index_en.htm", "en", statisticDto.getAttributes().get(index++));
        assertEqualsAttributeOneDimension(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_SOURCE_LAST_VERSION_USED, dimension, codeDimension, "Extraction 2 December 2011", "en",
                statisticDto.getAttributes().get(index++));
        // bb_penet_TOTAL_FBB;lines/100 pop;Fixed broadband penetration;Fixed broadband penetration;Fixed broadband penetration;Broadband;Number of fixed broadband subscriptions (lines) per 100
        // people. Situation at 1st July of the reference year.;COCOM;2
        index = 10;
        codeDimension = "bb_penet_TOTAL_FBB";
        assertEqualsAttributeOneDimension(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATOR_UNIT, dimension, codeDimension, "lines/100 pop", "en", statisticDto.getAttributes().get(index++));
        // ...

        // i_cisk_sfjobx_sal_self_fam;% ind;Individuals who judge their current computer or Internet skills not to be sufficient if they were to look for a job or change job within a year;% of workers
        // who judge their current ICT skills insufficient for changing job within a year;ICT skills perceived as insufficient for the labour market;eSkills;Scope: individuals with an occupation as
        // employees, self-employed or family workers, aged 16-74. They were asked if they judge their current computer or Internet skills to be sufficient (yes/not) if they were to look for a job or
        // change job within a year.;ESTAT HH-IND;80
        codeDimension = "i_cisk_sfjobx_sal_self_fam";
        index = 790;
        assertEqualsAttributeOneDimension(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATOR_UNIT, dimension, codeDimension, "% ind", "en", statisticDto.getAttributes().get(index++));
        assertEqualsAttributeOneDimension(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATOR_VARIABLE_CAPTION, dimension, codeDimension,
                "Individuals who judge their current computer or Internet skills not to be sufficient if they were to look for a job or change job within a year", "en", statisticDto.getAttributes()
                        .get(index++));
        assertEqualsAttributeOneDimension(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATOR_LONG_LABEL, dimension, codeDimension,
                "% of workers who judge their current ICT skills insufficient for changing job within a year", "en", statisticDto.getAttributes().get(index++));
        assertEqualsAttributeOneDimension(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATOR_SHORT_LABEL, dimension, codeDimension, "ICT skills perceived as insufficient for the labour market", "en",
                statisticDto.getAttributes().get(index++));
        assertEqualsAttributeOneDimension(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATORS_GROUP, dimension, codeDimension, "eSkills", "en", statisticDto.getAttributes().get(index++));
        assertEqualsAttributeOneDimension(
                DigitalAgendaEuropeCsvConstants.ATTRIBUTE_INDICATOR_DEFINITION_SCOPE_NOTES,
                dimension,
                codeDimension,
                "Scope: individuals with an occupation as employees, self-employed or family workers, aged 16-74. They were asked if they judge their current computer or Internet skills to be sufficient (yes/not) if they were to look for a job or change job within a year.",
                "en", statisticDto.getAttributes().get(index++));
        assertEqualsAttributeOneDimension(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_SOURCE_CODE, dimension, codeDimension, "ESTAT HH-IND", "en", statisticDto.getAttributes().get(index++));
        assertEqualsAttributeOneDimension(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_SOURCE_LABEL, dimension, codeDimension, "Eurostat - Community survey on ICT usage in Households and by Individuals", "en", statisticDto.getAttributes()
                .get(index++));
        assertEqualsAttributeOneDimension(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_SOURCE_LINKS, dimension, codeDimension,
                "http://epp.eurostat.ec.europa.eu/portal/page/portal/information_society/introduction", "en", statisticDto.getAttributes().get(index++));
        assertEqualsAttributeOneDimension(DigitalAgendaEuropeCsvConstants.ATTRIBUTE_SOURCE_LAST_VERSION_USED, dimension, codeDimension, "Extraction from HH/Indiv comprehensive database (ACCESS) v 3 April 2012", "en",
                statisticDto.getAttributes().get(index++));

    }

    private void assertEqualsAttributeOneDimension(String attributeId, String dimension, String codeDimension, String label, String locale, AttributeDto attributeDto) {
        assertEquals(attributeId, attributeDto.getAttributeId());
        assertEquals(1, attributeDto.getCodesDimension().size());
        assertEquals(dimension, attributeDto.getCodesDimension().get(0).getDimensionId());
        assertEquals(codeDimension, attributeDto.getCodesDimension().get(0).getCodeDimensionId());
        assertEquals(label, attributeDto.getValue().getLocalisedLabel(locale));
    }

    @Test
    @Ignore
    public void testTransformPxToSdmxMl() throws Exception {

        // TODO: Se comenta el test porque se interrumpe el desarrollo y no se puede garantizar la integridad del mismo.

        // InputStream pxStream = TransformationImportServiceTest.class.getResourceAsStream("/px/I101003_0201.px");
        //
        // PxImportDto pxImportDto = new PxImportDto();
        // pxImportDto.setContent(pxStream);
        // pxImportDto.setProviderUri("stat4you:dsd:provider1:1");
        // pxImportDto.setCategory("categoryMock");
        // pxImportDto.setPxUrl("http://urlmock");
        //
        // SdmxMlResponseDto sdmxMlResponseDto = new SdmxMlResponseDto();
        //
        // statisticImportService.transformPxToSdmxMl(serviceContext, pxImportDto, sdmxMlResponseDto);
        // assertNotNull(sdmxMlResponseDto.getDsd());
        //
        // sdmxMlResponseDto.getDsd();

        fail("unimplemented");
    }

    private void assertEqualsObservation(String primaryMeasureExpected, String uniqueKeyExpected, ObservationExtendedDto actual) {
        assertEquals(primaryMeasureExpected, actual.getPrimaryMeasure());
        assertEquals(uniqueKeyExpected, actual.getUniqueKey());
    }
}
