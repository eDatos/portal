-- **********
-- INE
-- **********

INSERT INTO TBL_INTERNATIONAL_STRINGS (ID) values (1);
INSERT INTO TBL_LOCALISED_STRINGS (LABEL, LOCALE, INTERNATIONAL_STRING_FK) values ("El Instituto Nacional de Estadística es un organismo autónomo de carácter administrativo, con personalidad jurídica y patrimonio propio, adscrito al Ministerio de Economía y Competitividad a través de la Secretaría de Estado de Economía y Apoyo a la Empresa. Se rige, básicamente, por la Ley 12/1989, de 9 de mayo, de la Función Estadística Pública, que regula la actividad estadística para fines estatales la cual es competencia exclusiva del Estado,y por el Estatuto aprobado por Real Decreto 508/2001 de 11 de mayo, y modificado por el Real Decreto 947/2003, de 18 de julio, por el Real Decreto 759/2005, de 24 de junio y por el Real Decreto 950/2009, de 5 de junio. La Ley asigna al Instituto Nacional de Estadística un papel destacado en la actividad estadística pública encomendándole expresamente la realización de las operaciones estadísticas de gran envergadura (censos demográficos y económicos, cuentas nacionales, estadísticas demográficas y sociales, indicadores económicos y sociales, coordinación y mantenimiento de los directorios de empresas, formación del Censo Electoral...).", "es", 1);
INSERT INTO TBL_LOCALISED_STRINGS (LABEL, LOCALE, INTERNATIONAL_STRING_FK) values ("The National Statistics Institute is a legally independent administrative Autonomous institution assigned to the Ministry of Economy and Competitivity via the Secretary of State for the Economy and Business Support. It is basically governed by Law 12/1989 of 9 May, on Public Statistics Function, that regulates Statistics activity for state purposes which is the exclusive competence of the State and by the Statute approved by Royal Decree 508/2001 of 11 May and modified by Royal Decree 947/2003 of 18 July, Royal Decree 759/2005, of 24 June and Royal Decree 950/2009, of 5 June. The Law assigns the National Statistics Institute an important role in public statistic activity, expressly placing it in charge of large scale statistical operations (demographic and economic censuses, national accounts, demographic and social statistics, economic and social indicators, coordination and maintenance of company directories Electoral Census training...).", "en", 1);

INSERT INTO TBL_PROVIDERS (ACRONYM, NAME, URL, CITATION, LICENSE_URL, LANGUAGE, LOGO, UUID, VERSION, CREATED_DATE_TZ, CREATED_DATE, CREATED_BY, DESCRIPTION_FK)
      values ('INE', 'Instituto Nacional de Estadística', 'http://www.ine.es', 'Fuente: Sitio web del INE', 'http://www.ine.es/avisolegal.htm', 'es', null, '1282f421-b01e-4e86-bcbd-039da9e82560', 1, 'Europe/London', now(), 'Stat4you', 1);

-- El logo del ine era: 'ine_r_w200_t2.png'      
      
-- DESCRIPTION - ES      
-- El Instituto Nacional de Estadística es un organismo autónomo de carácter administrativo, con personalidad jurídica y patrimonio propio, adscrito al Ministerio de Economía y Competitividad a través de la Secretaría de Estado de Economía y Apoyo a la Empresa. Se rige, básicamente, por la Ley 12/1989, de 9 de mayo, de la Función Estadística Pública, que regula la actividad estadística para fines estatales la cual es competencia exclusiva del Estado,y por el Estatuto aprobado por Real Decreto 508/2001 de 11 de mayo, y modificado por el Real Decreto 947/2003, de 18 de julio, por el Real Decreto 759/2005, de 24 de junio y por el Real Decreto 950/2009, de 5 de junio.
-- La Ley asigna al Instituto Nacional de Estadística un papel destacado en la actividad estadística pública encomendándole expresamente la realización de las operaciones estadísticas de gran envergadura (censos demográficos y económicos, cuentas nacionales, estadísticas demográficas y sociales, indicadores económicos y sociales, coordinación y mantenimiento de los directorios de empresas, formación del Censo Electoral...)

