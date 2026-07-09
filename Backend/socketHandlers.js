const { addUserToRoom, removeUserFromRoom } = require('./rooms');
const Room = require('./models/Room');

// In-memory cache to store the latest active code state for throttling database writes
// Structure: { roomId: "current code text content..." }
const codeBufferCache = {};

// Background Process: Flushes active in-memory code changes to MongoDB Atlas every 10 seconds
setInterval(async () => {
  const activeRoomIds = Object.keys(codeBufferCache);
  
  if (activeRoomIds.length === 0) return;

  console.log(`Auto-Save: Syncing ${activeRoomIds.length} active room changes to MongoDB Atlas...`);

  for (const roomId of activeRoomIds) {
    try {
      const currentCodeSnapshot = codeBufferCache[roomId];
      
      // Persist the code snapshot to database
      await Room.findOneAndUpdate({ roomId }, { code: currentCodeSnapshot });
      
      // Remove from write-buffer queue once successfully saved
      if (codeBufferCache[roomId] === currentCodeSnapshot) {
        delete codeBufferCache[roomId];
      }
    } catch (error) {
      console.error(`Background Auto-Save failed for room ${roomId}: ${error.message}`);
    }
  }
}, 10000); // 10,000 milliseconds = 10 seconds

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Connection established: ${socket.id}`);

    // Event: User joins an interview room workspace
    socket.on('join-room', ({ roomId, userId, name, avatarUrl }) => {
      socket.join(roomId);

      const currentUsersList = addUserToRoom(roomId, socket.id, { userId, name, avatarUrl });

      // Broadcast the updated presence user list back to everyone in the room
      io.to(roomId).emit('presence-updated', currentUsersList);
      console.log(`User [${name}] stepped inside room: ${roomId}`);
    });

    // Event: Captures keystrokes from a user's Monaco Editor and mirrors it to others
    socket.on('code-change', ({ roomId, updatedCode }) => {
      // 1. Instantly update memory cache so background auto-save catches it
      codeBufferCache[roomId] = updatedCode;

      // 2. Stream layout changes to other connected developers in real time
      socket.to(roomId).emit('code-receive', updatedCode);
    });

    // Event: Synced dropdown changes highlighting rules for all peers
    socket.on('language-change', async ({ roomId, targetLanguage }) => {
      socket.to(roomId).emit('language-receive', targetLanguage);
      
      try {
        await Room.findOneAndUpdate({ roomId }, { language: targetLanguage });
      } catch (error) {
        console.error(`Language sync save failure: ${error.message}`);
      }
    });

    // Event: Client cleanly closes the window or disconnects entirely
    socket.on('disconnect', () => {
      const { affectedRoomId, remainingUsers } = removeUserFromRoom(socket.id);
      
      if (affectedRoomId) {
        io.to(affectedRoomId).emit('presence-updated', remainingUsers);
        console.log(`🔌 Connection removed from room ${affectedRoomId} for client: ${socket.id}`);
      }
    });
  });
};
