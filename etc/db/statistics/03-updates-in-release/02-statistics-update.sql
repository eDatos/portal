UPDATE TBL_PROVIDERS SET ACRONYM='EC', NAME='European Comission', LOGO='ec.png', CITATION='Source: European Comission website', URL='http://ec.europa.eu/index_es.htm' WHERE ACRONYM='DSW';

SET @DESCRIPTION_FK = (SELECT DESCRIPTION_FK FROM TBL_PROVIDERS WHERE ACRONYM='EC');

INSERT INTO TBL_LOCALISED_STRINGS(LABEL, LOCALE, INTERNATIONAL_STRING_FK)
VALUES ('La Comisión Europea es el órgano ejecutivo de la UE y representa los intereses del conjunto de Europa (no los de país alguno en concreto). El término "Comisión" designa tanto al Colegio de Comisarios como a la propia institución, que tiene su sede en Bruselas (Bélgica) y oficinas en Luxemburgo. La Comisión cuenta además con representaciones en todos los países miembros.', 'es', @DESCRIPTION_FK);

UPDATE TBL_LOCALISED_STRINGS
SET LABEL="The European Commission is the EU's executive body and represents the interests of Europe as a whole (as opposed to the interests of individual countries). The term 'Commission' refers to both the college of commissioners and the institution itself – which has its headquarters in Brussels, Belgium with offices in Luxembourg. The Commission also has offices known as 'representations' in all EU member countries."
WHERE LOCALE="en" AND INTERNATIONAL_STRING_FK = @DESCRIPTION_FK;