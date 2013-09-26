package org.siemac.metamac.portal.rest.external.export.v1_0.mapper;

import static org.junit.Assert.assertEquals;

import java.util.Arrays;

import org.junit.Test;
import org.siemac.metamac.portal.core.domain.DatasetSelection;
import org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionDimension;
import org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionDimensions;
import org.siemac.metamac.rest.export.v1_0.domain.DimensionValues;

public class DatasetSelectionMapperTest {

    @Test
    public void testFormJSON() throws Exception {

        org.siemac.metamac.rest.export.v1_0.domain.DatasetSelection source = new org.siemac.metamac.rest.export.v1_0.domain.DatasetSelection();
        source.setDimensions(new DatasetSelectionDimensions());
        source.getDimensions().getDimensions().add(mockDimension("TIME_PERIOD", 21, "time_1", "time_2"));
        source.getDimensions().getDimensions().add(mockDimension("INDICADORES", 0, "INDICE_OCUPACION_PLAZAS"));
        source.getDimensions().getDimensions().add(mockDimension("CATEGORIA_ALOJAMIENTO", 20, "1_2_3_ESTRELLAS"));
        source.getDimensions().getDimensions().add(mockDimension("DESTINO_ALOJAMIENTO", 40, "EL_HIERRO"));

        // Transform
        DatasetSelection selection = DatasetSelectionMapper.toDatasetSelection(source);

        // Validate
        assertEquals(selection.getDimensions().size(), 4);
        assertDimension(selection, "TIME_PERIOD", 21, "time_1", "time_2");
        assertDimension(selection, "INDICADORES", 0, "INDICE_OCUPACION_PLAZAS");
        assertDimension(selection, "CATEGORIA_ALOJAMIENTO", 20, "1_2_3_ESTRELLAS");
        assertDimension(selection, "DESTINO_ALOJAMIENTO", 40, "EL_HIERRO");
    }
    private DatasetSelectionDimension mockDimension(String dimensionId, int position, String... dimensionValues) {
        DatasetSelectionDimension dimension = new DatasetSelectionDimension();
        dimension.setDimensionId(dimensionId);
        dimension.setPosition(position);
        dimension.setDimensionValues(new DimensionValues());
        dimension.getDimensionValues().getDimensionValues().addAll(Arrays.asList(dimensionValues));
        return dimension;
    }

    private void assertDimension(DatasetSelection selection, String dimensionId, int position, String... dimensionValues) {
        org.siemac.metamac.portal.core.domain.DatasetSelectionDimension dimension = selection.getDimension(dimensionId);
        assertEquals(dimensionId, dimension.getId());
        assertEquals(position, dimension.getPosition());
        assertEquals(Arrays.asList(dimensionValues), dimension.getSelectedDimensionValues());
    }

}