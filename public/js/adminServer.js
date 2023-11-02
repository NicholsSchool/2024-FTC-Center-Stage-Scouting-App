/**
 * Returns a list of events saved
 * @return a list of events saved
 */
async function getExistingEvents() {
    console.log(firebase.auth())
    console.log(firebase.auth().currentUser);
    return firebase.auth().currentUser.getIdToken(true)
        .then((idToken) => {
            return $.ajax({
                url: "/getAllEvents",
                headers: { 'Authorization': idToken },
                method: 'GET',
            })
        })
}

/**
 * Returns a list of teams in the given event
 * @param {*} event the event to get teams of
 * @return a list of teams in the given event
 */
async function getTeamsInEvent(event) {
    return firebase.auth().currentUser.getIdToken(true)
        .then((idToken) => {
            return $.ajax({
                url: "/getTeamsInEvent",
                headers: { 'Authorization': idToken },
                data: { 'event': event },
                method: 'GET',
            })
        })
}

/**
 * Returns a list of matches in the given event
 * @param {*} event the event to get matches of
 * @return a list of matches in the given event
 */
async function getMatchesInEvent(event) {
    return firebase.auth().currentUser.getIdToken(true)
        .then((idToken) => {
            return $.ajax({
                url: "/getDetailedMatches",
                headers: { 'Authorization': idToken },
                data: { 'event': event },
                method: 'GET',
            })
        })
}

/**
 * Saves teams of specific event
 * @param {*} event the event the teams will be saved under
 * @param {*} matches the list of teams to save
 */
function saveTeamsToServer(event, teams) {
    var data = {}
    data["event"] = event;
    data["teams"] = teams;
    firebase.auth().currentUser.getIdToken(true)
        .then((idToken) => {
            return $.ajax({
                url: "/saveTeams",
                headers: { 'Authorization': idToken },
                data: data,
                method: 'POST',
            })
        })
        .then((response) => {
            console.log(response);
        })
        .catch(err => {
            console.log(err);
        })
}

/**
 * Saves matches of specific event 
 * @param {*} event the event the matches will be saved under
 * @param {*} matches the list of matches with the teams within them
 */
function saveMatchesToServer(event, matches) {
    console.log("saving matches");
    var data = {}
    data["event"] = event;
    data["matches"] = matches;
    firebase.auth().currentUser.getIdToken(true)
        .then((idToken) => {
            return $.ajax({
                url: "/saveMatches",
                headers: { 'Authorization': idToken },
                data: data,
                method: 'POST',
            })
        })
        .then((response) => {
            console.log(response);
        })
        .catch(err => {
            console.log(err);
        })
}

/**
 * Sets the currently inputted event as the event to be scoutted
 */
async function setEvent() {
    if (eventError())
        return;

    firebase.auth().currentUser.getIdToken(true)
        .then((idToken) => {
            return $.ajax({
                url: "/setEvent",
                headers: { 'Authorization': idToken },
                data: { "event": getUserInputtedEventName() },
                method: 'POST',
            })
        })
        .then((response) => {
            console.log(response);
            console.log(status);
            $('#set-event-btn').hide();
            $("#set-event-btn").parent().append(`<p>${status}</p>`);
        })
        .catch(err => {
            console.log(err);
        })


}