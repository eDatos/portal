package org.siemac.metamac.portal.web.mocks;

import org.siemac.metamac.portal.web.model.DatasetSelection;
import org.siemac.metamac.portal.web.model.DatasetSelectionDimension;

import java.util.Arrays;

public class DatasetSelectionMockFactory {
    
    public static DatasetSelection create() {

        DatasetSelectionDimension timeDimension = new DatasetSelectionDimension("TIME_PERIOD", 21);
        timeDimension.setSelectedCategories(Arrays.asList("2013", "2012"));

        DatasetSelectionDimension indicadores = new DatasetSelectionDimension("INDICADORES", 0);
        indicadores.setSelectedCategories(Arrays.asList("INDICE_OCUPACION_PLAZAS"));

        DatasetSelectionDimension categoriaAlojamiento = new DatasetSelectionDimension("CATEGORIA_ALOJAMIENTO", 20);
        categoriaAlojamiento.setSelectedCategories(Arrays.asList("1_2_3_ESTRELLAS"));

        DatasetSelectionDimension destinoAlojamiento = new DatasetSelectionDimension("DESTINO_ALOJAMIENTO", 40);
        destinoAlojamiento.setSelectedCategories(Arrays.asList("EL_HIERRO"));

        DatasetSelection datasetSelection = new DatasetSelection(Arrays.asList(timeDimension, indicadores, categoriaAlojamiento, destinoAlojamiento));

        return datasetSelection;
    } 
    
}
