const fs = require('fs/promises');

exports.readUserNames = async () => {
    return fs.readFile('./usernames.txt', 'utf8' , (err, data) => {
        return data;
    });
}