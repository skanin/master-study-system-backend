const fsPromise = require('fs/promises');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require('csv-parser');

exports.readUserNames = async () => {
	return fsPromise.readFile('./usernames.txt', 'utf8', (err, data) => {
		return data;
	});
};

exports.readCsvHeaders = async (path) => {
	console.log('heyheyhey');
	return new Promise((resolve, reject) => {
		fs.createReadStream(path)
			.on('error', (err) => {
				console.log('There was an err');
				reject(err);
			})
			.pipe(csv())
			.on('headers', (header) => {
				resolve(header);
			});
	});
};

exports.writeToCsv = (path, data, append = false) => {
	const csvWriter = createCsvWriter({
		path: path,
		header: Object.keys(data).map((elem) => {
			return { id: elem, title: elem };
		}),
		append: append,
	});

	csvWriter.writeRecords([data]).then(() => {
		console.log('Done writing');
	});
};
