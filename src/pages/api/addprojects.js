import Project from "../../models/Project"
import connectDb from "../../middleware/mongoose"


const handler =  async (req, res)=> {
    if (req.method == 'POST'){
        for (let i=0; i<req.body.length; i++){
        let h = new Project({
             title: req.body[i].title ,
             slug: req.body[i].slug ,
             desc: req.body[i].desc ,
             img: req.body[i].img ,
             blockimg: req.body[i].blockimg ,
             component: req.body[i].component ,
             branch: req.body[i].branch ,
             video: req.body[i].video ,
             price: req.body[i].price ,
             availableQty: req.body[i].availableQty ,
        })
        await h.save()
    }
    res.status(200).json({ success:"sucess"})
        
    }
    else{
        res.status(400).json({ error: "This method is not allowed"})
    }
    
}

export default connectDb(handler);



