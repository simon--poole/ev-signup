var express = require('express')();
var helper = require('sendgrid').mail;
var mongoose = require('mongoose');
var bodyparser = require('body-parser')
var Signups = require('./signup_model.js');
express.use(bodyparser.urlencoded({
    extended: true
}))
express.use(bodyparser.json());
express.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.protocol + "://eventvods.com");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
express.post('/signup', function(req, res) {
    Signups.validate(req.body)
        .then(function() {
            Signups.create(req.body, function(err, doc) {
                if (err) res.sendStatus('500');
                else Signups.email(doc)
                    .then(function(){
                        res.sendStatus('200');
                    })
                    .catch(function(){
                        res.sendStatus('500');
                    })
            });
        })
        .catch(function(errs) {
            res.sendStatus('400');
        });
});
express.get('/verify/:id/:code', function(req, res) {
    Signups.findById(req.params.id, function(err, doc){
        if (err) res.sendStatus('500');
        if(req.params.code === doc.code){
            doc.confirmed = true;
            doc.save(function(err){
                if(err) res.sendStatus('500');
                else res.redirect('http://eventvods.com/beta/complete');
            });
        }
        else res.send('Invalid verification code. Please double check your email for the correct link.');
    });
});
express.get('/test/', function(req, res){
    Signups.email({
        "email": "simon__poole@hotmail.com",
        "_id": "testing_id",
        "code": "codetest"
    });
});
express.listen(process.env.PORT);
mongoose.connect(process.env.DB);
mongoose.connection.on('error', (err) => {
    console.log(err);
});