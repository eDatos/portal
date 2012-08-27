package com.stat4you.idxmanager.mocks;

import java.util.ArrayList; 
import java.util.List;

import com.stat4you.common.criteria.Stat4YouCriteriaPaginatorResult;
import com.stat4you.common.criteria.Stat4YouCriteriaResult;
import com.stat4you.common.dto.InternationalStringDto;
import com.stat4you.common.dto.LocalisedStringDto;
import com.stat4you.statistics.dsd.dto.DatasetBasicDto;
import com.stat4you.statistics.dsd.dto.ProviderDto;

public class DsdServiceMock {

    public static String           DATASET_1_PROVIDER_1 = "stat4you:dsd:dataset:P-1-D-1";
    public static String           DATASET_1_PROVIDER_4 = "stat4you:dsd:dataset:P-4-D-1";
    public static String           DATASET_PUBLISHED_1  = "stat4you:dsd:dataset:P-1-D-1:1";
    public static String           DATASET_PUBLISHED_2  = "stat4you:dsd:dataset:P-4-D-1:1";
    public static String           DATASET_3_PROVIDER_1 = "stat4you:dsd:dataset:P-1-D-3";

    public static String           PROVIDER_1           = "stat4you:dsd:provider:P-1";
    public static String           PROVIDER_2           = "stat4you:dsd:provider:P-2";
    public static String           PROVIDER_3           = "stat4you:dsd:provider:P-3";
    public static String           PROVIDER_4           = "stat4you:dsd:provider:P-4";
    public static String           PROVIDER_5           = "stat4you:dsd:provider:P-5";

    private static DatasetBasicDto datasetPublished1    = createSimpleDataset(DATASET_PUBLISHED_1, "DSPUB1", "Índice de Precios al Consumo: Base 2006. Según indicadores. Comunidades Autónomas y años.",
                                                                "Consumer Price Index: Base 2006. According to regions and years.");
    private static DatasetBasicDto datasetPublished2    = createSimpleDataset(DATASET_PUBLISHED_2, "DSPUB2",
                                                                "Estadística de Precios de Vivienda: Resultados trimestrales por comunidades autónomas y provincias.",
                                                                "Housing Price Statistics: Quarterly results for autonomous communities and provinces");

    private static ProviderDto     provider1            = createSimpleProvider(PROVIDER_1, "Instituto Canario de Estadística");
    private static ProviderDto     provider2            = createSimpleProvider(PROVIDER_2, "Instituto Balear de Estadística");
    private static ProviderDto     provider3            = createSimpleProvider(PROVIDER_3, "Instituto Canario de Estadística y ...");
    private static ProviderDto     provider4            = createSimpleProvider(PROVIDER_4, "Provider4");
    private static ProviderDto     provider5            = createSimpleProvider(PROVIDER_5, "Provider5");
    
    public static DatasetBasicDto retrieveDataset(String uri) {
        if (DATASET_1_PROVIDER_1.equals(uri)) {
            DatasetBasicDto dataset = createSimpleDataset(DATASET_1_PROVIDER_1, "DS1_PROV1", "Índice de Precios al Consumo: Base 2006. Según indicadores. Comunidades Autónomas y años.",
                    "Consumer Price Index: Base 2006. According to regions and years.");
            return dataset;
        } else if (DATASET_3_PROVIDER_1.equals(uri)) {
            DatasetBasicDto dataset = createSimpleDataset(DATASET_3_PROVIDER_1, "DS3_PROV1", "Índice de Precios al Consumo: Base 2006. Según indicadores. Comunidades Autónomas y años.",
                    "Consumer Price Index: Base 2006. According to regions and years.");
            {
                LocalisedStringDto localised = new LocalisedStringDto();
                localised.setLabel("Índex de preus de consum: Base 2006. Segons indicadors. Comunitats autònomes i anys.");
                localised.setLocale("ca");
                dataset.getTitle().addText(localised);
            }
            {
                LocalisedStringDto localised = new LocalisedStringDto();
                localised.setLabel("Kuluttajahintaindeksi: Base 2006. Mukaan indikaattoreita. Autonomisten alueiden ja vuosia.");
                localised.setLocale("fi");
                dataset.getTitle().addText(localised);
            }

            return dataset;
        }
        return null;
    }

    public static ProviderDto retrieveProvider(String uri) {
        if (PROVIDER_1.equals(uri)) {
            return provider1;
        }
        if (PROVIDER_2.equals(uri)) {
            return provider2;
        }
        return null;
    }

    public static Stat4YouCriteriaResult<DatasetBasicDto> findPublishedDatasets() {
        Stat4YouCriteriaResult<DatasetBasicDto> stat4YouCriteriaResult = new Stat4YouCriteriaResult<DatasetBasicDto>();
        stat4YouCriteriaResult.setResults(new ArrayList<DatasetBasicDto>());
        stat4YouCriteriaResult.getResults().add(datasetPublished1);
        stat4YouCriteriaResult.getResults().add(datasetPublished2);
        stat4YouCriteriaResult.setPaginatorResult(new Stat4YouCriteriaPaginatorResult());
        stat4YouCriteriaResult.getPaginatorResult().setFirstResult(Integer.valueOf(0));
        stat4YouCriteriaResult.getPaginatorResult().setMaximumResultSize(Integer.valueOf(25));
        stat4YouCriteriaResult.getPaginatorResult().setTotalResults(Integer.valueOf(2));
        return stat4YouCriteriaResult;
    }

    public static List<ProviderDto> listProviders() {
        List<ProviderDto> list = new ArrayList<ProviderDto>();
        list.add(provider1);
        list.add(provider2);
        list.add(provider3);
        list.add(provider4);
        list.add(provider5);

        return list;
    }

    private static DatasetBasicDto createSimpleDataset(String uri, String identifier, String name_es, String name_en) {
        DatasetBasicDto basicDto = new DatasetBasicDto();
        InternationalStringDto intString = new InternationalStringDto();
        LocalisedStringDto localString = new LocalisedStringDto();
        localString.setLabel(name_es);
        localString.setLocale("es");
        intString.addText(localString);
        localString = new LocalisedStringDto();
        localString.setLabel(name_en);
        localString.setLocale("en");
        intString.addText(localString);
        basicDto.setTitle(intString);
        basicDto.setUri(uri);
        basicDto.setIdentifier(identifier);
        return basicDto;
    }

    private static ProviderDto createSimpleProvider(String uri, String name) {
        ProviderDto providerDto = new ProviderDto();
        providerDto.setUri(uri);
        providerDto.setName(name);
        return providerDto;
    }
}
