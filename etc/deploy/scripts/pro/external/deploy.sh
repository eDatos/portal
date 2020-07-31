#!/bin/bash

HOME_PATH=metamac-portal
TRANSFER_PATH=$HOME_PATH/tmp
SCRIPTS_PATH=$HOME_PATH/scripts
ENV_CONF=$HOME_PATH/env
DEPLOY_TARGET_PATH=/servers/bubango/tomcats/bubango01/webapps

RESTART=1

if [ "$1" == "--no-restart" ]; then
    RESTART=0
fi

scp -o "StrictHostKeyChecking=no" -r etc/deploy/config/pro/external/* deploy@mgcrinaco.gobiernodecanarias.net:$ENV_CONF
scp -o "StrictHostKeyChecking=no" -r etc/deploy/utils/utilities.sh deploy@mgcrinaco.gobiernodecanarias.net:$SCRIPTS_PATH
scp -o "StrictHostKeyChecking=no" metamac-portal-web/target/statistical-visualizer-*.war deploy@mgcrinaco.gobiernodecanarias.net:$TRANSFER_PATH/statistical-visualizer.war
scp -o "StrictHostKeyChecking=no" metamac-portal-api-web/target/statistical-visualizer-api-*.war deploy@mgcrinaco.gobiernodecanarias.net:$TRANSFER_PATH/statistical-visualizer-api.war
ssh -o "StrictHostKeyChecking=no" deploy@mgcrinaco.gobiernodecanarias.net <<EOF

    chmod a+x $SCRIPTS_PATH/utilities.sh;
    . $SCRIPTS_PATH/utilities.sh
    
    ###
    # METAMAC-PORTAL - External
    ###

    if [ $RESTART -eq 1 ]; then
        sudo service bubango01 stop
        checkPROC "bubango"
    fi

    # Update Process
    sudo rm -rf $DEPLOY_TARGET_PATH/istac#api#statistical-visualizer
    sudo mv $TRANSFER_PATH/statistical-visualizer.war $DEPLOY_TARGET_PATH/statistical-visualizer.war
    sudo unzip $DEPLOY_TARGET_PATH/statistical-visualizer.war -d $DEPLOY_TARGET_PATH/istac#api#statistical-visualizer
    sudo rm -rf $DEPLOY_TARGET_PATH/statistical-visualizer.war
    
    # Restore Configuration
    sudo cp -rf $ENV_CONF/web/* $DEPLOY_TARGET_PATH/istac#api#statistical-visualizer

    ###
    # METAMAC-PORTAL-API - External
    ###

    # Update Process
    sudo rm -rf $DEPLOY_TARGET_PATH/istac#statistical-visualizer
    sudo mv $TRANSFER_PATH/statistical-visualizer-api.war $DEPLOY_TARGET_PATH/statistical-visualizer-api.war
    sudo unzip $DEPLOY_TARGET_PATH/statistical-visualizer-api.war -d $DEPLOY_TARGET_PATH/istac#statistical-visualizer
    sudo rm -rf $DEPLOY_TARGET_PATH/statistical-visualizer-api.war

    # Restore Configuration
    sudo cp -rf $ENV_CONF/api/* $DEPLOY_TARGET_PATH/istac#statistical-visualizer
    
    if [ $RESTART -eq 1 ]; then
        sudo chown -R bubango.bubango /servers/bubango
        sudo service bubango01 start
    fi
    
    sudo rm -rf $SCRIPTS_PATH/*
	sudo rm -rf $ENV_CONF/*

    echo "Finished deploy"
EOF