/* Templates for HTML blocks
 *
 * format is variant of Mustache
 * using ~{ }~ instead of {{ }}
 * (to avoid clashes in SPARQL, not actually relevant here)
 *
 */

 /**
  * Property Description Template
  */
 var propertyTemplate = "\n\
 <div class='propertyEditBlock'> \n\
    <label>Property</label> \n\
    <input class='resource' value='~{propertyName}~' /> \n\
 \n\
    ~{#subPropertyOf}~ \n\
       <label>rdfs:subPropertyOf</label> \n\
       <input class='resource' value='~{subPropertyOfURI}~' /> \n\
    ~{/subPropertyOf}~ \n\
\n\
    ~{#domain}~ \n\
       <label>rdfs:domain</label> \n\
       <input value='~{domainURI}~' class='resource' /> \n\
    ~{/domain}~ \n\
\n\
    ~{#range}~ \n\
       <label>rdfs:range</label> \n\
       <input value='~{rangeURI}~' class='resource' /> \n\
   ~{/range}~ \n\
\n\
   ~{#label}~ \n\
      <div class='fieldBlock'> \n\
         <label>rdfs:label</label> \n\
         <input class='propertyLabel' class='literal' lang='~{language}~' value='~{content}~' /> \n\
         <button class='langButton'></button> \n\
      </div> \n\
   ~{/label}~ \n\
   <button class='plusButton'>+</button> \n\
\n\
   ~{#comment}~ \n\
      <div class='fieldBlock'> \n\
         <label>rdfs:comment</label> \n\
         <textarea class='propertyComment' rows='4' cols='75' class='literal'  lang='~{language}~'>~{content}~</textarea> \n\
         <button class='langButton'></button> \n\
      </div> \n\
   ~{/comment}~ \n\
   <button class='plusButton'>+</button> \n\
 \n\
   <button class='updatePropertyButton'>Update</button> \n\
</div> \n\
";
