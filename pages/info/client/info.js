// import '../pages/sidepanel.html';
// import { sidepanel } from 'pages/sidepanel.html';

Template.info.helpers({
    thread: function() {
        var threads = InfoBoothNotes.find({createdAt: {$gte : moment().subtract(2, "days").toDate() }}).fetch();

        threads = _.map(threads, function(thread) {
            thread.timeStamp = moment(thread.createdAt).fromNow();
            if (thread.user == Meteor.userId()) {
              thread.username = "me"
            }
            return thread;
        });

        if (threads.length == 0) {
            return false;
        } else {
            return threads;
        }
    },
    mine: function() {
        return Meteor.userId();
    },
    today: function(template) {
        var today = moment().format('dddd');
        if (today == "Monday" || today == "Tuesday" || today == "Wednesday" || today == "Thursday") {
            today = "Weekday";
        }
        return today && template === today ? 'css-today' : '';
    },
    solvedIssue: function() {
        var solvedOnes = Issues.find({solved: true}).fetch();

        solvedOnes = _.map(solvedOnes, function(x) {
            var d = moment(x.solvedDate).format("MM/DD/YYYY");
            x.recent = moment().diff(d, "days");
            return x;
        });

        solvedOnes = _.filter(solvedOnes, function(x) {
            return x.recent < 3;
        });

        if (solvedOnes.length > 0) {
            return solvedOnes;
        } else {
            return false;
        }

    },
    auxiliary: function() {
      var loans = BoothLoans.find({returned: false}).fetch();
      if (loans.length == 0) {
        return false;
      } else {
        return BoothLoans.find({returned: false});
      }
    },
});

Template.info.events({
    "submit .js-info-chat": function(event) {
        event.preventDefault();

        const text = $(".js-info-chat-thread").val();

        if (text.length == 0) {
            sAlert.error("So... you have nothing to say?");
            return;
        }

        if (text.includes("@")) {
            if (atSomeone(text) == false) {
              return;
            }
        }

        const thread = {
            username: Meteor.users.find({
                _id: Meteor.userId()
            }).fetch()[0].profile.first,
            user: Meteor.userId(),
            text: text,
            createdAt: new Date(),
            timeStamp: moment().format("hh:mm A"),
        }

        Meteor.call("infoSend", thread);

        if ($('.css-info-chat') != undefined || $('.css-info-chat').length > 0) {
            $('.css-info-chat').stop().animate({
                scrollTop: $('.css-info-chat')[0].scrollHeight
            }, 500);
        }

        sAlert.success("Sent!");
        $(".js-info-chat-thread").val("");
    },
    "submit .js-info-problem-report": function(event) {
        event.preventDefault();

        const by = Meteor.users.findOne({
            _id: Meteor.userId()
        }).profile.first;
        const text = $(".js-info-problem").val();
        const category = $(".js-info-problem-category").val();

        if (by == "Johnny") {
            sAlert.warning("Uhm.. Are you ok?");
            // return;
        }

        const hex = categoryHex(category);

        const problem = {
            text: text,
            createdAt: new Date(),
            by: by,
            category: category,
            hex: hex,
            date: moment().format("MM/DD/YYYY"),
            solved: false,
            solvedDate: undefined,
        }

        // console.log(problem);

        Meteor.call("infoProblem", problem);
        sAlert.success("Now its all up to Johnny");

        $(".js-info-problem").val("");
        $(".js-info-problem-category").prop('selectedIndex', 0);
    },
    "click .js-info-loan-log": function(event) {
      event.preventDefault();

      const student = $(".js-info-loan-user").val();
      const item = $(".js-info-loan-item").val();

      const loan = {
        student: student,
        when: new Date(),
        item: item,
        returned: false,
      }

      if (student.length == 0) {
        sAlert.error("Something is missing.");
        return;
      }

      Meteor.call("auxLoan", loan);

      sAlert.success("Finito!");
      $(".js-info-loan-user").val("");
      $(".js-info-loan-item").val("");
    },
    "click .js-info-loan-return": function(event) {
      event.preventDefault();

      Meteor.call("loanReturn", this._id);
    },
    "dblclick .css-info-chat": function(event) {
      event.preventDefault();

      $('.css-info-chat').stop().animate({
          scrollTop: $('.css-info-chat')[0].scrollHeight
      }, 800);
    },
});

Template.info.onRendered(function() {
    $('.css-info-chat').stop().animate({
        scrollTop: $('.css-info-chat')[0].scrollHeight
    }, 800);
});

Template.registerHelper('equals', function(a, b) {
    return a === b;
});
