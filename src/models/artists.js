const bcrypt = require('bcrypt');

module.exports = function (mongoose) {
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

    const findArtists = query => {
        return Artist.find(query).lean().exec();
    };

    const findById = id => {
        return Artist.findById(id).lean().exec();
    };

    const findByEmail = email => {
        return Artist.findOne({ 'email': email }).lean().exec();
    };

    const create = params => {
        params.createdAt = Number(Date.now());

        // salt round 10
        return bcrypt.hash(params.password, 10)
        .then(hash => {
            params.password = hash;
        }).then(() => {
             return (new Artist(params)).save();
        });
    };

    const update = (id, params) => {
        return Artist.findByIdAndUpdate(id, params).exec();
    };

    const remove = id => {
        return Artist.findByIdAndRemove(id).exec();
    };

    return {
        Artist: Artist,
        findArtists: findArtists,
        findById: findById,
        findByEmail: findByEmail, 
        create: create,
        update: update,
        remove: remove
    };
};