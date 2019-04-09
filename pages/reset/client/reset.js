Template.reset.helpers({
    currentView: function(view) {
        return Session.get("currentView") && view === Session.get("currentView") ? 'css-calendar-highlight' : 'css-calender-other';
    },
});

Template.reset.events({
    "click .css-reset-table": function(event) {
        event.preventDefault();

        console.log($(this).attr("title"));
    },
    "click .css-reset-table": function(event) {
        event.preventDefault();

        $('#resetTable').modal('show');
    },
    "click .css-reset-view-floorplan": function(event) {
        event.preventDefault();

        $('#sccFloorPlan').modal('show');
    },
    "click .js-reset-room-reserv": function(event) {
        event.preventDefault();

        const type = $(".js-reset-type").val();
        var eventName = $(".js-reset-event").val();
        const location = $(".js-reset-location").val();
        var start = $(".js-reset-from").val();
        var end = $(".js-reset-until").val();
        var notes = $(".js-reset-notes").val();

        if (eventName.length == 0) {
            sAlert.error("What's the name of the event?");
            return;
        }

        if (notes.length == 0) {
            notes = null;
        }


        const roomObj = {
            type: type,
            event: eventName,
            location: location,
            start: start,
            end: end,
            notes: notes,
        }

        Meteor.call("roomReserv", roomObj);

        $(".js-reset-type").val("");
        $(".js-reset-event").val("");
        $(".js-reset-location").val("");
        $(".js-reset-from").val("");
        $(".js-reset-until").val("");
        $(".js-reset-notes").val("");
    },
});

Template.reset.onRendered(function(event, template) {
    $('[data-toggle="tooltip"]').tooltip(); // {"trigger": "click"}
    Session.set("currentView", "month");
    var resets = ResetCalendar.find({}).fetch();
    var admin = false;
    if (Meteor.userId()) {
        admin = Meteor.users.findOne({
            _id: Meteor.userId()
        }).admin;
    }
    this.autorun(function(event, template) {
        $('#reset-calendar').fullCalendar({
            dayClick: function(date) {
                const xDate = date.format();
                const minDate = moment().format("YYYY-MM-DD");
                const minDateAfter = moment().add(1, 'days').format("YYYY-MM-DD");
                // console.log(xDate + " " + minDate);
                if (admin) {
                    if (xDate === minDateAfter || xDate === minDate || date > moment(new Date())) {
                        Session.set("resetInfo", undefined);
                        // Session.set("theDate", date);
                        $('#reset').modal('show');
                        $(function() {
                            $('#datetimepickerResetFrom').datetimepicker({
                                minDate: new Date()
                            });
                        });
                        $(function() {
                            $('#datetimepickerResetFrom').val(moment(date).format("MM/DD/YYYY h:mm A"));
                        });
                        $(function() {
                            $('#datetimepickerResetUntil').datetimepicker({
                                minDate: new Date()
                            });
                        });
                        $(function() {
                            $('#datetimepickerResetUntil').val(moment(date).format("MM/DD/YYYY h:mm A"));
                        });
                    } else {
                        sAlert.error("Let the past stay in the past.");
                    }
                }
            },
            eventClick: function(calEvent, jsEvent, view) {
                if (admin) {
                    var dT = moment(calEvent.start).format("MM/DD/YYYY h:mm a").split(" ");
                    const departTime = moment(dT[0]).format('dddd') + " at " + dT[1] + dT[2];

                    var rT = moment(calEvent.end).format("MM/DD/YYYY h:mm a").split(" ");
                    const returnTime = moment(rT[0]).format('dddd') + " at " + rT[1] + rT[2];

                    const resetObj = {
                        title: calEvent.title,
                        start: departTime,
                        end: returnTime,
                        _id: calEvent._id,
                        cell: calEvent.cell,
                        email: calEvent.email,
                        individual: calEvent.individual,
                        notes: calEvent.notes,
                        date: calEvent.date,
                        organization: calEvent.organization,
                    }

                    Session.set("resetInfo", resetObj);
                    $('#resetInfo').modal('show');
                }
            },
            header: {
                left: '',
                center: 'title',
                right: ''
            },
            events: _.map(resets, function(x) {

                const z = {
                    resetTeam: x.team,
                    start: new Date(x.from),
                    end: new Date(x.until),
                    _id: x._id,
                    where: x.where,
                    notes: x.notes,
                    date: x.date,
                    organization: x.organization,
                };

                return z;
            }),
            height: 500,

        });

    }); // this

    var floorPlan = document.getElementById("sccAtriumPlan");
    var ctx = floorPlan.getContext("2d");
    ctx.scale(2, 2)
    ctx.beginPath();

    // east side of scc
    ctx.moveTo(15, 0);
    ctx.lineTo(15, 35);

    ctx.moveTo(15, 35);
    ctx.lineTo(50, 35);

    ctx.moveTo(50, 35);
    ctx.lineTo(50, 0);

    ctx.moveTo(27, 35);
    ctx.lineTo(37, 110);

    ctx.moveTo(20, 107);
    ctx.lineTo(37, 110);

    ctx.moveTo(15, 135);
    ctx.lineTo(20, 107);

    ctx.moveTo(25, 137);
    ctx.lineTo(1, 132);

    ctx.moveTo(25, 137);
    ctx.lineTo(10, 199); // end of east side of scc

    // south side of scc
    ctx.moveTo(105, 1);
    ctx.lineTo(140, 1);

    ctx.moveTo(140, 1);
    ctx.lineTo(142, 30);

    ctx.moveTo(142, 30);
    ctx.lineTo(152, 29);

    ctx.moveTo(152, 29);
    ctx.lineTo(150, 1);

    ctx.moveTo(205, 23);
    ctx.lineTo(260, 1);

    ctx.moveTo(245, 7);
    ctx.lineTo(272, 50);

    ctx.moveTo(268, 50);
    ctx.lineTo(325, 50);

    ctx.moveTo(268, 50);
    ctx.lineTo(268, 57);

    ctx.moveTo(268, 57);
    ctx.lineTo(325, 57);

    ctx.moveTo(208, 50); // column start
    ctx.lineTo(223, 50);

    ctx.moveTo(223, 50);
    ctx.lineTo(223, 57);

    ctx.moveTo(223, 57);
    ctx.lineTo(208, 57);

    ctx.moveTo(208, 57);
    ctx.lineTo(208, 50); // column end

    ctx.moveTo(325, 50);
    ctx.lineTo(325, 170);

    ctx.moveTo(325, 170);
    ctx.lineTo(208, 155);

    ctx.moveTo(208, 155);
    ctx.lineTo(210, 145);

    ctx.moveTo(210, 145);
    ctx.lineTo(158, 145);

    ctx.moveTo(158, 145);
    ctx.lineTo(85, 135);

    ctx.moveTo(85, 135);
    ctx.lineTo(82, 148);

    ctx.moveTo(82, 148);
    ctx.lineTo(92, 150);

    ctx.moveTo(92, 150);
    ctx.lineTo(80, 199);

    ctx.strokeStyle = '#3c3a3a';

    ctx.stroke();

});

// $(window).resize(function() {
//     if ($(window).width() > 767) {
//         $(".css-link-slide-nav").animate({
//             "left": "-=100%"
//         }, "fast");
//         $(".css-link-slide-nav-container").fadeOut("slow");
//     }
// });
