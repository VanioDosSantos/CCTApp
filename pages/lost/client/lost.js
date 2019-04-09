Template.lost.helpers({
    lostAndFoundResults: function() {
        var allItems = LostAndFound.find({}).fetch();
        var searchTerm = Template.instance().searchInput.get();

        if (searchTerm != undefined) {
            var matches = _.filter(allItems, function(item) {
                if (itemMatch(item.item, item.description, searchTerm) === true && item.claimed === false) {
                    return item;
                }
            });

            return matches;
        } else {
            return false;
        }

    },
    today: function(template) {
        var today = moment().format('dddd');
        if (today == "Monday" || today == "Tuesday" || today == "Wednesday" || today == "Thursday") {
            today = "Weekday";
        }
        return today && template === today ? 'css-today' : '';
    },
});

Template.lost.events({
    "click .js-lost-found": function(event) {
        event.preventDefault();

        Meteor.call("lostItemFound", this);
        // cct@lists
        Meteor.call("sendEmail", this.email, "vanio.brandeis.edu", "Campus Center Team: We've found something that belongs to you.", emailText(this.name));
    },
    "submit .js-lost-search": function(event, template) {
        event.preventDefault();

        const searchInput = $(".js-lost-search-input").val();

        if (searchInput.length <= 0) {
            if (Meteor.userId) {
                var username = Meteor.users.find({
                    _id: Meteor.userId()
                }).fetch()[0].profile.first;
                sAlert.error("Uhmm... You gotta type something first... " + username, {
                    position: 'bottom',
                    effect: 'flip'
                });
            } else {
                sAlert.error("Try typing something first.");
            }
        } else {
            template.searchInput.set(searchInput);
            $(".js-lost-search-input").val("");
        }
    },
    "click .js-lost-claimed": function(event) {
        event.preventDefault();

        // console.log(this._id);

        Meteor.call("lostFoundEntryUpdate", this);
    },
});

Template.newLost.events({
    "change .js-lost-status": function(event) {
        event.preventDefault();

        if ($(".js-lost-status").val() == "Found") {
            $(".js-lost-name").prop("disabled", true);
            $(".js-lost-email").prop("disabled", true);
        } else {
            $(".js-lost-name").prop("disabled", false);
            $(".js-lost-email").prop("disabled", false);
        }
    },
    "click .js-lost-archive": function(event) {
        event.preventDefault();

        const status = $(".js-lost-status").val();
        var entry = {};

        if (status == "Found") {
            const name = null;
            const email = null;
            var item = $(".js-lost-item").val();
            const storage = $(".js-lost-storage").val();
            var description = $(".js-lost-description").val();

            entry = {
                status: status,
                item: item,
                email: email,
                name: name,
                storage: storage,
                description: description,
                createdAt: moment().format("MMMM Do YYYY"),
                claimed: false
            };

        } else {
            const name = $(".js-lost-name").val();
            const email = $(".js-lost-email").val();
            var item = $(".js-lost-item").val();
            const storage = $(".js-lost-storage").val();
            var description = $(".js-lost-description").val();

            entry = {
                status: status,
                item: capitalizeString(item),
                email: email,
                name: name,
                storage: storage,
                description: capitalizeString(description),
                createdAt: moment().format("MMMM Do YYYY"),
                found: false,
                claimed: false
            };
        }

        Meteor.call("lostFoundEntry", entry);
        sAlert.success("Done! " + item + " archived.", {
            position: 'top-right',
            effect: 'flip'
        });

        $('.modal').modal('hide');

        $(".js-lost-status").prop('selectedIndex', 0);
        $(".js-lost-name").val("");
        $(".js-lost-email").val("");
        $(".js-lost-item").val("");
        $(".js-lost-storage").prop('selectedIndex', 0);
        $(".js-lost-description").val("");
    },
    "click .js-lost-close": function(event) {
        event.preventDefault();

        $(".js-lost-status").prop('selectedIndex', 0);
        $(".js-lost-name").val("");
        $(".js-lost-email").val("");
        $(".js-lost-item").val("");
        $(".js-lost-storage").prop('selectedIndex', 0);
        $(".js-lost-description").val("");
    },
});

Template.lost.onCreated(function() {
    this.searchInput = new ReactiveVar();
});

Template.registerHelper('equals', function(a, b) {
    return a === b;
});

Template.registerHelper('is', function(a) {
    return a == false;
});
