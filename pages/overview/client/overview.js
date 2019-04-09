Template.overview.helpers({
    problem: function() {

        var issues = Issues.find({solved: false}).fetch();

        if(issues.length == 0) {
          return false;
        } else {
          var problems = _.map(issues, function(x) {
            x.time = moment(x.createdAt).fromNow();
            return x;
          });

          return problems;
        }

    },
});

Template.overview.events({
    "click .js-problem-solved": function(event) {
      event.preventDefault();

      Meteor.call("problemSolved", this);
    },
});
