const db = require('../models/db')

module.exports.ping = (req, res) =>{
    //res.send('This is a ping test')
    const consult = 'SELECT * FROM usuarios';

    try{
        db.query(consult,(err,results)=>{
            console.log(results)
            res.json(results)
        });
    } catch (e){

    }
}