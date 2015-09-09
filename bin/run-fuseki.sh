# adjust paths for your setup

export FUSEKI_HOME=../../fuseki
export FUSEKI_BASE=../../fuseki

java -Xms2048M -Xmx2048M -Xss4m  -jar ../../fuseki/fuseki-server.jar --verbose --update --config ../data/schemaedit-config.ttl --port=3333

# --pages ../src/public/

# --pages ../jena-fuseki-1.0.0/pages

# -Xss4m is stack
