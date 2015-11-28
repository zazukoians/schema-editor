var PublicModule = (function() {  
  "use strict";

  // This is the public interface of the Module.
  var Module = {
    // publicFunction can be called externally
    publicFunction: function() {
      return "publicFunction can be invoked "          
                  + "externally but " 
                  + privateFunction();
     }
  };

  // privateFunction is completely hidden
  // from the outside.
  function privateFunction() {
     return "privateFunction cannot";
  }

  return Module;
}());