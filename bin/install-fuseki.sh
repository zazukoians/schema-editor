#!/bin/sh

cd ../../
wget -c http://apache.panu.it/jena/binaries/apache-jena-fuseki-2.3.0.tar.gz
tar xzf apache-jena-fuseki-2.3.0.tar.gz
mv apache-jena-fuseki-2.3.0 fuseki

# a marker for future ref.
touch fuseki/version_apache-jena-fuseki-2.3.0

# CORS-enabled version
mv fuseki/webapp/WEB-INF/web.xml fuseki/webapp/WEB-INF/original_web.xml
cd -
cp etc/web_CORS-enabled.xml ../../fuseki/webapp/WEB-INF/web.xml
