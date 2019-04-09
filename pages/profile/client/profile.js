Template.profile.helpers({
    fuzzy: function() {
        var fuzz = WarmFuzzies.find({}).fetch();
        var mine = Meteor.users.findOne({
            _id: Meteor.userId()
        }).fuzzyId;

        fuzz = _.map(fuzz, function(x) {
            x.count = x.fuzzies.length;
            return x;
        });

        fuzz = _.filter(fuzz, function(x) {
          return x.fuzzyId != mine;
        });
        return fuzz;
    },
});

Template.profile.events({

});
