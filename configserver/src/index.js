const express = require('express');
const app = express();

var MongoClient = require('mongodb').MongoClient
var format = require('util').format

const ownPort = 5102;

//Very Important!
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

//Erstellt eine collection mit Standardwerten.
app.get('/api/init', (req, res) => {
    console.log("Trying to initialize...");
    MongoClient.connect('mongodb://mongodb:27017', {
        useNewUrlParser: true
    }, function (err, client) {
        if (!err) {
            var initData = [{
                    key: 'numOfBlocks',
                    value: '15'
                },
                {
                    key: 'widthOfBlock',
                    value: '40'
                },
                {
                    key: 'waviness',
                    value: '0.3'
                },
                {
                    key: 'speed',
                    value: '0.05'
                }
            ];

            var dbInstance = client.db("myDockerDb01");
           //Wenn initDataStuff noch nicht existiert, wird diese Collektion generiert.
           dbInstance.collection("initDataStuff").insertMany(initData, function (err, res) { 
               console.log("Inserted data into the collection");
               if (err) throw err;
            });
        } else {
            console.log("An Error occured...");
        }
        client.close;
    });
    res.send('Initialized the DB');
});

app.get('/api/numOfBlocks', (req, res) => {
    getFromDB("numOfBlocks", res);
});

app.get('/api/widthOfBlock', (req, res) => {
    getFromDB("widthOfBlock", res);
});

app.get('/api/waviness', (req, res) => {
    getFromDB("waviness", res);
});

app.get('/api/speed', (req, res) => {
    getFromDB("speed", res);
});

function getFromDB(searchKey, res){
    console.log("Trying to get " + searchKey + "...");
    //Das zweite mongodb bei der URL ist der docker-service Name van der docker-compose.yml Datei.
    MongoClient.connect('mongodb://mongodb:27017', {useNewUrlParser: true}, function (err, client) {
        if (!err) {
            var dbInstance = client.db("myDockerDb01");
            dbInstance.collection("initDataStuff").findOne({key: searchKey}, function (err2, res2) {
                if (err2) throw err2;
                res.send(res2.value);
            });
        } else {
            console.log("An Error occured...");
        }
        client.close
    });
}

app.get('/api/config/numOfBlocks/:value', (req, res) => {
    updateEntryInDB("numOfBlocks", req.params.value, res);
});

app.get('/api/config/widthOfBlock/:value', (req, res) => {
    updateEntryInDB("widthOfBlock", req.params.value, res);
});

app.get('/api/config/waviness/:value', (req, res) => {
    updateEntryInDB("waviness", req.params.value, res);
});

app.get('/api/config/speed/:value', (req, res) => {
    updateEntryInDB("speed", req.params.value, res);
});

app.get('/api/config/default', (req, res) => {
    updateEntryInDB("numOfBlocks", '15');
    updateEntryInDB("widthOfBlock", '40');
    updateEntryInDB("waviness", '0.3');
    updateEntryInDB("speed", '0.05');

    res.send("Successful reset of the config"); 
});

function updateEntryInDB(searchKey, newValue, res){
    console.log("Trying to update " + searchKey + "...");
    //Das zweite mongodb bei der URL ist der docker-service Name van der docker-compose.yml Datei.
    MongoClient.connect('mongodb://mongodb:27017', {useNewUrlParser: true}, function (err, client) {
        if (!err) {
            var dbInstance = client.db("myDockerDb01");
            dbInstance.collection("initDataStuff").updateOne({key: searchKey}, { $set: {value: newValue} }, function (err2, res2) {
                if (err2) throw err2;
                if (res != undefined) {
                    res.send("Successfully updated " + searchKey);
                }
            });
        } else {
            console.log("An Error occured...");
        }
        client.close
    });
}

app.listen(ownPort, () => console.log('Listening on Port ' + ownPort + '...'));