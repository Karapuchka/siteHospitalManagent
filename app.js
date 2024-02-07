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

    pool.query()
    /* Сделать вывод списка приёмов → сделать таблицу с пациентами, отчётами, записями */

    pool.query('SELECT * FROM users', (err, data)=>{
        if(err) return console.log(err);

        for (let i = 0; i < data.length; i++) {
            if(data[i].id == req.params.id){
                res.render('profile.hbs', {
                    pathImg: user.pathImg,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    surName: user.surName,
                    jobTitle: user.jobTitle,
                    department: user.department,
                });
            }            
        }
    });

});

app.post('/profile', (req, res)=>{

    let listConclusion = [];
    
    
    pool.query('SELECT * FROM conclusion', (err, data)=>{
        if(err) return console.log(err);

        for (let i = 0; i < data.length; i++) {
            if(data[i].id == user.id){
                listConclusion.push(data[i]);               
            }            
        }

        pool.query('SELECT * FROM patient', (errPatient, dataPatient)=>{
            if(errPatient) return console.log(errPatient);

            let listPatents = [];

            for (let i = 0; i < dataPatient.length; i++) {

                for (let j = 0; j < listConclusion.length; j++) {
                    if(dataPatient[i].id == listConclusion[j].id){
                     
                        listPatents.push({
                            "id": dataPatient[i].id,
                            "firstName": dataPatient[i].firstName,
                            "lastName": dataPatient[i].lastName,
                            "surName": dataPatient[i].surName,
                            "date": validDate(listConclusion[j].date),
                            "diagnosis": listConclusion[j].diagnosis,
                        });
                    };
                };
            };

            return res.render('profile.hbs', {
                pathImg: user.pathImg,
                firstName: user.firstName,
                lastName: user.lastName,
                surName: user.surName,
                jobTitle: user.jobTitle,
                department: user.department,
                listPatients: listPatents,
            });
        });

    });
});

app.get('/patients', (_, res)=>{
    pool.query('SELECT * FROM patient', (err, data)=>{
        if(err) return console.log(err);
        
        let listPatients = [];
       
        pool.query('SELECT * FROM patientcard', (errCards, dataCards)=>{
            if(errCards) return console.log(errCards);

            for (let i = 0; i < data.length; i++) {
                
                for (let j = 0; j < dataCards.length; j++) {

                    if(dataCards[j].idPatient == data[i].id){
                        listPatients.push({
                            'firstName': data.firstName,
                            'lastName': data.lastName,
                            'surName': data.surName,
                            'status': dataCards[j].status ? 'Активная заявка' : 'Не активная заявка',
                        });
                        break;
                    };                 
                };
            };

            return res.render('patient.hbs', {
                listPatients: listPatients,
            });
        });
    });
});

app.post('/getCards/:id', urlcodedParsers, (req, res)=>{
    if(!req.body) return res.send(400);
});

app.listen(3000, ()=>{
    console.log('Server ative. URL: http://localhost:3000/');
});

//Преобразование даты из бд в нормальный вид
function validDate(date){
    let arr = String(date).split(' ');

    let listMonth = {
        "Jan": "Января",
        "Feb": "Февраля",
        "Mar": "Марта",
        "Apr": "Апреля",
        "May": "Мая",
        "June": "Июня",
        "July": "Июля",
        "Aug": "Августа",
        "Sept": "Сентября",
        "Oct": "Октября",
        "Nov": "Ноября",
        "Dec": "Декабря",
    }

    return `${arr[2]} ${listMonth[arr[1]]} ${arr[3]}`;
}