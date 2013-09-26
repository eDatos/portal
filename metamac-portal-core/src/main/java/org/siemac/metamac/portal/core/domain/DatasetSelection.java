package org.siemac.metamac.portal.core.domain;

import java.util.*;

public class DatasetSelection {

    public static final int LEFT_DIMENSIONS_START_POSITION = 0;
    public static final int TOP_DIMENSIONS_START_POSITION = 20;
    public static final int FIXED_DIMENSIONS_START_POSITION = 40;

    private List<DatasetSelectionDimension> dimensions = new ArrayList<DatasetSelectionDimension>();
    private Map<String, DatasetSelectionDimension> dimensionsMap = new HashMap<String, DatasetSelectionDimension>();
    private Map<String, Integer> multipliers = new HashMap<String, Integer>();

    public DatasetSelection(List<DatasetSelectionDimension> dimensions) {
        this.dimensions = new ArrayList<DatasetSelectionDimension>(dimensions);
        for(DatasetSelectionDimension dimension : dimensions) {
            dimensionsMap.put(dimension.getId(), dimension);
        }

        initializeMultipliers(getLeftDimensions());
        initializeMultipliers(getTopDimensions());
        initializedFixedMultipliers();
    }

    private void initializeMultipliers(List<DatasetSelectionDimension> dimensions) {
        ListIterator<DatasetSelectionDimension> li = dimensions.listIterator(dimensions.size());
        int ac = 1;
        while(li.hasPrevious()) {
            DatasetSelectionDimension dimension = li.previous();
            multipliers.put(dimension.getId(), ac);
            ac *= dimension.getSelectedDimensionValues().size();
        }
    }

    private void initializedFixedMultipliers() {
        List<DatasetSelectionDimension> fixedDimensions = getFixedDimensions();
        for(DatasetSelectionDimension dimension : fixedDimensions) {
            multipliers.put(dimension.getId(), 1);
        }
    }

    public DatasetSelectionDimension getDimension(String dimensionId) {
        return dimensionsMap.get(dimensionId);
    }

    public List<DatasetSelectionDimension> getDimensions() {
        return new ArrayList<DatasetSelectionDimension>(dimensions);
    }

    public int getRows() {
        List<DatasetSelectionDimension> leftDimensions = getLeftDimensions();
        if(leftDimensions.size() > 0) {
            DatasetSelectionDimension biggerLeftDimension = leftDimensions.get(0);
            return multipliers.get(biggerLeftDimension.getId()) * biggerLeftDimension.getSelectedDimensionValues().size();
        } else {
            return 1;
        }
    }

    public int getColumns() {
        List<DatasetSelectionDimension> topDimensions = getTopDimensions();
        if (topDimensions.size() > 0) {
            DatasetSelectionDimension biggerTopDimension = topDimensions.get(0);
            return multipliers.get(biggerTopDimension.getId()) * biggerTopDimension.getSelectedDimensionValues().size();
        } else {
            return 1;
        }
    }

    public List<DatasetSelectionDimension> getLeftDimensions() {
        return getDimensionsInPositionRange(LEFT_DIMENSIONS_START_POSITION, TOP_DIMENSIONS_START_POSITION);
    }

    public List<DatasetSelectionDimension> getTopDimensions() {
        return getDimensionsInPositionRange(TOP_DIMENSIONS_START_POSITION, FIXED_DIMENSIONS_START_POSITION);
    }

    public List<DatasetSelectionDimension> getFixedDimensions() {
        return getDimensionsInPositionRange(FIXED_DIMENSIONS_START_POSITION, FIXED_DIMENSIONS_START_POSITION + 20);
    }

    private List<DatasetSelectionDimension> getDimensionsInPositionRange(int from, int to) {
        List<DatasetSelectionDimension> dimensionsInRange = new ArrayList<DatasetSelectionDimension>();
        for (DatasetSelectionDimension dimension : dimensions) {
            if (dimension.getPosition() >= from && dimension.getPosition() < to) {
                dimensionsInRange.add(dimension);
            }
        }
        sortDimensionsByPosition(dimensionsInRange);
        return dimensionsInRange;
    }

    private void sortDimensionsByPosition(List<DatasetSelectionDimension> dimensions) {
        Collections.sort(dimensions, new Comparator<DatasetSelectionDimension>() {
            public int compare(DatasetSelectionDimension datasetSelectionDimension, DatasetSelectionDimension datasetSelectionDimension2) {
                return datasetSelectionDimension.getPosition() - datasetSelectionDimension2.getPosition();
            }
        });
    }

    public Map<String, String> permutationAtCell(int row, int column) {
        Map<String, String> permutation = new HashMap<String, String>();

        for(DatasetSelectionDimension dimension : getLeftDimensions()) {
            Integer multiplier = multipliers.get(dimension.getId());
            int selectedCategoryIndex = (row / multiplier) % dimension.getSelectedDimensionValues().size();
            permutation.put(dimension.getId(), dimension.getSelectedDimensionValues().get(selectedCategoryIndex));
        }

        for(DatasetSelectionDimension dimension : getTopDimensions()) {
            Integer multiplier = multipliers.get(dimension.getId());
            int selectedCategoryIndex = (column / multiplier) % dimension.getSelectedDimensionValues().size();
            permutation.put(dimension.getId(), dimension.getSelectedDimensionValues().get(selectedCategoryIndex));
        }

        for(DatasetSelectionDimension dimension : getFixedDimensions()) {
            permutation.put(dimension.getId(), dimension.getSelectedDimensionValues().get(0));
        }

        return permutation;
    }

    public int getMultiplierForDimension(DatasetSelectionDimension dimension) {
        return multipliers.get(dimension.getId());
    }
}
