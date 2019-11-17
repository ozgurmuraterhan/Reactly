const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CountrySchema = new Schema({
  
  code2: {type:String, required:true, unique:true,},
  code3: {type:String, required:true, unique:true,},
  name: {type:String, required:true, unique:true,},
  capital: {type:String, required:true, unique:true,},
  region: {type:String, required:true, unique:true,},
  subregion: {type:String, required:true, unique:true,},
  states:{
      code: {type:Number, required:true, unique:true,},
      name: {type:String, required:true, unique:true,},
      subdivision: {type:String}
  }
  
}) 

const Country = mongoose.model('country',CountrySchema)

module.exports = Country 