
# Clients must set the content type header of the HTTP request to application/sparql-query.

#$.ajax({
#    url: Config.sparqlUpdateEndpoint,
#    type: 'POST',
#    data: ({
#        update: data
#    }),

# POST /rdf-graph-store?graph=..graph_uri.. HTTP/1.1
#    Host: example.com
#    Content-Type: text/turtle

#    ... RDF payload ...

# curl -F "userid=1" -F "filecomment=This is an image file" -F "image=@/home/user1/Desktop/test.jpg" localhost/uploader.php

# curl -F "update=@../data/well-known/rdf.ttl" -F "graph=http://www.w3.org/1999/02/22-rdf-syntax-ns#" --header "Content-Type: application/sparql-update" http://localhost:3333/schema-edit/update

curl -v -F "update=@../data/well-known/schema.org.ttl" -F "graph=http://schema.org/" --header "Content-Type: text/turtle" http://localhost:3333/schema-edit/data
