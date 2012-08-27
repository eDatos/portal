Categorías
----------


INE
---

En el INE el formato es de dos dígitos de acuerdo al campo subject del enumerado IneSubjectEnum. Estos dos dígitos se pueden extraer de la url de las páginas anteriores a la pasada
en el forceMode. Es la primera parte del parámetro path sin la "t". Por ejemplo:

URL de entrada en el Force Mode (lista de tablas) ej: http://www.ine.es/jaxiBD/menu.do?L=0&divi=IPR&his=2&type=db
URL anterior a la página de listas de tablas --> http://www.ine.es/jaxi/menu.do?type=pcaxis&path=/t05/p051/ipri_mx&file=inebase&L=0
     La categoría a pasar sería "05", (t05) que significa "Minería e industria, captación y distribución de agua, recuperación" en el INE


ISTAC
-----

Lo que se le pasa es el path de la URL que va a continuación de /temas_estadisticos/, el resto de paths se ignora. Por ejemplo:

URL de entrada en el Force Mode (lista de tablas) ej: http://www2.gobiernodecanarias.org/istac/jaxi-web/menu.do?path=/03022/E30416A/P0001&file=pcaxis&type=pcaxis
URL anterior a la página de listas de tablas --> http://www.gobiernodecanarias.org/istac/temas_estadisticos/sociedad/salud/atencionap/
    La categoría a pasar sería "sociedad", que significa "Sociedad" en el ISTAC.



IBESTAT
-------

La categoría se coge de las migas de pan, luego no es necesario pasarla.


EUSTAT
-----

Lo que se le pasa es el primer nivel de la la lista UL de jerarquisación que se muestra en la página del Banco de Datos.

URL de entrada en el Force Mode (lista de tablas) ej: http://www.eustat.es/bancopx/spanish/id_2385/indiceRR.html#axzz1x66J8oVS
URL anterior a la página de listas de tablas --> http://www.eustat.es/bancopx/spanish/tipo_N/indice.html
    La categoría a pasar sería "Territorio y medio ambiente".
