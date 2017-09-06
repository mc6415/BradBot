exports.config = {
    "prefix": "-",
    "discordToken": "MzUzNzUwNjM2OTM3ODcxMzYw.DI01kw.MW_pVMMfwO3OTh5qLlOjS76GeIY",
    "sqlUser": "mcoombes",
    "sqlPass": "Mc220391",
    "sqlServer": "bradbot.database.windows.net",
    "dbName": "BradBot"
};

exports.sqlConfig = {
    userName: "mcoombes",
    password: "Mc220391",
    server: "bradbot.database.windows.net",
    options: {
        encrypt: true,
        database: "BradBot",
        rowCollectionOnDone: true
    }
};

exports.sessionConfig = {
    user: "mcoombes",
    password: "Mc220391",
    server: "bradbot.database.windows.net",
    database: "BradBot",
    connectionTimeout: 10000,
    requestTimeout: 10000,

    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 14999
    },

    options:{
        encrypt: true
    }
};