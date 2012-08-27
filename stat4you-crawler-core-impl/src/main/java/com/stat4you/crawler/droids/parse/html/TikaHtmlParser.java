package com.stat4you.crawler.droids.parse.html;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import org.apache.droids.api.ContentEntity;
import org.apache.droids.api.Link;
import org.apache.droids.api.Parse;
import org.apache.droids.api.Parser;
import org.apache.droids.exception.DroidsException;
import org.apache.droids.parse.html.LinkExtractor;
import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.html.HtmlParser;
import org.apache.tika.sax.BodyContentHandler;
import org.apache.tika.sax.TeeContentHandler;
import org.xml.sax.ContentHandler;
import org.xml.sax.SAXException;

import com.stat4you.crawler.droids.parse.TikaMetadataParseImpl;

public class TikaHtmlParser implements Parser {

    private Map<String, String> elements = null;

    public Map<String, String> getElements() {
        if (elements == null) {
            elements = new HashMap<String, String>();
        }
        return elements;
    }

    public void setElements(Map<String, String> elements) {
        this.elements = elements;
    }

    public Parse parse(ContentEntity entity, Link link) throws IOException, DroidsException {
        Metadata metadata = new Metadata();
        LinkExtractor extractor = new LinkExtractor(link, elements);
        InputStream instream = entity.obtainContent();
        ContentHandler body = new BodyContentHandler();
        try {
            new HtmlParser().parse(instream, new TeeContentHandler(body, extractor), metadata, new ParseContext());
            return new TikaMetadataParseImpl(body.toString(), extractor.getLinks(), metadata);

        } catch (SAXException ex) {
            throw new DroidsException("Failure parsing document " + link.getId(), ex);
        } catch (TikaException ex) {
            throw new DroidsException("Failure parsing document " + link.getId(), ex);
        } finally {
            instream.close();
        }
    }

}
