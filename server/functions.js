Accounts.onCreateUser(function(options, user) {

  user.admin = options.admin;
  user.super = options.super;
  user.justCreated = options.justCreated;
  user.fuzzyId = options.fuzzyId;
  user.profile = {
    first: options.first,
    last: options.last,
    greeting: options.greeting,
    birthday: options.birth,
    createdAt: moment(new Date()).format("MMMM Do YYYY"),
    notifications: options.notifications,
    cell: options.cell,
  };

  return user;
});

Accounts.validateLoginAttempt(function(user) {
  if (user) {
    if (user.user.justCreated == true) {
      Meteor.call("readyForUser", user.user._id);
      return false;
    } else {
      return true;
    }
  }
});
