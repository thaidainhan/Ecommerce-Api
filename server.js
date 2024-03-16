const app = require('./src/app')
const {app: {port}} = require('./src/configs/mongodb.config')



// * Init Server
const server = app.listen(port, () => {
    console.log(`WSV ecommerce start with port ${port}`);
})

process.on("SIGINT", () => {
    server.close( () => {
        console.log("Exit Server Express");
    })
    // notify.send("Ping...")
})

