Router.configure({
    layoutTemplate: 'layout',
    waitOn: function() {
      return Meteor.subscribe("theUsers");
    },
    loadingTemplate: 'loading',
});

Router.route('/', {
    name: 'home',
    waitOn: function() {
      if (Meteor.userId()) {
        return Meteor.subscribe("theUsers");
      }
    },
    onAfterAction: function() {
      $(".css-link-slide-nav").animate({ "left": "-=100%" }, "fast");
      $(".css-link-slide-nav-container").fadeOut("slow");
      $("body").removeClass("css-map-background");
      if (Session.get("newLogin")) {
        onLoginFunction();
      }
      Session.setPersistent("newLogin", false);
    },
});

Router.route('/admin', {
    name: 'admin',
    onAfterAction: function() {
      $(".css-link-slide-nav").animate({ "left": "-=100%" }, "fast");
      $(".css-link-slide-nav-container").fadeOut("slow");
      $("body").removeClass("css-map-background");
    },
});

Router.route('/lost&found', {
    name: 'lost',
    onAfterAction: function() {
      $(".css-link-slide-nav").animate({ "left": "-=100%" }, "fast");
      $(".css-link-slide-nav-container").fadeOut("slow");
      $("body").removeClass("css-map-background");
    },
});

Router.route('/cctlogin', {
    name: 'login',
});

Router.route('/reservations', {
    name: 'reservations',
    onAfterAction: function() {
      $(".css-link-slide-nav").animate({ "left": "-=100%" }, "fast");
      $(".css-link-slide-nav-container").fadeOut("slow");
      $("body").removeClass("css-map-background");
    },
    waitOn: function() {
      return Meteor.subscribe("theUsers"), Meteor.subscribe("archive");
    },
    loadingTemplate: 'loading',
});

Router.route('/deisbikes2.0', {
    name: 'bikes',
    onAfterAction: function() {
      $(".css-link-slide-nav").animate({ "left": "-=100%" }, "fast");
      $(".css-link-slide-nav-container").fadeOut("slow");
      $("body").removeClass("css-map-background");
    },
});

Router.route('/infobooth', {
    name: 'info',
    onAfterAction: function() {
      $(".css-link-slide-nav").animate({ "left": "-=100%" }, "fast");
      $(".css-link-slide-nav-container").fadeOut("slow");
      $("body").removeClass("css-map-background");
    },
});

Router.route('/overview', {
    name: 'overview',
    onAfterAction: function() {
      $(".css-link-slide-nav").animate({ "left": "-=100%" }, "fast");
      $(".css-link-slide-nav-container").fadeOut("slow");
      $("body").removeClass("css-map-background");
    },
});

Router.route('/gameroom', {
    name: 'game',
    onAfterAction: function() {
      $(".css-link-slide-nav").animate({ "left": "-=100%" }, "fast");
      $(".css-link-slide-nav-container").fadeOut("slow");
      $("body").removeClass("css-map-background");
    },
});

Router.route('/reset', {
    name: 'reset',
    onAfterAction: function() {
      $(".css-link-slide-nav").animate({ "left": "-=100%" }, "fast");
      $(".css-link-slide-nav-container").fadeOut("slow");
      $("body").removeClass("css-map-background");
    },
    waitOn: function() {
      return Meteor.subscribe("theUsers"), Meteor.subscribe("resets");
    },
});

Router.route('/department', {
    name: 'department',
    onAfterAction: function() {
      $(".css-link-slide-nav").animate({ "left": "-=100%" }, "fast");
      $(".css-link-slide-nav-container").fadeOut("slow");
      $("body").removeClass("css-map-background");
    },
});

Router.route('/map', {
    name: 'map',
    onAfterAction: function() {
      $(".css-link-slide-nav").animate({ "left": "-=100%" }, "fast");
      $(".css-link-slide-nav-container").fadeOut("slow");
      $("body").addClass("css-map-background");
    },
});

Router.route('/posterpolicy', {
    name: 'posters',
    onAfterAction: function() {
      $(".css-link-slide-nav").animate({ "left": "-=100%" }, "fast");
      $(".css-link-slide-nav-container").fadeOut("slow");
      $("body").addClass("css-map-background");
    },
});

Router.route('/profile', {
    name: 'profile',
    onAfterAction: function() {
      $(".css-link-slide-nav").animate({ "left": "-=100%" }, "fast");
      $(".css-link-slide-nav-container").fadeOut("slow");
      $("body").removeClass("css-map-background");
    },
});

Router.route('/team', {
    name: 'team',
    onAfterAction: function() {
      $(".css-link-slide-nav").animate({ "left": "-=100%" }, "fast");
      $(".css-link-slide-nav-container").fadeOut("slow");
      $("body").removeClass("css-map-background");
    },
});

Router.route('/schedule', {
    name: 'schedule',
    onAfterAction: function() {
      $(".css-link-slide-nav").animate({ "left": "-=100%" }, "fast");
      $(".css-link-slide-nav-container").fadeOut("slow");
      $("body").removeClass("css-map-background");
    },
});

var requireLogin = function() {
    // if the user is not logged in...
    if (!Meteor.userId()) {
        // ...render the home template in order to login
        this.render('login');
    } else {
        // otherwise continue
        this.next();
    }
};

Router.onBeforeAction(requireLogin, {
    // the only pages that don't require logged in user are:
    except: ['login', 'home', 'lost', 'reservations', 'bikes', 'posters', 'department']
});
