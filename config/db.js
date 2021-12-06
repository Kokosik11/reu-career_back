const config = require('config');
const mongoose = require('mongoose');

mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.database}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('error', (err) => {
    console.error(`Database Connection Error: ${err}`);
})

mongoose.connection.on('connected', () => {
    console.info("Succesfully connected to MongoDB Database");
})