-- DESCRIPTION - EN 
-- The National Statistics Institute is a legally independent administrative Autonomous institution assigned to the Ministry of Economy and Competitivity via the Secretary of State for the Economy and Business Support. It is basically governed by Law 12/1989 of 9 May, on Public Statistics Function, that regulates Statistics activity for state purposes which is the exclusive competence of the State and by the Statute approved by Royal Decree 508/2001 of 11 May and modified by Royal Decree 947/2003 of 18 July, Royal Decree 759/2005, of 24 June and Royal Decree 950/2009, of 5 June.
-- The Law assigns the National Statistics Institute an important role in public statistic activity, expressly placing it in charge of large scale statistical operations (demographic and economic censuses, national accounts, demographic and social statistics, economic and social indicators, coordination and maintenance of company directories Electoral Census training...)

                
-- **********
-- ISTAC
-- **********

INSERT INTO TBL_INTERNATIONAL_STRINGS (ID) values (2);
INSERT INTO TBL_LOCALISED_STRINGS (LABEL, LOCALE, INTERNATIONAL_STRING_FK) values ("El Instituto Canario de Estadística (ISTAC), es el órgano central del sistema estadístico autonómico y centro oficial de investigación del Gobierno de Canarias, creado y regulado por la Ley 1/1991, de 28 de enero, de Estadística de la Comunidad Autónoma de Canarias (CAC), y que entre otras, le asigna las siguientes funciones: (1) Proveer información estadística: El ISTAC tiene entre sus objetivos proveer, con independencia técnica y profesional, información estadística de interés de la CAC atendiendo a la fragmentación del territorio y a sus singularidades y cumpliendo con los principios establecidos en el Código de Buenas Prácticas de la Estadísticas Europeas. (2) Coordinar la actividad estadística pública: El ISTAC es el organismo responsable de la promoción, gestión y coordinación de la actividad estadística pública de la CAC, asumiendo el ejercicio de la competencia estatutaria prevista en el artículo 30, apartado 23, del Estatuto de Autonomía de Canarias.", "es", 2);
      
INSERT INTO TBL_PROVIDERS (ACRONYM, NAME, URL, CITATION, LICENSE_URL, LANGUAGE, LOGO, UUID, VERSION, CREATED_DATE_TZ, CREATED_DATE, CREATED_BY, DESCRIPTION_FK)
      values ('ISTAC', 'Instituto Canario de Estadística', 'http://www.gobiernodecanarias.org/istac', 'Fuente: Sitio web del ISTAC', 'http://www.gobiernodecanarias.org/es/avisolegal.html', 'es', 'istac_r_w200_t2.png', 'da17545b-8274-47a2-93ed-4546f68c2a1f', 1, 'Europe/London', now(), 'Stat4you', 2);
      
