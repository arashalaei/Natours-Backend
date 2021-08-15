const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, 'The tour must have a name.'],
        unique: true,
        trim: true,
        minLength:[10, 'The tour\'s name must be over than 10 chars'],
        maxLength:[40, 'The tour\'s name must be less than 40 chars']
    },
    duration:{
        type: Number,
        required: [true, 'Please specify duration of the tour'],
        trim: true
    },
    startLocation:{
        description: String,
        type: {
            type: String,
            enum:['Point'],
            default: 'Point'
        },
        coordinates: [Number],
        address: String
    },
    ratingsAverage:{
        type: Number,
        min:[1, 'Min of the rating average is 1'],
        max:[5, 'Max of the ratings average is 5'],
        default: 4.5
    },
    ratingsQuantity:{
        type: Number,
        default: 0
    },
    images:[String],
    startDates:[String],
    maxGroupSize: Number,
    difficulty:{
        type: String,
        required: [true, 'The tour must have a difficulty property'],
        enum:{
            values: ['Easy', 'Medium', 'Hard'],
            message: ['Difficulty is either: Easy | Medium | Hard']
        },
        trim: true
    },
    guides:[String],
    price: {
        type: Number,
        required:[true, 'The tour must have a price.']
    },
    summary: String, 
    description: String, 
    imageCover: String, 
    locations: [
        {
            description: String, 
            type: {
                type: String, 
                enum: ['Point'],
                default: ['Point']
            },
            coordinates: [Number], 
            address: String
        }
    ], 
    priceDiscount:{
        type: Number, 
        validate: {
            validator: function(val){
                return val < this.price
            }, 
            message: 'Discount price ({VALUE}) should be reqular price.'
        }
    }
},{
    toJSON: {virtuals: true}, 
    toObject: {virtuals: true}
})

tourSchema.virtual('durationWeeks').get(function(){
    return this.duration / 7; 
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour; 