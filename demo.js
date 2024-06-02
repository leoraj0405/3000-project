const express = require('express');
const mysql = require('mysql');
const app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json())

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Root1234@',
    database: 'project'
})

con.connect(function (err) {
    if (err) {
        console.error(err)
    } else {
        console.log('mysql connected')
    }
})


app.get('/', function (req, res) {
    try {
        con.query('select * from admin', function (err, result) {
            if (err) {
                res.status(409).send(err.sqlMessage)
            } else {
                res.status(200).send(result)
            }
        })
    } catch (error) {
        console.error(error)
    }

})

app.post('/', (req, res) => {
    const {
        name,
        age,
        native
    } = req.body;
    try {
        con.query('insert into admin (name,age,native) values(?,?,?)', [name, age, native], (err, result) => {
            if (err) {
                res.status(409).send(err.sqlMessage)
            } else {
                res.status(200).send("Insert Successfully")
            }
        })
    }
    catch (error) {
        console.error(error)
    }
})

app.put('/:jeeva', (req, res) => {
    const adminId = req.params.jeeva;     // params or query
    const {
        name,
        age,
        native
    } = req.body;
    try {
        con.query('update admin set name = ? , age = ?,native = ? where id = ?', [name, age, native,adminId], (err, result) => {
            if (err) {
                res.status(409).send(err.sqlMessage)
            } else {
                res.status(200).send("Update Successfully")
            }
        })
    }
    catch (error) {
        console.error(error)
    }
})

app.delete('/:jeeva', (req, res) => {
    const adminId = req.params.jeeva;     // params or query
    try {
        con.query('delete  from admin where id = ?', [adminId], (err, result) => {
            if (err) {
                res.status(409).send(err.sqlMessage)
            } else {
                res.status(200).send("deleted Successfully")
            }
        })
    }
    catch (error) {
        console.error(error)
    }
})


app.listen(4000, () => {
    console.log('port listening on 4000')
})