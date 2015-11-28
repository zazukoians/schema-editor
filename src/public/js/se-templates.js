/* TODO refactor into module
 *
 * Templates for HTML rendering and SPARQL queries
 *
 * format is variant of Mustache
 * using ~{ }~ instead of {{ }}
 * (to avoid clashes in SPARQL, ease of reading)
 * see http://mustache.github.io/mustache.5.html
 *
 * templating engine is Hogan
 * http://twitter.github.io/hogan.js/
 */

/* *** HTML TEMPLATES *** */

var SE_HtmlTemplates = (function () {
    "use strict";

    // This is the public interface of the Module.
    var SE_HtmlTemplates = {

        /**
         * Template for describing/editing terms
         */
        termTemplate: "\n\
<div class='termEditBlock'> \n\
<h3  class='hasHelp' data-help-id='termHelpText'>Edit Term</h3> \n\
   <label>Resource Name</label> \n\
   <input class='resource resourceName' value='~{resourceName}~' /> \n\
\n\
   <label>RDF Type</label> \n\
   <input class='resource rdfType' value='~{rdfType}~' /> \n\
\n\
   ~{#isClass}~ \n\
      ~{#subClassOf}~ \n\
            <div class='fieldBlock'> \n\
         <label>rdfs:subClassOf</label> \n\
         <input class='resource subClassOf' value='~{subClassOfURI}~' /> \n\
         </div> \n\
      ~{/subClassOf}~ \n\
   <button class='plusButton'>+</button> \n\
   ~{/isClass}~ \n\
\n\
   ~{#isProperty}~ \n\
      ~{#subPropertyOf}~ \n\
         <div class='fieldBlock'> \n\
            <label>rdfs:subPropertyOf</label> \n\
            <input class='resource subPropertyOf' value='~{subPropertyOfURI}~' /> \n\
         </div> \n\
      ~{/subPropertyOf}~ \n\
   <button class='plusButton'>+</button> \n\
\n\
   ~{#domain}~ \n\
      <div class='fieldBlock'> \n\
         <label>rdfs:domain</label> \n\
         <input value='~{domainURI}~' class='resource domain' /> \n\
      </div> \n\
   ~{/domain}~ \n\
   <button class='plusButton'>+</button> \n\
\n\
      ~{#range}~ \n\
        <div class='fieldBlock'> \n\
         <label>rdfs:range</label> \n\
         <input value='~{rangeURI}~' class='resource range' /> \n\
         </div> \n\
      ~{/range}~ \n\
         <button class='plusButton'>+</button> \n\
         \n\
               ~{#domainIncludes}~ \n\
                 <div class='fieldBlock'> \n\
                  <label>schema:domainIncludes</label> \n\
                  <input value='~{domainIncludesURI}~' class='resource domainIncludes' /> \n\
                  </div> \n\
               ~{/domainIncludes}~ \n\
                  <button class='plusButton'>+</button> \n\
         \n\
               ~{#rangeIncludes}~ \n\
                 <div class='fieldBlock'> \n\
                  <label>schema:rangeIncludes</label> \n\
                  <input value='~{rangeIncludesURI}~' class='resource rangeIncludes' /> \n\
                  </div> \n\
               ~{/rangeIncludes}~ \n\
                  <button class='plusButton'>+</button> \n\
   ~{/isProperty}~ \n\
\n\
   ~{#label}~ \n\
      <div class='fieldBlock'> \n\
         <label>rdfs:label</label> \n\
         <input class='label literal' lang='~{language}~' value='~{content}~' /> \n\
         <button class='langButton'></button> \n\
      </div> \n\
   ~{/label}~ \n\
   <button class='plusButton'>+</button> \n\
\n\
   ~{#comment}~ \n\
      <div class='fieldBlock'> \n\
         <label>rdfs:comment</label> \n\
         <textarea class='comment literal' rows='4' cols='75' lang='~{language}~'>~{content}~</textarea> \n\
         <button class='langButton'></button> \n\
      </div> \n\
   ~{/comment}~ \n\
\n\
   <button class='plusButton'>+</button> \n\
\n\
   <button class='updateTermButton'>Update</button> \n\
</div>",

        languageChoiceTemplate: "~{#langList}~ \n\
            <p class='languageChoice'> \n\
               <label>~{lang}~</label> \n\
               <input value='~{lang}~' type='radio' name='language' class='languageRadio' /> \n\
            </p> \n\
        ~{/langList}~"
    }
    return SE_HtmlTemplates;
}());

/* *** SPARQL TEMPLATES *** */

