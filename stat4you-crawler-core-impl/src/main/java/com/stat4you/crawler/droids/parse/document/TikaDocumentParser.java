package com.stat4you.crawler.droids.parse.document;

import java.io.IOException;
import java.io.InputStream;

import org.apache.droids.api.ContentEntity;
import org.apache.droids.api.Link;
import org.apache.droids.api.Parse;
import org.apache.droids.api.Parser;
import org.apache.droids.exception.DroidsException;
import org.apache.tika.config.TikaConfig;
import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.sax.BodyContentHandler;
import org.springframework.beans.factory.InitializingBean;
import org.xml.sax.ContentHandler;
import org.xml.sax.SAXException;

import com.stat4you.crawler.droids.parse.TikaMetadataParseImpl;

public class TikaDocumentParser implements Parser, InitializingBean {

	@SuppressWarnings("unused")
    private TikaConfig tc;

	public void afterPropertiesSet() throws Exception {
		tc = TikaConfig.getDefaultConfig();
	}

	public Parse parse(ContentEntity entity, Link link) throws DroidsException, IOException {
		try {
			// PARSE: AUTODETECTION
			return parseAutodetection(entity, link);
		} catch (SAXException ex) {
			throw new DroidsException("Failure parsing document " + link.getId(), ex);
		} catch (TikaException ex) {
			throw new DroidsException("Failure parsing document " + link.getId(), ex);
		}
	}

	/**************************************************************************
	 * PRIVADOS
	 ***************************************************************************/

	private Parse parseAutodetection(ContentEntity entity, Link link) throws SAXException, TikaException, IOException {

		InputStream instream = entity.obtainContent();
		try {
			Metadata metadata = new Metadata();
			ContentHandler handler = new BodyContentHandler();
//			new AutoDetectParser().parse(instream, handler, metadata);

			TikaMetadataParseImpl parse = new TikaMetadataParseImpl(handler.toString(), null, metadata);

			return parse;
		} finally {
			instream.close();
		}
	}

}
