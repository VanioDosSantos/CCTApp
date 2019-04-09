Template.game.helpers({
    today: function(template) {
        var today = moment().format('dddd');
        if (today == "Monday" || today == "Tuesday" || today == "Wednesday" || today == "Thursday") {
            today = "Weekday";
        }
        return today && template === today ? 'css-today' : '';
    },
    logSuggestion: function() {
        var term = Session.get("stringInput");

        if (term == "" || term == undefined) {
            return false;
        } else {
            term = term.toUpperCase();
            var logs = GameRoomLog.find({}).fetch();

            var suggestions = _.filter(logs, function(x) {
                var student = x.student.toUpperCase();
                return student.includes(term);
            });

            if (suggestions.length == 0) {
                return false;
            } else {
                suggestions = _.uniq(suggestions, function(x) {
                    return x.student;
                });
                return suggestions;
            }
        }
    },
    currentPlayin: function() {
      var playin = GameRoomLog.find({done: false}).fetch();

      return playin;
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
    thread: function() {
        var threads = InfoBoothNotes.find({createdAt: {$gte : moment().subtract(2, "days").toDate() }}).fetch();

        threads = _.map(threads, function(thread) {
            thread.timeStamp = moment(thread.createdAt).fromNow();
            return thread;
        });

        return threads;
    },
    mine: function() {
        return Meteor.userId();
    },
});

Template.game.events({
    "keyup .js-game-student-name": function(event) {
        event.preventDefault();

        var string = $(".js-game-student-name").val();
        $(".js-game-student-id").val("");
        Session.set("stringInput", string);
    },
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

        $('.css-info-chat').stop().animate({
            scrollTop: $('.css-info-chat')[0].scrollHeight
        }, 500);

        sAlert.success("Sent!");
        $(".js-info-chat-thread").val("");
    },
    "submit .js-game-new-entry": function(event) {
        event.preventDefault();

        const student = $(".js-game-student-name").val();
        const studentId = $(".js-game-student-id").val();
        const game = $(".js-game-game-select").val();

        if (!student.includes(" ")) {
            sAlert.error("It said 'Full name' right");
            return;
        }

        if (studentId.length < 15) { // 603305021504765
          sAlert.error("Missing numbers, use x if u cant read a digit");
          return;
        }

        const log = {
            student: student,
            studentId: studentId,
            game: game,
            date: new Date(),
            worker: Meteor.users.findOne({_id: Meteor.userId()}).profile.first,
            timeIn: moment().format("h:mm A"),
            timeOut: moment().add(1, 'hours').format("h:mm A"),
            actualTimeOut: undefined,
            done: false,
        }

        Meteor.call("logStudent", log);
        Session.set("stringInput", "");

        $(".js-game-student-name").val("");
        $(".js-game-student-id").val("");
        $(".js-game-game-select").prop('selectedIndex', 0);
        sAlert.success("Done!");
    },
    "click .css-suggestion-item": function(event) {
      event.preventDefault();

      $(".js-game-student-name").val(this.student);
      $(".js-game-student-id").val(this.studentId);

      Session.set("stringInput", "");
    },
    "click .js-game-finished": function(event) {
      event.preventDefault();

      Meteor.call("finishedPlayin", this);
    },
    "submit .js-info-problem-report": function(event) {
        event.preventDefault();

        const by = Meteor.users.findOne({
            _id: Meteor.userId()
        }).profile.first;
        const text = $(".js-info-problem").val();
        const category = $(".js-info-problem-category").val();

        if (by == "Johnny") {
            sAlert.warning("Uhm ok.. sent to Johnny");
            // return;
        }

        const hex = categoryHex(category);

        const problem = {
            text: text,
            createdAt: new Date(),
            by: by,
            category: category,
            hex: hex,
            date: moment().format("MM/DD/YYY"),
            solved: false,
            solvedDate: undefined,
        }

        console.log(problem);

        Meteor.call("infoProblem", problem);
        sAlert.success("Now its all up to Johnny");

        $(".js-info-problem").val("");
        $(".js-info-problem-category").prop('selectedIndex', 0);
    },
});

Template.game.onRendered(function() {
    $('.css-info-chat').stop().animate({
        scrollTop: $('.css-info-chat')[0].scrollHeight
    }, 800);
});

Template.game.onRendered(function() {
  Session.set("stringInput", "");
});
