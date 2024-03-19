import mongoose, { Schema, type Document, type ObjectId } from 'mongoose'

export interface SessionDocument extends Document {
  user: ObjectId
  valid: boolean
  userAgent: string
  createdAt: Date
  updatedAt: Date
}

const SessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    valid: { type: Boolean, default: true },
    userAgent: { type: String },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model<SessionDocument>("session", SessionSchema)

export { Session }