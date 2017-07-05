------------------------------------------------------------------------------------------
-- METAMAC-2621 Separar API del Portal y visualizador en dos aplicaciones web diferentes
------------------------------------------------------------------------------------------

UPDATE TB_DATA_CONFIGURATIONS SET CONF_VALUE = 'FILL_ME' WHERE CONF_KEY EQ 'metamac.portal.rest.external.base';
UPDATE TB_DATA_CONFIGURATIONS SET CONF_VALUE = 'FILL_ME' WHERE CONF_KEY EQ 'metamac.portal.web.external';
UPDATE TB_DATA_CONFIGURATIONS SET CONF_VALUE = 'FILL_ME' WHERE CONF_KEY EQ 'metamac.portal.web.internal';

insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE) values (GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,1,'metamac.portal.web.external.visualizer', 'http://FILL_ME');
UPDATE TB_SEQUENCES SET SEQUENCE_NEXT_VALUE = SEQUENCE_NEXT_VALUE + 1 WHERE SEQUENCE_NAME = 'DATA_CONFIGURATIONS';

insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE) values (GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,1,'metamac.portal.web.internal.visualizer', 'http://FILL_ME');
UPDATE TB_SEQUENCES SET SEQUENCE_NEXT_VALUE = SEQUENCE_NEXT_VALUE + 1 WHERE SEQUENCE_NAME = 'DATA_CONFIGURATIONS';

-- Valores de ejemplo/demos

-- UPDATE TB_DATA_CONFIGURATIONS SET CONF_VALUE = 'http://estadisticas.arte-consultores.com/statistical-visualizer-api' WHERE CONF_KEY EQ 'metamac.portal.rest.external.base';
-- UPDATE TB_DATA_CONFIGURATIONS SET CONF_VALUE = 'http://estadisticas.arte-consultores.com/statistical-visualizer' WHERE CONF_KEY EQ 'metamac.portal.web.external';
-- UPDATE TB_DATA_CONFIGURATIONS SET CONF_VALUE = 'http://estadisticas.arte-consultores.com/statistical-visualizer-internal' WHERE CONF_KEY EQ 'metamac.portal.web.internal';

-- insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE) values (GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,1,'metamac.portal.web.external.visualizer', 'http://estadisticas.arte-consultores.com/statistical-visualizer/visualizer');
-- UPDATE TB_SEQUENCES SET SEQUENCE_NEXT_VALUE = SEQUENCE_NEXT_VALUE + 1 WHERE SEQUENCE_NAME = 'DATA_CONFIGURATIONS';

-- insert into TB_DATA_CONFIGURATIONS (ID,VERSION,SYSTEM_PROPERTY,CONF_KEY,CONF_VALUE) values (GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'),1,1,'metamac.portal.web.internal.visualizer', 'http://estadisticas.arte-consultores.com/statistical-visualizer-internal/visualizer');
-- UPDATE TB_SEQUENCES SET SEQUENCE_NEXT_VALUE = SEQUENCE_NEXT_VALUE + 1 WHERE SEQUENCE_NAME = 'DATA_CONFIGURATIONS';

COMMIT;