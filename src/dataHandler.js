// const {readFileSync, writeFileSync} = require("node:fs");
import {readFileSync, writeFileSync} from 'node:fs'

const readJSONFile = (path, fileName) => {
	const collection = readFileSync(`${path}/${fileName}`, "utf8");
	return collection.length ? JSON.parse(collection) : [];
}

const writeJSONFile = (path, fileName, data) => {
	data = JSON.stringify(data, null, 2);
	return writeFileSync(`${path}/${fileName}`, data, {encoding: "utf8"});
}

export {
	readJSONFile,
	writeJSONFile
}
