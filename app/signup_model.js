var mongoose = require('mongoose');
var Indicative = require('indicative');
var shortid = require('shortid');
var helper = require('sendgrid').mail;
var sg = require('sendgrid').SendGrid(process.env.SENDGRID);
var q = require('q');
var signupSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
    email: {
        type: String,
        required: true
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    code: {
        type: String,
        default: shortid.generate()
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    comments: String
});

var validator = {
    email: 'required|email',
	name: 'required',
    comments: 'max:500'
};

module.exports = mongoose.model('Signup', signupSchema);

module.exports.validate = function(data) {
    return Indicative.validateAll(data, validator);
};
module.exports.email = function(doc) {
    var promise = q.defer();
    var from, to, subject, html, plain, mail, json, request, verifyemail, name, personalization, url, tracking, namePersonalization;
    from = new helper.Email("no-reply@mailer.eventvods.com", "Eventvods");
    to = new helper.Email(doc.email);
    subject = "Eventvods.com Email Confirmation";
    html = new helper.Content("text/html", "Eventvods");
    plain = new helper.Content("text/plain", "Eventvods");
    mail = new helper.Mail();
    mail.setTemplateId("0a91c12e-0a74-4608-bd09-8e65c0fc3508");//confirmation email
    url = "http://ev-signup.herokuapp.com/verify/" + doc._id + "/" + doc.code;
    verifyemail = new helper.Substitution("-verifyurl-", url);
	name = new helper.Substitution("-name-", doc.name);
    tracking = new helper.ClickTracking(true, true);
    personalization = new helper.Personalization();
    personalization.addSubstitution(verifyemail);
	personalization.addSubstitution(name);
	//don't know why, but removing this makes the API call fail
    personalization.substitutions = personalization.substitions;
    personalization.addTo(to);
    mail.setSubject(subject);
    mail.setFrom(from);
    mail.addPersonalization(personalization);
    mail.addContent(plain);
    mail.addContent(html);
    mail.addTrackingSettings(tracking);
    json = mail.toJSON();
    request = sg.emptyRequest();
    request.method = 'POST';
    request.path = '/v3/mail/send';
    request.body = json;
    sg.API(request, function(response) {
        if(response.statusCode === 202)
            promise.resolve();
        else
            promise.reject();
    });
    return promise.promise;
};
