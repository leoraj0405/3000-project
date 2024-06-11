const express = require('express');
const path = require('path')
const multer = require('multer')
const mysql = require('mysql')
const app = express();

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Root1234@',
    database: 'python_db_2'
})

if (con) {
    console.log('mysql connected')
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname.replace(/\.[^/.]+$/, '') + "-" + Date.now() + path.extname(file.originalname));
    },
})

const maxSize = 2 * 1000 * 1000;

var upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb) {
        var filetypes = /jpeg|jpg|png/;
        var mimetype = filetypes.test(file.mimetype);
        var extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(
            "Error: File upload only supports the " + "following filetypes - " + filetypes
        );

    }
}).single('mypic');

app.get('/', function (req, res) {
    res.render('signup')
})

app.post('/uploadPic', function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            if (err.code == "LIMIT_FILE_SIZE") {
                return res.send('Maxmimum size 2MB only')
            }
            res.send(err)
        } else {
            // console.log(req.file.filename)
            // res.send('Success, Image uploaded!')
            const fileName = req.file.filename;

            con.query('insert into files (filePath) values(?)', [fileName], (err, result) => {
                if (err) {
                    res.send(err)
                } else {
                    if(result.affectedRows == 1){
                        res.send('Success, Image uploaded!')
                    }else{
                        res.send('Please Try again!')
                    }
                }
            })
        }
    })
})

app.get('/download/:id',function(req,res){
    console.log('test')
    const fileId = req.params.id;
    // console.log(fileId)
    con.query(`select * from files where id = ${fileId}`,function (err,result){
        var name = result[0].filePath
        if(err){
            res.send(err)
        }else{
            res.download('uploads/'+name)
        }
    })
})

app.delete('/download/:id',function(req,res){
    console.log('leo')
    const fileId = req.params.id;
    // console.log(fileId)
    con.query(`delete from files where id = ${fileId}`,function (err,result){
        if(err){
            res.send(err)
        }else{
            res.send('Row Deleted')
        }
    })
})

app.get('/download',function(req,res){
    con.query('select * from files',function (err,result){
        if(err){
            res.send(err)
        }else{
            res.render('download',{result})
        }
    })
})

app.listen(5000, function (error) {
    if (error) throw error;
    console.log("Server created Successfully on PORT 5000");
});