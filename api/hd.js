import axios from "axios"
import FormData from "form-data"

export const config = {
  api: {
    bodyParser: false
  }
}

async function parse(req){

  return new Promise((resolve,reject)=>{

    const chunks=[]

    req.on("data",(chunk)=>{
      chunks.push(chunk)
    })

    req.on("end",()=>{
      resolve(Buffer.concat(chunks))
    })

    req.on("error",reject)

  })

}

export default async function handler(req,res){

  try{

    const body = await parse(req)

    const upload = await axios.post(
      "https://catbox.moe/user/api.php",
      (()=>{

        const form = new FormData()

        form.append("reqtype","fileupload")
        form.append("fileToUpload",body,{
          filename:"image.jpg"
        })

        return form

      })(),
      {
        headers:{
          ...new FormData().getHeaders
        }
      }
    )

    const imageUrl = upload.data

    const hd = await axios.get(
      `https://api.obscuraworks.org/api/v2/tools/upscale?url=${encodeURIComponent(imageUrl)}`,
      {
        responseType:"arraybuffer",
        headers:{
          Authorization:"Bearer obs-N9GacfsE5SDVNuAMk4Wu"
        }
      }
    )

    const base64 = Buffer.from(hd.data).toString("base64")

    res.status(200).json({
      status:true,
      result:`data:image/jpeg;base64,${base64}`
    })

  }catch(e){

    res.status(500).json({
      status:false,
      message:"Error HD"
    })

  }

}