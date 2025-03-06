require('dotenv').config();
const mongoose = require('mongoose');

const app = require('./app');

mongoose.connect(process.env.DATABASE).then(() => {
    console.log('MongoDB Connected....')
    app.listen(process.env.PORT, () => {
        console.log('app is listening on PORT ' + process.env.PORT)
    });
}).catch((err) => {
    console.log(err.message)
});
