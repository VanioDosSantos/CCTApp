Meteor.methods({
  lostFoundEntry: function(entry) {
    LostAndFound.insert(entry);
  },
  lostFoundEntryUpdate: function(entry) {
    LostAndFound.update({_id: entry._id}, {$set: {"claimed": true}});
  },
  equipment: function(newEquip) {
    Equipment.insert(newEquip);
  },
  equipmentReturn: function(equip) {
    Equipment.update({equipment: equip.equipment}, {$set: {"status": "Available", "hex": "#29DF72", "returnTime": false}});
    EquipmentArchive.update({_id: equip._id}, {$set: {"complete": true}});
  },
  equipmentPickup: function(nextReserve) {
    Equipment.update({equipment: nextReserve.equipment}, {$set: {"status": "In Use", "hex": "#DD3B38", "returnTime": nextReserve.until}});
    // EquipmentArchive.update({_id: nextReserve._id}, {$set: {"complete": false}});
  },
  todayNextReserve: function(equipment, hasNextToday) {
    Equipment.update({equipment: equipment}, {$set: {"reservedToday": hasNextToday}});
  },
  archiveReservation: function(archive) {
    EquipmentArchive.insert(archive);
  },
  lostItemFound: function(entry) {
    LostAndFound.update({_id: entry._id}, {$set: {"found": true}});
  },
  sendEmail: function(to, from, subject, text) {
    check([to, from, subject, text], [String]);
    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();
    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: text
    });
  },
  infoSend: function(thread) {
    InfoBoothNotes.insert(thread);
  },
  readyForUser: function(id) {
    Meteor.users.update({_id: id}, {$set: {"justCreated": false}});
  },
  newSCCEvent: function(newEvent) {
    SCCEvents.insert(newEvent);
  },
  infoProblem: function(problem) {
    Issues.insert(problem);
  },
  problemSolved: function(problem) {
    Issues.update({_id: problem._id}, {$set: {"solved": true, "solvedDate": new Date()}});
  },
  logStudent: function(log) {
    GameRoomLog.insert(log);
  },
  finishedPlayin: function(log) {
    GameRoomLog.update({_id: log._id}, {$set: {"done": true, "actualTimeOut": new Date()}});
  },
  auxLoan: function(loan) {
    BoothLoans.insert(loan);
  },
  loanReturn: function(id) {
    BoothLoans.update({_id: id}, {$set: {"returned": true}});
  },
  createFuzzies: function(fuzzyObj) {
    WarmFuzzies.insert(fuzzyObj);
  },
  addInfo: function(info) {
    Information.insert(info);
  },
  validateReserve: function(objID) {
    EquipmentArchive.update({_id: objID}, {$set: {"complete": true}});
  },
  tagUser: function(obj) {
    Notifications.insert(obj);
  },
  notificationSeen: function(notif) {
    Notifications.update({_id: notif._id}, {$set: {"seen": true}});
  },
  markAsNotified: function(thisNotif) {
    Notifications.update({_id: thisNotif._id}, {$set: {"notified": true}});
  },
  roomReserv: function(roomObj) {
    ResetCalendar.insert(roomObj);
  },
  

});