var commonPrefixes =
    " \n\
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n\
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n\
PREFIX owl: <http://www.w3.org/2002/07/owl#> \n\
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> \n\
PREFIX vann: <http://purl.org/vocab/vann/> \n\
PREFIX sem: <http://semanticweb.cs.vu.nl/2009/11/sem/> \n\
PREFIX skos: <http://www.w3.org/2004/02/skos/core#> \n\
PREFIX schema: <http://schema.org/> \n\
# nb. prefer dcterms over dcelements \n\
PREFIX dc: <http://purl.org/dc/terms/> \n\
PREFIX foaf: <http://xmlns.com/foaf/0.1/> \n\
PREFIX dcat: <http://www.w3.org/ns/dcat#> \n\
PREFIX void: <http://rdfs.org/ns/void#> \n\
PREFIX bibo: <http://purl.org/ontology/bibo/> \n\
PREFIX dctype: <http://purl.org/dc/dcmitype/> \n\
PREFIX sioc: <http://rdfs.org/sioc/ns#>  \n\
PREFIX stuff: <http://purl.org/stuff#>  \n";

var SE_SparqlTemplates = (function () {
    "use strict";

    // This is the public interface of the Module.
    var SE_SparqlTemplates = {
        // moved out PREFIX dc: <http://purl.org/dc/elements/1.1/> \n\

        updateTerm: commonPrefixes +
            "WITH <~{graphURI}~> \n\
     DELETE {  \n\
     <~{resourceName}~> ?p ?o . \n\
     }  \n\
     WHERE {  \n\
     <~{resourceName}~>  ?p ?o  . \n\
   }; \n\
 \n\
 BASE <~{graphURI}~> \n\
        INSERT DATA {  \n\
         		GRAPH <~{graphURI}~> {  \n\
         			<~{resourceName}~>  a <~{rdfType}~> ; \n\
\n\
               ~{#subClassOf}~ \n\
                  rdfs:subClassOf <~{subClassOf}~> ; \n\
               ~{/subClassOf}~  \n\
\n\
               ~{#subPropertyOf}~ \n\
                   rdfs:subPropertyOf <~{subPropertyOf}~> ; \n\
               ~{/subPropertyOf}~  \n\
\n\
               ~{#domain}~ \n\
                   rdfs:domain <~{domain}~> ; \n\
               ~{/domain}~  \n\
\n\
               ~{#range}~ \n\
                   rdfs:range <~{range}~> ; \n\
               ~{/range}~ \n\
               \n\
                              ~{#domainIncludes}~ \n\
                                  schema:domainIncludes <~{domainIncludes}~> ; \n\
                              ~{/domainIncludes}~  \n\
               \n\
                              ~{#rangeIncludes}~ \n\
                                  schema:rangeIncludes <~{rangeIncludes}~> ; \n\
                              ~{/rangeIncludes}~ \n\
\n\
               ~{#label}~ \n\
                   ~{#labelText}~ \n\
                      rdfs:label \"\"\"~{labelText}~\"\"\"@~{labelLang}~ ; \n\
                      skos:prefLabel \"\"\"~{labelText}~\"\"\"@~{labelLang}~ ; \n\
                   ~{/labelText}~ ; \n\
               ~{/label}~ ; \n\
\n\
               ~{#comment}~ \n\
                  ~{#commentText}~ \n\
                       rdfs:comment \"\"\"~{commentText}~\"\"\"@~{commentLang}~ ; \n\
                       skos:definition \"\"\"~{commentText}~\"\"\"@~{commentLang}~ ; \n\
                  ~{/commentText}~  \n\
               ~{/comment}~  \n\
\n\
               rdfs:isDefinedBy <~{graphURI}~> \n\
         } \n\
       }",

        labelBlock: " \n\
       ~{#label}~ \n\
           ~{#labelText}~ \n\
              rdfs:label \"\"\"~{labelText}~\"\"\"@~{labelLang}~ ; \n\
              skos:prefLabel \"\"\"~{labelText}~\"\"\"@~{labelLang}~ ; \n\
           ~{/labelText}~ ; \n\
       ~{/label}~ ; \n\
       ",

        commentBlock: " \n\
       ~{#comment}~ \n\
          ~{#commentText}~ \n\
               rdfs:comment \"\"\"~{commentText}~\"\"\"@~{commentLang}~ ; \n\
               skos:definition \"\"\"~{commentText}~\"\"\"@~{commentLang}~ ; \n\
          ~{/commentText}~  \n\
       ~{/comment}~  \n\
       ",

        getLanguages: "SELECT DISTINCT ?language \n\
                FROM <~{graphURI}~>  \n\
                WHERE { \n\
                ?s ?p ?o; \n\
                BIND (lang(?o) AS ?language) \n\
              }"
    };
    return SE_SparqlTemplates;
}());

