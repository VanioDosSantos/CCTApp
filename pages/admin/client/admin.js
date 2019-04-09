Template.admin.helpers({

});

Template.admin.events({
    "click .js-signup-btn": function(event) {
        event.preventDefault();

        var f = $(".js-signup-first").val();
        var l = $(".js-signup-last").val();
        var b = $(".js-signup-birth").val();
        const e = $(".js-signup-email").val();
        const p = $(".js-signup-password").val();
        const pc = $(".js-signup-password-check").val();
        var g = $(".js-signup-greet").val();
        var a = $(".js-signup-admin").val();
        var s = $(".js-signup-super").val();
        // var c = $(".js-signup-cell").val();

        f = capitalizeString(f);
        l = capitalizeString(l);
        g = capitalizeString(g);

        if (e.substring(e.length - 13) != "@brandeis.edu") {
            sAlert.error("Email must be @brandeis.edu", {
                position: 'top-right',
                effect: 'flip'
            });
            return;
        }

        if (p.length < 8) {
            sAlert.error("Password must be 8 characters or longer", {
                position: 'top-right',
                effect: 'flip'
            });
            return;
        }

        if (b.length != 5 || b[2] != '/') {
            sAlert.error("Birthday? Follow the format, MM/DD", {
                position: 'top-right',
                effect: 'flip'
            });
            $(".js-signup-birth").val("");
            return;
        }

        if (pc != p) {
          sAlert.error("Passwords do not match.");
          return;
        }

        if (a == "no") {
            a = false;
        } else if (a == "yes") {
            a = true;
        }

        if (s == "no") {
            s = false;
        } else if (s == "yes") {
            s = true;
        }

        const newUser = {
            admin: a,
            super: s,
            first: f,
            last: l,
            birth: b,
            greet: g,
            createdAt: moment().format("MMMM Do YYYY"),
            email: e,
            password: p,
            justCreated: true,
            fuzzyId: Random.id(),
            cell: undefined,
            notifications: [],
        }

        // Meteor.call("newSignUp", newUser);

        Accounts.createUser(newUser, function(error) {
            if (error) {
                console.log(error.reason);
                return;
            } else {
                sAlert.success("Done! " + f + "'s account created.", {
                    position: 'top-right',
                    effect: 'flip'
                });
            }
        });

        const infoObj = {
          cct: newUser.first + " " + newUser.last,
          cell: null,
          member: Random.id(),
          email: newUser.email,
          crew: newUser.crew,
        }

        Meteor.call("addInfo", infoObj);

        const fuzzyObj = {
          fuzzyId: newUser.fuzzyId,
          first: newUser.first,
          last: newUser.last,
          birth: newUser.birth,
          fuzzies: [],
        }

        Meteor.call("createFuzzies", fuzzyObj);

        $(".js-signup-first").val("");
        $(".js-signup-last").val("");
        $(".js-signup-birth").val("");
        $(".js-signup-email").val("");
        $(".js-signup-password").val("");
        $(".js-signup-greet").val("");
        $(".js-signup-admin").prop('selectedIndex', 0);
        $(".js-signup-super").prop('selectedIndex', 0);
    },
    "submit .js-new-equip": function(event) {
        event.preventDefault();

        const name = $(".js-new-equip-name").val();

        if (name == "") {
            sAlert.error("What are you adding again?", {
                position: 'bottom-right',
                effect: 'flip'
            });
            return;
        }

        const newEquip = {
            equipment: name,
            status: "Available",
            hex: "#29DF72",
            condition: "good",
            returnTime: false,
            reservedToday: false,
        };

        Meteor.call("equipment", newEquip);
        sAlert.success("It's like magic", {
            position: 'bottom-right',
            effect: 'flip'
        });
    },
});
