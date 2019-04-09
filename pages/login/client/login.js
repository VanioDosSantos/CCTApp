Template.login.helpers({

});

Template.login.events({
    "submit .js-login": function(event) {
        event.preventDefault();

        const e = $(".js-email").val();
        const p = $(".js-password").val();

        Meteor.loginWithPassword(e, p, function(error) {
            if (error) {
                event.preventDefault();
                $(".js-password").val("");
                sAlert.error(error.reason, {effect: 'flip'});
                sAlert.info("Art thou not CCT?", {position: 'bottom-right', effect: 'flip'});
                // console.log(error.reason);
                return;
            } else {
                Session.setPersistent("newLogin", true);
                Router.go("/");
                // notification();
                // greetUser();
                // sAlert.info("'What\'s gucci!", {position: 'bottom-right', effect: 'flip'});
            }
        });
    },
    // "click .secret": function() {
    //   const adminUser = {
    //       admin: true,
    //       super: true,
    //       first: "Johnny",
    //       last: "Wilson",
    //       birth: "12/10",
    //       greet: "Hello sir!",
    //       createdAt: moment().format("MMMM Do YYYY"),
    //       email: "jtwilson@brandeis.edu",
    //       password: "campusCenterTeam",
    //       fuzzyId: Random.id(),
    //       crew: "Boss",
    //       notifications: [],
    //       cell: "857-225-2367",
    //       justCreated: false,
    //   }
    //
    //   Accounts.createUser(adminUser, function(error) {
    //       if (error) {
    //           console.log(error.reason);
    //           return;
    //       }
    //   });
    //
    //   const infoObj = {
    //     cct: adminUser.first + " " + adminUser.last,
    //     cell: adminUser.cell,
    //     member: Random.id(),
    //     email: adminUser.email,
    //     crew: adminUser.crew,
    //   }
    //
    //   Meteor.call("addInfo", infoObj);
    //
    //
    //   const fuzzyObj = {
    //     fuzzyId: adminUser.fuzzyId,
    //     first: adminUser.first,
    //     last: adminUser.last,
    //     birth: adminUser.birth,
    //     fuzzies: [],
    //   }
    //   Meteor.call("createFuzzies", fuzzyObj);
    // },
});
