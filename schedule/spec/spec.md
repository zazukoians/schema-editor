Reto Contract 2015-07-15

Implemented in JS and running in the browser
backend sparql 1.1 (tested against vanilla fuseki 2)
support hash URI and non hash URI
Range and Domain with and without Union
On start page I set sparql endpoint URIs and can choose an existing class or property to edit or create a new one
When editing a class I can add properties (existing or new)
When editing a property I can add classes (existing or new)
All literal values properties support mulitple languages
1200 for reaching the goal above by the deadline, or up to 1700? at our discretion if the application is technically and visually particularly attractive and/or delivered early.

Ideal: Mid August
Deadline: End of August

...

Look at schema.org to be inspired. Differences:

- On schema.org you cannt edit
- On Schema.org you're dereferencing the classes/properties directly in your browser, In the app you should write the URI accessed in the browser is the URI of the editor, which need not to be related to the sparql-endpoint which need not to be related to the namespace of the properties and classes.

But to your question:
Say I've created a class <SpaceShip> as a subclass of Vehicle. Now on the pane to edit the class I "add" a property <warpLevel> (that property previously didn't exist). This creates an instance of  rdf:property with rdfs:domain <SpaceShip>.

If I create a subclass of <SpaceShip> this will already "have" the property <warpLevel>
If I create a new class <Bicycle2> (whcih is not a subclass of <SpaceShip>) I can "add" the property <warpLevel> to it. If I do this, the domain of the property <warpLevel> will be changed to be the Union of <SpaceShip> and <Bicycle2>.

Of course I can also undo any of these steps.

Something else: I'll create a git repo to use, while this shall be open source at the end it if first developed non-publicly.

Hope that makes it clearer.
