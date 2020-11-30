const app = require('./app');
require('dotenv').config();
const port = process.env.PORT || 8000

app.listen(port, (err) => {
    if (err) {
        console.error(`ERROR: ${err.message}`);
    } else {
        console.log(`Listening on port ${process.env.PORT}`);
    }
});
