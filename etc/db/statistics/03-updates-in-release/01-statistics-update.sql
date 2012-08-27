-- ************************
-- IDESCAT
-- ************************
INSERT INTO TBL_INTERNATIONAL_STRINGS () values ();
SET @INTERNATIONAL_STRING_ID = LAST_INSERT_ID();
INSERT INTO TBL_LOCALISED_STRINGS (LABEL, LOCALE, INTERNATIONAL_STRING_FK) values ("El Instituto de Estadística de Cataluña (Idescat) es el organismo público de Cataluña encargado de recoger, analizar y difundir la información estadística sobre todos los aspectos de la sociedad y la economía vasca.", "es", @INTERNATIONAL_STRING_ID);
INSERT INTO TBL_LOCALISED_STRINGS (LABEL, LOCALE, INTERNATIONAL_STRING_FK) values ("The Catalonia Statistics Institute is the public body of Catalonia that collects, analyses and publishes statistical information about every aspect of Basque society and economy.", "en", @INTERNATIONAL_STRING_ID);
-- INSERT INTO TBL_LOCALISED_STRINGS (LABEL, LOCALE, INTERNATIONAL_STRING_FK) values ("Euskal Estatistika Erakundera (EUSTAT). Euskal Autonomia Erkidegoko erakunde publiko bat da, eta gure erkidegoko gizartearen eta ekonomiaren alderdi guztiei buruzko estatistika-informazioa biltzeaz, aztertzeaz eta zabaltzeaz arduratzen da.", "eu", @INTERNATIONAL_STRING_ID);

      
INSERT INTO TBL_PROVIDERS (ACRONYM, NAME, URL, CITATION, LICENSE_URL, LANGUAGE, LOGO, UUID, VERSION, CREATED_DATE_TZ, CREATED_DATE, CREATED_BY, DESCRIPTION_FK)
VALUES ('IDESCAT', 'Instituto de Estadística de Cataluña', 'http://www.idescat.cat/', 'Fuente: Api REST de IDESCAT: www.idescat.cat/api', null, 'en', null, '1cc200a1-a967-4a53-80ce-19a4908cdada', 1, 'Europe/London', now(), 'Stat4you', @INTERNATIONAL_STRING_ID);
