import Admin from "../models/admin.js";
import sequelize from "../utils/database.js";

export const makeAdmin = async (req,res,next)=>{
  const t = await sequelize.transaction();
  const userId = req.qurey.userId;
  const gpId = req.qurey.gpId;
  try
  {
     await Admin.create({
      userId : userId,
      groupchatId: gpId,
     },{transaction : t}
     );
     await t.commit();
     res.status(200).json({success : true})
  }
  catch(err)
  {
    await t.rollback();
    console.log(err);
    res.status(500).json({success : false});
  }
};



export const removeAdmin = async(req,res,next)=>{
  const t = await sequelize.transaction();
  const userId = req.qurey.userId;
  const gpId = req.qurey.gpId;
  try{
    const findAdmin = await Admin.findOne({where : {
      userId : userId,
      groupchatId : gpId,
    }},{transaction : t}
    );
    await findAdmin.destroy({transaction : t});
    await t.commit();
    res.json({
      success : true,
    });
  }
  catch(err){
    console.log(err)
    await t.rollback();
    res.status(500).json({success : false});
  }
  
};