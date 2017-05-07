module.exports = function (mongoose) {
    const Schema = mongoose.Schema;

    const artistSchema = new Schema({
        name: String,
        nickname: String,
        email: String,
        password: String,
        createdAt: Date
    }, { versionKey: false, collection: 'artists' });

    const Artist = mongoose.model('Artist', artistSchema);

    const findArtists = (query) => {
        return Artist.find(query).lean().exec();
    };

    // TODO: Create CRUD operations for model

    return {
        Artist: Artist,
        findArtists: findArtists
    };
};