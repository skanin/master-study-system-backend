const fsPromise = require('fs/promises');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require('csv-parser');

readUserNames = async () => {
	// return fsPromise.readFile('./usernames.txt', 'utf8', (err, data) => {
	// 	return data;
	// });

	return new Promise(async (resolve, reject) => {
		await readCsv('./usernames.csv').then((data) => {
			let usernames = [];
			for (let d of data) {
				let user = Object.values(d)[0].split('\t');
				usernames.push({ username: user[0], helpType: user[1], subject: user[2] });
			}
			resolve(usernames);
		});
	});
};

const getFilteredUsernames = async (username) => {
	let usernames;

	await readUserNames().then((data) => {
		usernames = data;
	});

	let filteredUsernames = usernames.filter((user) => user.username === username);

	return filteredUsernames;
};

readCsvHeaders = async (path) => {
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

readCsv = async (path) => {
	return new Promise((resolve, reject) => {
		let results = [];
		fs.createReadStream(path)
			.on('error', (err) => {
				console.log('There was an err reading the csv', path);
				reject(err);
			})
			.pipe(csv())
			.on('data', (data) => {
				results.push(data);
			})
			.on('end', () => {
				resolve(results);
			});
	});
};

writeToCsv = async (path, data) => {
	let csvWriter;
	if (Array.isArray(data)) {
		// const headers = Array.from(new Set(data.map((item) => Object.keys(item))));
		const headers = [
			'type',
			'time',
			'subject',
			'helpType',
			'username',
			'pretestAnswer',
			'pretestId',
			'pretestQuestion',
			'from',
			'to',
			'videoTime',
			'taskId',
		];
		csvWriter = createCsvWriter({
			path: path,
			header: headers.map((h) => {
				return { id: h, title: h };
			}),
		});
	} else {
		csvWriter = createCsvWriter({
			path: path,
			header: Object.keys(data).map((elem) => {
				return { id: elem, title: elem };
			}),
			append: false,
		});
	}

	if (!fs.existsSync(path)) {
		fs.writeFileSync(path, '');
	}

	await readCsv(path)
		.then((results) => {
			if (!results.length) {
				return Array.isArray(data) ? data : [data];
			}

			let o = results.filter((row) => row.username === data.username);
			let tmpData = results;

			if (o && !Array.isArray(data)) {
				o = o[0];
				tmpData = results.filter((row) => row.username !== data.username);
				data = { ...o, ...data };
				tmpData.push(data);
			} else if (o && Array.isArray(data)) {
				o = o[0];
				tmpData = results.filter((row) => row.username !== data.username);
				tmpData.push(...data);
			}

			return tmpData;
		})
		.then((res) => {
			csvWriter.writeRecords(res).then(() => {
				console.log('Done writing');
			});
		});
};

module.exports = {
	readCsv,
	writeToCsv,
	readCsvHeaders,
	readUserNames,
	getFilteredUsernames,
};
