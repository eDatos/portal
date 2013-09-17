package org.siemac.metamac.portal.core.serviceimpl;

import java.io.OutputStream;
import java.io.StringReader;

import org.apache.batik.transcoder.SVGAbstractTranscoder;
import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.apache.batik.transcoder.image.JPEGTranscoder;
import org.apache.batik.transcoder.image.PNGTranscoder;
import org.apache.fop.svg.PDFTranscoder;
import org.siemac.metamac.portal.core.domain.SvgExportSupportedMimeType;

public class SVGRasterizer {

    private static final SVGRasterizer INSTANCE = new SVGRasterizer();

    public static final SVGRasterizer getInstance() {
        return INSTANCE;
    }

    public SVGRasterizer() {
    }

    public synchronized void transcode(OutputStream stream, String svg, SvgExportSupportedMimeType mime, Float width) throws Exception {
        TranscoderInput input = new TranscoderInput(new StringReader(svg));
        TranscoderOutput transOutput = new TranscoderOutput(stream);
        SVGAbstractTranscoder transcoder = SVGRasterizer.getTranscoder(mime);
        if (width != null) {
            transcoder.addTranscodingHint(SVGAbstractTranscoder.KEY_WIDTH, width);
        }
        transcoder.transcode(input, transOutput);
    }

    public static SVGAbstractTranscoder getTranscoder(SvgExportSupportedMimeType mime) throws Exception {

        SVGAbstractTranscoder transcoder = null;

        switch (mime) {
            case PNG:
                transcoder = new PNGTranscoder();
                break;
            case JPEG:
                transcoder = new JPEGTranscoder();
                transcoder.addTranscodingHint(JPEGTranscoder.KEY_QUALITY, new Float(0.9));
                break;
            case PDF:
                transcoder = new PDFTranscoder();
                break;
            default:
                // do nothing
                break;
        }

        if (transcoder == null) {
            throw new Exception("MimeType not supported: " + mime);
        }

        return transcoder;
    }
}
