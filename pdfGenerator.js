const dotenv = require('dotenv')
const puppeteer = require('puppeteer-core');
const fs = require('fs-extra');
const hbs = require('handlebars');
//const ejs = require('ejs')
const path = require('path');
const nodemailer = require('nodemailer');
dotenv.config();



const compile = async function( data){
    console.log(data)
    var randomPath = __dirname+'/public/views/template.ejs'
    var filepath = path.normalize(randomPath);
    //const filepath = path.join(process.cwd(),'views', templateName+'.hbs');
    const html = fs.readFileSync(filepath,'utf-8');
    return hbs.compile(html)(data);
    // var template =  ejs.compile(html,data);
    // return template(html,{data})
}

// hbs.registerHelper('dateFormat', function(value,format){
//     console.log('formatting', value, format);
//     return moment(value).format(format);
// })

const pupet = {async pdfFunction(data, email){
    try{
        console.log('data is', data);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const content = await compile(data)
        //console.log(content);
        const randomPDFpath = __dirname +'/pdf/mypdf'+Date.now()+'.pdf';
        const pdfPath = path.normalize(randomPDFpath);
        await page.setContent(content);
        await page.emulateMedia('screen');
        await page.pdf({
            path:pdfPath,
            format: 'A3',
            printBackground: true
        });
        await sendEmail(email, pdfPath);
        
        console.log('Done');
        await browser.close();
        
        //process.exit();
    } catch(e){
        console.log('Error is', e);
    }
}};

var sendEmail = function(email, path){
    console.log('in email func');
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'testm720@gmail.com',
            pass: 'gmailtest'
        }
    });
    let mailOptions = {
        from: 'testm720@gmail.com',
        to: email,
        subject:'Testing',
        text: 'It works',
        attachments: [
            {
                path: path
            }
        ]
    }
    transporter.sendMail(mailOptions,function(err,data){
        if(err){
            console.log('Error occur', err);
        }
        else{
            console.log('Mail sent !!!');
        }
    });
}

module.exports = pupet;