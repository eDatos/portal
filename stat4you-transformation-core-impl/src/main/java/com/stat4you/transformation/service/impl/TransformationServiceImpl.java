package com.stat4you.transformation.service.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.IOUtils;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.arte.statistic.dataset.repository.dto.AttributeDto;
import com.arte.statistic.dataset.repository.dto.ObservationExtendedDto;
import com.arte.statistic.parser.px.PxParser;
import com.arte.statistic.parser.px.domain.PxAttributeCodes;
import com.arte.statistic.parser.px.domain.PxData;
import com.arte.statistic.parser.px.domain.PxModel;
import com.stat4you.common.io.FileUtils;
import com.stat4you.statistics.dsd.dto.DatasetDto;
import com.stat4you.transformation.csv.daeurope.DigitalAgendaEuropeCsvData;
import com.stat4you.transformation.csv.daeurope.DigitalAgendaEuropeCsvParser;
import com.stat4you.transformation.domain.TransformationExceptionCodeEnum;
import com.stat4you.transformation.dto.DigitalAgendaEuropeCsvDto;
import com.stat4you.transformation.dto.PxImportDto;
import com.stat4you.transformation.dto.SdmxMlResponseDto;
import com.stat4you.transformation.dto.StatisticDto;
import com.stat4you.transformation.mapper.DigitalAgendaEuropeCsvMapper;
import com.stat4you.transformation.mapper.PxMapper;
import com.stat4you.transformation.service.util.InvocationValidator;

/**
 * Implementation of TransformationService.
 */
@Service("transformationService")
public class TransformationServiceImpl extends TransformationServiceImplBase {

    @Autowired
    private PxMapper pxMapper;

    @Autowired
    private DigitalAgendaEuropeCsvMapper digitalAgendaEuropeCsvMapper;

    private final String PX_METADATA_CHARSET = PxAttributeCodes.CHARSET + "=";

    // TODO pendiente px to sdmx
    // // @Autowired
    // private TransformationServiceFacade transformationServiceFacade;
    //
    // // @Autowired
    // // @Qualifier("jaxb2MarshallerWithValidation")
    // private Jaxb2Marshaller marshallerWithValidation;
    //
    // // @Autowired
    // // @Qualifier("jaxb2MarshallerWithoutValidation")
    // private CustomJaxb2Marshaller marshallerWithoutValidation;

    // public Jaxb2Marshaller getMarshallerWithValidation() {
    // return marshallerWithValidation;
    // }
    //
    // public CustomJaxb2Marshaller getMarshallerWithoutValidation() {
    // return marshallerWithoutValidation;
    // }

    @Override
    public StatisticDto transformPxToStatistic(ServiceContext ctx, PxImportDto pxImportDto) throws ApplicationException {

        // Validation
        InvocationValidator.validateTransformPxToStatistic(pxImportDto);

        // Transform
        StatisticDto statisticDto = transformPx(pxImportDto, true, true);
        return statisticDto;
    }

    @Override
    public StatisticDto transformDigitalAgendaEuropeCsvToStatistic(ServiceContext ctx, DigitalAgendaEuropeCsvDto digitalAgendaEuropeCsvDto) throws ApplicationException {

        // Validation
        InvocationValidator.validateTransformDigitalAgendaEurope(digitalAgendaEuropeCsvDto);

        // Transform
        try {
            // Parse streams
            DigitalAgendaEuropeCsvData digitalAgendaEuropeData = transformDigitalAgendaEuropeCsvDsdAndObservations(digitalAgendaEuropeCsvDto);
            List<AttributeDto> attributes = transformDigitalAgendaEuropeCsvAttributes(digitalAgendaEuropeCsvDto);

            // Transform to stat4you model
            DatasetDto dataset = digitalAgendaEuropeCsvMapper.toDataset(digitalAgendaEuropeCsvDto, digitalAgendaEuropeData);

            StatisticDto statisticDto = new StatisticDto();
            statisticDto.setDataset(dataset);
            statisticDto.setObservationsExtended(digitalAgendaEuropeData.getObservations());
            statisticDto.setAttributes(attributes);

            return statisticDto;
        } catch (Exception e) {
            throw new ApplicationException(TransformationExceptionCodeEnum.ILLEGAL_ARGUMENT.getName(), "Error parsing csv file", e);
        }
    }

    @Override
    public void transformPxToSdmxMl(ServiceContext ctx, PxImportDto pxImportDto, SdmxMlResponseDto sdmxMlResponseDto) throws ApplicationException {

        // // Validation
        // InvocationValidator.validateTransformPxToSdmxMl(pxImportDto);
        //
        // // Transform to PX
        // StatisticDto statisticDto = transformPx(pxImportDto, true, true);
        //
        // // Transform to SDMX-ML
        // transformToSdmxMl(ctx, statisticDto, sdmxMlResponseDto);

        // TODO px to sdmx
        throw new ApplicationException("incomplete and untested method", "incomplete and untested: transformPxToSdmxMl");

    }

