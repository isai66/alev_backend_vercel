const db = require('../models/db')

module.exports.bitacora_logins = (req, res) =>{
    //res.send('This is a ping test')
    try{
        db.query('SELECT * FROM bitacora_logins',
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