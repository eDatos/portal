package com.stat4you.crawler.droids.parse;

import java.util.Collection;

import org.apache.droids.api.Link;
import org.apache.droids.parse.ParseImpl;
import org.apache.tika.metadata.Metadata;

public class TikaMetadataParseImpl extends ParseImpl {
	
	  protected Metadata metadata;
	  
	  public Metadata getMetadata() {
		return metadata;
	  }
	  
	  public TikaMetadataParseImpl() {}
	  
      public TikaMetadataParseImpl(String text, Collection<Link> outlinks) {
    	  super(text, outlinks);
      }
      
      public TikaMetadataParseImpl(String text, Object data, Collection<Link> outlinks) {
    	  super(text, data, outlinks);
      }
      
      public TikaMetadataParseImpl(String text, Collection<Link> outlinks, Metadata metadata) {
  	    this.text = text;
  	    this.outlinks = outlinks;
  	    this.metadata = metadata;
      }

}
