# adjust paths for your setup

export FUSEKI_HOME=../../jena-fuseki1-1.3.0
export FUSEKI_BASE=../../jena-fuseki1-1.3.0

java -Xms2048M -Xmx2048M -Xss4m  -jar ../../jena-fuseki1-1.3.0/fuseki-server.jar --verbose --update --config ../data/schemaedit-config.ttl --port=3030

# --pages ../src/public/

# --pages ../jena-fuseki-1.0.0/pages

# -Xss4m is stack
