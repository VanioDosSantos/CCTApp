Deps.autorun(function() {
    Meteor.subscribe("theUsers");
});

Meteor.subscribe("lostandfound");
Meteor.subscribe("equipment");
Meteor.subscribe("archive");
Meteor.subscribe("info");
Meteor.subscribe("game");
Meteor.subscribe("reset");
Meteor.subscribe("resets");
Meteor.subscribe("events");
Meteor.subscribe("issues");
Meteor.subscribe("gameslog");
Meteor.subscribe("loans");
Meteor.subscribe("fuzzies");
Meteor.subscribe("infos");
Meteor.subscribe("notif");

Template.layout.helpers({
    admin: function() {
        if (Meteor.userId()) {
            return Meteor.users.findOne({
                _id: Meteor.userId()
            }).admin;
        } else {
            return false;
        }
    },
    highlight: function(template) {
        var currentRoute = Router.current().route.getName();
        return currentRoute && template === currentRoute ? 'css-nav-highlight' : '';
    },
    sideNavHighlight: function(template) {
        var currentRoute = Router.current().route.getName();
        return currentRoute && template === currentRoute ? 'css-sidenav-highlight' : '';
    },
    inHomeRoute: function() {
        var currentRoute = Router.current().route.getName();
        if (currentRoute == "home" || currentRoute == "department" || currentRoute == "posters") {
            return true;
        }
        return false;
    },
    notification: function() {
        var n = Notifications.find({to: Meteor.userId(), seen: false}, {sort: {createdAt: -1}}).fetch();

        var unseen = undefined;
        if (n.length > 0) {
            var unseen = _.map(n, function(x) {
              if (x.text.length > 35) {
                x.textSample = x.text.substring(0, 35) + "...";
                return x;
              } else {
                x.textSample = x.text;
                return x;
              }
            });
            return unseen;
        } else {
            return false;
        }

    },
    notify: function() {
        var n = Notifications.find({to: Meteor.userId(), notified: false}, {sort: {createdAt: -1}}).fetch();

        if (n.length > 0) {
            var lastNoti = n[0];
            console.log(n);

            if (lastNoti.notified == false) {
              Meteor.call("markAsNotified", lastNoti);
              sAlert.info(lastNoti.who + " tagged you in the group chat.");
            }
        }


    },
    // scrollDown: function() {
    //     var x = InfoBoothNotes.find({}).fetch();
    //
    //     $('.css-info-chat').stop().animate({
    //         scrollTop: $('.css-info-chat')[0].scrollHeight
    //     }, 800);
    // },
    notificationNum: function() {
      var n = Notifications.find({to: Meteor.userId(), seen: false}).fetch();

      if (n) {
        return n.length;
      } else {
        return 0;
      }
    },
});

Template.layout.events({
    "click .js-logout": function(event) {
        event.preventDefault();

        Meteor.logout();
        Router.go("/");
    },
    "click .css-more": function(event) {
        event.preventDefault();

        $(".css-link-slide-nav-container").fadeIn("fast", function() {
            $(".css-link-slide-nav").animate({
                "left": "0%"
            }, "fast");
        });

    },
    "click .css-link-slide-nav-container": function(event) {
        event.preventDefault();

        $(".css-link-slide-nav").animate({
            "left": "-=100%"
        }, "fast");
        $(".css-link-slide-nav-container").fadeOut("slow");

    },
    "click .js-notification-seen" : function(event) {
      event.preventDefault();

      Meteor.call("notificationSeen", this);
    },
});

Meteor.startup(function() {

    // const adminUser = {
    //     admin: true,
    //     super: true,
    //     first: "Johnny",
    //     last: "Wilson",
    //     birth: "12/10",
    //     greeting: "Hello sir!",
    //     createdAt: moment().format("MMMM Do YYYY"),
    //     email: "jtwilson@brandeis.edu",
    //     password: "campusCenterTeam",
    //     justCreated: false,
    //     cell: "",
    //     fuzzyId: Random.id(),
    // }
    //
    // Accounts.createUser(adminUser, function(error) {
    //     if (error) {
    //         console.log(error.reason);
    //         return;
    //     }
    // });

});

$(window).resize(function() {
    if ($(window).width() > 767) {
        $(".css-link-slide-nav").animate({
            "left": "-=100%"
        }, "fast");
        $(".css-link-slide-nav-container").fadeOut("slow");
    }
});

// $(window).scroll(function() {
//     var currentRoute = Router.current().route.getName();
//     if ($(window)[0].scrollY > 125 && (currentRoute == "home" || currentRoute == "posters" || currentRoute == "department")) {
//         $(".css-nav").fadeOut("slow")
//     } else {
//       $(".css-nav").fadeIn("fast");
//     }
// });

window.onscroll = function (e) {
    if ($(window).scrollTop() > 770) {
        $(".css-nav-border-placeholder").addClass("css-nav-border");
    } else {
        $(".css-nav-border-placeholder").removeClass("css-nav-border");
    }
}
