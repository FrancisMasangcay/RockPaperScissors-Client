1. export socket instance and import into each react component
2. socket.io uses strings for rooms
3. send front end schemas for what functions will be available, and what they'll take as args/return
4. have a single updateState socket handler called after every game state change, this would emit to all in the room
5. all players should be included in roomstate/gamestate users array, ideally they already contain all needed info, if not we would do a get user lookup on each
6. must enforce that all usernames must be unique across all game rooms, or we add the socket.id as a field in the player document