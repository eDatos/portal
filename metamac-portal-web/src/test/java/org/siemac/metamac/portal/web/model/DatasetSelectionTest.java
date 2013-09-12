package org.siemac.metamac.portal.web.model;

import org.junit.Before;
import org.junit.Test;
import org.siemac.metamac.portal.web.mocks.DatasetSelectionMockFactory;

import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertEquals;

public class DatasetSelectionTest {

    private DatasetSelection datasetSelection;

    @Before
    public void before() {
        datasetSelection = DatasetSelectionMockFactory.create()
                .dimension("TIME_PERIOD", 21).categories("2013", "2012")
                .dimension("INDICADORES", 0).categories("INDICE_OCUPACION_PLAZAS")
                .dimension("CATEGORIA_ALOJAMIENTO", 20).categories("1_2_3_ESTRELLAS")
                .dimension("DESTINO_ALOJAMIENTO", 40).categories("EL_HIERRO")
                .build();
    }

    @Test
    public void testGetLeftDimensions() {
        List<DatasetSelectionDimension> leftDimensions = datasetSelection.getLeftDimensions();
        assertEquals(1, leftDimensions.size());
        assertEquals("INDICADORES", leftDimensions.get(0).getId());
    }

    @Test
    public void testGetTopDimensions() {
        List<DatasetSelectionDimension> leftDimensions = datasetSelection.getTopDimensions();
        assertEquals(2, leftDimensions.size());
        assertEquals("CATEGORIA_ALOJAMIENTO", leftDimensions.get(0).getId());
        assertEquals("TIME_PERIOD", leftDimensions.get(1).getId());
    }

    @Test
    public void testGetFixedDimensions() {
        List<DatasetSelectionDimension> leftDimensions = datasetSelection.getFixedDimensions();
        assertEquals(1, leftDimensions.size());
        assertEquals("DESTINO_ALOJAMIENTO", leftDimensions.get(0).getId());
    }

    @Test
    public void testGetRows() {
        assertEquals(1, datasetSelection.getRows());
    }

    @Test
    public void testGetColumns() {
        assertEquals(2, datasetSelection.getColumns());
    }

    @Test
    public void testPermutationAtCell00() {
        Map<String, String> permutation = datasetSelection.permutationAtCell(0, 0);
        assertEquals("EL_HIERRO", permutation.get("DESTINO_ALOJAMIENTO"));
        assertEquals("1_2_3_ESTRELLAS", permutation.get("CATEGORIA_ALOJAMIENTO"));
        assertEquals("2013", permutation.get("TIME_PERIOD"));
        assertEquals("INDICE_OCUPACION_PLAZAS", permutation.get("INDICADORES"));
    }

    @Test
    public void testPermutationAtCell01() {
        Map<String, String> permutation = datasetSelection.permutationAtCell(0, 1);
        assertEquals("EL_HIERRO", permutation.get("DESTINO_ALOJAMIENTO"));
        assertEquals("1_2_3_ESTRELLAS", permutation.get("CATEGORIA_ALOJAMIENTO"));
        assertEquals("2012", permutation.get("TIME_PERIOD"));
        assertEquals("INDICE_OCUPACION_PLAZAS", permutation.get("INDICADORES"));
    }

}
