capitalizeString = function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
itemMatch = function(entryItem, entryDescription, searchTerm) {

    searchTerm = searchTerm.split(" ");

    for (i = 0; i < searchTerm.length; i++) {
        if (new RegExp('\\b' + searchTerm[i] + '\\b', 'i').test(entryItem) || new RegExp('\\b' + searchTerm[i] + '\\b', 'i').test(entryDescription)) {
            return true;
        }
    }

    return false;
}
emailText = function(name) {
    return "Hey " + name + ",\n\n We have found your lost item. Please feel free to pick it up during our hours. \n\n Best, Campus Center Team";
}
checkForConflict = function(equipment, date, from, until) {
    var thisDayReservations = EquipmentArchive.find({
        equipment: equipment,
        date: date
    }).fetch();

    var x = _.filter(thisDayReservations, function(reserve) {

        return moment(from).diff(reserve.until) < 0;

    })

    if (x.length == 0) {
        return false;
    } else {
        return true;
    }


}
categoryHex = function(category) {
    var hex = "";
    switch (category) {
        case "Info Booth":
            hex = "rgb(50, 107, 255)";
            break;
        case "General":
            hex = "rgb(255, 145, 0)";
            break;
        case "Game Room":
            hex = "rgb(255, 68, 68)";
            break;
        case "Scheduling":
            hex = "rgb(255, 247, 50)";
            break;
        case "SCC":
            hex = "rgb(91, 242, 138)";
            break;
        case "Customer":
            hex = "rgb(163, 95, 238)";
            break;
        case "Other":
            hex = "rgb(143, 143, 143)";
    }
    return hex;
}
onLoginFunction = function() {
    var userProfile = Meteor.users.findOne({
        _id: Meteor.userId()
    }).profile;
    var birthdays = Meteor.users.find({}).fetch();
    var bDay = _.filter(birthdays, function(x) {
        return x.profile.birthday == moment().format("MM/DD");
    });
    sAlert.success(userProfile.greeting + " - What's up " + userProfile.first, {
        position: 'bottom',
        effect: 'jelly'
    });
    if (bDay.length > 0) {
        for (i = 0; i < bDay.length; i++) {
            if (Meteor.userId() == bDay[i]._id) {
                sAlert.info("Happy Birthday!!!", {
                    position: 'top-right',
                    effect: 'jelly'
                });
            } else {
                sAlert.info("It's " + bDay[i].profile.first + "'s birthday", {
                    position: 'top-right',
                    effect: 'jelly'
                });
            }
        }
    }
}

validateReservation = function() {
    var pastReservations = EquipmentArchive.find({
        date: moment().subtract(1, "days").format("MM/DD/YYYY"),
        complete: false
    }).fetch();
    if (pastReservations.length > 0) {
        for (i = 0; i < pastReservations.length; i++) {
            Meteor.call("validateReserve", pastReservations[i]._id);
        }
    }
}

atSomeone = function(text) {
    var ogText = text;
    text = text.split(" ");
    if (text.length < 2) {
        sAlert.warning("What do u want to say to the tagged.");
        return false;
    }
    var tag = undefined;
    for (i = 0; i < text.length; i++) {
        if (text[i].includes("@") && text[i].length != 1) {
            if (text[i] == "@everyone") {
                tag = Meteor.users.find({}).fetch();
            } else {
                var atUser = text[i].substring(1);
                atUser = atUser.toLowerCase();
                tag = Meteor.users.findOne({
                    "profile.first": capitalizeString(atUser)
                });
                if (tag == undefined) {
                    sAlert.error("Fix tag, no user by that name.");
                }
            }
        }
    }

    var by = Meteor.users.findOne({
        _id: Meteor.userId()
    }).profile.first;
    if (tag.length > 1) {

        tag = _.filter(tag, function(x) {
            return x._id != Meteor.userId();
        });

        for (i = 0; i < tag.length; i++) {
            const tagObj = {
                text: ogText,
                from: Meteor.userId(),
                who: by,
                to: tag[i]._id,
                createdAt: new Date(),
                seen: false,
            }

            Meteor.call("tagUser", tagObj);
        }

    } else if (tag && tag._id != Meteor.userId()) {
        const tagObj = {
            text: ogText,
            from: Meteor.userId(),
            who: by,
            to: tag._id,
            createdAt: new Date(),
            seen: false,
            notified: false,
        }

        Meteor.call("tagUser", tagObj);
    }

    return true;

}

notification = function() {
    if (Meteor.userId()) {
        var n = Notifications.find({to: Meteor.userId(), seen: false}).fetch();
        Session.setPersistent("notes", n);
    }
}

notifying = function(newNoti) {
  if (newNoti && newNoti.notified == false) {
    Meteor.call("markAsNotified", newNoti);
    sAlert.info(newNoti.who + " tagged you in the group chat.");
  }
}

runFloorPlan = function(id) {
    var floorPlan = document.getElementById(id);
    var ctx = floorPlan.getContext("2d");
    ctx.scale(2, 2)
    ctx.beginPath();

    // east side of scc
    ctx.moveTo(15, 0);
    ctx.lineTo(15, 35);

    ctx.moveTo(15, 35);
    ctx.lineTo(50, 35);

    ctx.moveTo(50, 35);
    ctx.lineTo(50, 0);

    ctx.moveTo(27, 35);
    ctx.lineTo(37, 110);

    ctx.moveTo(20, 107);
    ctx.lineTo(37, 110);

    ctx.moveTo(15, 135);
    ctx.lineTo(20, 107);

    ctx.moveTo(25, 137);
    ctx.lineTo(1, 132);

    ctx.moveTo(25, 137);
    ctx.lineTo(10, 199); // end of east side of scc

    // south side of scc
    ctx.moveTo(105, 1);
    ctx.lineTo(140, 1);

    ctx.moveTo(140, 1);
    ctx.lineTo(142, 30);

    ctx.moveTo(142, 30);
    ctx.lineTo(152, 29);

    ctx.moveTo(152, 29);
    ctx.lineTo(150, 1);

    ctx.moveTo(205, 23);
    ctx.lineTo(260, 1);

    ctx.moveTo(245, 7);
    ctx.lineTo(272, 50);

    ctx.moveTo(268, 50);
    ctx.lineTo(325, 50);

    ctx.moveTo(268, 50);
    ctx.lineTo(268, 57);

    ctx.moveTo(268, 57);
    ctx.lineTo(325, 57);

    ctx.moveTo(208, 50); // column start
    ctx.lineTo(223, 50);

    ctx.moveTo(223, 50);
    ctx.lineTo(223, 57);

    ctx.moveTo(223, 57);
    ctx.lineTo(208, 57);

    ctx.moveTo(208, 57);
    ctx.lineTo(208, 50); // column end

    ctx.moveTo(325, 50);
    ctx.lineTo(325, 170);

    ctx.moveTo(325, 170);
    ctx.lineTo(208, 155);

    ctx.moveTo(208, 155);
    ctx.lineTo(210, 145);

    ctx.moveTo(210, 145);
    ctx.lineTo(158, 145);

    ctx.moveTo(158, 145);
    ctx.lineTo(85, 135);

    ctx.moveTo(85, 135);
    ctx.lineTo(82, 148);

    ctx.moveTo(82, 148);
    ctx.lineTo(92, 150);

    ctx.moveTo(92, 150);
    ctx.lineTo(80, 199);

    ctx.strokeStyle = '#3c3a3a';

    ctx.stroke();
}
