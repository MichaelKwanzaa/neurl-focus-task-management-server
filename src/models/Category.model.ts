import mongoose, { Schema, type Document, type ObjectId } from 'mongoose'

interface CategoryDocument extends Document{
    user: ObjectId;
    name: string;
    description: string;
}

const CategorySchema = new Schema<CategoryDocument>({
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    name: { 
        type: String,
        required: true
    },
    description: { 
        type: String
    }
},
{
    timestamps: true
})

const Category = mongoose.model<CategoryDocument>('category', CategorySchema)

export { Category }