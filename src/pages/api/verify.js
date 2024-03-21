import User from "../../models/User"
import connectDb from "../../middleware/mongoose"

const handler = async (req, res) => {
    if (req.method == 'GET') {
        const { token } = req.query;

        // find user by verification token
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ error: "Invalid verification link" });
        }

        // update user account status
        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.status(200).json({ success: "Your account has been verified" });
    } else {
        res.status(400).json({error: "This method is not allowed"})
      }
  };
  
  export default connectDb(handler);
