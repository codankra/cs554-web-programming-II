

const dbConnection = require("./mongoConnection");
import { Collection } from "mongodb";

/* This will allow you to have one reference to each collection per app */
/* Feel free to copy and paste this this */
const getCollectionFn = (collection: string) : () => Promise<Collection<any>> => {
let _col: Promise<Collection<any>>;

return async () : Promise<Collection<any>> => {
if (!_col) {
const db = await dbConnection();
_col = await db.collection(collection);
}

return _col;
};
};

/* Now, you can list your collections here: */
module.exports = {
tasks: getCollectionFn("tasks")
};