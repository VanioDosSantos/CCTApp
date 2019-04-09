LostAndFound = new Meteor.Collection("lostandfound");
Equipment = new Meteor.Collection("equipment");
EquipmentArchive = new Meteor.Collection("archive"); // maybe: change this to EquipmentReserv = new Meteor.Collection("reservations")
InfoBoothNotes = new Meteor.Collection("info"); // change to: CrewChat = new Meteor.Collection("crew");
GameRoomNotes = new Meteor.Collection("game"); // delete: Info Booth and Game Room will be under CrewChat
ResetNotes = new Meteor.Collection("reset"); // change to: ResetChat
ResetCalendar = new Meteor.Collection("resets") // this: use this collection for calendar stuff
SCCEvents = new Meteor.Collection("events");
Issues = new Meteor.Collection("issues");
GameRoomLog = new Meteor.Collection("gameslog");
BoothLoans = new Meteor.Collection("loans");
WarmFuzzies = new Meteor.Collection("fuzzies");
Information = new Meteor.Collection("infos");
Notifications = new Meteor.Collection("notif");
