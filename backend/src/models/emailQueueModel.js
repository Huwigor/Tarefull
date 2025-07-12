import mongoose from 'mongoose';

const emailQueueSchema = new mongoose.Schema({
    email: { type: String, required: true },
    tokenJwt: { type: String, required: true},
    assunto:{type:String, required:true},
    lastAttempt: { type: Date }
}, { timestamps: true });

const EmailQueue = mongoose.model('EmailQueue', emailQueueSchema);

export default EmailQueue;
