// In-memory mapping of active rooms and their connected users
// Structure: { roomId: { socketId: { userId, name, avatarUrl } } }
const activeRooms = {};

const addUserToRoom = (roomId, socketId, userData) => {
  if (!activeRooms[roomId]) {
    activeRooms[roomId] = {};
  }
  activeRooms[roomId][socketId] = userData;
  return Object.values(activeRooms[roomId]); // Returns array of all active users in this room
};

const removeUserFromRoom = (socketId) => {
  let affectedRoomId = null;
  let remainingUsers = [];

  for (const roomId in activeRooms) {
    if (activeRooms[roomId][socketId]) {
      affectedRoomId = roomId;
      delete activeRooms[roomId][socketId];
      
      // Clean up the room object completely if it is now empty
      if (Object.keys(activeRooms[roomId]).length === 0) {
        delete activeRooms[roomId];
      } else {
        remainingUsers = Object.values(activeRooms[roomId]);
      }
      break;
    }
  }
  return { affectedRoomId, remainingUsers };
};

module.exports = {
  addUserToRoom,
  removeUserFromRoom
};
