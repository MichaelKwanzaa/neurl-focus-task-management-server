import mongoose, { Schema, type Document, type ObjectId } from 'mongoose'

interface ReportingDocument extends Document{
    user: ObjectId; // Reference to the User model (if relevant)
    reportType: string; // Type of report (e.g., "sales", "user activity")
    data: Object; // Stores report data (structure depends on report type)
    startDate: Date; // Optional, start date for the report data
    endDate: Date; // Optional, end date for the report data
    generatedAt: Date; // Timestamp when the report was generated
    status: string //(e.g., "pending", "generated", "failed")
}

const ReportingSchema = new Schema<ReportingDocument>({
    user: { type: Schema.Types.ObjectId, ref: 'User' }, // Optional, relevant if reports are user-specific
    reportType: { type: String, required: true },
    data: { type: Object, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    generatedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'generated', 'failed'] }

},
{
    timestamps: true
})

const Reporting = mongoose.model<ReportingDocument>('reporting', ReportingSchema)

export { Reporting }