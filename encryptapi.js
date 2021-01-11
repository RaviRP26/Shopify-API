var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const crypto = require('crypto');
var cors = require('cors')

app.use(cors())
app.use(bodyParser.json())

const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const iv = crypto.randomBytes(16);

app.post('/access', (req, res) => {
    const body = req.body;
    if (Object.keys(req.body).length === 0) {
        res.status(400).send("Request body is empty");
    } else {
        const email = body.email;
        const password = body.password;

        const encrypt = (password) => { //Encryption function

            const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
            const encrypted = Buffer.concat([cipher.update(password), cipher.final()]);
            const encryptedString = JSON.stringify({
                iv: iv.toString('hex'),
                content: encrypted.toString('hex')
            });
            return Buffer.from(encryptedString).toString("base64")
        };

        const encryptedText = encrypt(password);
        console.log(encryptedText, 'ENCRYPT');

        res.status(200).send({ status: true, message: 'encrypted', data: { PASSWORD: encryptedText } })
    }

})

app.post('/decrypt', (req, res) => {
    var body = req.body;
    if (Object.keys(req.body).length === 0) {
        res.status(400).send("Request body is empty");
    } else {

        const decrypt = (body) => { //Decrypted function
            const data = JSON.stringify(body.PASSWORD);
            const decode = Buffer.from(data,"base64").toString('utf-8');
            const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(JSON.parse(decode).iv, 'hex'));
            const decrpyted = Buffer.concat([decipher.update(Buffer.from(JSON.parse(decode).content, 'hex')), decipher.final()]);
            return decrpyted.toString();
        };

        const decryptedText = decrypt(body);
        console.log(decryptedText, 'decrypt');
        res.status(200).send({ status: true, message: 'decrypted', data: { PASSWORD: decryptedText } })
    }

})

app.listen(9082, () => {
    console.log('Server is started on 127.0.0.1:9082')

})