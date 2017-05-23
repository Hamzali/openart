module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    
    const artSchema = new Schema({
        title: String,
        content: String,
        description: String,
        artist: Schema.Types.ObjectId,
        likeCount: {
            type: Number,
            default: 0
        },
        viewCount: {
            type: Number,
            default: 0
        },
        commentCount: {
            type: Number,
            default: 0
        },
        createdAt: Date
    }, { versionKey: false, collection: 'art' });

    const Art = mongoose.model('Art', artSchema);
    
    const updateCount = app.utils.model.updateCount(Art);

    this.findArts = (query) => {
        return Art.find(query).lean().exec();
    };

    this.findById = (id) => {
        return Art.findById(id).lean().exec().then(art => {
            if (!art) throw new Error('invalid data retrieved from db.');
            return art;
        });
    };

    this.create = (params) => {
        params.createdAt = Number(Date.now());

        return (new Art(params)).save().then(art => art._id);
    };

    this.remove = (id, artist) => {
        return Art.findById(id).exec()
        .then(art => {
            if (!art) throw new Error('no such data!');

            if (art.artist.toString() !== artist) throw new Error('Artist do not own art.');

            return art.remove();
        });
    };

    
    this.update = (id, artist, params) => {
        return Art.findById(id).exec()
        .then(art => {
            if (!art) throw new Error('No art found.');

            if (art.artist.toString() !== artist) throw new Error('Artist do not own art.');

            for (var prop in params) {
                art[prop] = params[prop];
            }

            return art.save();
        });
    };

    
    this.incViewCount = updateCount('viewCount', 1);
    
    this.incLikeCount = updateCount('likeCount', 1);
    this.decLikeCount = updateCount('likeCount', -1);

    this.incCommentCount = updateCount(Art, 'commentCount', 1);

    this.model = Art;
    return this;
};