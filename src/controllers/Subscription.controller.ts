import { type Request, type Response, type NextFunction } from 'express'
import { Subscription, User } from '../models';
import { v4 as uuidv4 } from 'uuid'
import { ApiResponse } from '../utils/ApiResponse.util';
import Flutterwave from 'flutterwave-node-v3';
import axios from 'axios';
import https from 'https';


export const SubscribeUser = async (req: Request, res: Response, next: NextFunction) => {
   
    try{
    const paystack = require("paystack-api")(process.env.PAYSTACKPRIVATEKEY);

    const { plan, billingFrequency } = req.body;

    const userId = req.user['_id'];

    const user = await User.findById(userId);

    if (!user) {
        return new ApiResponse(404, 'User not found', {}).send(res);
    }


    const userEmail = user['email']

    const priceTest = getSubscriptionPrice(plan, billingFrequency)

    const getOptions = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACKPRIVATEKEY}`,
        }
    }

    const plans = await axios.get('https://api.paystack.co/plan', getOptions)

    console.log(plans.data.data);

    let planCode = null;

    if(billingFrequency === 'monthly'){
        const activePlan = plans.data.data.find(plan => plan.interval === 'monthly');
        planCode = activePlan['plan_code'];
    } else {
        const activePlan = plans.data.data.filter(plan => plan.interval !== 'monthly')[0];
        planCode = activePlan['plan_code'];
    }


    const params = {
        email: userEmail,
        amount: priceTest,
        callback_url: "http://localhost:4200/subscription",
        plan: planCode
      };
      
      const config = {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACKPRIVATEKEY}`,
          'Content-Type': 'application/json'
        }
      };
      
      const response = await axios.post('https://api.paystack.co/transaction/initialize', params, config)
   

    console.log(response);

    const authUrl = response.data.data.authorization_url;

    const tx_ref = response.data.data.reference;

    const rawPrice = getSubscriptionPrice(plan, billingFrequency)

    const subscription = new Subscription({
        user: userId,
        plan: plan,
        billingFrequency: billingFrequency,
        price: getFormattedPrice(rawPrice),
        startDate: new Date(),
        endDate: billingFrequency === 'monthly' ? 
        new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000) :
        new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
        status: 'pending',
        metadata: { 
            tx_ref,

         },
      });

      await subscription.save();

    return new ApiResponse(200, 'Redirecting to payment gateway!', {
        data: authUrl
    }).send(res);
    } catch(error){
        console.log(error) 
    }
}

export const HandleSubscriptionCallback = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { trxref } = req.body;

        const getOptions = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACKPRIVATEKEY}`,
            }
        }
    
        const transactionReference = await axios.get(`https://api.paystack.co/transaction/verify/${trxref}`, getOptions)
    
        if(!transactionReference){
            return new ApiResponse(404, 'Transaction not found!', {}).send(res);
        }
        
        const subscription = await Subscription.findOne({ metadata: { tx_ref: trxref }})

        if(!subscription){
            return new ApiResponse(404, 'Transaction not found!', {}).send(res);
        }

        const paymentGatewayTransaction = transactionReference.data.data;

        if(paymentGatewayTransaction['status'] !== 'success'){
            return new ApiResponse(200, 'Something went wrong with your payment', {}).send(res);
        }

        subscription['status'] = 'active';
        await subscription.save();

        console.log(subscription);

        return new ApiResponse(200, 'Successfully subscribed!', {
        }).send(res);

    }catch(error){

    }
}

function getSubscriptionPrice(plan: string, billingFrequency: string): string {
    // Implement your pricing logic here in Nigerian Naira
    // For example:
    if (plan === 'basic' && billingFrequency === 'monthly') return "150000"; // ₦1,500
    if (plan === 'basic' && billingFrequency === 'yearly') return "1500000"; // ₦15,000
    // Add more cases for other plans and frequencies
    return "0";
}

function getFormattedPrice(priceString) {
    // Convert the price string to a number and divide by 100
    let priceNumber = parseInt(priceString, 10) / 100;
    // Convert it back to a string if necessary
    let formattedPrice = priceNumber.toString();
    return formattedPrice;
  }

function generateTransactionRef(): string {
    // You can use a library like uuid or implement your own logic
    return uuidv4();
  }
