/*
 * Project: Milestone 1
 * File Name: main.js
 * Description: BCITstagram lab main script. Pulls in ./IOhandler.js, which in turn pulls in ./filter.js
 *
 * Created Date: 2024/02/21
 * Author: Liam Jackson
 *
 */

const path = require('path');
const IOhandler = require('./IOhandler');
const zipFilePath = path.join(__dirname, 'myfile.zip');
const pathUnzipped = path.join(__dirname, 'unzipped');
const pathProcessed = path.join(__dirname, 'filtered');

IOhandler.unzip(zipFilePath, pathUnzipped)
		.then(() => {
				return IOhandler.readDir(pathUnzipped);
		})
		.then((images) => {
				images.forEach((image) => {
						IOhandler.filter(image, pathProcessed, 'grayscale');
						IOhandler.filter(image, pathProcessed, 'sepia');
				});
		})
		.catch((err) => {
				console.log(err);
		});
