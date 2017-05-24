module.exports = () => {
    // Model unique validator.
    this.isUnique = model => {
        return property => {
            return async (val, cb) => {
                let obj = {};
                obj[property] = val;
                
                let result;
                try {
                    result = await model.findOne(obj).exec();
                    
                    if (result) {
                        return cb(false);
                    }

                    
                } catch (err) {
                    console.log(err);
                }
                
                return cb(true);
            };
        };
    };

    // Counter field helper function.
    this.updateCount = (model) => {
        return (path, val) => 
            id => 
                model.findById(id).lean().exec().then(d => {
                    d[path] += val;
                    d.save();
                });
    };
    
    return this;
};