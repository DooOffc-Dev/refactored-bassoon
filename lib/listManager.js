const fs = require('fs');

const listPath = './database/listdata.json';

if (!fs.existsSync('./database')) fs.mkdirSync('./database');
if (!fs.existsSync(listPath)) fs.writeFileSync(listPath, JSON.stringify({
    blacklist: [],
    whitelist: [],
    admin: [],
    premium: []
}, null, 2));

let listDB = JSON.parse(fs.readFileSync(listPath, 'utf-8'));

function saveList() {
    fs.writeFileSync(listPath, JSON.stringify(listDB, null, 2));
}

function addToList(type, value) {
    if (!listDB[type]) listDB[type] = [];
    if (!listDB[type].includes(value)) {
        listDB[type].push(value);
        saveList();
        return true;
    }
    return false;
}

function removeFromList(type, value) {
    if (listDB[type]) {
        const index = listDB[type].indexOf(value);
        if (index !== -1) {
            listDB[type].splice(index, 1);
            saveList();
            return true;
        }
    }
    return false;
}

function getList(type) {
    return listDB[type] || [];
}

function isInList(type, value) {
    return listDB[type] && listDB[type].includes(value);
}

function getAllLists() {
    return listDB;
}

module.exports = {
    addToList,
    removeFromList,
    getList,
    isInList,
    getAllLists
};