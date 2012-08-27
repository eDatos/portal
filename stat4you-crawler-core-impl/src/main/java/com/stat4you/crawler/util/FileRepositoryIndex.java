package com.stat4you.crawler.util;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.index.Term;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TermQuery;
import org.apache.lucene.search.TopScoreDocCollector;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.NIOFSDirectory;
import org.apache.lucene.util.Version;
import org.fornax.cartridges.sculptor.framework.errorhandling.ApplicationException;
import org.joda.time.DateTime;

import com.stat4you.crawler.droids.api.LinkStat4you;
import com.stat4you.crawler.exceptions.CrawlerExceptionCodeEnum;

public class FileRepositoryIndex {

    private IndexReader reader;
    
    private IndexWriter writer;

    private CrawlerInfo crawlerInfo;
    


    public void setCrawlerInfo(CrawlerInfo crawlerInfo) {
        this.crawlerInfo = crawlerInfo;
    }
    
    /**************************************************************************
     * PUBLIC
     **************************************************************************/

    public void closeIndex() throws ApplicationException {
        try {
            if (this.writer != null) {
                this.writer.close();
            }
            if (this.reader != null) {
                this.reader.close();
            }
            this.writer = null;
            this.reader = null;
        } catch (IOException e) {
            throw new ApplicationException(CrawlerExceptionCodeEnum.LUCENE.getName(), "Close Index repository FAILED. Provider: " + this.crawlerInfo.getCrawlerName(), e);
        }
    }

    public void updateRepositoryIndex(LinkStat4you linkStat4you, File file) throws ApplicationException {
        try {
            FileRepositoryContent fileRepo = FileRepositoryContentBuilder.fileRepositoryContent().withId(linkStat4you.getId()).withPath(file.getParentFile().getName() + "/" + file.getName())
            .withPxUpdate(CrawlerUtil.transformDateTimeToISODateTimeLexicalRepresentation(linkStat4you.getPxLastUpdate())).build();

            Document document = findFile(linkStat4you.getId());

            if (document != null) {
                String[] paths = document.get(FileRepositoryContent.LUCENE_MODEL_PATH).split("/");
                if (paths.length == 2) { 
                    // First remove all old associated files
                    File oldDirectory = new File(this.crawlerInfo.retrieveRepositoryPath(), paths[0]);
    
                    // remove File
                    (new File(oldDirectory, paths[1])).delete();
    
                    // removeInfo file
                    (new File(oldDirectory, paths[1] + ".info")).delete();
    
                    // remove Imported File
                    (new File(oldDirectory, paths[1] + ".imported")).delete();
    
                    // remove Failed File
                    (new File(oldDirectory, paths[1] + ".failed")).delete();
                    
                    // remove empty directory
                    if (oldDirectory.list().length == 0) {
                        oldDirectory.delete();
                    }
                }
                else {
                    // Corrupted Index
                    // TODO improve corrupted index, recreate method.
                }
                updateDoc(linkStat4you, file, document);
            } else {
                // Add index entry
                addToIndex(fileRepo);
            }
        } catch (IOException e) {
            throw new ApplicationException(CrawlerExceptionCodeEnum.LUCENE.getName(), "Updating file repository index failed.", e);
        }
    }
    
    public DateTime retrieveLastUpdateForDocument(LinkStat4you linkStat4you) throws ApplicationException {
        
        try {
            Document document = findFile(linkStat4you.getId());
            
            if (document == null) {
                return null;
            }
            
            String pxLastUpdate = document.get(FileRepositoryContent.LUCENE_MODEL_PX_UPDATE);
            
            return CrawlerUtil.transformISODateTimeLexicalRepresentationToDateTime(pxLastUpdate);
        } catch (IOException e) {
            throw new ApplicationException(CrawlerExceptionCodeEnum.LUCENE.getName(), "Searching for pxlastupdate field failed.", e);
        }
    }

    /**************************************************************************
     * PRIVATE
     **************************************************************************/

    private Directory getIndexDirectory() throws IOException {
        File indexPath = new File(this.crawlerInfo.retrieveRepositoryPath(), "index");
        if (!indexPath.exists()) {
            FileUtils.forceMkdir(indexPath);
        }
        return new NIOFSDirectory(indexPath);
    }

    private IndexReader openReader() throws IOException {
        if (this.reader == null) {
            // If exist the index
            Directory index = getIndexDirectory();
            if (IndexReader.indexExists(index)) {
                this.reader = IndexReader.open(index);
            }
        }

        return this.reader;
    }

    private IndexWriter openWriter() throws IOException {
        if (this.writer == null) {

            StandardAnalyzer analyzer = new StandardAnalyzer(Version.LUCENE_36);
            IndexWriterConfig config = new IndexWriterConfig(Version.LUCENE_36, analyzer);

            // If exist the index
            Directory index = getIndexDirectory();
            this.writer = new IndexWriter(index, config);

        }

        return this.writer;
    }

    private void addToIndex(FileRepositoryContent file) throws IOException {
        IndexWriter w = openWriter();

        Document doc = new Document();
        doc.add(new Field(FileRepositoryContent.LUCENE_MOEL_ID, file.getId(), Field.Store.YES, Field.Index.NOT_ANALYZED)); // ID
        doc.add(new Field(FileRepositoryContent.LUCENE_MODEL_PATH, file.getPath(), Field.Store.YES, Field.Index.NOT_ANALYZED)); // PATH
        doc.add(new Field(FileRepositoryContent.LUCENE_MODEL_PX_UPDATE, file.getPxUpdate(), Field.Store.YES, Field.Index.NOT_ANALYZED)); // PX_UPDATE
        w.addDocument(doc);

        w.commit();
    }

    private void updateDoc(LinkStat4you linkStat4you, File file, Document document) throws IOException {
        // Update Lucene Doc
        String currentValue = document.get(FileRepositoryContent.LUCENE_MODEL_PATH);
        if (currentValue != null) {
            document.removeFields(FileRepositoryContent.LUCENE_MODEL_PATH);
            document.add(new Field(FileRepositoryContent.LUCENE_MODEL_PATH, file.getPath(), Field.Store.YES, Field.Index.NOT_ANALYZED));
        }

        IndexWriter w = openWriter();
        // Term query (Not analysis is needed)
        Term term = new Term(FileRepositoryContent.LUCENE_MOEL_ID, linkStat4you.getId());
        
        try {
            w.updateDocument(term, document);
        } catch (OutOfMemoryError e) {
            if (this.writer != null) {
                this.writer.close();
            }
        }
        w.commit();
    }

    private Document findFile(String id) throws IOException {
        Document result = null;

        // Term query (Not analysis is needed)
        Term term = new Term(FileRepositoryContent.LUCENE_MOEL_ID, id);
        Query q = new TermQuery(term);

        int hitsPerPage = 1;
        IndexReader indexReader = openReader();
        if (indexReader != null) {
            IndexSearcher searcher = new IndexSearcher(indexReader);
            TopScoreDocCollector collector = TopScoreDocCollector.create(hitsPerPage, true);
            searcher.search(q, collector);
            ScoreDoc[] hits = collector.topDocs().scoreDocs;

            if (hits.length == 1) {
                result = searcher.doc(hits[0].doc);
            }
        }
        return result;
    }
}
