package org.siemac.metamac.portal.rest.external.export.v1_0.service;

import static org.junit.Assert.assertEquals;

import java.util.Arrays;

import org.junit.Test;
import org.siemac.metamac.portal.core.domain.DatasetSelection;
import org.siemac.metamac.portal.core.domain.DatasetSelectionDimension;

public class DatasetSelectionMapperTest {

    @Test
    public void testFormJSON() throws Exception {

        String json = "{\"TIME_PERIOD\" : {\"position\" : 21,\"selectedCategories\" : [\"time_1\", \"time_2\"]},\n"
                + "\"INDICADORES\" : {\"position\" : 0,\"selectedCategories\" : [\"INDICE_OCUPACION_PLAZAS\"]},\n"
                + "\"CATEGORIA_ALOJAMIENTO\" : {\"position\" : 20,\"selectedCategories\" : [ \"1_2_3_ESTRELLAS\"]},\n"
                + "\"DESTINO_ALOJAMIENTO\" : {\"position\" : 40,\"selectedCategories\" : [\"EL_HIERRO\"]}}";

        DatasetSelection selection = DatasetSelectionMapper.fromJSON(json);
        assertEquals(selection.getDimensions().size(), 4);
        assertDimension(selection, "TIME_PERIOD", 21, "time_1", "time_2");
        assertDimension(selection, "INDICADORES", 0, "INDICE_OCUPACION_PLAZAS");
        assertDimension(selection, "CATEGORIA_ALOJAMIENTO", 20, "1_2_3_ESTRELLAS");
        assertDimension(selection, "DESTINO_ALOJAMIENTO", 40, "EL_HIERRO");
    }

    private void assertDimension(DatasetSelection selection, String dimensionId, int position, String... selectedCategories) {
        DatasetSelectionDimension dimension = selection.getDimension(dimensionId);
        assertEquals(dimensionId, dimension.getId());
        assertEquals(position, dimension.getPosition());
        assertEquals(Arrays.asList(selectedCategories), dimension.getSelectedCategories());
    }

}