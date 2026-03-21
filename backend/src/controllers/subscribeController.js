import { createSubscription } from "../services/subscriptionService.js"

export const subscribe = async (req,res)=>{

  try{

    const { email } = req.body

    const result = await createSubscription(email)

    res.json(result)

  }catch(error){

    console.error(error)

    res.status(500).json({
      success:false,
      message:"Server error"
    })

  }

}