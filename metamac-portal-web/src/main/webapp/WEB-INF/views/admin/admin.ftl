[#ftl]
[#include "/inc/includes.ftl"]

[@template.base]

<div id="first-row-internal-page" class="row page-admin">
    <h1>Administración</h1>

    <h2>Crawler</h2>

    <div>
        <h3>Px: Importación remota</h3>
        <p>
            <a href="[@spring.url "/app/admin/crawler/remote/ine" /]" class="btn">Ejecutar crawler INE</a>
            <a href="[@spring.url "/app/admin/crawler/remote/istac" /]" class="btn">Ejecutar crawler ISTAC</a>
            <a href="[@spring.url "/app/admin/crawler/remote/eustat" /]" class="btn">Ejecutar crawler EUSTAT</a>
            <a href="[@spring.url "/app/admin/crawler/remote/ibestat" /]" class="btn">Ejecutar crawler IBESTAT</a>
            <a href="[@spring.url "/app/admin/job/remote/idescat" /]" class="btn">Ejecutar Job IDESCAT</a>
        </p>

		<h3>Px: Importación local</h3>
		<div>
		    <form class="form-inline" action="[@spring.url "/app/admin/crawler/local" /]" method="get">
		        <input type="text" class="input-large" name="path" placeholder="Ruta">
		        <button type="submit" class="btn">Importar</button>
		    </form>
		</div>
		
		<h3>Digital Agenda Europe: Importación local</h3>
		<div>
		    <form class="form-inline" action="[@spring.url "/app/admin/crawler/daelocal" /]" method="get">
		        <input type="text" class="input-large" name="path" placeholder="Ruta">
		        <button type="submit" class="btn">Importar</button>
		    </form>
		</div>
    </div>

    <h2>Solr</h2>
    <div>
        <a href="[@spring.url "/app/admin/solr" /]" class="btn">Reindexar solr</a>
    </div>

    <h2>Descartar dataset en borrador</h2>
    <div>
        <form class="form-inline" action="[@spring.url "/app/admin/discardDatasetDraft" /]" method="get">
            <input type="text" class="input-large" name="uri" placeholder="Uri">
            <button type="submit" class="btn">Descartar</button>
        </form>
    </div>

    <h2>Indexar dataset publicado</h2>
    <div>
        <form class="form-inline" action="[@spring.url "/app/admin/indexDatasetPublished" /]" method="get">
            <input type="text" class="input-large" name="uri" placeholder="Uri">
            <button type="submit" class="btn">Indexar</button>
        </form>
    </div>

</div>

[/@template.base]