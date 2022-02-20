//join user to chat
const userJoinObject = (id, username, roomID) => {
  const user = { id, username, roomID };
  users.push(user);
  return user;
};

module.exports = userJoinObject;
