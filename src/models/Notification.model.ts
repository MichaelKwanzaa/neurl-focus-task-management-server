import mongoose, { Schema, type Document, type ObjectId } from 'mongoose'

interface NotificationDocument extends Document{
    user: ObjectId;
    title: string;
    message: string;
    read: boolean;
}

const NotificationSchema = new Schema<NotificationDocument>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
      },
      title: {
        type: String,
        required: true
      },
      message: { 
        type: String,
        required: true
      },
      read: {
        type: Boolean,
        default: false
      }
},
{
    timestamps: true
})

const Notification = mongoose.model<NotificationDocument>('notification', NotificationSchema)

export { Notification }