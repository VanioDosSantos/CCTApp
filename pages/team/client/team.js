Template.team.helpers({
    teamInfo: function() {
      return Information.find({}).fetch();
    },
});

Template.team.events({

});
