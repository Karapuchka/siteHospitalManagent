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

app.post('/getEmployee/:id', urlcodedParsers, (req, res)=>{

    pool.query('SELECT * FROM users', (err, data)=>{
        if(err) return console.log(err);

        let doctor;

        for (let i = 0; i < data.length; i++) {
            if(data[i].id == req.params.id){
                doctor = data[i];
                break;
            }
        }

        let listConclusion = [];
    
        pool.query('SELECT * FROM conclusion', (err, dataConclusion)=>{
            if(err) return console.log(err);

    
            for (let i = 0; i < dataConclusion.length; i++) {
                if(dataConclusion[i].idDoctor == req.params.id){
                    listConclusion.push(dataConclusion[i]);               
                }            
            }


            pool.query('SELECT * FROM patient', (errPatient, dataPatient)=>{
                if(errPatient) return console.log(errPatient);
    
                let listPatents = [];
    
                for (let i = 0; i < dataPatient.length; i++) {
    
                    for (let j = 0; j < listConclusion.length; j++) {

                        if(dataPatient[i].id == listConclusion[j].idPationt){
                         
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
                    pathImg: doctor.pathImg,
                    firstName: doctor.firstName,
                    lastName: doctor.lastName,
                    surName: doctor.surName,
                    jobTitle: doctor.jobTitle,
                    department: doctor.department,
                    listPatients: listPatents,
                });
            });   
        });
    });
});

app.post('/profile', (req, res)=>{

    let listConclusion = [];
    
    
    pool.query('SELECT * FROM conclusion', (err, data)=>{
        if(err) return console.log(err);

        for (let i = 0; i < data.length; i++) {
            if(data[i].idDoctor == user.id){
                listConclusion.push(data[i]);               
            }            
        }

        pool.query('SELECT * FROM patient', (errPatient, dataPatient)=>{
            if(errPatient) return console.log(errPatient);

            let listPatents = [];

            for (let i = 0; i < dataPatient.length; i++) {

                for (let j = 0; j < listConclusion.length; j++) {
                    if(dataPatient[i].id == listConclusion[j].idPationt){
                     
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
                            'id': data[i].id,
                            'firstName': data[i].firstName,
                            'lastName': data[i].lastName,
                            'surName': data[i].surName,
                            'status': dataCards[j].status,
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

    let card = {};

    pool.query('SELECT * FROM patientcard', (err, data)=>{
        if(err) return console.log(err);

        for (let i = 0; i < data.length; i++) {
            if(data[i].id == +req.params.id){
                let status = (data[i].status) ? 'Активен' : 'Не активен' ;
      
                pool.query('SELECT * FROM patient', (err, dataPatient)=>{
                    if(err) return console.log(err);
             
                    for (let j = 0; j < dataPatient.length; j++) {
                        if(dataPatient[j].id == data[i].idPatient){

                            pool.query('SELECT * FROM conclusion', (err, dataConcsludion)=>{
                                if(err) return console.log(err);

                                let cardsList = [];

                                for (let x = 0; x < dataConcsludion.length; x++) {

                                    if(dataConcsludion[x].idPatient == dataPatient[j].id){
                                        cardsList.push({'diagnosis': dataConcsludion[x].diagnosis, 'id': dataConcsludion[x].id});

                                    }
                                }

                                let receptionInfo = data[i].reception.split(',');

                                return res.render('cards.hbs', {
                                    id: dataPatient[j].id,
                                    firstName: dataPatient[j].firstName,
                                    lastName: dataPatient[j].lastName,
                                    surName: dataPatient[j].surName,
                                    gender: dataPatient[j].gender,
                                    snils: dataPatient[j].snils,
                                    polis: dataPatient[j].polis,
                                    phone: dataPatient[j].phone,
                                    email: dataPatient[j].email,
                                    statusCards: data[i].status,
                                    status: status,
                                    cardsList: cardsList,
                                    idCard: data[i].id,
                                    doctor: receptionInfo[1],
                                    reception: receptionInfo[0], 
                                });
                            });

                        break;
                        };                          
                    };
                }); 
            };
        }
    });
});

app.post('/openConslusion', JSONParser, (req, res)=>{
    if(!req.body) return res.sendStatus(400);

    pool.query('SELECT * FROM conclusion', (err, data)=>{
        if(err) return console.log(err);

        let conslusion = data.find(item => item.id == req.body.idConclusion);

        pool.query('SELECT * FROM users', (err, dataDoctor)=>{
            if(err) return console.log(err);

            let doctor = dataDoctor.find(item => item.id == conslusion.idDoctor);

            conslusion.doctor = `${doctor.lastName} ${doctor.firstName} ${doctor.surName}`;

            res.send(conslusion);
        });
    });
});

app.post('/addingConslusion', JSONParser, (req, res)=>{
    if(!req.body) return res.sendStatus(400);

    pool.query('SELECT * FROM users', (err, data)=>{
        if(err) return console.log(err);

        let validDoctor = false;

        for (let i = 0; i < data.length; i++) {
            let firstName = RegExp(`${data[i].firstName}`, 'i');
            let lastName = RegExp(`${data[i].lastName}`, 'i');
            let surName = RegExp(`${data[i].surName}`, 'i');


            if(req.body.doctor.search(firstName) != -1){

                if(req.body.doctor.search(lastName) != -1){

                    if(req.body.doctor.search(surName) != -1){
                        validDoctor = true;

                        switch ('') {
                            case req.body.diagnosis:
                                return res.send('Поле «Диагноз» не заполнено!');

                            case req.body.date:
                                return res.send('Поле «Дата» не заполнено!');

                            case req.body.medicines:
                                return res.send('Поле «Лекарства» не заполнено!');

                            case req.body.recommend:
                                return res.send('Поле «Рекомеендации» не заполнено!');
                        }

                        pool.query('INSERT INTO conclusion (idPatient, idDoctor, diagnosis, date, doctorRecommends, listMedicine) VALUES (?,?,?,?,?,?)', 
                        [+req.body.idPatient, data[i].id, req.body.diagnosis, req.body.date, req.body.recommend, req.body.medicines], (err, data)=>{
                            if(err) return console.log(err);
                        });

                        break;
                    }
                }
            }
        }

        if(!validDoctor){ return res.send('Такого доктора нет в базе!') };

        
        pool.query('SELECT * FROM conclusion', (err, dataConcsludion)=>{
            if(err) return console.log(err);

            let cardsList = [];

            for (let i = 0; i < dataConcsludion.length; i++) {

                if(dataConcsludion[i].idPatient == +req.body.idPatient){
                    cardsList.push({'diagnosis': dataConcsludion[i].diagnosis, 'id': dataConcsludion[i].id});
                }
            }

            return res.send({
                resultOperation: "Запись добавлена!",
                cardsList: cardsList,
            });
        });
    });
});

app.post('/setStatusCard', JSONParser, (req, res)=>{
    if(!req.body) return res.sendStatus(400);
    
    let status = !(+req.body.status);

    pool.query('UPDATE patientcard SET status=? WHERE id=?', [status, +req.body.id], (err) => {if(err) return console.log(err)});
    
    return res.send(status);
});

app.get('/reports', (_, res)=>{
    pool.query('SELECT * FROM reports', (err, data)=>{
        if(err) return console.log(err);

        let listTerapevt = [], 
            listPediatr = [], 
            listOftolmolog = [], 
            listNevrolog = [], 
            listStomotolog = [], 
            listTravmpunkt = [];
        
        for (let i = 0; i < data.length; i++) {
            data[i].date = validDate(data[i].date);

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

        return res.render('reports.hbs', {
            emoloyeeTerapevt: listTerapevt,
            emoloyeePediatr: listPediatr,
            emoloyeeOftolmolog: listOftolmolog,
            emoloyeeNevrolog: listNevrolog,
            emoloyeeStomotolog: listStomotolog,
            emoloyeeTravma: listTravmpunkt,
        });
    });
});

app.post('/del-report', JSONParser, (req, res)=>{
    if(!req.body) return res.sendStatus(400);

    pool.query('DELETE FROM reports WHERE id=?', [req.body.id], (err)=> {if(err) return console.log(err)});

    return res.send('Отчет ' + req.body.id + ' удалён!');
});

app.post('/adding-reception', JSONParser, (req, res)=>{
    if(!req.body) return res.sendStatus(400);

    pool.query('UPDATE patientcard SET reception=? WHERE idPatient=?', [req.body.receptionInfo, req.body.idPatien], (err)=> {if(err) return console.log(err)});

    let info = req.body.receptionInfo.split(',');
    res.send(info);
});

app.post('/open-report/:id', urlcodedParsers, (req, res)=>{
    if(!req.body) return res.sendStatus(400);

    pool.query('SELECT * FROM reports', (err, dataReports)=>{
        if(err) return console.log(err);

        for (let i = 0; i < dataReports.length; i++) {
            if(dataReports[i].id == req.params.id){
                let author, jobTitle, date, countActiveReports, listPatient = [];

                date = validDate(dataReports[i].date);
                countActiveReports = dataReports[i].countActiveOrders;

                pool.query('SELECT * FROM conclusion', (errConclusion, dataConclusion)=>{
                    if(errConclusion) return console.log(errConclusion);

                    let idConclusion = dataReports[i].listActiveOrders.split(',');
                    let listConslusion = [];

                    for (let j = 0; j < dataConclusion.length; j++) {
                        for (let x = 0; x < idConclusion.length; x++) {
                            if(+dataConclusion[j].id == +idConclusion[x]){
                                listConslusion.push(dataConclusion[j]);

                                break;
                            };  
                        };                      
                    };

                    pool.query('SELECT * FROM users', (errDoctor, dataDoctor)=>{
                        if(errDoctor) return console.log(errDoctor);
    
                        for (let c = 0; c < dataDoctor.length; c++) {

                            for (let x = 0; x < dataConclusion.length; x++) {
                                if (dataDoctor[c].id == dataConclusion[x].idDoctor) {
                                    listPatient.push({
                                        'doctor': `${dataDoctor[c].firstName} ${dataDoctor[c].surName} ${dataDoctor[c].firstName}`,
                                        'idDoctor': dataDoctor[c].id,
                                        'department': dataDoctor[c].department,
                                    });
                                };                        
                            }
                            
                            if(dataReports[i].idAuthor == dataDoctor[c].id){
                                author = `${dataDoctor[c].firstName} ${dataDoctor[c].surName} ${dataDoctor[c].lastName}`;
                                jobTitle = dataDoctor[c].jobTitle;
                            }; 
                        };

                        pool.query('SELECT * FROM patient', (errPatient, dataPatient)=>{
                            if(errPatient) return console.log(errPatient);

                            let count = 1;

                            for (let v = 0; v < dataPatient.length; v++) {
                                for (let x = 0; x < dataConclusion.length; x++) {
                                    if (+dataPatient[v].id == +dataConclusion[x].idPatient) {
                                        for (let b = 0; b < listPatient.length; b++) {

                                           if(+listPatient[b].idDoctor == +dataConclusion[x].idDoctor){
                                                if(dataReports[i].department == listPatient[b].department){
                                                    let oldDoctor = listPatient[b].doctor;
                                                    listPatient[b] = {
                                                        'number': count,
                                                        'patient': `${dataPatient[v].firstName} ${dataPatient[v].surName} ${dataPatient[v].lastName}`,
                                                        'doctor': oldDoctor,
                                                        'diagnosis': dataConclusion[x].diagnosis,
                                                    } 
                                                    count++;
                                                }else{
                                                    listPatient[b] = false;
                                                };  
                                           }; 
                                        };
                                    };  
                                };                              
                            };

                            let newArr = [];

                            for (let v = 0; v < listPatient.length; v++) {
                                if(listPatient[v]){
                                    newArr.push(listPatient[v]);
                                }                       
                            }

                            res.render('openReports.hbs', {
                                'author': author,
                                'jobTitle': jobTitle,
                                'date': date,
                                'countActiveReports': countActiveReports,
                                'listPatient': newArr,
                            });
                        });
                    });
                });
            };
        };
    });
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