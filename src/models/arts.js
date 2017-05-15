module.exports = (mongoose) => {
    const Schema = mongoose.Schema;
    
    const artSchema = new Schema({
        title: String,
        content: String,
        description: String,
        createdAt: Date
    }, { versionKey: false, collection: 'arts' });

    const Art = mongoose.model('Art', artSchema);

    const findArts = (query) => {
        return Art.find(query).lean().exec();
    };

    const findById = (id) => {
        return Art.findById(id).lean().exec();
    };

    const create = (params) => {
        params.createdAt = Number(Date.now());

        return (new Art(params)).save();
    };

    const remove = (id) => {
        return Art.findByIdAndRemove(id).exec();
    };

    const update = (id, params) => {
        return Art.findByIdAndUpdate(id, params).exec();
    };

    return {
        findArts: findArts,
        findById: findById,
        create: create,
        remove: remove,
        update: update,
        Art: Art
    };
};