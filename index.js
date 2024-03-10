let { MongoClient } = require("mongodb");
require("dotenv").config();
const client = new MongoClient(process.env.MONGODB_URL);
const fs = require("fs");
const cron = require("node-cron");

cron.schedule(process.env.CRON_SCHEDULE, () => {
  console.log("Backing up MongoDB to /backups at " + Date.now())
  run()
});

let databases = [];

async function run() {
  try {
    await client.connect();
    const admin = client.db("admin");

    databases = await admin.command({ listDatabases: 1, nameOnly: false });
    databases = databases.databases;
    databases = databases.filter((obj) => obj.name !== "local");
    databases = databases.filter((obj) => obj.name !== "config");
    databases = databases.filter((obj) => obj.name !== "admin");

    for (const val of databases) {
      let collection_results = await client
        .db(val.name)
        .listCollections()
        .toArray();

      let database_name = val.name;

      for (const collection of collection_results) {
        let data_in_collection = await client
          .db(database_name)
          .collection(collection.name)
          .find({})
          .toArray();

        try {
          fs.writeFileSync(
            "./backups/" + database_name + "+" + collection.name + ".json",
            JSON.stringify(data_in_collection)
          );
          console.log(
            "Backed up database: " +
              database_name +
              ", collection: " +
              collection.name
          );
        } catch (err) {
          console.log("Error writing to file", err);
        }
      }
    }
  } finally {
    await client.close();
  }
}

