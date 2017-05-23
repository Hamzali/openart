const bcrypt = require('bcrypt');

module.exports = app => {

    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    
    // let Artist;
    // const isUnique = app.utils.model.isUnique(Artist);

    const isUnique = property => {
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
                if (process.env.NODE_ENV === 'dev') console.log(err);
                
                cb(true);
            });  
        };
    };

    const artistSchema = new Schema({
        
        name: {
            type: String,
            required: true
        },

        nick: {
            type: String,
            validate: {
                isAsync: true,
                validator: isUnique('nick'), 
                message: 'nick already exists'
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
    }, { versionKey: false, collection: 'artist' });

    
    const Artist = mongoose.model('Artist', artistSchema);

    this.findArtists = query => {
        return Artist.find(query).lean().exec().then(artists => {
            return artists.map((artist) => {
                
                delete artist.password;
                delete artist.email;

                return artist;
            });
        });
    };

    this.findById = id => {
        return Artist.findById(id).lean().exec().then(artist => {
            if (!artist) throw new Error('No artist found!');

            delete artist.password;

            return artist;
        });
    };

    this.findByEmail = email => {
        return Artist.findOne({ 'email': email }).lean().exec()
        .then(artist => {
            if (!artist) {
                throw new Error('No such user found with ' + email + '.');
            }
            return artist;
        });
    };

    this.create = params => {
        params.createdAt = Number(Date.now());

        // salt round 10
        return bcrypt.hash(params.password, 10)
        .then(hash => {
            params.password = hash;
        }).then(() => {
             return (new Artist(params)).save();
        }).then(artist => {
            return artist.email;
        });
    };


    this.update = (id, params) => {
        return Artist.findByIdAndUpdate(id, params, { new: true }).exec()
        .then(artist => {
            if (!artist) throw new Error('something went wrong!');
            return artist;
        });
    };

    this.updatePassword = (email, password)  => {
        
        return bcrypt.hash(password, 10)
        .then(hash => {
            return Artist.findOneAndUpdate({ 'email': email }, { $set: { password: hash } });
        }).then(artist => {
            if (!artist) throw new Error('No such user in db.');
            
            delete artist.password;

            return artist;
        });

    };

    this.verify = (email) => {
        return Artist.findOneAndUpdate({ 'email': email }, { $set: { isVerified: true } });
    };

    this.remove = id => {
        return Artist.findByIdAndRemove(id).exec();
    };

    this.model = Artist;
    return this;
};