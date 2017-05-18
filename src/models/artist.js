const bcrypt = require('bcrypt');

module.exports = app => {

    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    
    // Validate email and nickname. 
    // TODO: refactor model isUnique out, make it more pleasent.
    const isUnique = (property) => {
        return (val, cb) => {
            let obj = {};
            obj[property] = val;
            Artist.findOne(obj)
            .exec()
            .then(data => {
                if (!data) return cb(true);
                cb(false);

            })
            .catch(err => {
                // data does not exists.
                console.log(err);
                cb(true);
            });  
        };
    };

    const artistSchema = new Schema({
        
        name: {
            type: String,
            required: true
        },

        nickname: {
            type: String,
            validate: {
                isAsync: true,
                validator: isUnique('nickname'), 
                message: 'nickname already exists'
            },
            required: true
        },

        email: {
            type: String,
            validate: {
                isAsync: true,
                validator: isUnique('email'), 
                message: 'email already exists'
            },
            required: true
        },

        password: {
            type: String,
            required: true
        },

        isVerified: {
            type: Boolean,
            default: false
        },

        createdAt: Date
    }, { versionKey: false, collection: 'artists' });

    
    const Artist = mongoose.model('Artist', artistSchema);
    
    this.findArtists = query => {
        return Artist.find(query).lean().exec();
    };

    this.findById = id => {
        return Artist.findById(id).lean().exec();
    };

    this.findByEmail = email => {
        return Artist.findOne({ 'email': email }).lean().exec();
    };

    this.create = params => {
        params.createdAt = Number(Date.now());

        // salt round 10
        return bcrypt.hash(params.password, 10)
        .then(hash => {
            params.password = hash;
        }).then(() => {
             return (new Artist(params)).save();
        });
    };

    this.update = (id, params) => {
        return Artist.findByIdAndUpdate(id, params).exec();
    };

    this.remove = id => {
        return Artist.findByIdAndRemove(id).exec();
    };

    this.model = Artist;
    return this;
};