var matchNum = 0;
var blueID = "blue";
var redID = "red";
document.addEventListener("DOMContentLoaded", event => {
    $("#matches").hide();
    $("#set-btns").hide();
    $("#event-form").hide();
    $("#teams").hide();
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            setUpEventOptions();
        }
    });

    $("#create-button").on("click", cardClick)

    setEnterResponse($('.info'))
    $("#save-teams").on("click", function () {

        if (!eventError()) {
            var event = getUserInputtedEventName();
            var teams = getInputtedTeamList()
            saveTeamsToServer(event, teams);
            $('#save-teams-modal .modal-body').text("Teams saved for " + event);
            $('#save-teams-modal').modal('show')
            $('#matches').show();
        }
    })
    $("#save-match-btn").on("click", function () {
        console.log("Save clicked")
        if (eventError())
            return;
        var responseText = "";
        var userMatches = {}
        var teams = getInputtedTeamList();
        $(".match-info").each(function (index, obj) {
            console.log("Looping through match " + index)
            var match = {};
            match[redID] = [];
            match[blueID] = [];
            $(this).children(".form-control").each(function (childIndex, childObj) {
                var val = $(this).val();
                if (val == "")
                    responseText += "Match " + (index + 1) + " has empty team at spot " + (childIndex + 1) + ".<br>";
                else if (!teams.includes(val))
                    responseText += "Match " + (index + 1) + " at spot " + (childIndex + 1) + " has teams not saved for event.<br>"
                else if (match[redID].includes(val) || match[blueID].includes(val))
                    responseText += "Match " + (index + 1) + " repeats teams.<br>";
                else
                    match[$(this).attr('data-alliance')].push(val);
            })
            userMatches[index + 1] = match;
        })
        if (responseText.length != 0)
            responseText += "Save Failed!";
        else {
            responseText += "Matches Save Successful!"
            var event = getUserInputtedEventName()
            saveTeamsToServer(event, teams);
            saveMatchesToServer(event, userMatches);
            $('#set-btns').show();
        }
        $('#save-matches-modal .modal-body').html(responseText);

        $('#save-matches-modal').modal('show')

    })

    $('#delete-last-match-btn').on("click", function () {
        $(".match-info").last().remove();
        matchNum--;
    })

    $('#set-event-btn').on("click", setEvent);
    $('#add-match-btn').on("click", addMatchLine)
})

function getInputtedTeamList() {
    teams = [];
    $(".team-info").each(function (index, obj) {
        if ($(obj).val() != "")
            teams.push($(obj).val())
    })
    return teams;
}

/**
 * Returns the name of the event inputted by the admin
 */
function getUserInputtedEventName() {
    return $('#event-name-input').val().trim();
}

/**
 * Returns true if the user did not input an event name
 */
function eventError() {
    if ($('#event-name-input').val() == "") {
        $('#event-name-input').addClass("is-invalid");
        return true;
    }
    $('#event-name-input').removeClass("is-invalid");
    return false;
}

function cardClick() {
    $('#event-form').show();
    $('#event-name').show();
    $('#create-card').hide();
    $('#edit-card').hide();
}

/**
 * Binds the given element to a function called when the "enter" key is pressed
 * @param {*} element - the html element to bind
 */
function setEnterResponse(element) {
    element.on('keypress', function (e) {
        if (e.which == 13)
            enterResponse(this)
    })
}

/**
 * Will change the given input line when enter is clicked
 * 
 * @param {*} input the input line to bind 
 */
function enterResponse(input) {
    if (!$(input).prop('readonly')) {
        $(input).prop('readonly', true);
        $(input).parent().append(getEditButton(input))
        if ($(input).hasClass("team-info")) {
            $(input).parent().append(getDeleteButton(input))
            if (!$(input).attr("data-click"))
                $(input).parent().parent().append(getTeamLine())
        }
        if ($(input).attr("id") == 'event-name-input')
            $("#teams").show();
        $(input).attr("data-click", 1)
    }
}

/**
 * Gets the html for a edit button and binds it to its function
 * @param {*} input - the input line this will be appended to
 */
function getEditButton(input) {
    var $button = $(`<div class = "ml-3 btn btn-outline-info"><i class="fas fa-pen"></i></div>`)
    $button.on('click', function () {
        $(input).prop('readonly', false);
        $(input).parent().children(".btn").remove();
    })
    return $button
}

/**
 * Gets the html for a delete button and binds it to its function
 * @param {*} input - the input line this will be appended to 
 */
function getDeleteButton(input) {
    var $button = $(`<div class = "ml-3 btn btn-outline-danger"><i class="fas fa-times"></i></div>`)
    $button.on('click', function () {
        $(input).parent().remove();
    })
    return $button
}

/**
 * Gets a team input line and binds it to an enter key function
 */
function getTeamLine() {
    var $team = $(`<div class="input-group mt-3 mb-3 ">
                    <input type="text" class="form-control team-info info" >
                </div>`)
    setEnterResponse($team.children(0));
    return $team;
}

/**
 * Adds a match input line to the form
 */
function addMatchLine() {
    $('#match-info-group').append(getMatchLine());
}

/**
 * Gets the html for a match input line
 */
function getMatchLine() {
    var match = ` <div class="match-info input-group mt-3 mb-3">
                            <div class="input-group-prepend mr-3">
                                <span class="input-group-text">Match ${++matchNum}</span>
                            </div>
                            <input type="text" data-alliance = "${redID}" class="form-control ">
                            <input type="text" data-alliance = "${redID}" class="form-control mr-3">
                            <input type="text" data-alliance = "${blueID}" class="form-control ml-3">
                            <input type="text" data-alliance = "${blueID}" class="form-control">
                </div>`
    return match;
}

/**
 * Gets all events and binds their options to a set up
 */
async function setUpEventOptions() {
    getExistingEvents()
        .then(events => {
            for (event of events)
                $('#edit-event-options').append("<option>" + event + "</option>");
        })

    /**
     * Fills in all known data for the selected event
     */
    $('#edit-button').on("click", async function () {
        enterResponse('#event-name-input');
        var eventName = $('#edit-event-options option:selected').text()
        $('#event-name-input').val(eventName);


        getTeamsInEvent(eventName)
            .then(teams => {
                for (i in teams) {
                    enterResponse($('.team-info').eq(i));
                    $('.team-info').eq(i).val(teams[i]);
                }
            })
        getMatchesInEvent(eventName)
            .then((matches) => {

                var simpleListOfMatchData = [];
                for (match of matches) {
                    var teams = []
                    for (alliance in match)
                        teams = teams.concat(match[alliance]);
                    simpleListOfMatchData.push(teams);
                }
                for (i in simpleListOfMatchData) {
                    addMatchLine();
                    $('.match-info').eq(i).children(".form-control").each(function (j, childObj) {
                        $(this).val(simpleListOfMatchData[i][j]);
                    })
                }
            })
        cardClick();
    })
}
