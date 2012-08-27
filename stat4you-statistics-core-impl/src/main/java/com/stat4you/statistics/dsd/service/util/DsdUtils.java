package com.stat4you.statistics.dsd.service.util;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;

import com.stat4you.statistics.dsd.Constants;

public class DsdUtils {

    private static final String  REG_EXP_SEMANTIC_IDENTIFIER = "[A-z][A-z0-9_\\-]*(\\.[A-z][A-z0-9_\\-]*)*";
    private static final Pattern PATTERN_SEMANTIC_IDENTIFIER = Pattern.compile(REG_EXP_SEMANTIC_IDENTIFIER);

    public static boolean isSemanticIdentifier(String str) {
        return matchStringToPattern(str, PATTERN_SEMANTIC_IDENTIFIER);
    }

    private static boolean matchStringToPattern(String str, Pattern pattern) {
        if (StringUtils.isNotEmpty(str)) {
            Matcher matcher = pattern.matcher(str);
            return matcher.matches();
        }
        return false;
    }

    public static List<String> doStringToDtoList(String source) {
        if (source == null) {
            return new ArrayList<String>();
        }
        source = StringUtils.removeStart(source, Constants.SEPARATOR_TO_LIST_IN_DO);
        source = StringUtils.removeEnd(source, Constants.SEPARATOR_TO_LIST_IN_DO);
        List<String> target = new ArrayList<String>();
        String[] sourceSplited = source.split(Constants.SEPARATOR_TO_LIST_IN_DO);
        for (int i = 0; i < sourceSplited.length; i++) {
            target.add(sourceSplited[i]);
        }
        return target;
    }
}