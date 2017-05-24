const uuid = require('uuid');

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    
    const verifySchema = new Schema({
        artist: {
            type: String
        },

        token: String,
        expires: Date
    }, { versionKey: false, collection: 'verification' });
    
    const Verify = mongoose.model( 'Verify', verifySchema);

    const isUnique = app.utils.model.isUnique(Verify);
    
    Verify.schema.path('artist').validate({
        isAsync: true,
        validator: isUnique('artist'),
        message: 'Token already created.'
    });
        
    this.create = (email) => {
        const expires = new Date();
        expires.setHours(expires.getHours() + 6);// 6 hours limit.
        
        const token = uuid.v4();

        return (new Verify({
            artist: email,
            token: token,
            expires: expires
        })).save()
        .then(v => {
            return v.token;
        });
    };

    this.findAndVerify = token => {
        return Verify.findOne({ token: token }).lean().exec()
        .then(v => {
            if (!v) throw new Error('Token does not exist.');
            if (Date.now() > new Date(v.expires)) throw new Error('expired');

            return v;
        });
    };

    this.updateToken = email  => {
        const expires = new Date();
        expires.setHours(expires.getHours() + 6);// 6 hours limit.

        const token = uuid.v4();

        return Verify.findOneAndUpdate({ artist: email }, 
        { $set: { token: token, expires: expires } }, 
        { new: true }).then(v => {
            if (!v) throw new Error('No such verify token with email:' + email);
            return v.token;
        });
    };

    this.remove = id => {
        return Verify.findByIdAndRemove(id).exec();
    };

    this.removeWithToken = t => {
        return Verify.findOneAndRemove(t).exec();
    };
    
    this.model = Verify;

    return this;
};