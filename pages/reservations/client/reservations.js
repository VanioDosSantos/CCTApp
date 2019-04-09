Template.reservations.helpers({
    currentView: function(view) {
        return Session.get("currentView") && view === Session.get("currentView") ? 'css-calendar-highlight' : 'css-calender-other';
    },
    reserve: function() {

        var equipmentList = Equipment.find({}).fetch();
        var reservationList = EquipmentArchive.find({date: moment().format("MM/DD/YYYY"), complete: false}).fetch();

        for (j = 0; j < equipmentList.length; j++) {
            for (i = 0; i < reservationList.length; i++) {
              if (equipmentList[j].equipment == reservationList[i].equipment) {
                // console.log(reservationList[i]);
                Meteor.call("todayNextReserve", equipmentList[j].equipment, true);
              }
            }
        }

        return Equipment.find({}).fetch();
    },
});

Template.newReservation.helpers({
    reservable: function() {
        return Equipment.find({}).fetch();
    },
    // theDate: function() {
    //     var theDate = moment(Session.get("theDate")).format("MM/DD/YYYY h:mm A");
    //     return theDate;
    // },
});

Template.reserveInfo.helpers({
    reserve: function() {
        return Session.get("info");
    },
});

Template.reservations.events({
    "click .css-calendar-prev": function(event) {
        event.preventDefault();

        $('#calendar').fullCalendar('prev');
    },
    "click .css-calendar-next": function(event) {
        event.preventDefault();

        $('#calendar').fullCalendar('next');
    },
    "click .css-week-view": function(event) {
        event.preventDefault();

        Session.set("currentView", "week");
        $('#calendar').fullCalendar('changeView', 'agendaWeek');
    },
    "click .css-month-view": function(event) {
        event.preventDefault();

        Session.set("currentView", "month");
        $('#calendar').fullCalendar('changeView', 'month');
    },
    "click .js-equip-pickup": function(event) {
        event.preventDefault();

        var reservations = EquipmentArchive.find({
            equipment: this.equipment, complete: false
        }).fetch();

        if (reservations.length == 0) {
            sAlert.error("The " + this.equipment + " has no reservations.");
            return;
        }

        var pickingUp = _.map(reservations, function(x) {
            x.distance = moment().diff(x.until, 'minutes');
            return x;
        });

        pickingUp = _.filter(pickingUp, function(x) {
            // console.log(x.distance);
            // console.log(x.distance > 1441);
            return x.distance < 1441; // 1441 about a day (24hours) // && x.distance > -15
        });

        pickingUp = _.max(pickingUp, function(x) {
            return x.distance;
        });

        // console.log(pickingUp);

        Meteor.call("equipmentPickup", pickingUp);
    },
    "click .js-equip-return": function(event) {
        event.preventDefault();

        var reservations = EquipmentArchive.find({
            equipment: this.equipment, complete: false
        }).fetch();

        if (reservations.length == 0) {
            sAlert.error("The " + this.equipment + " wasn't reserved.");
            return;
        }
        // the probem is in this event somewhere, find it, fix it
        var returning = _.map(reservations, function(x) {
            x.distance = moment().diff(x.until, 'minutes');
            return x;
        });

        returning = _.filter(returning, function(x) {
            return x.distance <= 1441; // 1441 about a day (24hours)
        });

        returning = _.max(returning, function(x) {
            return x.distance;
        });

        // console.log(returning);

        Meteor.call("equipmentReturn", returning);
        Meteor.call("todayNextReserve", this.equipment, false);
    },
    "click .css-status": function(event) {
      event.preventDefault();

      $(this).tooltip("show");
    },
});

