import mongoose, { Schema, type Document, type ObjectId } from 'mongoose'

interface PaymentDocument extends Document{
    user: ObjectId;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed';
    paymentMethod: string;
}

const PaymentSchema = new Schema<PaymentDocument>({
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'user',
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      currency: {
        type: String,
        required: true
      },
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
      },
      paymentMethod: {
        type: String,
        required: true
      }
},
{
    timestamps: true
})

const Payment = mongoose.model<PaymentDocument>('payment', PaymentSchema)

export { Payment }