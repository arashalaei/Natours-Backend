class APIFeatures {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    filter(){
        const queryObj = {...this.queryStr}
        const excluded = ['fields', 'sort', 'page', 'limit'];
        excluded.forEach(item => delete queryObj[item]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(lt|gt|gte|lte|ne)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort(){ 
        if(this.queryStr.sort){
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields(){
        if(this.queryStr.fields){
            const limitBy = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(limitBy)
        }else{
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate(){
        const limit = +this.queryStr.limit || 100;
        const page  = +this.queryStr.page || 1; 
        const skip  = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = APIFeatures;