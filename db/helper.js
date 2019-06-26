const userModel = require('../db/model');
const sendMail = require('../pdfGenerator');
const userOperation = {
    addBulk(userObject){
        userModel.create({users:userObject, id:'user1'},(err)=>{
            if(err){
                console.log('Error in user upload', err);
            }
            else{
                console.log('User Uploaded');
                this.allUsers();
                
            }
        })
    },
    async allUsers(){
        userModel.collection.findOne({id:'user1'},(err,doc)=>{
            if(err){
                console.log('error in find users');
            }
            else{
                for (const key in doc.users) {
                    if (doc.users.hasOwnProperty(key)) {
                        const element = doc.users[key];
                        //console.log('element '+ key +' is',element);
                        //console.log('element '+ key +' is',element.headquater);
                        //console.log('element '+ key +' is',element.name);
                        var data = {name:element.name, headquater:element.headquater, email:element.email};
                        //console.log(data);
                        //var stringData = JSON.stringify(data)
                        sendMail.pdfFunction(data, element.email);
                    }
                }
            }
        })
    }
    
}


module.exports = userOperation;