const client = require('./database.js')
const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

client.connect();

app.listen(3300, ()=>{
    console.log("Sever is now listening at port 3300");
})

// -- GET --
app.get('/sample_table', (req, res)=>{
    client.query(`Select * from sample_table`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
})

// -- GET --
app.get('/sample_table/:id', (req, res)=>{
    client.query(`Select * from sample_table where id=${req.params.id}`, (err, result)=>{
        if(!err){
            res.send(result.rows);
            console.log("did a get")
        }
    });
    client.end;
})

// -- POST --
app.post('/sample_table', (req, res)=> {
    const user = req.body;
    console.log(user);
    let insertQuery = `insert into sample_table(id, hashrate, btcprice, date) 
                       values(${user.id}, '${user.hashrate}', '${user.btcprice}', '${user.date}')`

    client.query(insertQuery, (err, result)=>{
        if(!err){
            res.send('Insertion was successful')
        }
        else{ console.log(err.message) }
    })
    client.end;
})

// -- PUT --
app.put('/sample_table/:id', (req, res)=> {
    let user = req.body;
    let updateQuery = `update sample_table
                       set hashrate = '${user.hashrate}',
                       btcprice = '${user.btcprice}',
                       date = '${user.date}'
                       where id = ${user.id}`

    client.query(updateQuery, (err, result)=>{
        if(!err){
            res.send('Update was successful')
        }
        else{ console.log(err.message) }
    })
    client.end;
})

// -- DELETE --
app.delete('/sample_table/:id', (req, res)=> {
    let insertQuery = `delete from sample_table where id=${req.params.id}`

    client.query(insertQuery, (err, result)=>{
        if(!err){
            res.send('Deletion was successful')
        }
        else{ console.log(err.message) }
    })
    client.end;
})