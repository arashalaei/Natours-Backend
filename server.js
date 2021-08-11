require('dotenv').config({path:'./config.env'});
const app = require('./app');
const mongoose = require('mongoose');

const DB = process.env.DB_URL.replace(
    '<PASSWORD>',
    process.env.DB_PASSWORD)
mongoose.connect(DB,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
    .then(() => {console.log('DB connection successful!')})
    .catch(e => console.log(e))

    
const PORT = process.env.PORT || 8080;
app.listen(PORT,'0.0.0.0', () => {
    console.log(`Server is listening on port ${PORT}`);
})