/**
 * @author Arash Alaei <arashalaei22@gmail.com>. 
 */
const express = require('express');

const app = express();

app.get('/',(req, res) => {
    res.status(200).write(
        `
    <div>
        <h1>Hello World</h1>
        <h2>Let's start fantastic journey!!!</h2>
    </div>
`);
})

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
})