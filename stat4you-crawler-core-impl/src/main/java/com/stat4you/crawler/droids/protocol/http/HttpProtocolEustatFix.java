package com.stat4you.crawler.droids.protocol.http;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import org.apache.droids.api.ManagedContentEntity;
import org.apache.droids.api.Protocol;
import org.apache.droids.norobots.ContentLoader;
import org.apache.droids.norobots.NoRobotClient;
import org.apache.droids.norobots.NoRobotException;
import org.apache.droids.protocol.http.DroidsHttpClient;
import org.apache.droids.protocol.http.HttpClientContentLoader;
import org.apache.droids.protocol.http.HttpContentEntity;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.StatusLine;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.HttpResponseException;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.params.CoreProtocolPNames;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Protocol handler based on HttpClient 4.0.
 */
public class HttpProtocolEustatFix implements Protocol {

  private final Logger log = LoggerFactory.getLogger(HttpProtocolEustatFix.class);

  private final HttpClient httpclient;
  private final ContentLoader contentLoader;
  
  private boolean forceAllow = false;
  private String userAgent = "Apache-Droids/1.1 (java 1.5)";

  public HttpProtocolEustatFix(final HttpClient httpclient) {
    super();
    this.httpclient = httpclient;
    this.httpclient.getParams().setParameter(CoreProtocolPNames.USER_AGENT, userAgent);
    this.contentLoader = new HttpClientContentLoader(httpclient);
  }
  
  public HttpProtocolEustatFix() {
    this(new DroidsHttpClient());
  }

  @Override
  public ManagedContentEntity load(URI uri) throws IOException {
    HttpGet httpget = new HttpGet(uri);
    HttpResponse response = httpclient.execute(httpget);
    StatusLine statusline = response.getStatusLine();
    // TODO THIS is a FIX for EUSTAT, delete this when the EUSTAT PX page: the original code line is corrected.
    //      if (statusline.getStatusCode() >= HttpStatus.SC_BAD_REQUEST)
    // See: http://jira.arte-consultores.com/browse/SFY-530
    // This code is only valid for EUSTAT, avoid with any other provider.
    if (statusline.getStatusCode() != HttpStatus.SC_INTERNAL_SERVER_ERROR & statusline.getStatusCode() >= HttpStatus.SC_BAD_REQUEST) {
      httpget.abort();
      throw new HttpResponseException(
          statusline.getStatusCode(), statusline.getReasonPhrase());
    }
    HttpEntity entity = response.getEntity();
    if (entity == null) {
      // Should _almost_ never happen with HTTP GET requests.
      throw new ClientProtocolException("Empty entity");
    }
    long maxlen = httpclient.getParams().getLongParameter(DroidsHttpClient.MAX_BODY_LENGTH, 0);
    return new HttpContentEntity(entity, maxlen);
  }

  @Override
  public boolean isAllowed(URI uri) throws IOException {
    if (forceAllow) {
      return forceAllow;
    }

    URI baseURI;
    try {
      baseURI = new URI(
          uri.getScheme(), uri.getUserInfo(), uri.getHost(), uri.getPort(), 
          "/", null, null);
    } catch (URISyntaxException ex) {
      log.error("Unable to determine base URI for " + uri);
      return false;
    }
    
    NoRobotClient nrc = new NoRobotClient(contentLoader, userAgent);
    try {
      nrc.parse(baseURI);
    } catch (NoRobotException ex) {
      log.error("Failure parsing robots.txt: " + ex.getMessage());
      return false;
    }
    boolean test = nrc.isUrlAllowed(uri);
    if (log.isInfoEnabled()) {
      log.info(uri + " is " + (test ? "allowed" : "denied"));
    }
    return test;
  }

  public String getUserAgent() {
    return userAgent;
  }

  public void setUserAgent(String userAgent) {
    this.userAgent = userAgent;
    this.httpclient.getParams().setParameter(CoreProtocolPNames.USER_AGENT, userAgent);
  }

  /**
   * You can force that a site is allowed (ignoring the robots.txt). This should
   * only be used on server that you control and where you have the permission
   * to ignore the robots.txt.
   * 
   * @return <code>true</code> if you are rude and ignore robots.txt.
   *         <code>false</code> if you are playing nice.
   */
  public boolean isForceAllow() {
    return forceAllow;
  }

  /**
   * You can force that a site is allowed (ignoring the robot.txt). This should
   * only be used on server that you control and where you have the permission
   * to ignore the robots.txt.
   * 
   * @param forceAllow
   *                if you want to force an allow and ignore the robot.txt set
   *                to <code>true</code>. If you want to obey the rules and
   *                be polite set to <code>false</code>.
   */
  public void setForceAllow(boolean forceAllow) {
    this.forceAllow = forceAllow;
  }
  
  protected HttpClient getHttpClient() {
    return this.httpclient;
  }

}
