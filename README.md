#Algorithm

gameRoleList[gameRole] = role list set by the game
playerRoleList[playerRole] = player roles given by user
roleMatches[playerRole] = lists each game role a player role can occupy
containers[container] = lists game role occupancy

* Recieve list of game roles / categories
* Convert categories into roles
* Recieve player role(s) from user
* Search for role matches between game roles and player role(s), place those matches into an array (roleMatches)
* While there are matches
  * While there are containers
    * If container is open
      * Occupy the container
      * Break
  * While there are containers
    * If occupier of container has somewhere else to go
      * Occupier occupies the new container
      * Occupy the container
  * All containers are marked for collisions
