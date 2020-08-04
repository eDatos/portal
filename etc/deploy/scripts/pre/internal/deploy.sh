#!/bin/bash

HOME_PATH=metamac-portal
TRANSFER_PATH=$HOME_PATH/tmp
SCRIPTS_PATH=$HOME_PATH/scripts
ENV_CONF=$HOME_PATH/env
DEPLOY_TARGET_PATH=/servers/arveja/tomcats/arveja01/webapps

RESTART=1

if [ "$1" == "--no-restart" ]; then
    RESTART=0
fi

scp -o "StrictHostKeyChecking=no" -r etc/deploy/config/pre/internal/* deploy@mgcarta.gobiernodecanarias.net:$ENV_CONF
scp -o "StrictHostKeyChecking=no" -r etc/deploy/utils/utilities.sh deploy@mgcarta.gobiernodecanarias.net:$SCRIPTS_PATH
scp -o "StrictHostKeyChecking=no" metamac-portal-web/target/statistical-visualizer-*.war deploy@mgcarta.gobiernodecanarias.net:$TRANSFER_PATH/statistical-visualizer-internal.war
ssh -o "StrictHostKeyChecking=no" deploy@mgcarta.gobiernodecanarias.net <<EOF

    chmod a+x $SCRIPTS_PATH/utilities.sh;
    . $SCRIPTS_PATH/utilities.sh
        
    ###
    # METAMAC-PORTAL - Internal
    ###
        
    if [ $RESTART -eq 1 ]; then
        sudo service arveja01 stop
        checkPROC "arveja"
    fi
    
    # Update Process
    sudo rm -rf $DEPLOY_TARGET_PATH/aplicaciones#statistical-visualizer-internal-istac
    sudo mv $TRANSFER_PATH/statistical-visualizer-internal.war $DEPLOY_TARGET_PATH/statistical-visualizer-internal.war
    sudo unzip $DEPLOY_TARGET_PATH/statistical-visualizer-internal.war -d $DEPLOY_TARGET_PATH/aplicaciones#statistical-visualizer-internal-istac
    sudo rm -rf $DEPLOY_TARGET_PATH/statistical-visualizer-internal.war
    
    # Restore Configuration
    sudo cp -rf $ENV_CONF/* $DEPLOY_TARGET_PATH/aplicaciones#statistical-visualizer-internal-istac
    
    ###
    # METAMAC-PORTAL-API - Internal
    ###
    # Internal visualizer won´t have enabled the internal api

	sudo chown -R arveja:arveja /servers/arveja

    if [ $RESTART -eq 1 ]; then
        sudo chown -R arveja.arveja /servers/arveja
        sudo service arveja01 start
    fi

	sudo rm -rf $SCRIPTS_PATH/*
	sudo rm -rf $ENV_CONF/*

    echo "Finished deploy"

EOF