-- DESCRIPTION - ES
-- El Instituto Canario de Estadística (ISTAC), es el órgano central del sistema estadístico autonómico y centro oficial de investigación del Gobierno de Canarias, creado y regulado por la Ley 1/1991, de 28 de enero, de Estadística de la Comunidad Autónoma de Canarias (CAC), y que entre otras, le asigna las siguientes funciones:
-- 1) Proveer información estadística: El ISTAC tiene entre sus objetivos proveer, con independencia técnica y profesional, información estadística de interés de la CAC atendiendo a la fragmentación del territorio y a sus singularidades y cumpliendo con los principios establecidos en el Código de Buenas Prácticas de la Estadísticas Europeas.
-- 2) Coordinar la actividad estadística pública: El ISTAC es el organismo responsable de la promoción, gestión y coordinación de la actividad estadística pública de la CAC, asumiendo el ejercicio de la competencia estatutaria prevista en el artículo 30, apartado 23, del Estatuto de Autonomía de Canarias.      
      
      
-- **********    
-- IBESTAT 
-- **********
INSERT INTO TBL_INTERNATIONAL_STRINGS (ID) values (5);
INSERT INTO TBL_LOCALISED_STRINGS (LABEL, LOCALE, INTERNATIONAL_STRING_FK) values ("El Instituto de Estadística de las Illes Balears (IBESTAT) es una entidad autónoma adscrita a la Vicepresidencia Económica, de Promoción Empresarial y de Empleo. El IBESTAT fue creado por la Ley 3/2002, de 17 de mayo, de Estadística de las Islas Baleares, en tanto que su funcionamiento y organización están regulados por el Decreto 128/2007, de 5 de octubre. Entre sus funciones cabe destacar las de promover, dirigir y coordinar la actividad estadística pública de interés de la comunidad autónoma. En este sentido, lleva a cabo las operaciones de carácter demográfico, económico o social que le asignan los planes y programas estadísticos oficiales, cuyos datos son objeto de difusión a través de la web www.ibestat.com. El IBESTAT también asume una importante labor de coordinación de las estadísticas que llevan a cabo las consejerías del Gobierno de las Islas Baleares, así como los consejos insulares. Entre los objetivos del IBESTAT se encuentran los de aportar datos con el mayor nivel de desagregación sectorial y territorial (islas y municipios) disponibles, así como garantizar la calidad de la información ofrecida a través del rigor metodológico de sus profesionales.", "es", 5);
INSERT INTO TBL_LOCALISED_STRINGS (LABEL, LOCALE, INTERNATIONAL_STRING_FK) values ("L’Institut d’Estadística de les Illes Balears (IBESTAT) és una entitat autònoma adscrita a la Vicepresidència Econòmica, de Promoció Empresarial i d’Ocupació. L’IBESTAT fou creat per la Llei 3/2002, de 17 de maig, d’estadística de les Illes Balears, mentre que en regula el seu funcionament i organització el Decret 128/2007, de 5 d’octubre. Entre les seves funcions es troben les de promoure, dirigir i coordinar l’activitat estadística pública d’interès de la comunitat autònoma. En aquest sentit, du a terme les operacions de caire demogràfic, econòmic o social que li encarreguen els plans i programes estadístics oficials, les quals són objecte de difusió a través del web www.ibestat.com. L’IBESTAT també assumeix una important tasca de coordinació de les estadístiques que duen a terme les conselleries del Govern de les Illes Balears, així com dels consells insulars. Els objectius de l’IBESTAT són els de poder oferir unes dades estadístiques amb el major nivell de desagregació sectorial i territorial (dades per illes o municipis) disponibles, així com garantir la qualitat de la informació oferta a través del rigor metodològic dels seus professionals.", "ca", 5);
INSERT INTO TBL_PROVIDERS (ACRONYM, NAME, URL, CITATION, LICENSE_URL, LANGUAGE, LOGO, UUID, VERSION, CREATED_DATE_TZ, CREATED_DATE, CREATED_BY, DESCRIPTION_FK)
      values ('IBESTAT', 'Institut d''Estadística de les Illes Balears', 'http://www.ibestat.es', 'Fuente: Sitio web del IBESTAT', 'http://www.ibestat.es/ibestat/page?f=default&p=aviso_legal', 'ca', 'ibestat_r_w200_t2.png', '3da4c0e5-54a6-4433-999c-e5e47f2d248c', 1, 'Europe/London', now(), 'Stat4you', 5);

-- DESCRIPTION - ES
-- El Instituto de Estadística de las Illes Balears (IBESTAT) es una entidad autónoma adscrita a la Vicepresidencia Económica, de Promoción Empresarial y de Empleo. El IBESTAT fue creado por la Ley 3/2002, de 17 de mayo, de Estadística de las Islas Baleares, en tanto que su funcionamiento y organización están regulados por el Decreto 128/2007, de 5 de octubre. Entre sus funciones cabe destacar las de promover, dirigir y coordinar la actividad estadística pública de interés de la comunidad autónoma. En este sentido, lleva a cabo las operaciones de carácter demográfico, económico o social que le asignan los planes y programas estadísticos oficiales, cuyos datos son objeto de difusión a través de la web www.ibestat.com. El IBESTAT también asume una importante labor de coordinación de las estadísticas que llevan a cabo las consejerías del Gobierno de las Islas Baleares, así como los consejos insulares. Entre los objetivos del IBESTAT se encuentran los de aportar datos con el mayor nivel de desagregación sectorial y territorial (islas y municipios) disponibles, así como garantizar la calidad de la información ofrecida a través del rigor metodológico de sus profesionales.

