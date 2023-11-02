var methods = {};

/**
 * Returns an object containing the point values for each task being scouted
 * 
 * @return an object containing the point values for each task being scouted
 */
methods.getDataPointValues = function () {
    /*
      TODO: Insert the point value for each task for each gameperiod of the game here.

      All gameperiods and tasks MUST be identical to those written for the content of 
      "gameplay" inside the  getEmptyMatchData() method, but DO NOT INCLUDE
      the "score" attributes or "totalScore"

      Insert the corresponding point value for each task as described in the game manual. 
      You may want to record tasks that don't actually give a team points, just set the value 
      for these to 0. For example, the content inside the "performance" map is likely all zeros,
      data such as "defense" or "no_show".

      Example (Made up point values): 
        return {
            auto: {
                "line" : 5,
                ...
            },
            teleop: {
                "jumps": 2,
                ...
            },
            performance: {
                "defense": 0,
                ...
            },
            ...
        }
     */

    return {
        auto: {
            // Insert tasks and their point values for Auto here.
        },
        teleop: {
            // Insert tasks and their point values for Teleop here.
        },
        end: {
            // Insert tasks and their point values for Endgame here.
        },
        performance: {
            // Insert tasks and their point values for Performance recording.
            // These are all likely to have point values of 0. 
        }
    }
}


/**
 * Returns an empty match data storage object
 * 
 * @return an empty match data storage object
 */
methods.getEmptyMatchData = function () {
    var gamePlay = methods.getDataPointValues();
    for (var gamePeriod in gamePlay) {
        for (var scoring in gamePlay[gamePeriod]) {
            gamePlay[gamePeriod][scoring] = 0;
        }
        gamePlay[gamePeriod]["score"] = 0;
    }
    gamePlay["totalScore"] = 0

    return {
        match: "",
        team: "",
        gamePlay: gamePlay,
        timestamps: []
    }
}


/**
 * Returns an object containing each task which only one team can accomplish per match
 * 
 * @return an object containing each task which only one team can accomplish per match
 */
methods.getDependentData = function () {
    /*
        TODO: Insert each dependent task and its corresponding gameperiod here. 

        In a game, there are sometime tasks only one team can accomplish. 
        These tasks are referred to in this code as "dependent". 
        It is important to be aware of these tasks for gameplay predictions,
        since we can't add it to each teams score, because only one team can do it. 
        The work around for this is to only add it to the score of the team in the alliance
        who accomplishes the task the most frequently. 

        Here you only need to insert gameperiods which contains dependent tasks, 
        and inside those gameperiods, just insert the dependent tasks themselves, 
        and set their value to 0. 

        For example, this is the full code for this method for 
        the 2020 Infinite Recharge game:

             return {
                "teleop": { // This was the only gameperiod with dependent tasks
                    "rotation": 0, // These were the only dependent task
                    "position": 0
                }
            }
    */

    return {
        /*  Insert only the gameperiods which contain dependent tasks, 
            and then the tasks themseleves
            EX: "gameperiod" : {
                        "dependentTask1" : 0, 
                        "dependentTask2": 0, 
                        ...
                },
                ...
         */
    }
}

module.exports = methods;