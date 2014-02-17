package org.siemac.metamac.portal;

import org.siemac.metamac.rest.common.v1_0.domain.InternationalString;
import org.siemac.metamac.rest.common.v1_0.domain.LocalisedString;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Chapter;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Collection;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.CollectionNode;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Table;

import java.util.List;

public class Helpers {

    public static int numberOfFixedDigitsInNumeration(Collection collection) {
        Integer totalIndicatorInstances = countIndicatorInstances(collection.getData().getNodes().getNodes());
        int fixedDigits = totalIndicatorInstances.toString().length();
        if (fixedDigits < 2) {
            fixedDigits = 2;
        }
        return fixedDigits;
    }

    public static int countIndicatorInstances(List<CollectionNode> nodes) {
        int total = 0;
        if (nodes != null) {
            for(CollectionNode node : nodes){
                if (node instanceof Chapter) {
                    Chapter chapter = (Chapter) node;
                    if (chapter.getNodes() != null) {
                        total += countIndicatorInstances(chapter.getNodes().getNodes());
                    }
                } else {
                    total += 1;
                }
            }
        }
        return total;
    }

    public static String localizeTitle(InternationalString internationalString) {
        for (LocalisedString text : internationalString.getTexts()) {
            if (text.getLang().equals("es")) {
                return text.getValue();
            }
        }
        return internationalString.getTexts().get(0).getValue();
    }

    public static String reverseIndex(String[] arr, int i) {
        return arr[arr.length - i - 1];
    }

    public static String tableViewUrl(Table table) {
        if (table.getQuery() != null) {
            String[] hrefParts = table.getDataset().getSelfLink().getHref().split("/");
            String agency = reverseIndex(hrefParts, 1);
            String identifier = reverseIndex(hrefParts, 0);
            return "view.html#queries/" + agency + "/" + identifier;
        } else if (table.getDataset() != null) {
            String[] hrefParts = table.getDataset().getSelfLink().getHref().split("/");
            String agency = reverseIndex(hrefParts, 2);
            String identifier = reverseIndex(hrefParts, 1);
            String version = reverseIndex(hrefParts, 0);
            return "view.html#datasets/" + agency + "/" + identifier + "/" + version;
        }
        return "#";
    }

}
