ALTER TABLE TBL_PROVIDERS ADD UNIQUE ACRONYM(ACRONYM);
ALTER TABLE TBL_DATASETS ADD UNIQUE DATASET_IDENTIFIER(IDENTIFIER, PROVIDER_FK);
ALTER TABLE TBL_DIMENSIONS ADD UNIQUE UNIQUE_DIMENSIONS(IDENTIFIER, DATASET_VERSION_FK);
ALTER TABLE TBL_ATTRIBUTES_DEFINITIONS ADD UNIQUE ATTRIBUTE_IDENTIFIER(IDENTIFIER, DATASET_VERSION_FK);
ALTER TABLE TBL_LOCALISED_STRINGS ADD UNIQUE LOCALE_UNIQUE(LOCALE, INTERNATIONAL_STRING_FK);