const nodemailer = require('nodemailer');

nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create a testing account: ' + err.message);
        return;
    }

    console.log('--- ETHEREAL SMTP CREDENTIALS ---');
    console.log('SMTP_HOST=' + account.smtp.host);
    console.log('SMTP_PORT=' + account.smtp.port);
    console.log('SMTP_USER=' + account.user);
    console.log('SMTP_PASS=' + account.pass);
    console.log('SMTP_FROM="VirtualLab Platform <' + account.user + '>"');
    console.log('WEB_URL=' + account.web);
    console.log('--- END ---');
});
