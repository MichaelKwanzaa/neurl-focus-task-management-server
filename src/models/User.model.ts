import mongoose, { Schema, type Document, type ObjectId } from 'mongoose'
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid'


interface UserDocument extends Document{
    name: string
    userId: string
    email: string
    picture: string
    password: string
    role: 'user' | 'admin'
    subscriptions: ObjectId[]
    tasks: ObjectId[]
    notifications: ObjectId[]
    settings: ObjectId
}

const UserSchema = new Schema<UserDocument>({
    name: { type: String, required: true, index: true, trim: true, lowercase: true },
    userId: { type: String, required: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    picture: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    subscriptions: [{
        type: Schema.Types.ObjectId,
        ref: 'subscription'
    }],
    tasks: [{ 
        type: Schema.Types.ObjectId,
        ref: 'task'
    }],
    notifications: [{
        type: {type: String},
        read: {type: Boolean, default: false}
    }],
    settings: {
        type: Schema.Types.ObjectId,
        ref: 'setting'
    }
},
{
    timestamps: true
})


UserSchema.methods.comparePassword = async function (
    candidatePassword: string
  ): Promise<boolean> {
    const user = this as UserDocument;
  
    return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

const User = mongoose.model<UserDocument>('user', UserSchema)

export { User }