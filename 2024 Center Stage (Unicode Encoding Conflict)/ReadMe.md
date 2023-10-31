# Project Description

This repo contains the template code for an FRC or FTC scouting app. Using this code along with firebase allows for an easy, customizable app for a team to use. 

## Background

This project is a part of Arnav Parashar's (Nichols '20) Senior Thesis. The goal of this project is to allow our team, The Electric Mayhem (FRC 4930 and FTC 12736 & 12736), to create and use a scouting app year after year. Creating an app only requires one student creating a firebase project and slightly adjusting the code in this repo to match the game for the desired year. This code is meant to be used by our team, The Electric Mayhem, but hopefully will be able for use for many teams in the future.

## Setup

First setup the firebase project on the online firebase console. Log in to any google account and go to the [firebase console](https://console.firebase.google.com/). Create a new project. The project name should be the year, the type of competiton (FTC or FRC) and then the word "Scouting". So for example, 2020FRCScouting. Follow the steps to create the project. 

Once created, navigate to the "Database" tab on the left of the console and set up the Database. Follow the steps, and begin in **Testing**, _not_ Production. 

Also go to the "Authentication" tab and then the **Sign In Method** tab and enable Google as a sign in provider. 

<hr/>

Once you have your firebase project set up, you need to install Node.js and NPM. This can be done from [this website](https://nodejs.org/en/). 

Now on your laptop, create a new folder to store the project, label it the same as the project name, (So keeping with the prior example, it would be 2020FRCScouting). Open the project in an IDE such as VSCode. In terminal run

	npm install -g firebase-tools
	
This will install firebase for your project. Before initializing firebase, you need to login with the google account you used on the online firebase console. In terminal run

	firebase login
	
and you will be prompted to login with your gmail. Once logged in, in terminal, run

	firebase init
	
Firebase Firestore, Functions, Hosting, and Emulators are needed for the project. Follow the steps given for setting up the project. 

<hr/>

Once all done, download the contents of this repo.


From the content downloaded from this repo, select the corresponding folder for your app, either FRC or FTC. Then insert all the files within "Client Side Code" into the "Public" folder of your new Project. The "index.html" file and "404.html" file should get overriden. 
 
Next, insert all the files within "Server Side Code", into the "Functions" folder of your new project, "index.js" should get overriden. 

 
The server side code in this repo uses the "Express" library, to make your new project use this as well, add the following code in the "firebase.json" file, inside the "hosting" object:


    "rewrites": [
      {
        "source": "**",
        "function": "app"
      }
    ],
    
 [This video](https://www.youtube.com/watch?reload=9&v=LOeioOKUKI8) has more info.
 
<hr/>

Also, since we started in Testing mode for our database, the default rules make it so that the data is accessible by anyone at all for one month. We do not want this to be allowed, the data should only be accessible from our server code. The only exception to this is team info for the Rankings page.

 In your **firestore.rules** file and in the rules section of firestore on the firebase website (can be found by going to database > Cloud Firestore > Rules) paste the following rules: 
 
	rules_version = '2';
	service cloud.firestore {
	  match /databases/{database}/documents {
				match /Events/{event}/Teams/{team} { 
	      		allow read: if request.auth.uid != null
	            allow write: if false
	         }
		  allow read, write: if false
	  }
	}

<hr/>

Now follow the instructions inside each folder of this repo and within the files themselves to adjust the app to your desired year's game 

For testing the app, use 
	
	firebase serve

in the terminal to locally host the app on your laptop.

Once the app is all good or if the local hosting isn't working properly, use 

	firebase deploy

to launch the app. If you continue to work after deploying but only make a change to the front end, use `firebase deploy --only hosting` for a quicker deploy, or `firebase deploy --only functions` for vice versa. 

<hr />

**Additonal Note: At the bottom of every html page are a few Firebase SDKs listed, for example:**

    <script src="/__/firebase/7.8.2/firebase-app.js"></script>
**These SDKs may need to be updated to their current versions for your year. To do this, just replace each SDK on every HTML page with the current version**

## Usage 

The scouting part of the app will vary year to year based off the game. Remember to remind scouts that they can not change the data once they submit.

 The analyzation pages for the data will remain the same. With the app the team can:

* View ranking lists for any gameplay task, which update in real time as new data gets inputted
* View any desired data for all teams in a spreadsheet layout
* Get rough predictions of match scores and match winners
* View trends in a team's gameplay throughout an event.

<hr />

The team should appoint one person to be the "Admin" of the app. The job of this person varies for the FRC and FTC versions of the app.

**FRC Admin:**

This person has only one responsibility, and that is once the event schedule is on The Blue Alliance, go to the admin page of the app (access it by adding /admin.html to the end of the app url) and input the event's key, which can be found in the url for the event on blue alliance. 

For example, Miami Valley 2020 event can be found on The Blue Alliance here: https://www.thebluealliance.com/event/2020ohmv

The event key is `2020ohmv`

This will set up the event's schedule as well as each team in the app's storage, and set the app to scout for that event. 

If you would like to switch back to an event that was already set up, either to see the scouted data again or test somethings, you will have to go into the Firebase Online Console for the project and go to the Database tab and then in the "MetaData" collection, set the current event to the desired event's event key. But make sure the event already exists in the database. 

**IMPORTANT NOTE: To use less data reads from the server, event info such as the name of the event and schedule are cached on the client side and on a Firebase CDN. The cache on the CDN lasts for 10 minutes, meaning the event name and schedule _WILL NOT UPDATE ON THE APP FOR 10 MINUTES._ So the admin is reponsible for setting up the event, at least 10 minutes prior to the use of the app.**

**A way to manually refresh the cache on the CDN is to deploy the app once again.** 

**To refresh cache on a device, for PC: Ctrl + Shift + r, Mac: Cmd + Shift + r, for iphones: double click home button and swipe up on safari**

**FTC Admin:**

At the time of this App's initial creation, the FTC counterpart of The Blue Alliance, The Orange Alliance, is not as quick to update their website with match schedules of events. So unfortunately, the FTC admin has to input the teams and match schedule manually rather than relying on  a website. 

To input the schedule, go to the admin page of the app (access it by adding /admin.html to the end of the app url) and select "Create" to create an event. You will first have to input the event's name, you can just put a shortened name if the real one is very long, and then hit enter. You will then have to input each team number, hit enter after typing a team name to make a new line appear. If you make a mistake, the buttons on the side will allow you to edit or delete the team number. Then hit save to save the teams for the event. Next you will have to input the schedule for the matches. If you make a mistake in inputting the schedule ( inserting a team not in the event, inserting a team twice for a match, or leaving a spot empty ) then when you hit save, it will tell you your mistake and where you made it. If there are no mistakes, it will save the matches and teams to the server. It will then ask you if you would like to set this event as the current event, if it is the event you want people to be scouting the click the "Set as current event" button. The app is now ready for use at the event.

Generally a list of teams competing at the competition is sent out beforehand. To make this setup process faster, create the event and add the teams and stop after saving the list of teams. This way, at the event once the match schedule is released, you can select the event you previously created and continue editing and setting it up. 

**Important Note:** If you click "Save" for either the team list or the match schedule, it will create a blank storage for everything. Meaning, **if the event has already had matches scouted, the data will be deleted.** So only select an event to be edited if it hasn't had any scouting. If you want to switch to an old event to see the data collected or any other reason, you will have to go into the Firebase Online Console for the project and go to the Database tab and then in the "MetaData" collection, set the current event to the desired event's name that you used.

**Another note:** While the FRC app cache's data on the Firebase CDN and the client side, the FTC app only cache's data on the client side. Meaning that there is no 10 minute gap for when the schedule will update on the app. The client side cache refreshes every 5 minute, but it is easy to refresh cache on a device. 

**To refresh cache on a device, for PC: Ctrl + Shift + r, Mac: Cmd + Shift + r, for iphones: double click home button and swipe up on safari**

## Issues With The App

1. Quota for Reads per day: The free plan for Firebase offers 50,000 reads per day. For a few people testing the app, this is more than enough, but when the whole team uses the app for scouting and viewing the data, this can build up fast. At Miami Valley 2020, after our scouting meeting at night, we had exceeded our quota and the app would not work because we weren't able to use any more reads. Since then, I have made the app cache certain data that doesn't change often, such as the event schedule, event name, and the empty match data. This will certainly reduce the amount of reads the app makes, but due to the 2020 season ending early, we were unable to verify that it is enough to stay well within the quota. 

	Regardless, there are three things the team can do to avoid issues with the quota
	
	* Have the scouts only use the scouting side of the app on the day before our hotel night scout meeting. If lots of people are viewing the analytical parts before the meeting, the quota could run out or almost be out during the meeting. Instead, have the scouts scout and have one person viewing the data, (possibly put it on a monitor for others to see). On any other day, anyone can view the data, because it won't matter if the quota runs out because there is no official meeting about the data. 

	* Once the day ends, before the hotel scouting meeting, have someone go on the "Tables" page and select every task, and then copy and paste the data into a spreadsheet. The way the "Tables" page is built, this should be very easy to do, and this will allow the team to have a backup of the data if the quota is exceeded.

	* Switch to [Firebase's Blaze Plan](https://firebase.google.com/pricing). This plan is pay as you go, so you only pay money if you exceed the quota **but** the quota is per month instead of per day. So if you exceed 1,500,000 reads in a month, you pay 6 cents per 100 thousand more reads. Our team will likely never ever exceed this quota because we would only use the app for 2 or 3 days of a month. 
	
2. Wifi. If we attend an event with no wifi or cellular service, the team will not be able to access and use the app. So always make and bring paper scouting forms to events and a group of students can insert the paper data into the app in a location with wifi or afterwards in the hotel. 



## Useful Resources

Bootstrap - https://getbootstrap.com/docs/4.4/getting-started/introduction/

Firebase - https://firebase.google.com/docs

Blue Alliance API - https://www.thebluealliance.com/apidocs/v3

2020 FRC Scouting app - https://github.com/NicholsSchool/2020-FRCScouting

Electric Mayhem members, feel free to contact Arnav Parashar via Slack anytime. 
