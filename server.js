const express = require('express')
const app = express()
const fs = require('fs');
const fileName = 'store.json';
const file2 = 'credentials.json';
const bcrypt = require('bcrypt')

const port= process.env.PORT || 3010
const jsonParser = express.json();


 const users = []

// Load data from file
let rawData = fs.readFileSync(fileName);
let data = JSON.parse(rawData);

// Load data from file2
credentials = fs.readFileSync(file2);
let info = JSON.parse(credentials);


app.set('views','views')
app.set('view engine','ejs')
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}))
// app.use(express.json)



app.get('/', (req,res) => {
    // res.render('index',{name:"Anne"})
    res.render('login')
})

app.get('/login', (req,res) => {
    res.render('login.ejs')
})
app.get('/index', (req,res) => {
    res.render('index.ejs')
})
app.get('/home', (req,res) => {
    res.render('home.hbs')
})
app.post('/login', async(req,res) => {
        const user = info.find(user => user.email === req.body.email )
        if (user == null){
            //return res.status(400).send('cant find user')
            alert("Wrong credentials entered!");
            return;
        }
    try {
        if(await bcrypt.compare(req.body.password,user.password)){
            // res.send('Success')
            res.redirect('index')
        }else{
            res.send('invalid password')
        }
    } catch{
        return res.status(500).send()

    } 
})


app.get('/register', (req,res) => {
    res.render('register.ejs')
    
})

app.post('/register', async (req,res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        const user = {name:req.body.name,email: req.body.email,password:hashedPassword}
        info.push(user)
        fs.writeFileSync(file2, JSON.stringify(info, null, 2));
        res.redirect('/login')

    } catch{
        res.redirect('/register')

    } 
    
})
app.post('/home', async (req,res) => {
    try {
     
        const infoAdd = {date: req.body.year, revenue:req.body.revenue,inventory: req.body.inventory,purchases:req.body.purchases}
        data.push(infoAdd)
        fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
        res.redirect('home')


    } catch{
        res.send('Im not adding any data')

    } 
    
})

app.get('/store', jsonParser, (request, response) =>{
    response.send(data);
});


app.listen(port,()=> {console.log(`server is listening on port ${port}`)})