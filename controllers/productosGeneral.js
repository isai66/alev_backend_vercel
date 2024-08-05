const db = require('../models/db')

module.exports.productosGeneral = (req, res) =>{
    try{
        db.query('SELECT * FROM tblprenda',
    (err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(result);
        }
    });
    } catch (e){

    }
}