import Project from "../../models/Project"
import connectDb from "../../middleware/mongoose"


const handler = async (req, res) => {
    if (req.method == 'POST') {
        const {title,slug,desc,img,blockimg,component,branch,video,price,availableQty} = req.body
        let u = new Project({title,slug,desc,img,blockimg,component,branch,video,price,availableQty})
        await u.save()
        res.status(200).json({ success: "success"})

       
    }
    else {
        res.status(400).json({error: "This method is noot allowed"})
       
       

        
        
    }
}
export default connectDb(handler);