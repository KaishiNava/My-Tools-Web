import FormData from "form-data"
import fetch from "node-fetch"

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

    const file = await parse(req)

    const form = new FormData()

    form.append("reqtype","fileupload")

    form.append("fileToUpload",file,{
      filename:"upload.bin"
    })

    const upload = await fetch(
      "https://catbox.moe/user/api.php",
      {
        method:"POST",
        body:form,
        headers:form.getHeaders()
      }
    )

    const result = await upload.text()

    res.status(200).json({
      status:true,
      result:[
        {
          host:"Catbox",
          url:result
        }
      ]
    })

  }catch(e){

    res.status(500).json({
      status:false,
      message:"Upload Error"
    })

  }

}