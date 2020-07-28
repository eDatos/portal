#!/bin/bash

HOME_PATH=metamac-portal
TRANSFER_PATH=$HOME_PATH/tmp
SCRIPTS_PATH=$HOME_PATH/scripts
ENV_CONF=$HOME_PATH/env
DEPLOY_TARGET_PATH=/servers/edatos-external/tomcats/edatos-external01/webapps

RESTART=1

if [ "$1" == "--no-restart" ]; then
    RESTART=0
fi

scp -o ProxyCommand="ssh -W %h:%p deploy@estadisticas.arte-consultores.com" -r etc/deploy/config/demo/external/* deploy@estadisticas.arte.internal:$ENV_CONF
scp -o ProxyCommand="ssh -W %h:%p deploy@estadisticas.arte-consultores.com" -r etc/deploy/utils/utilities.sh deploy@estadisticas.arte.internal:$SCRIPTS_PATH
scp -o ProxyCommand="ssh -W %h:%p deploy@estadisticas.arte-consultores.com" metamac-portal-web/target/statistical-visualizer-*.war deploy@estadisticas.arte.internal:$TRANSFER_PATH/statistical-visualizer.war
scp -o ProxyCommand="ssh -W %h:%p deploy@estadisticas.arte-consultores.com" metamac-portal-api-web/target/statistical-visualizer-api-*.war deploy@estadisticas.arte.internal:$TRANSFER_PATH/statistical-visualizer-api.war
ssh -o ProxyCommand="ssh -W %h:%p deploy@estadisticas.arte-consultores.com" deploy@estadisticas.arte.internal <<EOF

    chmod a+x $SCRIPTS_PATH/utilities.sh;
    . $SCRIPTS_PATH/utilities.sh
    
    ###
    # METAMAC-PORTAL - External
    ###

    if [ $RESTART -eq 1 ]; then
        sudo service edatos-external01 stop
        checkPROC "edatos-external"
    fi

    # Update Process
    sudo rm -rf $DEPLOY_TARGET_PATH/statistical-visualizer
    sudo mv $TRANSFER_PATH/statistical-visualizer.war $DEPLOY_TARGET_PATH/statistical-visualizer.war
    sudo unzip $DEPLOY_TARGET_PATH/statistical-visualizer.war -d $DEPLOY_TARGET_PATH/statistical-visualizer
    sudo rm -rf $DEPLOY_TARGET_PATH/statistical-visualizer.war
    
    # Restore Configuration
    sudo mv $ENV_CONF/web/* $DEPLOY_TARGET_PATH/statistical-visualizer

    ###
    # METAMAC-PORTAL-API - External
    ###

    # Update Process
    sudo rm -rf $DEPLOY_TARGET_PATH/statistical-visualizer-api
    sudo mv $TRANSFER_PATH/statistical-visualizer-api.war $DEPLOY_TARGET_PATH/statistical-visualizer-api.war
    sudo unzip $DEPLOY_TARGET_PATH/statistical-visualizer-api.war -d $DEPLOY_TARGET_PATH/statistical-visualizer-api
    sudo rm -rf $DEPLOY_TARGET_PATH/statistical-visualizer-api.war

    # Restore Configuration
    sudo mv $ENV_CONF/api/* $DEPLOY_TARGET_PATH/statistical-visualizer-api
    
    if [ $RESTART -eq 1 ]; then
        sudo chown -R edatos-external.edatos-external /servers/edatos-external
        sudo service edatos-external01 start
    fi

EOF