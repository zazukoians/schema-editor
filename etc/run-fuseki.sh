# adjust paths for your setup

export FUSEKI_HOME=../../fuseki
export FUSEKI_BASE=../../fuseki

java -Xms2048M -Xmx2048M -Xss4m  -jar ../../fuseki/fuseki-server.jar --verbose --update --config schemaedit-config.ttl --pages /home/danny/fuseki-pages/pages --port=3333

# --pages ../jena-fuseki-1.0.0/pages

# -Xss4m is stack

