var mongoose= require('mongoose');
var commonConfig = require('./config.json');

var host= commonConfig.DBURL+commonConfig.DB;
const options = {
    useNewUrlParser: true,
};
mongoose.connect(host, options).then(()=>{
}).catch(err=>{
    console.log(err);
})

module.exports=mongoose;
