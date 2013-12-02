package org.siemac.metamac.portal;

import org.siemac.metamac.rest.common.v1_0.domain.InternationalString;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Chapter;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Collection;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.CollectionNode;

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
                    Chapter chapter = (Chapter)node;
                    total += countIndicatorInstances(chapter.getNodes().getNodes());
                } else {
                    total += 1;
                }
            }
        }
        return total;
    }

    public static String localizeTitle(InternationalString internationalString) {
        //TODO fetch the spanish language
        return internationalString.getTexts().get(0).getValue();
    }

}
