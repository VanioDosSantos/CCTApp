Template.home.helpers({
    today: function(template) {
        var today = moment().format('dddd');
        if (today == "Monday" || today == "Tuesday" || today == "Wednesday" || today == "Thursday") {
            today = "Weekday";
        }
        return today && template === today ? 'css-today' : '';
    },
    todayDate: function() {
        return moment().format("dddd, MMM Do YY");
    },
    admin: function() {
        if (Meteor.userId()) {
          return Meteor.users.findOne({
              _id: Meteor.userId()
          }).admin;
        }
    },
    sccEvent: function() {
        var allEvents = SCCEvents.find({
            date: moment().format("MM/DD/YYYY")
        }).fetch();

        if (allEvents.length > 0) {
            return allEvents;
        } else {
            return false;
        }

    },
});

Template.home.events({
    "click #nextBtn": function(event) {
        event.preventDefault();

        next(x);
    },
    "click #prevBtn": function(event) {
        event.preventDefault();

        prev();
    },
    "click .js-new-event": function(event) {
        event.preventDefault();

        $('#newEvent').modal('show');
    },
    "click .css-more-arrow": function(event) {
      event.preventDefault();

      $('body').stop().animate({
          scrollTop: 500
      }, 500);
      console.log("hello");

    },
});

Template.homeEvent.events({
    "click .js-add-new-event": function(event) {
        event.preventDefault();

        const name = $(".js-event-name").val();
        const room = $(".js-event-room").val();
        const time = $(".js-event-time").val();

        const eventObj = {
            event: name,
            room: room,
            time: time,
            date: moment().add(1, 'days').format("MM/DD/YYYY"),
        }
        console.log(eventObj);

        Meteor.call("newSCCEvent", eventObj);
    },
});

Template.home.onRendered(function() {
    Session.setPersistent("current", 1);
    Session.setPersistent("next", 2);

    $("#slider #2").hide();
    $("#slider #3").hide();
    $("#slider #1").fadeIn(500);

    $(".css-more-arrow").animate({"top": "+=25px"}, "slow");
    $(".css-more-arrow").animate({"top": "-=25px"}, "slow");
});

x = Meteor.setInterval(function() {
    if (Session.get("next") == 4) {
        Session.setPersistent("next", 1);
        Session.setPersistent("current", 3);
    }

    $("#slider div").fadeOut(800);
    $("#slider #" + Session.get("next")).fadeIn(700);

    Session.setPersistent("current", Session.get("next"));
    Session.setPersistent("next", Session.get("next") + 1);
}, 7000);

y = Meteor.setInterval(function() {
    $(".css-more-arrow").animate({"top": "+=25px"}, "slow");
    $(".css-more-arrow").animate({"top": "-=25px"}, "slow");
}, 3000);
