"use strict"

const express = require('express')
const cors = require('cors')
const app = express()
const port = 3001

var fs = require('fs');

const MAX_LEVEL = 6
const MIN_LEVEL = 0

const FINAL_COORDINATE = "59.3566, 17.9692"

//Level instructions (i = level - 1, i.e. instruction 0 comes when level is 1 (first is coordinate))
let TASK_INSTRUCTIONS = [
	"Skapa en midsommarkrans av godtyckliga föremål. Stäm av med oss när ni är klara",
	"Spara det största och minsta lövet som ni kan hitta i omgivningen. Hör av er sen!",
	"Lägg till typ 5 superhärliga låtar i <a href='https://open.spotify.com/playlist/3mdUUNDb1tlRy0bzslhIta?si=_0-auC36RZC4tI9zWjnNHg'>denna spellista</a> och släng sen iväg ett meddelande till oss",
	"Filma en scen som skulle passa bra i Mission Impossible (glöm inte ljudeffekter och musik!). Skicka videon till oss för godkännande",
	"Ta en bild på studs och skicka till oss (tolka detta på godtyckligt sätt)",
]

//Send subdomain as paramter, sub=SUBDOMAIN
//Replies with {name: NAME, instructions: [INSTRUCTION,...]}
app.get('/', cors(), (req, res) => {

	res.setHeader("Access-Control-Allow-Origin", "*")

	const subdomain = req.query.id
	if( !subdomain ){
		console.log("No subdomain: ", subdomain)
		res.send({})
		return;
	}

	// Read the file and parse as JSON
	let fileData = fs.readFileSync("settings.json");

	if(!fileData) {
		console.log("No file data");
		res.send({});
		return
	}
	
	let json = JSON.parse(fileData);

	if(!json) {
		console.log("No json");
		res.send({});
		return
	}

	let groupObject = json[subdomain]

	if(!groupObject) {
		console.log("No group of subdomain");
		res.send({});
		return
	}

	let name = groupObject.name
	let level = groupObject.level
	let coordinate = groupObject.coordinate
	let count = groupObject.count

	let instructions = []

	if(level < MIN_LEVEL) {
		console.log("No instructions yet");
		res.send({});
		return
	}

	for(var i = level; i >= MIN_LEVEL; i--) {
		if(i == MAX_LEVEL) {
			var instruction = "Nu kan ni ta er till koordinaten " + FINAL_COORDINATE;
			instructions.push(instruction);
		} else if(i == MIN_LEVEL) {
			var instruction = "Ta dig till " + coordinate + ". När ni är " + count + " personer kan ni höra av er till oss!"; 
			instructions.push(instruction);
		} else {
			//0 indexed and level 1 is coordinates (MIN_LEVEL)
			instructions.push(TASK_INSTRUCTIONS[i - 1]);	
		}
	}

	res.send({
		"name": name, 
		"instructions": instructions
	})
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})