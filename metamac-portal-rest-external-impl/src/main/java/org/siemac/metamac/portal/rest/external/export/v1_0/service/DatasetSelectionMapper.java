package org.siemac.metamac.portal.rest.external.export.v1_0.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ArrayNode;
import org.siemac.metamac.portal.core.domain.DatasetSelection;
import org.siemac.metamac.portal.core.domain.DatasetSelectionDimension;

public class DatasetSelectionMapper {

    private static ObjectMapper mapper = new ObjectMapper();

    public static DatasetSelection fromJSON(String json) throws Exception {

        List<DatasetSelectionDimension> dimensions = new ArrayList<DatasetSelectionDimension>();
        try {
            JsonNode jsonNode = mapper.readTree(json);
            Iterator<Map.Entry<String, JsonNode>> dimensionNodes = jsonNode.getFields();
            while (dimensionNodes.hasNext()) {
                Map.Entry<String, JsonNode> dimensionNode = dimensionNodes.next();
                int position = dimensionNode.getValue().get("position").asInt();
                String id = dimensionNode.getKey();

                ArrayNode selectedCategoriesNode = (ArrayNode) dimensionNode.getValue().get("selectedCategories");
                List<String> selectedCategories = nodeArrayToListString(selectedCategoriesNode);

                DatasetSelectionDimension dimension = new DatasetSelectionDimension(id, position);
                dimension.setSelectedCategories(selectedCategories);
                dimensions.add(dimension);
            }
        } catch (IOException e) {
            throw new Exception("Error parsing dataset selection", e);
        }

        return new DatasetSelection(dimensions);
    }

    private static List<String> nodeArrayToListString(ArrayNode selectedCategoriesNode) {
        Iterator<JsonNode> iterator = selectedCategoriesNode.getElements();
        List<String> result = new ArrayList<String>();
        while (iterator.hasNext()) {
            result.add(iterator.next().asText());
        }
        return result;
    }

    public static String getDimsParameter(DatasetSelection datasetSelection) {
        StringBuilder sb = new StringBuilder();
        for (DatasetSelectionDimension dimension : datasetSelection.getDimensions()) {
            sb.append(dimension.getId());
            sb.append(":");
            sb.append(StringUtils.join(dimension.getSelectedCategories(), "|"));
            sb.append(":");
        }
        sb.deleteCharAt(sb.length() - 1); // delete last :
        return sb.toString();
    }

}