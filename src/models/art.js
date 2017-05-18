module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    
    const artSchema = new Schema({
        title: String,
        content: String,
        description: String,
        artist: Schema.Types.ObjectId,
        createdAt: Date
    }, { versionKey: false, collection: 'arts' });

    const Art = mongoose.model('Art', artSchema);

    this.findArts = (query) => {
        return Art.find(query).lean().exec();
    };

    this.findById = (id) => {
        return Art.findById(id).lean().exec();
    };

    this.create = (params) => {
        params.createdAt = Number(Date.now());

        return (new Art(params)).save();
    };

    this.remove = (id) => {
        return Art.findByIdAndRemove(id).exec();
    };

    this.update = (id, params) => {
        return Art.findByIdAndUpdate(id, params).exec();
    };

    this.model = Art;
    return this;
};