-- ###########################################
-- # Create
-- ###########################################
-- Create pk sequence
    


-- Create normal entities
    
CREATE TABLE TB_PERMALINKS (
  ID BIGINT NOT NULL,
  CODE VARCHAR(255) NOT NULL,
  CONTENT TEXT NOT NULL,
  UUID VARCHAR(36) NOT NULL,
  CREATED_DATE_TZ VARCHAR(50),
  CREATED_DATE TIMESTAMP,
  CREATED_BY VARCHAR(50),
  LAST_UPDATED_TZ VARCHAR(50),
  LAST_UPDATED TIMESTAMP,
  LAST_UPDATED_BY VARCHAR(50),
  VERSION BIGINT NOT NULL
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


    