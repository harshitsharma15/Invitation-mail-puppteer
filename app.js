const addUsers = require('./db/helper');
const express = require('express');
const exceltojson = require('xls-to-json');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
app.set('view engine','hbs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log('Going to Store the Data in Disk');
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      console.log('File name is ',file.fieldname);
      cb(null, file.fieldname + '-' + Date.now()+'.xls')
    }
  })
app.use(multer({storage:storage}).single('file'));
app.post('/upload', (req,res)=>{
console.log('Server Upload');
var randompath =  __dirname+'/uploads/'+req.file.filename;
var filepath = path.normalize(randompath);
console.log(filepath);
uploadDataToDB(filepath);
//addUsers.allUsers();
res.end('User Uploaded');
})


app.listen(process.env.PORT || 3333,()=>{
    console.log('Server Start on port 3333');
})

function uploadDataToDB(filePath){
    exceltojson({
    input: filePath,
    output: null
  }, function(err,result){
    if(err){
      console.log(err);
    }
    else{
      //console.log('result is',result);
      addUsers.addBulk(result);
    }
  })
  //console.log('Excel data is',excelData);
  }