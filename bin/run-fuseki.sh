# adjust paths for your setup

export FUSEKI_HOME=../../fuseki
export FUSEKI_BASE=../../fuseki

java -Xms1024M -Xmx1024M -Xss2m  -jar ../../fuseki/fuseki-server.jar --verbose --update --config ../data/schemaedit-config.ttl --port=3030

# was -Xms2048M -Xmx2048M -Xss4m
# --pages ../src/public/

# --pages ../jena-fuseki-1.0.0/pages

# -Xss4m is stack
