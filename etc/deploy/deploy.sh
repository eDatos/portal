#!/bin/sh

HOME_PATH=metamac-portal
TRANSFER_PATH=$HOME_PATH/tmp
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


    ###
    # METAMAC-PORTAL
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
    # METAMAC-PORTAL-API
    ###

    # Update Process
    sudo rm -rf $DEPLOY_TARGET_PATH/statistical-visualizer-api
    sudo mv $TRANSFER_PATH/statistical-visualizer-api.war $DEPLOY_TARGET_PATH/statistical-visualizer-api.war
    sudo unzip $DEPLOY_TARGET_PATH/statistical-visualizer-api.war -d $DEPLOY_TARGET_PATH/statistical-visualizer-api
    sudo rm -rf $DEPLOY_TARGET_PATH/statistical-visualizer-api.war

    # Restore Configuration
    sudo cp $HOME_PATH/environment-api.xml $DEPLOY_TARGET_PATH/statistical-visualizer-api/$ENVIRONMENT_RELATIVE_PATH_FILE
    sudo cp $HOME_PATH/logback-api.xml $DEPLOY_TARGET_PATH/statistical-visualizer-api/$LOGBACK_RELATIVE_PATH_FILE


    if [ $RESTART -eq 1 ]; then
        sudo chown -R metamac.metamac /servers/metamac
        sudo service metamac01 start
    fi

    #checkURL "http://estadisticas.arte-consultores.com/permalinks/latest?_wadl" "metamac01"
    echo "Finished deploy"

EOF