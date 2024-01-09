const { app, db } = require('./server');
const gameData = require("./data");
const verification = require("./verification.js");

/**
 * Saves the inputted teams for the inputted event
 * @param event - inside the request sent, this must be the desired event's name
 * @param teams = inside the request sent, this must be a list of the teams 
 */
app.post('/saveTeams', (req, res) => {
    var event = req.body.event;
    var teams = req.body.teams;
    //First we verify the user. If they aren't valid, the code skips to the catch()
    verification.verifyAuthToken(req)
        .then(decoded => {
            var batch = db.batch();
            for (team of teams)
                batch.set(db.collection("Events").doc(event).collection("Teams").doc(team), {
                    teamNum: team,
                    matches: {},
                    averages: gameData.getEmptyMatchData().gamePlay
                });
            return batch.commit()
        })
        .then(() => {
            res.send("done");
        })
        .catch(err => {
            console.error(err);
            res.status(400).send("Error setting saving teams")
        })
})

/**
 * Saves the inputted matches for the inputted event
 * @param event - inside the request sent, this must be the desired event's name
 * @param teams = inside the request sent, this must be a list of the matches with their alliances 
 */
app.post("/saveMatches", (req, res) => {
    var event = req.body.event;
    var matches = req.body.matches;
    verification.verifyAuthToken(req)
        .then(decoded => {
            var batch = db.batch();
            for (match in matches) {
                var matchNum = "" + (Number(match) + 1);
                while (matchNum.length < 3)
                    matchNum = "0" + matchNum;
                batch.set(db.collection("Events").doc(event).collection("Matches").doc(matchNum), matches[match]);
            }
            return batch.commit()
        })
        .then(() => {
            res.send("done");
        })
        .catch(err => {
            console.error(err);
            res.status(400).send("Error setting saving matches")
        })
})

/**
 * Sets the inputted event as the current event
 * @param event - inside the request sent, this must be the desired event's name
 */
app.post("/setEvent", (req, res) => {
    //First we verify the user. If they aren't valid, the code skips to the catch()
    verification.verifyAuthToken(req)
        .then((decoded) => {
            db.collection("MetaData").doc("CurrentEvent").set({ event: req.body.event })
            db.collection("Events").doc(req.body.event).set({ name: req.body.event })
            res.send("All done");
        })
        .catch(err => {
            console.log(err);
            res.status(401).send("Not allowed to set current event");
        })
})

/**
 * Returns the names of all events in database
 * @return the names of all events in database
 */
app.get("/getAllEvents", async (req, res) => {

    verification.verifyAuthToken(req)
        .then((decoded) => {
            return db.collection("Events").listDocuments()
        })
        .then(docs => {
            var events = [];
            for (i in docs)
                events.push(docs[i].id);
            res.send(events);
        })
        .catch(err => {
            console.error(err);
            res.status(400).send("Error getting saved events")
        })

})

/**
 * Returns all the matches, along with the teams in each match, for a given event
 * @param event - inside the request sent, this must be the desired event's name
 * @return all the matches, along with the teams in each match, for a given event
 */
app.get("/getDetailedMatches", async (req, res) => {
    var event = req.query.event;
    verification.verifyAuthToken(req)
        .then((decoded) => {
            return db.collection("Events").doc(event).collection("Matches").listDocuments()
        })
        .then(docs => {
            return db.getAll(...docs)
        })
        .then(async docSnaps => {
            var matches = [];
            for (let docSnap of docSnaps)
                matches.push(await docSnap.data())
            res.send(matches);
        })
        .catch(err => {
            console.error(err)
            res.status(400).send("Error getting detailed match info")
        })
})

/**
 * Returns all the teams in the given event
 * @param event - inside the request sent, this must be the desired event's name
 * @return all the teams in the given event
 */
app.get("/getTeamsInEvent", async (req, res) => {
    var event = req.query.event;
    verification.verifyAuthToken(req)
        .then((decoded) => {
            return db.collection("Events").doc(event).collection("Teams").listDocuments()
        })
        .then(docs => {
            var teams = [];
            for (team of docs)
                teams.push(team.id);
            res.send(teams);
        })
        .catch(err => {
            console.error(err);
            res.status(400).send("Error getting teams in event")
        })
})