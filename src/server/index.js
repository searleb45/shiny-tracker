const express = require('express');
const path = require('path');

const app = express();

console.log(`dirname is ${__dirname}`);
app.use(express.static(__dirname));

app.use('*', express.static(path.join(__dirname, 'index.html')));

app.listen(3000);