#!/bin/sh

if [ ! -d "data/store" ]; then
# install Fuseki
   wget https://repository.apache.org/content/repositories/snapshots/org/apache/jena/apache-jena-fuseki/2.3.1-SNAPSHOT/apache-jena-fuseki-2.3.1-20151127.100942-77.tar.gz
   tar xzf apache-jena-fuseki-2.3.1-20151127.100942-77.tar.gz
   mv apache-jena-fuseki-2.3.1-SNAPSHOT data/store

# a marker for future ref.
   touch data/store/VERSION_apache-jena-fuseki-2.3.1-SNAPSHOT

# CORS-enabled version
# mv fuseki/webapp/WEB-INF/web.xml fuseki/webapp/WEB-INF/original_web.xml
# cd -
# cp etc/web_CORS-enabled.xml ../fuseki/webapp/WEB-INF/web.xml
fi

# upload prefix map
# see http://www.w3.org/TR/sparql11-http-rdf-update/#http-post
