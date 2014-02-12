# metamac-portal-web-client

## Desarrollo
Para el desarrollo del proyecto utilizar el fichero `src/main/preview.html`.

La aplicación no tiene página principal, por lo que hay que acceder directamente a un recurso. Alguno de los recursos disponibles son:

	src/main/preview.html#/collections/ISTAC/C00031A_000002/001.000	src/main/preview.html#/collections/ISTAC/C00031A_000001/001.000
	src/main/preview.html#datasets/ISTAC/C00031A_000002/001.000/selection
	src/main/preview.html#datasets/ISTAC/C00031A_000002/001.000/visualization/canvasTable
	src/main/preview.html#queries/ISTAC/ULTIMOS_DATOS_ALOJAMIENTO/selection
	
## API
La aplicación de conecta a diferentes apis para consumir los datos. Las peticiones que hay que realizar son

**Shapes**

[http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/variables/TERRITORIO/variableelements/~all/geoinfo?query=ID%20IN%20('GRAN_CANARIA',%20'TENERIFE')&_type=json]()

**Fecha de actualizacion shapes**

[http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/variables/TERRITORIO/variableelements/LA_GOMERA/geoinfo.json?fields=-geographicalGranularity,-geometry,-point]()

**Mundo**

[http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/variables/~all/variableelements?query=VARIABLE_TYPE%20EQ%20'GEOGRAPHICAL'%20AND
%20GEOGRAPHICAL_GRANULARITY_URN%20IS_NULL&limit=1]()

[http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/variables/TERRITORIO_MUNDO/variableelements/MUNDO/geoinfo.json]()


**Orden de granularidad geográfica**

*TODO: Falta consulta para averiguar el codelist con el orden de las granularidad geográficas*

[http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/codelists/ISTAC/CL_GEO_GRANULARITIES/01.001/codes?_type=json]()

	