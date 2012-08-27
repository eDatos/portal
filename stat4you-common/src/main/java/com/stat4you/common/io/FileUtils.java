package com.stat4you.common.io;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.ibm.icu.text.CharsetDetector;
import com.ibm.icu.text.CharsetMatch;

public class FileUtils {

    protected static final Logger log = LoggerFactory.getLogger(FileUtils.class);

    /**
     * Creates a temporal file with stream content
     */
    public static File createTempFile(InputStream inputStream) throws Exception {
        File temporalFile = File.createTempFile("stat4you-", ".tmp");
        OutputStream outputStream = new FileOutputStream(temporalFile);

        IOUtils.copy(inputStream, outputStream);
        outputStream.flush();

        IOUtils.closeQuietly(inputStream);
        IOUtils.closeQuietly(outputStream);

        return temporalFile;
    }

    /**
     * Deletes file quietly. If it is not deleted, it will be deleted on exit
     */
    public static void deleteFileQuietly(File file) {
        if (file == null) {
            return;
        }

        Boolean fileDeleted = null;
        try {
            fileDeleted = file.delete();
        } catch (Exception e) {
            // nothing
        } finally {
            if (!fileDeleted) {
                file.deleteOnExit();
            }
        }
    }

    /**
     * Reads the contents of a file line by line to a List of Strings.
     * The file is always closed.
     **/
    public static List<String> readLines(File file) throws Exception {
        String encoding = guessCharset(file);
        List<String> values = org.apache.commons.io.FileUtils.readLines(file, encoding);
        return values;
    }

    /**
     * Guesses charset name of a file
     */
    public static String guessCharset(File inputFile) throws Exception {
        FileInputStream fileStream = null;
        try {
            fileStream = new FileInputStream(inputFile);
            CharsetDetector detector = new CharsetDetector();
            byte[] byteData = new byte[500]; // The heuristic detection is applied to the first 100 bytes. If you want to be safer, increase
            fileStream.read(byteData);
            detector.setText(byteData);
            CharsetMatch match = detector.detect();
            return match.getName();
        } catch (IOException e) {
            log.error("Error guessing charset", e);
            throw e;
        } finally {
            IOUtils.closeQuietly(fileStream);
        }
    }

}
