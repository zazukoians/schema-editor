#!/bin/sh

cd ../
wget -c https://repository.apache.org/content/repositories/snapshots/org/apache/jena/apache-jena-fuseki/2.3.1-SNAPSHOT/apache-jena-fuseki-2.3.1-20151127.100942-77.tar.gz
tar xzf apache-jena-fuseki-2.3.1-20151127.100942-77.tar.gz
mv apache-jena-fuseki-2.3.0 fuseki

# a marker for future ref.
touch fuseki/version_apache-jena-fuseki-2.3.0

# CORS-enabled version
mv fuseki/webapp/WEB-INF/web.xml fuseki/webapp/WEB-INF/original_web.xml
cd -
cp etc/web_CORS-enabled.xml ../fuseki/webapp/WEB-INF/web.xml
