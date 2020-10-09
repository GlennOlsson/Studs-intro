"use strict"

const express = require('express')
const app = express()
const port = 3001

var fs = require('fs');

const MAX_LEVEL = 6
const MIN_LEVEL = 0

//Send subdomain as paramter, sub=SUBDOMAIN
//Replies with {name: NAME, instructions: [INSTRUCTION,...]}
app.get('/', (req, res) => {

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

	let groupObject = json.groups[subdomain]

	if(!groupObject) {
		console.log("No group of subdomain");
		res.send({});
		return
	}

	let name = groupObject.name
	let level = groupObject.level
	let startCoordinate = groupObject.coordinate
	let count = groupObject.count

	//Level instructions, i = level - 1, i.e. instruction 0 comes when level is 1 (first is coordinate)
	let taskInstructions = json.instructions;
	let finalCoordinate = json.finalCoordinate

	let instructions = []

	if(level < MIN_LEVEL) {
		console.log("No instructions yet");
		res.send({});
		return
	}

	for(var i = level; i >= MIN_LEVEL; i--) {
		if(i == MAX_LEVEL) {
			var instruction = "Nu kan ni ta er till koordinaten " + finalCoordinate;
			instructions.push(instruction);
		} else if(i == MIN_LEVEL) {
			var instruction = "Ta dig till " + startCoordinate + " tills att klockan är 17 (ej ackkvart). När ni är " + count + " personer kan ni höra av er till oss på 070-680 96 45!"; 
			instructions.push(instruction);
		} else {
			//0 indexed and level 1 is coordinates (MIN_LEVEL)
			instructions.push(taskInstructions[i - 1]);	
		}
	}

	var options = { day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
	var today  = new Date();

	console.log(today.toLocaleDateString("en-US", options) + ": Request from " + name + " at level " + level);

	res.send({
		"name": name, 
		"instructions": instructions
	})
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})