import mongoose, { Schema, type Document, type ObjectId } from 'mongoose'

interface SubtaskDocument extends Document{
    title: string;
    description: string;
    isCompleted: boolean;
    order: number; // Index of the subtask within the parent task
    estimatedTime: number; // (in minutes)
    notes: string;
}

const SubtaskSchema = new Schema<SubtaskDocument>({
    title: { type: String, required: true },
    description: { type: String },
    isCompleted: { type: Boolean, default: false },
    order: { type: Number, required: true },
    estimatedTime: { type: Number },
    notes: { type: String },
},
{
    timestamps: true
})

const Subtask = mongoose.model<SubtaskDocument>('subtask', SubtaskSchema)

export { Subtask } 