Template.newReservation.events({
    "click .js-reserv": function(event) {
        event.preventDefault();

        const reserv = $(".js-equip-reserv").val();
        var name = $(".js-reserv-name").val();
        var org = $(".js-reserv-org").val();
        const email = $(".js-reserv-email").val();
        const cell = $(".js-reserv-cell").val();
        const from = $(".js-reserv-from").val();
        const until = $(".js-reserv-until").val();

        org = org.toUpperCase();
        name = capitalizeString(name);

        if (!email.includes("@brandeis.edu") || email.length <= 13) {
            sAlert.error("Brandeis email..?");
            return;
        }
        if (name == "" || org == "" || cell == "") {
            sAlert.error("You're missing somehting");
            return;
        }
        if (moment(from).diff(until) == 0) {
            sAlert.error("Fix your reservation times.");
        }

        var date = from.split(" ");

        var conflict = checkForConflict(reserv, date[0], from, until);

        if (conflict == true) {
            sAlert.error("Reservation conflict");
            return;
        }

        const reservation = {
            equipment: reserv,
            organization: org,
            email: email,
            cell: cell,
            from: from,
            date: date[0],
            until: until,
            notes: null,
            individual: name,
            complete: false,
        };

        // var rT = until.split(" ");
        // const returnTime = moment(rT[0]).format('dddd') + " at " + rT[1] + "" + rT[2];
        // const r = Equipment.findOne({equipment: reserv});
        // Meteor.call("equipmentReserve", r, from, until, returnTime);

        Meteor.call("archiveReservation", reservation);
        Session.set("updateReservationTable", reservation);

        $(".js-equip-reserv").prop('selectedIndex', 0);
        $(".js-reserv-name").val("");
        $(".js-reserv-org").val("");
        $(".js-reserv-email").val("");
        $(".js-reserv-cell").val("");
        $(".js-reserv-from").val("");
        $(".js-reserv-until").val("");

        $('#reservation').modal('hide');

        reservation.start = new Date(reservation.from);
        reservation.end = new Date(reservation.until);
        reservation.title = reservation.equipment;

        $('#calendar').fullCalendar('renderEvent', reservation, 'stick');
        sAlert.success(reserv + " reservation successful.");
    },
});

Template.reservations.onRendered(function(event, template) {
    $('[data-toggle="tooltip"]').tooltip(); // {"trigger": "click"}
    Session.set("currentView", "month");
    var equipment = EquipmentArchive.find({}).fetch();
    var admin = false;
    if (Meteor.userId()) {
        admin = Meteor.users.findOne({_id: Meteor.userId()}).admin;
    }
    this.autorun(function(event, template) {
        $('#calendar').fullCalendar({
            dayClick: function(date) {
                const xDate = date.format();
                const minDate = moment().format("YYYY-MM-DD");
                const minDateAfter = moment().add(1, 'days').format("YYYY-MM-DD");
                // console.log(xDate + " " + minDate);
                if (admin) {
                    if (xDate === minDateAfter || xDate === minDate || date > moment(new Date())) {
                        Session.set("info", undefined);
                        // Session.set("theDate", date);
                        $('#reservation').modal('show');
                        $(function() {
                            $('#datetimepickerFrom').datetimepicker({
                                minDate: new Date()
                            });
                        });
                        $(function() {
                            $('#datetimepickerFrom').val(moment(date).format("MM/DD/YYYY h:mm A"));
                        });
                        $(function() {
                            $('#datetimepickerUntil').datetimepicker({
                                minDate: new Date()
                            });
                        });
                        $(function() {
                            $('#datetimepickerUntil').val(moment(date).format("MM/DD/YYYY h:mm A"));
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

                    const infoObj = {
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

                    Session.set("info", infoObj);
                    $('#reserveInfo').modal('show');
                }
            },
            header: {
                left: '',
                center: 'title',
                right: ''
            },
            events: _.map(equipment, function(x) {

                const z = {
                    title: x.equipment,
                    start: new Date(x.from),
                    end: new Date(x.until),
                    _id: x._id,
                    cell: x.cell,
                    email: x.email,
                    individual: x.individual,
                    notes: x.notes,
                    date: x.date,
                    organization: x.organization,
                };

                return z;
            }),
            height: 500,

        });

    }); // this
});
