import axios from "axios"

export default async function handler(req,res){

  try{

    const { url } = req.body

    const response = await axios.post(
      "https://www.tikwm.com/api/",
      {},
      {
        params:{
          url,
          hd:1
        },
        headers:{
          "Content-Type":"application/json"
        }
      }
    )

    const data = response.data.data

    res.status(200).json({
      status:true,
      title:data.title,
      video:"https://www.tikwm.com" + data.hdplay
    })

  }catch(e){

    res.status(500).json({
      status:false,
      message:e.toString()
    })

  }

}