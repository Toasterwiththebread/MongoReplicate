# MongoReplicate
Simple app to backup your MongoDB database whenever you want

# How to setup
You can run the Docker image or compile the code yourself using Node.js

# ENV
You must add either a .ENV file or use the example one provided at example.env, formatted like this:

```
MONGODB_URL = "Your MongoDB connection string"
CRON_SCHEDULE = "CRON SCHEDULE HERE"
```

Here is the CRON schedule we recommend:

```
0 */2 * * *
```

It runs every 2 hours

# Contributing
We will look at pulls and merges and contributions, this project is not actively being managed, but we will still check
and respond to them.
