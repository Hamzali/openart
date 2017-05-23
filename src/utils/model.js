module.exports = () => {

    this.isUnique = model => {
        return property => {
            return (val, cb) => {
                let obj = {};
                obj[property] = val;
                model.findOne(obj)
                .exec()
                .then(data => {
                    if (!data) return cb(true);
                    cb(false);
                })
                .catch(err => {
                    // data does not exists.
                    if (process.env.NODE_ENV === 'dev') console.log(err);
                    
                    cb(true);
                });  
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