package com.stat4you.normalizedvalues.transform;

import java.io.File;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.util.List;

import org.springframework.util.ResourceUtils;

public class NormalizedValuesToSqlUtils {

    @SuppressWarnings("unchecked")
    public static List<String> readFile(String path) throws Exception {
        File file = ResourceUtils.getFile(path);
        List<String> values = org.apache.commons.io.FileUtils.readLines(file, "UTF-8");
        return values;
    }

    public static void saveFile(List<String> sentences, String path) throws Exception {
        FileWriter outFile = new FileWriter(path);
        PrintWriter out = new PrintWriter(outFile);
        for (String sentence : sentences) {
            out.println(sentence);
        }
        out.close();
    }
}
