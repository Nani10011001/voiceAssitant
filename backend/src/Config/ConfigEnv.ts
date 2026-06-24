import dotenv from "dotenv"
import path  from "path"
import { fileURLToPath } from "url"

const filename = fileURLToPath(import.meta.url)

const dirfile = path.dirname(filename)

dotenv.config(
    {
        path:path.resolve(dirfile,"../../.env")
    }
)
if(!process.env.PORT) console.log("---PORT--- is undefined")
if(!process.env.MONG_URL) console.log("MONG_URL is undefined")
if(!process.env.VAPI_ASSISTANT_ID) console.log("VAPI_ASSISTANT_IDL is undefined")
    