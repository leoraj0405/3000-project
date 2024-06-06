var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Root1234@',
    database: 'mydb'
})

con.connect(function (err) {
    if (err) throw err;
    console.log('mysql connected successfully')
})

router.get('/', (req, res) => {
    const {
        page = 1,
        limit = 5,
    } = req.query
    const pageNo = isNaN(page) ? 1 : Number(page)
    const limitNo = isNaN(limit) ? 5 : Number(limit)
    responseData = {
        data :[],
        page : pageNo,
        limit : limitNo,
        total : '',
    }
    try {
        con.query(`select count(id) as total from country`, function (err1,result1) {
            con.query(`select * from country limit ? offset ?`, [limitNo, (pageNo - 1) * limitNo], (err, result) => {
                responseData.data = result;
                responseData.total = result1[0].total;
                if (err) {
                    res.status(409).status(err)
                } else {
                    res.status(200).send(responseData)
                }
                // responseData.total =
            })
        })
    } catch (error) {
        console.error(error)
    }
})

router.post('/', (req, res) => {
    const {
        name,
        code2,
        code3,
        phonecode
    } = req.body;
    try {
        sqlQuery = 'insert into country (name,isoCode2,isoCode3,phoneCode) values(?,?,?,?)'
        con.query(sqlQuery, [name, code2, code3, phonecode], (err, result) => {
            if (err) {
                res.status(409).send(err.sqlMessage)
            } else {
                res.status(200).send('insert sucessfully')
            }
        })
    }
    catch (error) {
        console.error(error)
    }
})

router.put('/:countryId', (req, res) => {
    var id = req.params.countryId;
    try {
        const {
            name,
            code2,
            code3,
            phcode
        } = req.body;
        con.query('UPDATE country SET name = ?, isoCode2 = ?,isoCode3 = ?,phoneCode = ? WHERE id = ?', [name, code2, code3, phcode, id], (err, result) => {
            console.log(err)
            con.query('select *  from country where id = ?', [id], (err2, resultData) => {
                if (err) {
                    res.status(409).send(err.sqlMessage)
                } else {
                    res.status(200).send(resultData)
                }
            })
        })
    } catch (error) {
        console.error(error)
    }
})

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    try {
        con.query(`select s.*,c.name from state s join country as c ON c.id = s.countryId where countryId = ${id}`, function (err, result) {
            if (result.length != 0) {
                res.status(409).send("You are not able to delete to this country")
            } else {
                con.query(`DELETE FROM country WHERE id = ${id}`, function (error, result1) {
                    if (error) {
                        res.status(409).send(error.sqlMessage)
                    } else {
                        res.status(200).send("Row Deleted")
                    }
                })
            }
        })
    } catch (error) {
        console.error(error)
    }
})

router.get('/name/', (req, res) => {
    console.log('demo')
    try {
        con.query('select name,id FROM country ', (err, result) => {
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

router.get('/:id', (req, res) => {
    const id = req.params.id;
    try {
        con.query('select * FROM country WHERE id = ?', [id], (err, result) => {
            res.send(result[0])
        })
    } catch (error) {
        console.error(error)
    }
})


module.exports = router;

