const db = require('../models/db')

module.exports.bitacora = (req, res) =>{
    //res.send('This is a ping test')
    try{
        db.query('SELECT * FROM bitacora',
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