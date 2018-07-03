// Initialize Firebase
// Initialize Firebase
var config = {
    apiKey: "AIzaSyCc7HhElENec2P2oDr-n2EixiB1sdaQqrw",
    authDomain: "train-time-8956d.firebaseapp.com",
    databaseURL: "https://train-time-8956d.firebaseio.com",
    projectId: "train-time-8956d",
    storageBucket: "train-time-8956d.appspot.com",
    messagingSenderId: "728598995156"
};
firebase.initializeApp(config);

var dataRef = firebase.database();

var name = "";
var destination = "";
var strtime = "";
var frequency = 0;

//  var startTime = moment('0900', 'hmm').format("HH:mm")
//  var endTime = moment('1700', 'hmm').format("HH:mm")

//storing new train input to vars 

function userSubmit() {
    $("#add").on("click", function (event) {
        event.preventDefault();


        name = $("#name-input").val().trim();
        console.log("length = " + name.length);
        destination = $("#destination").val().trim();
        //  console.log(destination)
        strtime = $("#strtime").val().trim();
        //  console.log(strtime)
        frequency = $("#frequency").val().trim();
        //  console.log(frequency)
        console.log(strtime.length, strtime.indexOf(":"));

//included the following for validation on first arrival format, make sure that the user entered a valid time
        if (strtime.length == 5 && strtime.indexOf(":") == 2 && parseInt(strtime[0] + strtime[1]) < 24 && parseInt(strtime[3] + strtime[4]) <60){

            var newRow = {
                name: name,
                destination: destination,
                strtime: strtime,
                frequency: frequency
            };

            dataRef.ref().push(newRow);

            console.log(newRow.name, newRow.destination, newRow.strtime, newRow.frequency);

            $("#name-input").val("");
            $("#destination").val("");
            $("#strtime").val("");
            $("#frequency").val("");

        }

        else {
            $("#name-input").val("");
            $("#destination").val("");
            $("#strtime").val("Please Enter in HH:mm Format!");
            $("#frequency").val("");

        };
        //clear the form of the values if it doesn't already




    });


};

function addStuff() {
    dataRef.ref().on("child_added", function (childSnapshot) {
        addTrain = childSnapshot.val().name;
        addDestination = childSnapshot.val().destination;
        addStrTime = childSnapshot.val().strtime;
        addFreq = childSnapshot.val().frequency;

        console.log(addTrain, addDestination, addStrTime, addFreq);

        //find the first train, push it back 24 hours CORRECTION 1 YEAR  so we can do operations on it, for some reason Math.abs() didn't work. had to set it back 1 year for the math to work out
        var convTime = moment(addStrTime, 'HH:mm').subtract(1, 'years');

        console.log("first train = " + convTime);

        var diffTime = moment().diff(moment(convTime), "minutes");


        console.log("time diff = " + diffTime);

        var remTime = diffTime % addFreq;

        // var  remTime = diffTime % addFreq;

        console.log("remaining time = " + remTime);

        var minTilNext = addFreq - remTime;

        console.log("min til next train = " + minTilNext);

        var nxtTrain = moment().add(minTilNext, "minutes");

        console.log("Arrival time: " + moment(nxtTrain).format("HH:mm a"));


        $("#allMyTrains").children('tbody').append("<tr><td>" + addTrain + "</td><td>" + addDestination + "</td><td>" + addFreq + "</td><td>" + moment(nxtTrain).format("h:mm A") + "</td><td>" + minTilNext + "</td></tr>");

    });
};

$(document).ready(function () {
    userSubmit();
    addStuff();
});

//appending the DB to the table in the html
