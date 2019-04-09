Meteor.publish("theUsers", function() {
  return Meteor.users.find({}, {fields: {admin: 1, super: 1, profile: 1, emails: 1, justCreated: 1, fuzzyId: 1}});
});

Meteor.publish("lostandfound", function() {
  return LostAndFound.find({});
});

Meteor.publish("equipment", function() {
  return Equipment.find({});
});

Meteor.publish("archive", function() {
  return EquipmentArchive.find({});
});

Meteor.publish("info", function() {
  return InfoBoothNotes.find({});
});

Meteor.publish("resets", function() {
    return ResetCalendar.find({});
});

Meteor.publish("events", function() {
  return SCCEvents.find({});
});

Meteor.publish("issues", function() {
  return Issues.find({});
});

Meteor.publish("gameslog", function() {
  return GameRoomLog.find({});
});

Meteor.publish("loans", function() {
  return BoothLoans.find({});
});

Meteor.publish("fuzzies", function() {
  return WarmFuzzies.find({});
});

Meteor.publish("infos", function() {
  return Information.find({});
});

Meteor.publish("notif", function() {
  return Notifications.find({});
});
