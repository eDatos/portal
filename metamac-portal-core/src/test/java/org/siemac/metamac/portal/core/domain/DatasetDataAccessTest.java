package org.siemac.metamac.portal.core.domain;

import org.junit.Test;
import org.siemac.metamac.portal.core.domain.DatasetDataAccess;
import org.siemac.metamac.portal.core.serviceapi.utils.DatasetDataMockBuilder;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Data;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;

public class DatasetDataAccessTest {

    @Test
    public void testObservationAtPermutation() throws Exception {
        Data data = DatasetDataMockBuilder.create()
                .observations("1.35 | 2.24 |  | 4.5")
                .dimension("DIM_A").representation("DIM_A_0", "DIM_A_1")
                .dimension("DIM_B").representation("DIM_B_0", "DIM_B_1")
                .build();

        Dataset dataset = new Dataset();
        dataset.setData(data);
        DatasetDataAccess datasetDataAccess = new DatasetDataAccess(dataset);

        Map<String, String> p1 = new HashMap<String, String>();
        p1.put("DIM_A", "DIM_A_0");
        p1.put("DIM_B", "DIM_B_0");
        assertEquals(new Double(1.35), datasetDataAccess.observationAtPermutation(p1));

        Map<String, String> p2 = new HashMap<String, String>();
        p2.put("DIM_A", "DIM_A_1");
        p2.put("DIM_B", "DIM_B_1");
        assertEquals(new Double(4.5), datasetDataAccess.observationAtPermutation(p2));

        Map<String, String> p3 = new HashMap<String, String>();
        p3.put("DIM_A", "DIM_A_1");
        p3.put("DIM_B", "DIM_B_0");
        assertEquals(null, datasetDataAccess.observationAtPermutation(p3));
    }

}
