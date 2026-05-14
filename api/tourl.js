import formidable from "formidable"
import fs from "fs"
import FormData from "form-data"
import fetch from "node-fetch"

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(req,res){

  const form = formidable({})

  form.parse(req, async(err,fields,files)=>{

    try{

      if(err){
        return res.status(500).json({
          status:false,
          message:"Form error"
        })
      }

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

      const upload = await fetch(
        "https://catbox.moe/user/api.php",
        {
          method:"POST",
          body:formData,
          headers:formData.getHeaders()
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
        message:e.toString()
      })

    }

  })

}