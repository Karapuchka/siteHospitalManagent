import express, { query } from 'express';
import fs from 'fs';
import mysql from 'mysql2';
import path from 'path';
import multer from 'multer';

const app = express();

let user; //Инфомрация о пользователе

//Настройка подключения к бд
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 3000,
    user: 'root',
    database: 'hospitalmanager',
});

//Создание парсера
const urlcodedParsers = express.urlencoded({extended: false});

//JSON парсер
const JSONParser = express.json();

//Указание пути к файлом hbs
app.use(express.static(path.join(fs.realpathSync('.') + '/public')));
app.set('view engine', 'hbs');

//Настройка работы с файлами пользователя
const storageFile = multer.diskStorage({
    destination: (req, file, cd)=>{
        cd(null, 'public/img/profile');
    },
    filename: (req, file, cd)=>{
        cd(null, file.originalname);
    },
});

const upload = multer({storage: storageFile});

let errorMEssangeLogin = 'Авторизация';

app.get('/', (_, res)=>{
    res.render('index.hbs', {
        'messanger': errorMEssangeLogin,
    });
});

app.post('/login', urlcodedParsers, (req, res)=>{
    if(!req.body) return res.sendStatus(400);

    pool.query('SELECT * FROM users', (err, data)=>{
        if(err) return console.log(err);
      
        for (let i = 0; i < data.length; i++) {
            if(data[i].login == req.body.login){
                if(data[i].password == req.body.password){

                    user = data[i];
                    return res.redirect('/home');
                }
                else {
                    errorMEssangeLogin = 'Пароль указан не верно!';
                    return res.redirect('/');
                }
            }            
        }

        errorMEssangeLogin = 'Логин указан не верно!';
        return res.redirect('/');
    })
});

app.get('/home', (_, res)=>{

    let listTerapevt = [], 
        listPediatr = [], 
        listOftolmolog = [], 
        listNevrolog = [], 
        listStomotolog = [], 
        listTravmpunkt = [];

    pool.query('SELECT * FROM users', (err, data)=>{
        if(err) return console.log(err);

        for (let i = 0; i < data.length; i++) {
            switch (data[i].department) {
                case 'Терапевтический корпус':
                    listTerapevt.push(data[i]);
                    break;

                case 'Педиатрическое отделение':
                    listPediatr.push(data[i]);
                    break;

                case 'Офтальмология':
                    listOftolmolog.push(data[i]);
                    break;

                case 'Отделение неврологии':
                    listNevrolog.push(data[i]);
                    break;

                case 'Стоматологическое отделение':
                    listStomotolog.push(data[i]);
                    break;

                case 'Травмпункт':
                    listTravmpunkt.push(data[i]);
                    break;
            
                default:
                    console.log(`Указаное некорректное значение свойства deportamnet ${data[i].department}`);
                    console.log(data[i]);
                    break;
            }           
        }

        return res.render('home.hbs', {
            emoloyeeTerapevt: listTerapevt,
            emoloyeePediatr: listPediatr,
            emoloyeeOftolmolog: listOftolmolog,
            emoloyeeNevrolog: listNevrolog,
            emoloyeeStomotolog: listStomotolog,
            emoloyeeTravma: listTravmpunkt,
        });
    });
});

app.post('/getEmployee/:id', urlcodedParsers, (_, res)=>{

    pool.query('SELECT * FROM users', (err, data)=>{
        if(err) return console.log(err);
    });

    res.render('profile.hbs', {

    });
});

app.post('/profile', (req, res)=>{

    res.render('profile.hbs', {
        pathImg: user.pathImg,
        firstName: user.firstName,
        lastName: user.lastName,
        surName: user.surName,
        jobTitle: user.jobTitle,
        department: user.department,
    });
});

app.listen(3000, ()=>{
    console.log('Server ative. URL: http://localhost:3000/');
});