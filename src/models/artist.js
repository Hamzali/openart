const bcrypt = require('bcrypt');

module.exports = app => {

    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    
    const artistSchema = new Schema({
        
        name: {
            type: String,
            required: true
        },

        nick: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },

        password: {
            type: String,
            required: true
        },

        avatar: String,

        isVerified: {
            type: Boolean,
            default: false
        },

        loc: {
            type: [Number],
            index: '2d'
        },

        birthday: Date,

        bio: String, // TODO: Validate bio, birthday.

        createdAt: Date
    }, { versionKey: false, collection: 'artist' });

    // artistSchema.index({ location: '2dsphere' });

    
    const Artist = mongoose.model('Artist', artistSchema);

    // Validators
    const isUnique = app.utils.model.isUnique(Artist);

    Artist.schema.path('email').validate({
        validator: isUnique('email'),
        isAsync: true,
        message: 'email already exists'
    });

    Artist.schema.path('nick').validate({
        validator: isUnique('nick'),
        isAsync: true,
        message: 'nick already exists'
    });

    this.findArtists = query => {
        return Artist.find(query).lean().exec().then(artists => {
            return artists.map((artist) => {
                
                delete artist.password;
                delete artist.email;
                delete artist.location;
                delete artist.bio;

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
        params.avatar = 'https://localhost:3030/avatars/default_avatar_' + Math.floor(Math.random() * 50) + '.svg';

        // salt round 10
        return bcrypt.hash(params.password, 10)
        .then(hash => {
            params.password = hash;
            return (new Artist(params)).save();
        }).then(artist => {
            return artist.email;
        });
    };


    this.update = (id, params) => {

        const validateUpdate = property => {
            return isUnique(property)(params[property], (isValid) => {
                // console.log(`isUnique callback: newVal: ${params[property]} isValid: ${isValid}`);
                if (!isValid) return new Error(property + ' already exists.');
            });
        };
    
        return Artist.findById(id).exec().then(artist => {
            if (!artist) throw new Error('No user found.');

            // encrypt password for db.
            if (params.password) {
                return bcrypt.hash(params.password, 10)
                .then(hash => {
                    params.password = hash;
                    return artist;
                });
            } else {
                return artist;
            }

        })
        .then(artist => {
            // format location data for database.
            if (params.location) {
                params.location = {
                    type: 'Point',
                    coordinates: params.location
                };
            }

            return artist;
        })
        .then(artist => {
            if (params.nick) {
                return validateUpdate('nick').then((err) => {
                    if (err) throw err;
                    return artist;
                });
            }
            
            return artist;
        })
        .then(artist => {
            
            if (params.email) {
                return validateUpdate('email').then((err) => {
                    if (err) throw err;
                    return artist;
                });
            }
            
            return artist;
                  
        })
        .then(artist => {
            for (var prop in params) {
                artist[prop] = params[prop];
            }

            return artist.save({ validateBeforeSave: false });
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