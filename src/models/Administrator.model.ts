import mongoose, { Schema, type Document, type ObjectId } from 'mongoose'

enum Permission {
    READ_TASK = 'READ_TASK',
    WRITE_TASK = 'WRITE_TASK',
    DELETE_TASK = 'DELETE_TASK',
    READ_USER = 'READ_USER',
    WRITE_USER = 'WRITE_USER',
    DELETE_USER = 'DELETE_USER',
    READ_REPORT = 'READ_REPORT'
}

interface AdministratorDocument extends Document{
    user: ObjectId;
    permissions: Permission[];
}

const AdministratorSchema = new Schema<AdministratorDocument>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user', 
        required: true
      },
      permissions: [{
        type: String,
        enum: Object.values(Permission),
      }],
    },
{
    timestamps: true
})

const Administrator = mongoose.model<AdministratorDocument>('administrator', AdministratorSchema)

export { Administrator }