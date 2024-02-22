/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date: 2024/02/21
 * Author: Liam Jackson
 */

const yauzl = require("yauzl-promise"),
		filters = require("./filters.js"),
		path = require("path"),
		{ pipeline } = require("stream").promises,
		{ PNG } = require("pngjs"),
		fs = require("fs").promises,
		{ createReadStream, createWriteStream } = require("fs");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */

async function unzip(pathIn, pathOut) {
		return new Promise(async (resolve, reject) => {
				const zip = await yauzl.open(pathIn);
				try {
						await fs.mkdir(pathOut, { recursive: true });
						for await (const entry of zip) {
								if (entry.filename.endsWith(path.sep)) {
										await fs.mkdir(path.join(pathOut, entry.filename), {
												recursive: true,
										});
								} else {
										const readStream = await entry.openReadStream();
										const writeStream = createWriteStream(
												path.join(pathOut, entry.filename),
										);
										await pipeline(readStream, writeStream);
								}
						}
						resolve();
				} catch (err) {
						reject(err);
				} finally {
						await zip.close();
				}
		});
}

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} dirPath
 * @return {promise}
 */

async function readDir(dirPath) {
		return new Promise(async (resolve, reject) => {
				try {
						const files = await fs.readdir(dirPath);
						let filesArray = [];
						for (let i = 0; i < files.length; i++) {
								if (path.extname(files[i]) === ".png") {
										filesArray.push(path.join(__dirname, "unzipped", files[i]));
								}
						}
						resolve(filesArray);
				} catch (err) {
						reject(err);
				}
		});
}

/**
 * Description: Read in png file by given pathIn,
 * convert to the given filter, and write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @param {string} filter
 * @return {promise}
 */
const filter = async (pathIn, pathOut, filter) => {
		return new Promise(async (resolve, reject) => {
				try {
						await fs.mkdir(path.join(pathOut, filter), { recursive: true });
						const fileName = path.basename(pathIn);
						createReadStream(pathIn)
								.pipe(
										new PNG({
												filterType: 4,
										}),
								)
								.on("parsed", function () {
										if (filter === "grayscale") {
												const image = filters.grayscaleFilter(this);
												image
														.pack()
														.pipe(createWriteStream(path.join(pathOut, filter, fileName)));
										} else if (filter === "sepia") {
												const image = filters.sepiaFilter(this);
												image
														.pack()
														.pipe(createWriteStream(path.join(pathOut, filter, fileName)));
										}
								});
						resolve();
				} catch (err) {
						reject(err);
				}
		});
};

module.exports = {
		unzip,
		readDir,
		filter,
};
