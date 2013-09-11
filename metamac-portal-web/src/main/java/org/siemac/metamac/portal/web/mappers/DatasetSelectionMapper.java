package org.siemac.metamac.portal.web.mappers;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ArrayNode;
import org.siemac.metamac.portal.web.model.DatasetSelection;
import org.siemac.metamac.portal.web.model.DatasetSelectionDimension;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

public class DatasetSelectionMapper {

    private static ObjectMapper mapper = new ObjectMapper();

    public static DatasetSelection fromJSON(String json) throws Exception {

        DatasetSelection selection = new DatasetSelection();
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
                selection.addDimension(dimension);
            }
        } catch (IOException e) {
            throw new Exception("Error parsing dataset selection", e);
        }

        return selection;
    }

    private static List<String> nodeArrayToListString(ArrayNode selectedCategoriesNode) {
        Iterator<JsonNode> iterator = selectedCategoriesNode.getElements();
        List<String> result = new ArrayList<String>();
        while(iterator.hasNext()){
            result.add(iterator.next().asText());
        }
        return result;
    }

}