-- DESCRIPTION - CA
-- L’Institut d’Estadística de les Illes Balears (IBESTAT) és una entitat autònoma adscrita a la Vicepresidència Econòmica, de Promoció Empresarial i d’Ocupació. L’IBESTAT fou creat per la Llei 3/2002, de 17 de maig, d’estadística de les Illes Balears, mentre que en regula el seu funcionament i organització el Decret 128/2007, de 5 d’octubre. Entre les seves funcions es troben les de promoure, dirigir i coordinar l’activitat estadística pública d’interès de la comunitat autònoma. En aquest sentit, du a terme les operacions de caire demogràfic, econòmic o social que li encarreguen els plans i programes estadístics oficials, les quals són objecte de difusió a través del web www.ibestat.com. L’IBESTAT també assumeix una important tasca de coordinació de les estadístiques que duen a terme les conselleries del Govern de les Illes Balears, així com dels consells insulars. Els objectius de l’IBESTAT són els de poder oferir unes dades estadístiques amb el major nivell de desagregació sectorial i territorial (dades per illes o municipis) disponibles, així com garantir la qualitat de la informació oferta a través del rigor metodològic dels seus professionals.      

-- **********
-- EUSTAT
-- **********
INSERT INTO TBL_INTERNATIONAL_STRINGS (ID) values (3);
INSERT INTO TBL_LOCALISED_STRINGS (LABEL, LOCALE, INTERNATIONAL_STRING_FK) values ("El Instituto Vasco de Estadística (EUSTAT) es el organismo público del País Vasco encargado de recoger, analizar y difundir la información estadística sobre todos los aspectos de la sociedad y la economía vasca.", "es", 3);
INSERT INTO TBL_LOCALISED_STRINGS (LABEL, LOCALE, INTERNATIONAL_STRING_FK) values ("The Basque Statistics Institute is the public body of the Basque Country that collects, analyses and publishes statistical information about every aspect of Basque society and economy.", "en", 3);
INSERT INTO TBL_LOCALISED_STRINGS (LABEL, LOCALE, INTERNATIONAL_STRING_FK) values ("Euskal Estatistika Erakundera (EUSTAT). Euskal Autonomia Erkidegoko erakunde publiko bat da, eta gure erkidegoko gizartearen eta ekonomiaren alderdi guztiei buruzko estatistika-informazioa biltzeaz, aztertzeaz eta zabaltzeaz arduratzen da.", "eu", 3);
      
INSERT INTO TBL_PROVIDERS (ACRONYM, NAME, URL, CITATION, LICENSE_URL, LANGUAGE, LOGO, UUID, VERSION, CREATED_DATE_TZ, CREATED_DATE, CREATED_BY, DESCRIPTION_FK)
      values ('EUSTAT', 'Instituto Vasco de Estadística', 'http://www.eustat.es', 'Fuente: Sitio web de Eustat: www.eustat.es', 'http://www.eustat.es/informacionLegal_c.html#axzz1vn5iokXZ', 'es', 'eustat_r_w200_t2.png', '128fe08c-1249-46db-83c5-de183d8a9571', 1, 'Europe/London', now(), 'Stat4you', 3);

-- DESCRIPTION - ES    
-- El Instituto Vasco de Estadística (EUSTAT) es el organismo público del País Vasco encargado de recoger, analizar y difundir la información estadística sobre todos los aspectos de la sociedad y la economía vasca.

-- DESCRIPTION - EN
-- The Basque Statistics Institute is the public body of the Basque Country that collects, analyses and publishes statistical information about every aspect of Basque society and economy.
      
