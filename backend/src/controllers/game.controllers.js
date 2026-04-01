import { User } from "../models/user.model.js";


export const saveGameState = async (req,res)=>{
    try {
        const { user_id , coins, level } = req.body;

        if( !user_id || coins === undefined || level === undefined){
            return res.status(400).json({
                message: "Missing credentials"
            })
        }

        const user = await User.findByIdAndUpdate(
            user_id,
            {
                coins:coins,
                level:level
            },
            { new: true }
        );

        return res.json({
            message: "Game saved",
            user: {
                username: user.username,
                coins: user.coins,
                level: user.level
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Game save failed",
            error: error.message
        })
    }
}