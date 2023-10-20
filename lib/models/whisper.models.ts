import mongoose from 'mongoose'

const whisperSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    parentId: {
        type: String
    },
    children:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Whisper'
        }
    ]
});

const Whisper = mongoose.models.Whisper || mongoose.model('Whisper', whisperSchema);

export default Whisper;