package org.siemac.metamac.portal.rest.external.export.v1_0.mapper;

import static org.junit.Assert.assertEquals;

import java.util.Arrays;

import org.junit.Test;
import org.siemac.metamac.common.test.utils.MetamacAsserts;
import org.siemac.metamac.portal.core.domain.DatasetSelection;
import org.siemac.metamac.portal.core.domain.DatasetSelectionForExcel;
import org.siemac.metamac.portal.core.domain.DatasetSelectionForTsv;
import org.siemac.metamac.portal.core.enume.LabelVisualisationModeEnum;
import org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionDimension;
import org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionDimensions;
import org.siemac.metamac.rest.export.v1_0.domain.DimensionValues;
import org.siemac.metamac.rest.export.v1_0.domain.LabelVisualisationMode;

public class DatasetSelectionMapperTest {

    @Test
    public void testToDatasetSelectionForExcel() throws Exception {

        org.siemac.metamac.rest.export.v1_0.domain.DatasetSelection source = new org.siemac.metamac.rest.export.v1_0.domain.DatasetSelection();
        source.setDimensions(new DatasetSelectionDimensions());
        source.getDimensions().getDimensions().add(mockDimension("TIME_PERIOD", 21, null, "2012", "2013"));
        source.getDimensions().getDimensions().add(mockDimension("INDICADORES", 0, null, "INDICE_OCUPACION_PLAZAS"));
        source.getDimensions().getDimensions().add(mockDimension("CATEGORIA_ALOJAMIENTO", 20, null, "1_2_3_ESTRELLAS"));
        source.getDimensions().getDimensions().add(mockDimension("DESTINO_ALOJAMIENTO", 40, null, "EL_HIERRO", "TENERIFE"));

        // Transform
        DatasetSelectionForExcel selection = DatasetSelectionMapper.toDatasetSelectionForExcel(source);

        // Validate
        assertEquals(source.getDimensions().getDimensions().size(), selection.getDimensions().size());
        for (DatasetSelectionDimension expected : source.getDimensions().getDimensions()) {
            assertDimension(expected, selection);
        }

        // TODO check rows, columns...
    }

    @Test
    public void testToDatasetSelectionForTsv() throws Exception {

        org.siemac.metamac.rest.export.v1_0.domain.DatasetSelection source = new org.siemac.metamac.rest.export.v1_0.domain.DatasetSelection();
        source.setDimensions(new DatasetSelectionDimensions());
        source.getDimensions().getDimensions().add(mockDimension("TIME_PERIOD", null, LabelVisualisationMode.CODE, "2012", "2013"));
        source.getDimensions().getDimensions().add(mockDimension("INDICADORES", null, LabelVisualisationMode.LABEL, "INDICE_OCUPACION_PLAZAS"));
        source.getDimensions().getDimensions().add(mockDimension("CATEGORIA_ALOJAMIENTO", null, LabelVisualisationMode.CODE_AND_LABEL, "1_2_3_ESTRELLAS"));
        source.getDimensions().getDimensions().add(mockDimension("DESTINO_ALOJAMIENTO", null, null, "EL_HIERRO", "TENERIFE"));

        // Transform
        DatasetSelectionForTsv selection = DatasetSelectionMapper.toDatasetSelectionForTsv(source);

        // Validate
        assertEquals(source.getDimensions().getDimensions().size(), selection.getDimensions().size());
        for (DatasetSelectionDimension expected : source.getDimensions().getDimensions()) {
            assertDimension(expected, selection);
        }
    }

    private DatasetSelectionDimension mockDimension(String dimensionId, Integer position, LabelVisualisationMode labelVisualisationMode, String... dimensionValues) {
        DatasetSelectionDimension dimension = new DatasetSelectionDimension();
        dimension.setDimensionId(dimensionId);
        dimension.setPosition(position);
        dimension.setLabelVisualisationMode(labelVisualisationMode);
        dimension.setDimensionValues(new DimensionValues());
        dimension.getDimensionValues().getDimensionValues().addAll(Arrays.asList(dimensionValues));
        return dimension;
    }

    private void assertDimension(DatasetSelectionDimension expected, DatasetSelection actualDatasetSelection) {
        org.siemac.metamac.portal.core.domain.DatasetSelectionDimension actual = actualDatasetSelection.getDimension(expected.getDimensionId());
        assertEquals(expected.getDimensionId(), actual.getId());
        assertDimensionValues(expected, actual);
        assertEquals(expected.getPosition(), actual.getPosition());
        assertLabelVisualisationMode(expected.getLabelVisualisationMode(), actual.getLabelVisualisationMode());
    }

    private void assertDimensionValues(DatasetSelectionDimension expected, org.siemac.metamac.portal.core.domain.DatasetSelectionDimension actual) {
        assertEquals(expected.getDimensionValues().getDimensionValues(), actual.getSelectedDimensionValues());
    }

    private void assertLabelVisualisationMode(LabelVisualisationMode expected, LabelVisualisationModeEnum actual) {
        MetamacAsserts.assertEqualsNullability(expected, actual);
        if (expected == null) {
            return;
        }
        assertEquals(expected.name(), actual.name());
    }

}