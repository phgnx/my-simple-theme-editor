#Store architecture

##State
The state contains a map of Variables, with the variable name as unique key.
All variables contain their category, description, raw and computed value, bust also a list of references to other variables, and the list of variables that referenced them.
The structure can be seen as a graph, but with no circular references inside (if A references B, B references C, C can't reference A).
All variables contain also a list of variables that reference them, because once there is a change, all the variables referencing the one changed need to be updated as well. 
All the referenced variables are the parents, and the variable referencing one we are updating are its children.

##Reducers & Actions
The only action needed here is the one to update a variable : UPDATE_VARIABLE

The reducer has different steps :
* Update parents referencedBy list
* Compute final value (removing references)
* Update the currentVariable references
* Update all the currentVariable children


