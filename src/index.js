const app = require('./app');
require('dotenv').config();

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.error(`ERROR: ${err.message}`);
    } else {
        console.log(`Listening on port ${process.env.PORT}`);
    }
});