    /**
     * Transform px stream to dataset, observations and attributes
     * 
     * @param pxImportDto Px file and additional information
     * @param transformObservations true when observations and observation attributes must be transformed
     * @param transformAttributes true when dataset and dimensions attributes must be transformed
     * @return px stream transformed to dataset model, observations and attributes
     */
    private StatisticDto transformPx(PxImportDto pxImportDto, boolean transformObservations, boolean transformAttributes) throws ApplicationException {

        // Validation
        InvocationValidator.validateTransformPxToStatistic(pxImportDto);

        // Parse px
        PxModel pxModel = null;
        PxData pxData = null;
        InputStream is1 = null;
        InputStream is2 = null;
        File tempFile = null;
        try {
            tempFile = FileUtils.createTempFile(pxImportDto.getContent());
            String charsetName = guessPxCharset(tempFile);

            // Transform
            is1 = new FileInputStream(tempFile);
            pxModel = PxParser.toPxModel(is1, charsetName);
            if (transformObservations) {
                is2 = new FileInputStream(tempFile);
                pxData = PxParser.toPxData(is2, charsetName);
            }
        } catch (Exception e) {
            throw new ApplicationException(TransformationExceptionCodeEnum.ILLEGAL_ARGUMENT.getName(), "Error parsing px file", e);
        } finally {
            IOUtils.closeQuietly(is1);
            IOUtils.closeQuietly(is2);
            FileUtils.deleteFileQuietly(tempFile);
        }

        // Attributes postprocessor
        pxMapper.reviewPxAttributesIdentifiersAndDimensions(pxModel);

        // Transform
        StatisticDto statisticDto = new StatisticDto();
        // Dataset
        DatasetDto dataset = pxMapper.toDataset(pxModel, pxImportDto);
        statisticDto.setDataset(dataset);
        // Observations and observation attributes
        if (transformObservations) {
            List<ObservationExtendedDto> observationsExtended = pxMapper.toObservations(pxData, pxModel.getAttributesObservations(), dataset.getDimensions());
            statisticDto.setObservationsExtended(observationsExtended);
        }
        // Dataset and dimensions attributes
        if (transformAttributes) {
            List<AttributeDto> attributes = pxMapper.toAttributes(pxModel);
            statisticDto.setAttributes(attributes);
        }

        return statisticDto;
    }

    private DigitalAgendaEuropeCsvData transformDigitalAgendaEuropeCsvDsdAndObservations(DigitalAgendaEuropeCsvDto digitalAgendaEuropeCsvDto) throws Exception {

        File tempFile = null;
        InputStream inputStream = null;
        try {
            tempFile = FileUtils.createTempFile(digitalAgendaEuropeCsvDto.getData());
            String charsetName = guessCsvCharset(tempFile);
            inputStream = new FileInputStream(tempFile);

            return DigitalAgendaEuropeCsvParser.toData(inputStream, charsetName, digitalAgendaEuropeCsvDto.getLanguage());
        } finally {
            IOUtils.closeQuietly(inputStream);
            FileUtils.deleteFileQuietly(tempFile);
        }
    }

    private List<AttributeDto> transformDigitalAgendaEuropeCsvAttributes(DigitalAgendaEuropeCsvDto digitalAgendaEuropeCsvDto) throws Exception {

        File tempFileSource = null;
        File tempFileIndicators = null;
        InputStream inputStreamSource = null;
        InputStream inputStreamIndicators = null;
        try {
            // Transform extensive attributes
            tempFileSource = FileUtils.createTempFile(digitalAgendaEuropeCsvDto.getSources());
            String charsetNameSources = guessCsvCharset(tempFileSource);
            inputStreamSource = new FileInputStream(tempFileSource);
            Map<String, List<AttributeDto>> attributesExtensive = DigitalAgendaEuropeCsvParser.toAttributesSources(inputStreamSource, charsetNameSources, digitalAgendaEuropeCsvDto.getLanguage());

            // Transform attributes
            tempFileIndicators = FileUtils.createTempFile(digitalAgendaEuropeCsvDto.getIndicators());
            String charsetNameIndicators = guessCsvCharset(tempFileIndicators);
            inputStreamIndicators = new FileInputStream(tempFileIndicators);
            List<AttributeDto> attributes = DigitalAgendaEuropeCsvParser.toAttributesIndicators(inputStreamIndicators, charsetNameIndicators, digitalAgendaEuropeCsvDto.getLanguage(),
                    attributesExtensive);

            return attributes;
        } finally {
            IOUtils.closeQuietly(inputStreamSource);
            IOUtils.closeQuietly(inputStreamIndicators);
            FileUtils.deleteFileQuietly(tempFileSource);
            FileUtils.deleteFileQuietly(tempFileIndicators);
        }
    }

