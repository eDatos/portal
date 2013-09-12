-- ###########################################
-- # Create
-- ###########################################
-- Create pk sequence
    


-- Create normal entities
    
CREATE TABLE TB_PERMALINKS (
  ID NUMBER(19) NOT NULL,
  CODE VARCHAR2(255 CHAR) NOT NULL,
  CONTENT CLOB NOT NULL,
  UUID VARCHAR2(36 CHAR) NOT NULL,
  CREATED_DATE_TZ VARCHAR2(50 CHAR),
  CREATED_DATE TIMESTAMP,
  CREATED_BY VARCHAR2(50 CHAR),
  LAST_UPDATED_TZ VARCHAR2(50 CHAR),
  LAST_UPDATED TIMESTAMP,
  LAST_UPDATED_BY VARCHAR2(50 CHAR),
  VERSION NUMBER(19) NOT NULL
);



-- Create many to many relations
    

-- Primary keys
    
ALTER TABLE TB_PERMALINKS ADD CONSTRAINT PK_TB_PERMALINKS
	PRIMARY KEY (ID)
;

    

-- Unique constraints
     

ALTER TABLE TB_PERMALINKS
    ADD CONSTRAINT UQ_TB_PERMALINKS UNIQUE (UUID)
;



-- Foreign key constraints
    

  
  

    

-- Index


