export const flutter = {
    /**
     *   const payload = {
        amount: getSubscriptionPrice(plan, billingFrequency),
        currency: 'NGN',
        email: user.email,
        fullname: user.name,
        tx_ref: tx_ref,
        payment_plan: billingFrequency,
        card_number: '5531886652142950',
        cvv: '564',
        expiry_month: '09',
        expiry_year: "32",
        redirect_url: `${process.env.CLIENT_REDIRECT_URI}/subscription-payment`,
        enckey: process.env.FLUTTERWAVEENCRYPTIONKEY
    }

    const flutterwaveChargeCardResponse = await flw.Charge.card(payload);

    const authorizationMode = flutterwaveChargeCardResponse["meta"]["authorization"]["mode"];

    if(authorizationMode === 'pin'){
        payload["authorization"] = {
            mode: "pin",
            pin: "3310"
        }

        const chargeChargeWithAuthentication = await flw.Charge.card(payload);
    
        console.log({chargeChargeWithAuthentication})

        return new ApiResponse(200, 'handle payment test', {
            data: {
                otpLink: chargeChargeWithAuthentication["meta"]["authorization"]["redirect"], flwRef: chargeChargeWithAuthentication["data"]["flw_ref"]
            }
        }).send(res);
    } else {
        payload["authorization"] = {
            "mode": "avs_noauth",
            "city": "San Francisco",
            "address": "69 Fremont Street",
            "state": "CA",
            "country": "US",
            "zipcode": "94105"
        }

        const chargeChargeWithAuthentication = await flw.Charge.card(payload);

        return new ApiResponse(200, 'handle payment test', {
            data: {
                otpLink: chargeChargeWithAuthentication["meta"]["authorization"]["redirect"],
                flwRef: chargeChargeWithAuthentication["data"]["flw_ref"]
            }
        }).send(res);
    }
     */
}