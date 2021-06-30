export const environment = {
    server: {
        port: process.env.SERVER_PORT || 3002
    },
    security: {
        saltRounds: process.env.SALT_ROUND || 10,
        apiSecret: process.env.API_SECRET || 'api-secret'
    },
    db: {
        url: process.env.DB_URL || "mongodb://user:secret@localhost:27017/nodejs-api-restify-template"
    }
}