    /**
     * Guess charset of px file.
     * PX-Axis documentation says:"If the keyword CHARSET is missing it means that all texts are in DOS text format, so that the same files can be used both in the DOS
     * and the Windows version of PC-AXIS. In the Windows version the texts are translated into Windows format when read. When a file is
     * saved in PC-AXIS file format it is always saved in DOS text format in versions prior to 2000.
     * Starting with version 2000 the files can be either in DOS or Windows texts. If they are in Windows texts this information is added: CHARSET="ANSI";".
     * ICU library does not guess this charset, so we must force it
     */
    private String guessPxCharset(File pxFile) throws Exception {
        InputStream inputStream = null;
        try {
            inputStream = new FileInputStream(pxFile);
            byte[] byteData = new byte[500]; // so many characters because charset metadata can not be in first lines
            inputStream.read(byteData);
            String firstCharacters = new String(byteData);
            if (firstCharacters.contains(PX_METADATA_CHARSET)) {
                return FileUtils.guessCharset(pxFile);
            } else {
                return PxParser.CHARSET_MSDOS;
            }
        } finally {
            IOUtils.closeQuietly(inputStream);
        }
    }

    /**
     * Guess charset of file
     */
    private String guessCsvCharset(File file) throws Exception {
        return FileUtils.guessCharset(file);
    }

    // TODO pendiente px to sdmx
    // /**
    // * Transform Dataset, observations and attributes into a SDMX-ML message
    // *
    // * @param pxDto
    // * @return SdmxMlDto
    // * @throws ApplicationException
    // */
    // private void transformToSdmxMl(ServiceContext ctx, StatisticDto statisticDto, SdmxMlResponseDto sdmxMlResponseDto) throws ApplicationException {
    //
    // // Map Dataset to SDMX DSD
    // DataStructureDefinitionExtendDto dsd = SdmxMapper.toDsd(pxDto.getDataset());
    // sdmxMlResponseDto.setDsd(exportSDMXStructureMsg(ctx, dsd));
    //
    // // Map Data to SDMX Generic Dataset
    // // TODO: Parsear datos
    //
    // // Map Data to SDMX Structured Dataset
    // // TODO: Parsear datos
    //
    // }

    // TODO cerrar streams
    // private OutputStream exportSDMXStructureMsg(ServiceContext ctx, DataStructureDefinitionExtendDto dataStructureDefinitionExtendDto) throws ApplicationException {
    //
    // // Prepare StructureMsgDto
    // StructureMsgDto structureMsgDto = new StructureMsgDto();
    // structureMsgDto.addDataStructureDefinitionDto(dataStructureDefinitionExtendDto);
    //
    // // Export
    // OutputStream outputStream = null;
    // File file = null;
    //
    // try {
    // file = File.createTempFile("mt_dsd_", ".xml");
    // outputStream = new FileOutputStream(file);
    //
    // // Output with writer to avoid bad indent in xml ouput
    // OutputStreamWriter writer = new OutputStreamWriter(outputStream);
    // StreamResult result = new StreamResult(writer);
    //
    // // Marshall properties
    // Map<String, Object> marshallProperties = new HashMap<String, Object>();
    // marshallProperties.put(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE); // Formatted output
    // getMarshallerWithValidation().setMarshallerProperties(marshallProperties);
    //
    // // Transform Metamac Business Objects to JAXB Objects
    // Structure structure = transformationServiceFacade.transformStructureMessage(ctx, structureMsgDto);
    //
    // getMarshallerWithValidation().marshal(structure, result);
    //
    // // sdmxMlStructureMessage = new ByteArrayInputStream(((ByteArrayOutputStream) outputStream).toByteArray());
    //
    // } catch (XmlMappingException e) {
    // throw new ApplicationException(MtmTransformationExceptionType.MTM_TRAN_E_JAXB.getErrorCode(), MtmTransformationExceptionType.MTM_TRAN_E_JAXB.getMessageForReasonType(), e.getMessage());
    // } catch (FileNotFoundException e) {
    // // TODO: Errores
    // // throw new ApplicationException(ServiceExceptionType.SERVICE_GENERAL_ERROR.getErrorCode(), ServiceExceptionType.SERVICE_GENERAL_ERROR.getMessageForReasonType(), e);
    // } catch (IOException e) {
    // // TODO: Errores
    // // throw new ApplicationException(ServiceExceptionType.SERVICE_GENERAL_ERROR.getErrorCode(), ServiceExceptionType.SERVICE_GENERAL_ERROR.getMessageForReasonType(), e);
    // }
    //
    // // return (file == null)? StringUtils.EMPTY : file.getAbsolutePath();
    //
    // return outputStream;
    //
    //
    // return null;
    // }
}
