require('dotenv').config({path:'./config.env'});
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('./../../models/tourModel');

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

const tours = JSON.parse(fs.readFileSync(path.join(__dirname, './tours.json')));

const importDevData = async () => {
    try {
        await Tour.create(tours, {validateBeforeSave: false});
        console.log('Data successfuly imprted.');
    } catch (error) {
        console.log(error);
    } finally {
        process.exit(0);
    }
};

const deleteDevData = async () => {
    try {
        await Tour.deleteMany({});
        console.log('Data successfuly deleted.');
    } catch (error) {
        console.log(error);
    } finally{
        process.exit(0);
    }
};

((process.argv[2] === '--import') && importDevData()) || ((process.argv[2] === '--delete') && deleteDevData()); 