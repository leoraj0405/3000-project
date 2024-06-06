var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Root1234@',
    database: 'mydb'
})


router.get('/', function (req, res) {
    console.log('dumy nire')
    const {
        page = 1,
        limit = 5,
        search = '',
        countryId = '',
    } = req.query;
    
    const pageNo = isNaN(Number(page)) ? 1 : Number(page)
    const limitNo = isNaN(Number(limit)) ? 5 : Number(limit)
    //console.log(pageNo,limitNo)
    const responseData = {
        data: [],
        total: '',
        page : pageNo,
        limit :limitNo,
        searchValue : '',
        countryId : '',
    }
    try {
       let sqlQuery1 = `select count(id) as total from state`
       const condition = []

       if (search){
        condition.push(` stateName LIKE '%${search}%'`)
       } 
       if(countryId) {
        condition.push(`countryId = ${countryId}`)
       }
       condtionStr = condition.length ? ` WHERE ${condition.join(' AND ')}` : ''
       sqlQuery1 += condtionStr

        con.query(sqlQuery1, function (error, resultCount) {
            responseData.total = resultCount[0].total
            let sqlQuery2 = `select s.*,c.name from state s join country as c ON c.id = s.countryId ${condtionStr} limit ?  offset ?`
            con.query(sqlQuery2,[limitNo,(pageNo - 1)*limitNo], function (err, result) {
                if (err){
                   res.status(409).send(err.sqlMessage)
                }
                responseData.data = result;
                responseData.searchValue = search;
                responseData.countryId = countryId;
                res.send(responseData)
            })
            
        })
    } catch (error) {
        console.error(error)
    }
})

router.get('/:stateId', function (req, res) {
    const id = req.params.stateId;
    try {
        con.query(`select s.*,c.name from state s join country as c ON c.id = s.countryId where s.id = ${id}`, function (error, result) {
            if (error) {
                res.status(409).send(error)
            }else{
                res.status(200).send(result[0])
            }

        })
    } catch (error) {
        console.error(error)
    }
})

router.post('/', (req, res) => {
    const {
        countryId,
        stateName,
    } = req.body;
    try {
        sqlQuery = 'insert into state (countryId,stateName) values(?,?)'
        con.query(sqlQuery, [countryId, stateName], (err, result) => {
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

router.put('/:stateId', (req, res) => {
    const id = req.params.stateId;
    try {
        const {
            countryId,
            stateName,
        } = req.body;
        con.query('UPDATE state SET countryId = ?, stateName = ? WHERE id = ? ', [countryId, stateName, id], (err, result) => {
            con.query('select s.*,c.name from state s join country as c ON c.id = s.countryId where s.id = ?', [id], (err2, resultData) => {
                if (err) {
                    res.status(409).send(err.sqlMessage)
                } else {
                    res.status(200).send('Update successfully')
                }
            })
        })
    } catch (error) {
        console.error(error)
    }
})

// router.delete('/countryDel/:countryid', (req, res) => {
//     const id = req.params.countryid;
//     try {
//         con.query('DELETE FROM state WHERE countryId = ?', [id], (err, result) => {
//             if (result.affectedRows === 0) {
//                 res.send("Invalid State Id ")
//             }
//             else {
//                 res.status(200).send('Row Deleted')
//             }
//         })
//     } catch (error) {
//         console.error(error)
//     }
// })

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    try {
        con.query('DELETE FROM state WHERE id = ?', [id], (err, result) => {
            console.log(result)
            if (result.affectedRows == 0) {
                res.status(409).send('Invalid State')
            }
            else {
                res.status(200).send('State Deleted')
            }
        })
    } catch (error) {
        console.error(error)
    }
})

module.exports = router;