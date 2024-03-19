import { type Request, type Response, type NextFunction } from 'express'
import { Subscription, User } from '../models';
import { v4 as uuidv4 } from 'uuid'
import { ApiResponse } from '../utils/ApiResponse.util';
import Flutterwave from 'flutterwave-node-v3';
import axios from 'axios';


export const SubscribeUser = async (req: Request, res: Response, next: NextFunction) => {
    try{
    const { plan, billingFrequency, price, startDate, paymentMethod } = req.body;

    const flw = new Flutterwave(process.env.FLUTTERWAVEPUBLICKEY, process.env.FLUTTERWAVEPRIVATEKEY);

    const userId = req.user['id'];

    const user = await User.findById(userId);

    if (!user) {
        return new ApiResponse(404, 'User not found', {}).send(res);
    }

    const tx_ref = generateTransactionRef();

    const subscription = new Subscription({
        user: userId,
        plan: plan,
        billingFrequency: billingFrequency,
        price: getSubscriptionPrice(plan, billingFrequency),
        startDate: new Date(),
        endDate: billingFrequency === 'monthly' ? 
        new Date(new Date().getTime() + 31 * 24 * 60 * 60 * 1000) :
        new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
        status: 'pending',
        paymentMethod: paymentMethod,
        metadata: { tx_ref },
      });

      await subscription.save();

      if(!subscription){
        return new ApiResponse(500, 'Something went wrong', {})
      }  

  

    //   const response = await axios.post("https://api.flutterwave.com/v3/payments", paymentData,
    //   {
    //     headers: {
    //     "Authorization": process.env.FLUTTERWAVEPRIVATEKEY
    //     }
    // })
   

    // const paymentLink = response["data"]["data"]["link"]

    return new ApiResponse(200, 'handle payment test', {}).send(res);
    } catch(error){
        console.log(error) 
    }
}

export const HandleSubscriptionCallback = (req: Request, res: Response, next: NextFunction) => {
    try{
        const { txRef } = req.body;

        console.log(txRef)

    }catch(error){

    }
}

function getSubscriptionPrice(plan: string, billingFrequency: string): number {
    // Implement your pricing logic here in Nigerian Naira
    // For example:
    if (plan === 'basic' && billingFrequency === 'monthly') return 3000; // ₦3,000
    if (plan === 'basic' && billingFrequency === 'yearly') return 30000; // ₦30,000
    // Add more cases for other plans and frequencies
    return 0;
}

function generateTransactionRef(): string {
    // You can use a library like uuid or implement your own logic
    return uuidv4();
  }
