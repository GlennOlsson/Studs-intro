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
			var instruction = "Ta dig till " + startCoordinate + ". När ni är " + count + " personer kan ni höra av er till oss!"; 
			instructions.push(instruction);
		} else {
			//0 indexed and level 1 is coordinates (MIN_LEVEL)
			instructions.push(taskInstructions[i - 1]);	
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