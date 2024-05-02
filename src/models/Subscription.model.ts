import mongoose, { Schema, type Document, type ObjectId } from 'mongoose'

interface SubscriptionDocument extends Document{
    user: ObjectId; // Reference to the User model
    plan: string; // Type of subscription plan (e.g., "basic", "premium")
    billingFrequency: string; // Enum for billing frequency (e.g., "monthly", "yearly")
    price: number; // Price of the subscription plan
    startDate: Date; // Date the subscription started
    endDate: Date; // Optional, calculated based on billing frequency and start date
    status: string; // Enum for subscription status (e.g., "active", "cancelled", "paused")
    // You might also consider including:
    metadata: {
        tx_ref: string; // Transaction reference from Flutterwave
        // Add any other metadata fields you need
      };
}

const SubscriptionSchema = new Schema<SubscriptionDocument>({
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    plan: { type: String, required: true, enum: ['basic'], default: 'basic' },
    billingFrequency: { type: String, enum: ['monthly', 'yearly'], required: true },
    price: { type: Number, required: true, min: 0 }, // Ensure non-negative price
    startDate: { type: Date,  },
    endDate: { type: Date,  }, // Calculate based on billing frequency and start date
    status: { type: String, enum: ['active', 'cancelled', 'paused', 'pending'], required: true },
    metadata: {
        tx_ref: { type: String, required: true },
        // Add any other metadata fields you need
    },
},
{
    timestamps: true
})
// Virtual fields for calculated end date and next billing date
// SubscriptionSchema.virtual('endDate').get(function () {
//     const startDate = this.startDate;
//     const billingFrequency = this.billingFrequency;
  
//     if (!startDate || !billingFrequency) {
//       return null;
//     }
  
//     const oneYear = 365 * 24 * 60 * 60 * 1000; // milliseconds in a year
  
//     switch (billingFrequency) {
//       case 'monthly':
//         return new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // Add 30 days
//       case 'yearly':
//         return new Date(startDate.getTime() + oneYear); // Add one year
//       default:
//         return null; // Handle unexpected billing frequencies
//     }
//   });
  
//   SubscriptionSchema.virtual('nextBillingDate').get(function () {
//     const startDate = this.startDate;
//     const billingFrequency = this.billingFrequency;
//     const endDate = this.endDate; // Utilize the calculated endDate
  
//     if (!startDate || !billingFrequency) {
//       return null;
//     }

//     const oneYear = 365 * 24 * 60 * 60 * 1000; // milliseconds in a year

//     if (!endDate) {
//       // If no end date, next billing date is based on start date and billing frequency
//       switch (billingFrequency) {
//         case 'monthly':
//           return new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // Add 30 days
//         case 'yearly':
//           return new Date(startDate.getTime() + oneYear); // Add one year
//         default:
//           return null;
//       }
//     } else {
//       // If end date exists, next billing date is after the end date based on billing frequency
//       switch (billingFrequency) {
//         case 'monthly':
//           return new Date(endDate.getTime() + 30 * 24 * 60 * 60 * 1000); // Add 30 days
//         case 'yearly':
//           return new Date(endDate.getTime() + oneYear); // Add one year
//         default:
//           return null;
//       }
//     }
//   });


const Subscription = mongoose.model<SubscriptionDocument>('subscription', SubscriptionSchema)

export { Subscription }