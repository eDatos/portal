package org.siemac.metamac.portal.core.exporters;

public class DataOrderingStackElement {

    private final String dimensionId;
    private final int    dimensionPosition;
    private final String dimensionCodeId;

    public DataOrderingStackElement(String dimensionId, int dimensionPosition, String dimensionCodeId) {
        super();
        this.dimensionId = dimensionId;
        this.dimensionPosition = dimensionPosition;
        this.dimensionCodeId = dimensionCodeId;
    }

    public String getDimensionId() {
        return dimensionId;
    }

    public int getDimensionPosition() {
        return dimensionPosition;
    }

    public String getDimensionCodeId() {
        return dimensionCodeId;
    }
}