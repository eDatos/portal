#!/bin/bash

HOME_PATH=metamac-portal
TRANSFER_PATH=$HOME_PATH/tmp

HOME_PATH_INTERNAL=metamac-portal-internal
TRANSFER_PATH_INTERNAL=$HOME_PATH_INTERNAL/tmp

DEPLOY_TARGET_PATH=/servers/metamac/tomcats/metamac01/webapps
ENVIRONMENT_RELATIVE_PATH_FILE=WEB-INF/classes/metamac/environment.xml
LOGBACK_RELATIVE_PATH_FILE=WEB-INF/classes/logback.xml
RESTART=1

if [ "$1" == "--no-restart" ]; then
    RESTART=0
fi


scp -r etc/deploy deploy@estadisticas.arte-consultores.com:$TRANSFER_PATH
scp metamac-portal-web/target/statistical-visualizer-*.war deploy@estadisticas.arte-consultores.com:$TRANSFER_PATH/statistical-visualizer.war
scp metamac-portal-api-web/target/statistical-visualizer-api-*.war deploy@estadisticas.arte-consultores.com:$TRANSFER_PATH/statistical-visualizer-api.war
ssh deploy@estadisticas.arte-consultores.com <<EOF

    chmod a+x $TRANSFER_PATH/deploy/*.sh;
    . $TRANSFER_PATH/deploy/utilities.sh

    if [ $RESTART -eq 1 ]; then
        sudo service metamac01 stop
        checkPROC "metamac"
    fi

    ## Un poco ineficiente, pero por simplificar el código
    cp $TRANSFER_PATH/statistical-visualizer.war $TRANSFER_PATH_INTERNAL/statistical-visualizer-internal.war

    ###
    # METAMAC-PORTAL - External
    ###

    # Update Process
    sudo rm -rf $DEPLOY_TARGET_PATH/statistical-visualizer
    sudo mv $TRANSFER_PATH/statistical-visualizer.war $DEPLOY_TARGET_PATH/statistical-visualizer.war
    sudo unzip $DEPLOY_TARGET_PATH/statistical-visualizer.war -d $DEPLOY_TARGET_PATH/statistical-visualizer
    sudo rm -rf $DEPLOY_TARGET_PATH/statistical-visualizer.war
    
    # Restore Configuration
    sudo cp $HOME_PATH/environment.xml $DEPLOY_TARGET_PATH/statistical-visualizer/$ENVIRONMENT_RELATIVE_PATH_FILE
    sudo cp $HOME_PATH/logback.xml $DEPLOY_TARGET_PATH/statistical-visualizer/$LOGBACK_RELATIVE_PATH_FILE


    ###
    # METAMAC-PORTAL-API - External
    ###

    # Update Process
    sudo rm -rf $DEPLOY_TARGET_PATH/statistical-visualizer-api
    sudo mv $TRANSFER_PATH/statistical-visualizer-api.war $DEPLOY_TARGET_PATH/statistical-visualizer-api.war
    sudo unzip $DEPLOY_TARGET_PATH/statistical-visualizer-api.war -d $DEPLOY_TARGET_PATH/statistical-visualizer-api
    sudo rm -rf $DEPLOY_TARGET_PATH/statistical-visualizer-api.war

    # Restore Configuration
    sudo cp $HOME_PATH/environment-api.xml $DEPLOY_TARGET_PATH/statistical-visualizer-api/$ENVIRONMENT_RELATIVE_PATH_FILE
    sudo cp $HOME_PATH/logback-api.xml $DEPLOY_TARGET_PATH/statistical-visualizer-api/$LOGBACK_RELATIVE_PATH_FILE
    
    
    ###
    # METAMAC-PORTAL - Internal
    ###

    # Update Process
    sudo rm -rf $DEPLOY_TARGET_PATH/statistical-visualizer-internal
    sudo mv $TRANSFER_PATH_INTERNAL/statistical-visualizer-internal.war $DEPLOY_TARGET_PATH/statistical-visualizer-internal.war
    sudo unzip $DEPLOY_TARGET_PATH/statistical-visualizer-internal.war -d $DEPLOY_TARGET_PATH/statistical-visualizer-internal
    sudo rm -rf $DEPLOY_TARGET_PATH/statistical-visualizer-internal.war
    
    # Restore Configuration
    sudo cp $HOME_PATH_INTERNAL/environment.xml $DEPLOY_TARGET_PATH/statistical-visualizer-internal/$ENVIRONMENT_RELATIVE_PATH_FILE
    sudo cp $HOME_PATH_INTERNAL/logback.xml $DEPLOY_TARGET_PATH/statistical-visualizer-internal/$LOGBACK_RELATIVE_PATH_FILE


    ###
    # METAMAC-PORTAL-API - Internal
    ###
    # Internal visualizer won´t have enabled the internal api

    if [ $RESTART -eq 1 ]; then
        sudo chown -R metamac.metamac /servers/metamac
        sudo service metamac01 start
    fi

    #checkURL "http://estadisticas.arte-consultores.com/permalinks/latest?_wadl" "metamac01"
    echo "Finished deploy"

EOF