import axios from "axios"

export default async function handler(req,res){

  try{

    const { url } = req.body

    const response = await axios.get(
      `https://api.nexray.eu.cc/downloader/v1/ytmp3?url=${encodeURIComponent(url)}`
    )

    res.status(200).json({
      status:true,
      title:response.data.result.title,
      audio:response.data.result.url
    })

  }catch(e){

    res.status(500).json({
      status:false,
      message:"YTMP3 Error"
    })

  }

}