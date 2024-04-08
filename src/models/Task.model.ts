import mongoose, { Schema, type Document, type ObjectId } from 'mongoose'

interface TaskDocument extends Document{
    user: ObjectId;
    title: string;
    description: string;
    priority: string; // Enum for different priorities (e.g., "High", "Medium", "Low")
    category: ObjectId; // Reference to the Category model
    isCompleted: boolean;
    startDate: Date;
    dueDate: Date;
    estimatedTime: number; // (in minutes)
    notes: string;
    timer: string;
    subtasks: Array<Schema.Types.ObjectId>; // Array of references to Subtask models
}

const TaskSchema = new Schema<TaskDocument>({
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ['high', 'medium', 'low'] },
    category: { type: Schema.Types.ObjectId, ref: 'category' },
    isCompleted: { type: Boolean, default: false },
    startDate: { type: Date },
    dueDate: { type: Date },
    estimatedTime: { type: Number },
    notes: { type: String },
    timer: { type: String },
    subtasks: [{ type: Schema.Types.ObjectId, ref: 'subtask' }],
},
{
    timestamps: true
})

const Task = mongoose.model<TaskDocument>('task', TaskSchema)

export { Task }