var getPrefixesSparql =
    "\n\
PREFIX : <http://purl.org/stuff/prefix/> \n\
\n\
SELECT DISTINCT ?prefix ?namespace \n\
WHERE { \n\
GRAPH <http://purl.org/stuff/prefix/> { \n\
[ \n\
:prefix ?prefix ; \n\
:namespace ?namespace \n\
] \n\
}} \n\
ORDER BY ?prefix";

var addPrefixSparqlTemplate =
    "\n\
PREFIX : <http://purl.org/stuff/prefix/> \n\
\n\
    INSERT DATA {  \n\
		GRAPH <http://purl.org/stuff/prefix/> {  \n\
      [ \n\
      :prefix \"~{prefix}~\" ; \n\
      :namespace <~{namespace}~> \n\
      ] \n\
} \n\
}";

var constructGraph = commonPrefixes +
    "CONSTRUCT { ?s ?p ?o } WHERE { GRAPH <~{graphURI}~> { ?s ?p ?o } . }";

var addClassSparqlTemplate = commonPrefixes +
    "BASE <~{graphURI}~> \n\
    INSERT DATA {  \n\
    		GRAPH <~{graphURI}~> {  \n\
    			<~{graphURI}~~{name}~>  a rdfs:Class ; \n\
      \n\
          ~{#label}~ \n\
              rdfs:label \"\"\"~{label}~\"\"\"@~{labelLang}~ ; \n\
              skos:prefLabel \"\"\"~{label}~\"\"\"@~{labelLang}~ ; \n\
          ~{/label}~  \n\
\n\
          ~{#subClassOf}~ \n\
              rdfs:subClassOf <~{subClassOf}~> ; \n\
          ~{/subClassOf}~  \n\
\n\
          ~{#comment}~ \n\
              rdfs:comment \"\"\"~{comment}~\"\"\"@~{commentLang}~ ; \n\
              skos:definition \"\"\"~{comment}~\"\"\"@~{commentLang}~ ; \n\
          ~{/comment}~ \n\
\n\
          rdfs:isDefinedBy <~{graphURI}~> \n\
    } \n\
    }";

// TODO tweak, namespace = graph
var addPropertySparqlTemplate = commonPrefixes +
    "BASE <~{graphURI}~> \n\
   INSERT DATA {  \n\
    		GRAPH <~{graphURI}~> {  \n\
    			<~{graphURI}~~{name}~>  a rdf:Property ; \n\
          \n\
          ~{#label}~ \n\
              rdfs:label \"\"\"~{label}~\"\"\"@~{labelLang}~ ; \n\
              skos:prefLabel \"\"\"~{label}~\"\"\"@~{labelLang}~ ; \n\
          ~{/label}~ ; \n\
\n\
          ~{#subPropertyOf}~ \n\
              rdfs:subPropertyOf <~{subPropertyOf}~> ; \n\
          ~{/subPropertyOf}~  \n\
\n\
          ~{#domain}~ \n\
              rdfs:domain <~{domain}~> ; \n\
          ~{/domain}~  \n\
\n\
          ~{#range}~ \n\
              rdfs:range <~{range}~> ; \n\
          ~{/range}~ \n\
\n\
          ~{#comment}~ \n\
            rdfs:comment \"\"\"~{comment}~\"\"\"@~{commentLang}~ ; \n\
            skos:definition \"\"\"~{comment}~\"\"\"@~{commentLang}~ ; \n\
          ~{/comment}~  \n\
\n\
          rdfs:isDefinedBy <~{graphURI}~> \n\
    } \n\
    }";

var uploadTurtleSparqlTemplate = "INSERT DATA { GRAPH <~{graphURI}~> { ~{data}~ } }";

var listGraphsSparqlTemplate =
    "SELECT DISTINCT ?graph { \n\
    GRAPH ?graph { ?s ?p ?o . } \n\
}";

// FROM <~{graphURI}~>  \n\

var getAllProperties = commonPrefixes +
    "SELECT DISTINCT ?property \n\
WHERE { GRAPH <~{graphURI}~> { \n\
?subject ?property ?object \n\
}} \n\
ORDER BY ?property \n\
";

// NAMED
var getResourcesOfTypeSparqlTemplate = commonPrefixes +
    " \n\
# from getResourcesOfType \n\
SELECT DISTINCT * \n\
FROM <~{graphURI}~>  \n\
WHERE { \n\
?uri a ~{type}~ \n\
} \n\
ORDER BY ?uri \n\
";

var getPropertiesOfResource = commonPrefixes +
    " \n\
# from getPropertiesOfResource \n\
SELECT DISTINCT * \n\
FROM <~{graphURI}~>  \n\
WHERE { \n\
<~{subject}~> ?property ?object \n\
} \n\
ORDER BY ?p \n\
";

