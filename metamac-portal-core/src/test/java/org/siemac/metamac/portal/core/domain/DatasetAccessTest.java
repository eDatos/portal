package org.siemac.metamac.portal.core.domain;

import org.junit.Before;
import org.junit.Test;
import org.siemac.metamac.portal.core.serviceapi.utils.DatasetMockBuilder;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;

public class DatasetAccessTest {

    private DatasetAccess datasetAccess;

    @Before
    public void before() {
        Dataset dataset = DatasetMockBuilder.create()
                .observations("1.35 | 2.24 |  | 4.5")
                .dimension("DIM_A", "Dimension A")
                .representation("DIM_A_0", "Representation A0")
                .representation("DIM_A_1", "Representation A1")
                .dimension("DIM_B", "Dimension B")
                .representation("DIM_B_0", "Representation B0")
                .representation("DIM_B_1", "Representation B1")
                .build();
        datasetAccess = new DatasetAccess(dataset, "es");
    }

    @Test
    public void testObservationAtPermutation() throws Exception {
        Map<String, String> p1 = new HashMap<String, String>();
        p1.put("DIM_A", "DIM_A_0");
        p1.put("DIM_B", "DIM_B_0");
        assertEquals(new Double(1.35), datasetAccess.observationAtPermutation(p1));

        Map<String, String> p2 = new HashMap<String, String>();
        p2.put("DIM_A", "DIM_A_1");
        p2.put("DIM_B", "DIM_B_1");
        assertEquals(new Double(4.5), datasetAccess.observationAtPermutation(p2));

        Map<String, String> p3 = new HashMap<String, String>();
        p3.put("DIM_A", "DIM_A_1");
        p3.put("DIM_B", "DIM_B_0");
        assertEquals(null, datasetAccess.observationAtPermutation(p3));
    }

    @Test
    public void testRepresentationLabel() {
        assertEquals("Representation A0", datasetAccess.representationLabel("DIM_A", "DIM_A_0"));
        assertEquals("Representation B1", datasetAccess.representationLabel("DIM_B", "DIM_B_1"));
    }

}