-- DESCRIPTION - EU
-- Euskal Estatistika Erakundera (EUSTAT). Euskal Autonomia Erkidegoko erakunde publiko bat da, eta gure erkidegoko gizartearen eta ekonomiaren alderdi guztiei buruzko estatistika-informazioa biltzeaz, aztertzeaz eta zabaltzeaz arduratzen da.

-- ************************
-- European Comission
-- ************************
INSERT INTO TBL_INTERNATIONAL_STRINGS (ID) values (4);
INSERT INTO TBL_LOCALISED_STRINGS (LABEL, LOCALE, INTERNATIONAL_STRING_FK) values ("La Comisión Europea es el órgano ejecutivo de la UE y representa los intereses del conjunto de Europa (no los de país alguno en concreto). El término "Comisión" designa tanto al Colegio de Comisarios como a la propia institución, que tiene su sede en Bruselas (Bélgica) y oficinas en Luxemburgo. La Comisión cuenta además con representaciones en todos los países miembros.", "es", 4);
INSERT INTO TBL_LOCALISED_STRINGS (LABEL, LOCALE, INTERNATIONAL_STRING_FK) values ("The European Commission is the EU's executive body and represents the interests of Europe as a whole (as opposed to the interests of individual countries). The term 'Commission' refers to both the college of commissioners and the institution itself – which has its headquarters in Brussels, Belgium with offices in Luxembourg. The Commission also has offices known as 'representations' in all EU member countries.", "en", 4);
      
INSERT INTO TBL_PROVIDERS (ACRONYM, NAME, URL, CITATION, LICENSE_URL, LANGUAGE, LOGO, UUID, VERSION, CREATED_DATE_TZ, CREATED_DATE, CREATED_BY, DESCRIPTION_FK)
      values ('EC', 'European Comission', 'http://ec.europa.eu/index_es.htm', 'Source: European Comission website', null, 'en', null, '3a5e3bfb-3392-4097-8bfa-3f104696cfee', 1, 'Europe/London', now(), 'Stat4you', 4);

-- DESCRIPTION - EN
-- The Digital Agenda for Europe is the European Union's roadmap for bringing the benefits of a digital society and economy to Europe's citizens. But it can only deliver if all stakeholders are involved in assessing problems and identifying solutions.
      
      
-- ************************
-- IDESCAT
-- ************************
INSERT INTO TBL_INTERNATIONAL_STRINGS (ID) values (5);
INSERT INTO TBL_LOCALISED_STRINGS (LABEL, LOCALE, INTERNATIONAL_STRING_FK) values ("El Instituto de Estadística de Cataluña (Idescat) es el organismo público de Cataluña encargado de recoger, analizar y difundir la información estadística sobre todos los aspectos de la sociedad y la economía vasca.", "es", 5);
INSERT INTO TBL_LOCALISED_STRINGS (LABEL, LOCALE, INTERNATIONAL_STRING_FK) values ("The Catalonia Statistics Institute is the public body of Catalonia that collects, analyses and publishes statistical information about every aspect of Basque society and economy.", "en", 5);
--INSERT INTO TBL_LOCALISED_STRINGS (LABEL, LOCALE, INTERNATIONAL_STRING_FK) values ("Euskal Estatistika Erakundera (EUSTAT). Euskal Autonomia Erkidegoko erakunde publiko bat da, eta gure erkidegoko gizartearen eta ekonomiaren alderdi guztiei buruzko estatistika-informazioa biltzeaz, aztertzeaz eta zabaltzeaz arduratzen da.", "eu", 5);

      
INSERT INTO TBL_PROVIDERS (ACRONYM, NAME, URL, CITATION, LICENSE_URL, LANGUAGE, LOGO, UUID, VERSION, CREATED_DATE_TZ, CREATED_DATE, CREATED_BY, DESCRIPTION_FK)
      values ('IDESCAT', 'Instituto de Estadística de Cataluña', 'http://www.idescat.cat/', 'Fuente: Api REST de IDESCAT: www.idescat.cat/api', null, 'en', null, '1cc200a1-a967-4a53-80ce-19a4908cdada', 1, 'Europe/London', now(), 'Stat4you', 5);
