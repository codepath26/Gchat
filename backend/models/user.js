import sequelize from '../utils/database.js'
import {DataTypes} from 'sequelize'

const User = sequelize.define('user',{
  userName : {
    type : DataTypes.STRING,
    allowNull : false,
    
  },
  email : {
    type : DataTypes.STRING,
    allowNull : false,
    unique : true,
    validate : {
      isEmail : true,
    },
  },
  password : {
    type :  DataTypes.TEXT ,
    allowNull : false,
  },

  
})


export default User