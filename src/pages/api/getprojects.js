import Project from "../../models/Project"
import connectDb from "../../middleware/mongoose"


const handler =  async (req, res)=> {
    let projects = await Project.find()
    
   
    
    res.status(200).json({projects})
}

export default connectDb(handler);