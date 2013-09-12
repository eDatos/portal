package org.siemac.metamac.portal.web.export;

import java.io.ByteArrayOutputStream;

import org.apache.batik.transcoder.TranscoderException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

// TODO servir como API? Si no, habilitar component scan Controller
@Controller
@RequestMapping("/chart/export")
public class ExportController {

    private static final String FORBIDDEN_WORD = "<!ENTITY";
    private static Logger       log            = LoggerFactory.getLogger(ExportController.class);

    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET})
    public HttpEntity<byte[]> export(@RequestParam(value = "filename", required = false) String filename, @RequestParam(value = "width", required = false) Float width,
            @RequestParam(value = "type", required = false) String type, @RequestParam(value = "svg") String svg) throws Exception {

        filename = getFilename(filename);
        width = getWidth(width);
        MimeType mimeType = getMime(type);
        validateSvg(svg);

        return createResponse(svg, filename, width, mimeType);
    }

    public static HttpEntity<byte[]> createResponse(String svg, String filename, Float width, MimeType mime) throws Exception {
        ByteArrayOutputStream stream = new ByteArrayOutputStream();

        // mime = MimeType.SVG;

        if (!MimeType.SVG.equals(mime)) {
            try {
                stream = SVGRasterizer.getInstance().transcode(stream, svg, mime, width);
            } catch (SVGRasterizerException sre) {
                log.error("Error while transcoding svg file to an image", sre);
                throw new Exception("Error while transcoding svg file to an image", sre);
            } catch (TranscoderException te) {
                log.error("Error while transcoding svg file to an image", te);
                throw new Exception("Error while transcoding svg file to an image", te);
            }
        } else {
            stream.write(svg.getBytes());
        }
        byte[] documentBody = stream.toByteArray();

        HttpHeaders headers = new HttpHeaders();
        headers.set("ContentType", mime.getType());
        headers.set("Content-Disposition", "attachment; filename=" + filename + "." + mime.name().toLowerCase());
        headers.setContentLength(documentBody.length);

        return new HttpEntity<byte[]>(documentBody, headers);
    }

    private void validateSvg(String svg) throws Exception {
        if (svg.indexOf(FORBIDDEN_WORD) > -1 || svg.indexOf(FORBIDDEN_WORD.toLowerCase()) > -1) {
            throw new Exception("The - svg - post parameter could contain a malicious attack");
        }
    }

    private String getFilename(String name) {
        return (name != null) ? name : "chart";
    }

    private static Float getWidth(Float width) {
        if (width.compareTo(0.0F) > 0) {
            return width;
        }
        return null;
    }

    private static MimeType getMime(String mime) {
        MimeType type = MimeType.get(mime);
        if (type != null) {
            return type;
        }
        return MimeType.PNG;
    }

}
