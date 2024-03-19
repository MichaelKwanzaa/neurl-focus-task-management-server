import mongoose, { Schema, type Document, type ObjectId } from 'mongoose'

interface AuditLogDocument extends Document{
 // User who performed the action
 user: string;
 // Action performed (e.g., "created task", "updated user")
 action: string;
 // Affected resource (e.g., task ID, user ID)
 target: string;
 // Data before the action (optional, depending on your needs)
 dataBefore: object;
 // Data after the action (optional, depending on your needs)
 dataAfter: object;
}

const AuditLogSchema = new Schema<AuditLogDocument>({
    user: {
        userId: { type: String, required: true },
        username: { type: String, required: true },
      },
      action: { type: String, required: true },
      target: { type: String, required: true },
      dataBefore: { type: Object },
      dataAfter: { type: Object },
},
{
    timestamps: true
})

const AuditLog = mongoose.model<AuditLogDocument>('audit-log', AuditLogSchema)

export { AuditLog }