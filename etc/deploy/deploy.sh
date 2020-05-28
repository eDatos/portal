#!/bin/bash

HOME_PATH_EXTERNAL=metamac-portal
TRANSFER_PATH_EXTERNAL=$HOME_PATH_EXTERNAL/tmp
DEPLOY_TARGET_PATH_EXTERNAL=/servers/edatos-external/tomcats/edatos-external01/webapps

HOME_PATH_INTERNAL=metamac-portal-internal
TRANSFER_PATH_INTERNAL=$HOME_PATH_INTERNAL/tmp
DEPLOY_TARGET_PATH_INTERNAL=/servers/edatos-internal/tomcats/edatos-internal01/webapps

ENVIRONMENT_RELATIVE_PATH_FILE=WEB-INF/classes/metamac/environment.xml
LOGBACK_RELATIVE_PATH_FILE=WEB-INF/classes/logback.xml
RESTART=1

if [ "$1" == "--no-restart" ]; then
    RESTART=0
fi

scp -o ProxyCommand="ssh -W %h:%p deploy@estadisticas.arte-consultores.com" -r etc/deploy deploy@estadisticas.arte.internal:$TRANSFER_PATH_EXTERNAL
scp -o ProxyCommand="ssh -W %h:%p deploy@estadisticas.arte-consultores.com" metamac-portal-web/target/statistical-visualizer-*.war deploy@estadisticas.arte.internal:$TRANSFER_PATH_EXTERNAL/statistical-visualizer.war
scp -o ProxyCommand="ssh -W %h:%p deploy@estadisticas.arte-consultores.com" metamac-portal-api-web/target/statistical-visualizer-api-*.war deploy@estadisticas.arte.internal:$TRANSFER_PATH_EXTERNAL/statistical-visualizer-api.war
ssh -o ProxyCommand="ssh -W %h:%p deploy@estadisticas.arte-consultores.com" deploy@estadisticas.arte.internal <<EOF

    chmod a+x $TRANSFER_PATH_EXTERNAL/deploy/*.sh;
    . $TRANSFER_PATH_EXTERNAL/deploy/utilities.sh

    ## Un poco ineficiente, pero por simplificar el código
    cp $TRANSFER_PATH_EXTERNAL/statistical-visualizer.war $TRANSFER_PATH_INTERNAL/statistical-visualizer-internal.war

    if [ $RESTART -eq 1 ]; then
        sudo service edatos-external01 stop
        checkPROC "edatos-external"
    fi

    ###
    # METAMAC-PORTAL - External
    ###

    # Update Process
    sudo rm -rf $DEPLOY_TARGET_PATH_EXTERNAL/statistical-visualizer
    sudo mv $TRANSFER_PATH_EXTERNAL/statistical-visualizer.war $DEPLOY_TARGET_PATH_EXTERNAL/statistical-visualizer.war
    sudo unzip $DEPLOY_TARGET_PATH_EXTERNAL/statistical-visualizer.war -d $DEPLOY_TARGET_PATH_EXTERNAL/statistical-visualizer
    sudo rm -rf $DEPLOY_TARGET_PATH_EXTERNAL/statistical-visualizer.war
    
    # Restore Configuration
    sudo cp $HOME_PATH_EXTERNAL/environment_external.xml $DEPLOY_TARGET_PATH_EXTERNAL/statistical-visualizer/$ENVIRONMENT_RELATIVE_PATH_FILE
    sudo cp $HOME_PATH_EXTERNAL/logback_external.xml $DEPLOY_TARGET_PATH_EXTERNAL/statistical-visualizer/$LOGBACK_RELATIVE_PATH_FILE


    ###
    # METAMAC-PORTAL-API - External
    ###

    # Update Process
    sudo rm -rf $DEPLOY_TARGET_PATH_EXTERNAL/statistical-visualizer-api
    sudo mv $TRANSFER_PATH_EXTERNAL/statistical-visualizer-api.war $DEPLOY_TARGET_PATH_EXTERNAL/statistical-visualizer-api.war
    sudo unzip $DEPLOY_TARGET_PATH_EXTERNAL/statistical-visualizer-api.war -d $DEPLOY_TARGET_PATH_EXTERNAL/statistical-visualizer-api
    sudo rm -rf $DEPLOY_TARGET_PATH_EXTERNAL/statistical-visualizer-api.war

    # Restore Configuration
    sudo cp $HOME_PATH_EXTERNAL/environment_external-api.xml $DEPLOY_TARGET_PATH_EXTERNAL/statistical-visualizer-api/$ENVIRONMENT_RELATIVE_PATH_FILE
    sudo cp $HOME_PATH_EXTERNAL/logback_external-api.xml $DEPLOY_TARGET_PATH_EXTERNAL/statistical-visualizer-api/$LOGBACK_RELATIVE_PATH_FILE
    
    if [ $RESTART -eq 1 ]; then
        sudo chown -R edatos-external.edatos-external /servers/edatos-external
        sudo service edatos-external01 start
    fi

    if [ $RESTART -eq 1 ]; then
        sudo service edatos-internal01 stop
        checkPROC "edatos-internal"
    fi
    
    ###
    # METAMAC-PORTAL - Internal
    ###
    
    # Update Process
    sudo rm -rf $DEPLOY_TARGET_PATH_INTERNAL/statistical-visualizer-internal
    sudo mv $TRANSFER_PATH_INTERNAL/statistical-visualizer-internal.war $DEPLOY_TARGET_PATH_INTERNAL/statistical-visualizer-internal.war
    sudo unzip $DEPLOY_TARGET_PATH_INTERNAL/statistical-visualizer-internal.war -d $DEPLOY_TARGET_PATH_INTERNAL/statistical-visualizer-internal
    sudo rm -rf $DEPLOY_TARGET_PATH_INTERNAL/statistical-visualizer-internal.war
    
    # Restore Configuration
    sudo cp $HOME_PATH_INTERNAL/environment_internal.xml $DEPLOY_TARGET_PATH_INTERNAL/statistical-visualizer-internal/$ENVIRONMENT_RELATIVE_PATH_FILE
    sudo cp $HOME_PATH_INTERNAL/logback_internal.xml $DEPLOY_TARGET_PATH_INTERNAL/statistical-visualizer-internal/$LOGBACK_RELATIVE_PATH_FILE


    ###
    # METAMAC-PORTAL-API - Internal
    ###
    # Internal visualizer won´t have enabled the internal api

    if [ $RESTART -eq 1 ]; then
        sudo chown -R edatos-internal.edatos-internal /servers/edatos-internal
        sudo service edatos-internal01 start
    fi

    echo "Finished deploy"

EOF