module.exports = function (mongoose) {
    const Schema = mongoose.Schema;

    const artistSchema = new Schema({
        name: String,
        nickname: String,// TODO:  name must be unique.
        email: String,// TODO:  email must be unique.
        password: String,// TODO: don't store the password directly create AUTH system.
        createdAt: Date
    }, { versionKey: false, collection: 'artists' });

    const Artist = mongoose.model('Artist', artistSchema);

    const findArtists = (query) => {
        return Artist.find(query).lean().exec();
    };

    const findById = (id) => {
        return Artist.findById(id).lean().exec();
    };

    const findByEmail = (email) => {
        return Artist.findOne({ 'email': email }).lean().exec();
    };

    const create = params => {
        params.createdAt = Number(Date.now());

        return (new Artist(params)).save();
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