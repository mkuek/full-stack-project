const buildUserMessagesObject = (userID) => {
  //!3b database query which generates this (all users with a certain roomID in an object), this may be two queries then some data manipulation
  //! [ {username: Matthew, guest1: John, roomID: 123},
  //! {username: Matthew, guest1: Tom, roomID: 456},
  //! {username: Matthew, guest1: Bill, guest2: Bill, roomID: 789} ]
  //! dummy data below to be replaced
  return [
    { guest: "John", roomID: 123 },
    { guest: "Tom", roomID: 456 },
    { guest: "Bill", roomID: 789 },
  ];
};

module.exports = buildUserMessagesObject;
