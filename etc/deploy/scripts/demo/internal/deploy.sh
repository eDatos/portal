#!/bin/bash

HOME_PATH=metamac-portal-internal
TRANSFER_PATH=$HOME_PATH/tmp
SCRIPTS_PATH=$HOME_PATH/scripts
ENV_CONF=$HOME_PATH/env
DEPLOY_TARGET_PATH=/servers/edatos-internal/tomcats/edatos-internal01/webapps

RESTART=1

if [ "$1" == "--no-restart" ]; then
    RESTART=0
fi

scp -o ProxyCommand="ssh -W %h:%p deploy@estadisticas.arte-consultores.com" -r etc/deploy/config/demo/internal/* deploy@estadisticas.arte.internal:$ENV_CONF
scp -o ProxyCommand="ssh -W %h:%p deploy@estadisticas.arte-consultores.com" -r etc/deploy/utils/utilities.sh deploy@estadisticas.arte.internal:$SCRIPTS_PATH
scp -o ProxyCommand="ssh -W %h:%p deploy@estadisticas.arte-consultores.com" metamac-portal-web/target/statistical-visualizer-*.war deploy@estadisticas.arte.internal:$TRANSFER_PATH/statistical-visualizer-internal.war
ssh -o ProxyCommand="ssh -W %h:%p deploy@estadisticas.arte-consultores.com" deploy@estadisticas.arte.internal <<EOF

    chmod a+x $SCRIPTS_PATH/utilities.sh;
    . $SCRIPTS_PATH/utilities.sh
        
    ###
    # METAMAC-PORTAL - Internal
    ###
        
    if [ $RESTART -eq 1 ]; then
        sudo service edatos-internal01 stop
        checkPROC "edatos-internal"
    fi
    
    # Update Process
    sudo rm -rf $DEPLOY_TARGET_PATH/statistical-visualizer-internal
    sudo mv $TRANSFER_PATH/statistical-visualizer-internal.war $DEPLOY_TARGET_PATH/statistical-visualizer-internal.war
    sudo unzip $DEPLOY_TARGET_PATH/statistical-visualizer-internal.war -d $DEPLOY_TARGET_PATH/statistical-visualizer-internal
    sudo rm -rf $DEPLOY_TARGET_PATH/statistical-visualizer-internal.war
    
    # Restore Configuration
    sudo mv $ENV_CONF/* $DEPLOY_TARGET_PATH/statistical-visualizer-internal
    
    ###
    # METAMAC-PORTAL-API - Internal
    ###
    # Internal visualizer won´t have enabled the internal api

	sudo chown -R edatos-internal:edatos-internal /servers/edatos-internal

    if [ $RESTART -eq 1 ]; then
        sudo chown -R edatos-internal.edatos-internal /servers/edatos-internal
        sudo service edatos-internal01 start
    fi

	sudo rm -rf $SCRIPTS_PATH/*

    echo "Finished deploy"

EOF