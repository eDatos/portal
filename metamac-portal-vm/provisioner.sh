#!/usr/bin/env bash
apt-get update
export DEBIAN_FRONTEND=noninteractive
apt-get -q -y install mysql-server
apt-get -q -y install vim
apt-get install unzip
apt-get -q -y install openjdk-6-jre

if [ ! -f apache-tomcat-6.0.37.tar.gz ]; then
    wget http://ftp.cixug.es/apache/tomcat/tomcat-6/v6.0.37/bin/apache-tomcat-6.0.37.tar.gz >/dev/null 2>&1
    tar -zxvf apache-tomcat-6.0.37.tar.gz
fi

if [ ! -f opencms.zip ]; then
    wget http://www.opencms.org/downloads/opencms/opencms_8.5.1.zip -O opencms.zip >/dev/null 2>&1
    unzip opencms.zip -d opencms
    mv opencms/opencms.war apache-tomcat-6.0.37/webapps/
fi

apache-tomcat-6.0.37/bin/startup.sh