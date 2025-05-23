import mongoose from 'mongoose';

const emailQueueSchema = new mongoose.Schema({
    to: { type: String, required: true },
    templateData: { type: Object, required: true },
    status: { type: String, default: 'pending' }, 
    attempts: { type: Number, default: 0 },
    lastAttempt: { type: Date }
}, { timestamps: true });

const EmailQueue = mongoose.model('EmailQueue', emailQueueSchema);

export default EmailQueue;
