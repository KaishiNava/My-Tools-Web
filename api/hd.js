import formidable from "formidable"
import fs from "fs"
import FormData from "form-data"
import fetch from "node-fetch"

export const config = {
  api: {
    bodyParser:false
  }
}

export default async function handler(req,res){

  const form = formidable({})

  form.parse(req, async(err,fields,files)=>{

    try{

      const file = files.file[0]

      const buffer = fs.readFileSync(file.filepath)

      const formData = new FormData()

      formData.append(
        "reqtype",
        "fileupload"
      )

      formData.append(
        "fileToUpload",
        buffer,
        file.originalFilename
      )

      const up = await fetch(
        "https://catbox.moe/user/api.php",
        {
          method:"POST",
          body:formData,
          headers:formData.getHeaders()
        }
      )

      const imageUrl = await up.text()

      const hd = await fetch(
        `https://api.obscuraworks.org/api/v2/tools/upscale?url=${encodeURIComponent(imageUrl)}`,
        {
          headers:{
            Authorization:"Bearer obs-N9GacfsE5SDVNuAMk4Wu"
          }
        }
      )

      const arrayBuffer = await hd.arrayBuffer()

      const base64 = Buffer
      .from(arrayBuffer)
      .toString("base64")

      res.status(200).json({
        status:true,
        result:`data:image/jpeg;base64,${base64}`
      })

    }catch(e){

      res.status(500).json({
        status:false,
        message:e.toString()
      })

    }

  })

}