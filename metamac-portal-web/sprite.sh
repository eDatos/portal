sf src/main/webapp/WEB-INF/theme/images/icons --library chunkypng --output-style src/main/webapp/WEB-INF/theme/less/icons.less --selector ".icon-" --cssurl ../../images/ 
sf src/main/webapp/WEB-INF/theme/images/providers --library chunkypng --output-style src/main/webapp/WEB-INF/theme/less/sprite-providers.less --selector ".provider-logo-" --cssurl ../../images/ 
sf src/main/webapp/WEB-INF/theme/images/providers-min --library chunkypng --output-style src/main/webapp/WEB-INF/theme/less/sprite-providers-min.less --selector ".provider-logo-min-" --cssurl ../../images/ 
grunt less:dev