/*
// redundant - using getResourceSparqlTemplate??
var getClassListSparqlTemplate = commonPrefixes +
    " \n\
SELECT DISTINCT * \n\
FROM <~{graphURI}~>  \n\
WHERE { \n\
?uri a rdfs:Class; \n\
} \n\
";

// redundant - using getResourceSparqlTemplate??
var getPropertyListSparqlTemplate = commonPrefixes +
    " \n\
SELECT DISTINCT * \n\
FROM <~{graphURI}~>  \n\
WHERE { \n\
	?uri a rdf:Property; \n\
	OPTIONAL { \n\
		?uri rdfs:range ?range \n\
	} \n\
} \n\
\n\
ORDER BY ?uri";

*/

// NAMED
var getResourceSparqlTemplate = commonPrefixes +
    " \n\
# from getResource \n\
SELECT DISTINCT ?s ?p ?o ?language \n\
FROM <~{graphURI}~>  \n\
WHERE { \n\
<~{uri}~> ?p ?o; \n\
BIND (lang(?o) AS ?language) \n\
BIND (<~{uri}~> AS ?s) \n\
} \n\
";

var getResourceListSparqlTemplate =
    "\n\
# from getResourceList \n\
SELECT DISTINCT ?subject \n\
FROM <~{graphURI}~>  \n\
WHERE { \n\
?subject ?p ?o; \n\
 FILTER isIRI(?subject) \n\
} \n\
";

var deleteResourceSparqlTemplate = commonPrefixes +
    " \n\
WITH <~{graphURI}~> \n\
DELETE {  \n\
<~{resourceURI}~> ?p ?o . \n\
}  \n\
WHERE {  \n\
<~{resourceURI}~>  ?p ?o  . \n\
}";

var deleteTurtleSparqlTemplate = commonPrefixes + " \n\
		DELETE DATA { \n\
			GRAPH <~{graphURI}~> { \n\
				 ~{turtle}~ \n\
			} \n\
		}";

var updateLiteralTripleSparqlTemplate = commonPrefixes +
    " \n\
  WITH <~{graphURI}~> \n\
	DELETE { <~{subject}~> <~{predicate}~> ?object }  \n\
	WHERE {  \n\
	<~{subject}~>  <~{predicate}~> ?object  . \n\
	}; \n\
	INSERT DATA {  \n\
		GRAPH <~{graphURI}~> {  \n\
			<~{subject}~>  <~{predicate}~> \"\"\"~{object}~\"\"\"@~{language}~  . \n\
}\n\
}";

var createVocabSparqlTemplate = commonPrefixes +
    "CREATE GRAPH <~{graphURI}~> ; \n\
    INSERT DATA {  \n\
		GRAPH <~{graphURI}~> {  \n\
			<~{graphURI}~>  a owl:Ontology; \n\
      stuff:prefPrefix \"\"\"~{prefix}~\"\"\" ; \n\
      rdfs:label \"\"\"~{name}~\"\"\" ; \n\
      skos:prefLabel \"\"\"~{name}~\"\"\" \n\
} \n\
}";

var createDummyClassSparqlTemplate = commonPrefixes +
    "INSERT DATA {  \n\
		GRAPH <~{graphURI}~> {  \n\
			<~{namespace}~Dummy>  a rdfs:Class; \n\
      rdfs:label \"\"\"Dummy\"\"\" \n\
} \n\
}";

var updateUriTripleSparqlTemplate = commonPrefixes +
    " \n\
  WITH <~{graphURI}~> \n\
	DELETE { <~{subject}~> <~{predicate}~> ?object }  \n\
	WHERE {  \n\
	<~{subject}~>  <~{predicate}~> ?object  . \n\
	}; \n\
	INSERT DATA {  \n\
		GRAPH <~{graphURI}~> {  \n\
			<~{subject}~>  <~{predicate}~> <~{object}~>  . \n\
}\n\
}";

// p, o not wrapped in <>
var insertPropertySparqlTemplate = commonPrefixes +
    " \n\
  WITH <~{graphURI}~> \n\
  	DELETE {  }  \n\
    WHERE {  \n\
    <~{subject}~>  ~{predicate}~ ?object  . \n\
    }; \n\
	INSERT DATA {  \n\
		GRAPH <~{graphURI}~> {  \n\
			<~{subject}~>  ~{predicate}~ ~{object}~  . \n\
}\n\
}";

/* maybe needed */
var deleteTripleSparqlTemplate = commonPrefixes +
    " \n\
WITH <~{graphURI}~> \n\
DELETE {  \n\
<~{subject}~> <~{property}~> <~{object}~> . \n\
}  \n\
WHERE {  \n\
<~{subject}~>  <~{property}~> <~{object}~>  . \n\
}";
