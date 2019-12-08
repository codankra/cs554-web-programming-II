const MongoClient = require("mongodb").MongoClient;
const settings = {
mongoConfig: {
serverUrl: "mongodb://localhost:27017/",
database: "Kramer_Daniel_C554_Lab1"
}
};


const mongoConfig = settings.mongoConfig;

let _connection: any = undefined;
let _db: any = undefined;

module.exports = async () => {
if (!_connection) {
_connection = await MongoClient.connect(mongoConfig.serverUrl, { useNewUrlParser: true });
_db = await _connection.db(mongoConfig.database);
}

return _db;
};