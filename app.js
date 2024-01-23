import express, { query } from 'express';
import fs from 'fs';
import mysql from 'mysql2';
import path from 'path';
import multer from 'multer';

const app = express();

let user; //Инфомрация о пользователе
let idProject; //Открытый проект
let fileNameImgPost; //Название файла изображения для поста

//Настройка подключения к бд
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 3000,
    user: 'root',
    database: 'project',
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
        fileNameImgPost = file.originalname;
    },
});

const upload = multer({storage: storageFile});

app.get('/', (_, res)=>{
    res.render('index.hbs', {
        errorMessange: '',
    });
});

app.post('/login', urlcodedParsers, (req, res)=>{
    if(!req.body) return res.status(400);

    pool.query('SELECT * FROM users', (err, data)=>{
        if(err) return console.log(err);

        for (let i = 0; i < data.length; i++) {
            if(req.body.loginUser == data[i].login){
                if(req.body.passwordUser == data[i].password){

                    user = data[i];
                    return res.redirect('/profile');
                }
                return res.render('index.hbs', {
                    errorMessange: 'Пароль введён не верно!',
                });
            };   
        };

        return res.render('index.hbs', {
            errorMessange: 'Такого пользователя нет!',
        });
    });
});

app.get('/registration', (_, res)=>{
    return res.render('registr.hbs', {
        errorMessange: '',
    });
});

app.post('/registrationUser', urlcodedParsers, (req, res)=>{
    if(!req.body) return res.statusCode(400);

    pool.query('SELECT * FROM users', (err, data)=>{

        if(err) return console.log(err);

        let userNew = true;

        for (let i = 0; i < data.length; i++) {
            if(req.body.loginUser == data[i].login) {
                userNew = !userNew;
                break;
            }
        }

        if(userNew){
            pool.query('INSERT INTO users (login, password, firstName, lastName) VALUES (?,?,?,?)', [req.body.loginUser, req.body.passwordUser, req.body.firstName, req.body.lastName], (err)=>{
                if(err) return console.log(err);
            });

            res.redirect('/');
        } else {
            return res.render('registr.hbs', {
                errorMessange: 'Логин занят!',
            });
        }
    });
});

app.get('/profile', (_, res)=>{

    pool.query('SELECT * FROM projects', (err, data)=>{
        if(err) return console.log(err);

        let listProject = [];

        for (let i = 0; i < data.length; i++) {
            if(+data[i].performers == user.id || +data[i].inspectors == user.id){
                listProject.push({'id': data[i].id, 'title': data[i].title, 'state': data[i].status});
            }    
        }
        
        if(listProject.length == 0){
            return res.render('profile.hbs', {
                userAvatar: user.pathImg,
                firstName: user.firstName,
                lastName: user.lastName,
            });
        }

        return res.render('profile.hbs', {
            userAvatar: user.pathImg,
            firstName: user.firstName,
            lastName: user.lastName,
            listProjects: listProject,
        }); 
    });
});

app.post('/changeUserInfo', upload.single('avatar'), (req, res)=>{
    if(!req.body) return res.sendStatus(400);
    
    if(typeof req.file === 'undefined') { // Если пользователь изменяет данные о себе, но не меняет аватар
        pool.query('UPDATE users SET firstName=?, lastName=?, WHERE id=?', [req.body.firstName, req.body.lastName, user.id], (err)=>{
            if(err) return console.log(err);
        });
    }else{// Если пользователь изменяет данные о себе и аватар
        pool.query('UPDATE users SET firstName=?, lastName=?, pathImg=?, WHERE id=?', [req.body.firstName, req.body.lastName, '/img/profile/' + req.file.filename, user.id], (err)=>{
            if(err) return console.log(err);
        });

        pool.query('UPDATE task SET status=? WHERE id=?', [req.body.listTasks.value, req.body.listTasks.id], (err)=>{
            if(err) return console.log(err);
        });
    } 

    pool.query('SELECT * FROM users', (err, data)=>{
        if(err) return console.log(err);

        for (let i = 0; i < data.length; i++) {
            if(user.id == data[i].id){
                user = data[i];
                break;
            }
        }

        return res.redirect('/profile');
    });

});

app.post('/getProjet/:id', urlcodedParsers, (req, res)=>{
    pool.query('SELECT * FROM projects', (err, data)=>{
        if(err) return console.log(err);

        let project, theme;

        for (let i = 0; i < data.length; i++) {
            if(data[i].id == req.params.id){

                idProject = req.params.id;
                project = data[i];

                if(data[i].status == 'Завершён') theme = 'red';
                if(data[i].status == 'В работе') theme = 'green';
                if(data[i].status == 'Планируемые') theme = 'blue';
            }
        }

        let inspectors, performers = []; 

        pool.query('SELECT * FROM users', (err, dataUsers)=>{
            if(err) return console.log(err);

           for (let i = 0; i < dataUsers.length; i++) {
                if(project.inspectors  == dataUsers[i].id){
                    inspectors = `${dataUsers[i].firstName} ${dataUsers[i].lastName}`;
                }
            }
        });

        pool.query('SELECT * FROM employee', (err, dataEmployee)=>{
            if(err) return console.log(err);
            
            for (let i = 0; i < dataEmployee.length; i++) {
                if(project.performers  == dataEmployee[i].id){
                    performers.push({firstName: dataEmployee[i].firstName, lastName: dataEmployee[i].lastName});
                }
            }
        });

        let listTasks = [];

        pool.query('SELECT * FROM task', (err, dataTask)=>{
            if(err) return console.log(err);

            for (let i = 0; i < dataTask.length; i++) {
                if(dataTask[i].idP == req.params.id){
                    listTasks.push(dataTask[i]);
                }
            }

            return res.render('project.hbs', {
                title: project.title,
                state: project.status,
                theme: theme,
                listTasks: listTasks,
                deadline: project.deadline,
                inspectors: inspectors,
                performers: performers,
            });     
        });  
    });
});

app.post('/setTask', JSONParser, (req, res)=>{
    if(!req.body) return res.sendStatus(400);

    pool.query('UPDATE task SET status=? WHERE id=?', [req.body.listTasks.value, req.body.listTasks.id], (err)=>{
        if(err) return console.log(err);
    });
});

app.post('/getStatusProject', JSONParser, (req, res)=>{
    if(!req.body) return res.sendStatus(400);

    pool.query('UPDATE projects SET status=? WHERE id=?', [req.body.status, idProject], (err)=>{
        if(err) console.log(err);
    });
});

app.get('/listProjects', (_, res)=>{

    pool.query('SELECT * FROM projects', (err, data)=>{
        if(err) return console.log(err);

        let listProjectsWords = [], listProjectsStarted = [], listProjectsFinish = [];

        for (let i = 0; i < data.length; i++) {
            if(data[i].status == 'В работе') listProjectsWords.push(data[i]);          
            if(data[i].status == 'Планируемые') listProjectsStarted.push(data[i]);          
            if(data[i].status == 'Завершён') listProjectsFinish.push(data[i]);          
        }

        return res.render('listProjects.hbs', {
            listProjectsStarted: listProjectsStarted,
            listProjectsWords: listProjectsWords,
            listProjectsFinish: listProjectsFinish,
        });
    });
});

app.post('/delProject', JSONParser, (req, res)=>{
    if(!req.body) return res.sendStatus(400);    

    pool.query('DELETE FROM projects WHERE id=?', [req.body.id], (err)=>{
        if(err) return console.log(err)     
    });

    pool.query('DELETE FROM task WHERE idP=?', [req.body.id], (err)=>{
        if(err) return console.log(err)     
    });


    pool.query('SELECT * FROM projects', (err, data)=>{
        if(err) return console.log(err);

        let newListProject = [];

        for (let i = 0; i < data.length; i++) {
            if(data[i].status == req.body.status){
                newListProject.push(data[i]);
            };          
        };
        
        return res.send(newListProject)
    });
});

app.get('/addingProject', (_, res)=>{

    let manager = [];

    pool.query('SELECT * FROM users', (err, data)=>{
        if(err) return console.log(err);

        for (let i = 0; i < data.length; i++) {
            if(data[i].firstName == 'Admin') continue;
            manager.push({'id': data[i].id, 'firstName': data[i].firstName, 'lastName': data[i].lastName});            
        }
    });

    pool.query('SELECT * FROM employee', (err, data)=>{
        if(err) return console.log(err);

        res.render('addProject.hbs', {
            employee: data,
            manager: manager,
        });
    });
});

app.post('/insetrProject', urlcodedParsers, async (req, res)=>{
    if(!req.body) return res.sendStatus(400);    

    pool.query('INSERT INTO projects (title, deadline, performers, inspectors, status) VALUES (?,?,?,?,?)', [req.body.title, req.body.date, req.body.performers, req.body.inspectors, 'Планируемые'], (err)=> {if(err) return console.log(err)});

    let idP;

    pool.query('SELECT * FROM projects', (err, data)=>{
        if(err) return console.log(err);

        idP = data[data.length - 1].id + 1;
        
        let count = 0;
        let valid = true;
    
        while(valid){
            if(!req.body['task' + count]) {
                valid = !valid;
                break;
            }

            pool.query('INSERT INTO task (idP, title, status) VALUES (?,?,?)', [idP, req.body['task' + count], '0'], (err)=>{if(err) return console.log(err)});
            count++;
        }

        return res.redirect('/profile');
    });
});

app.get('/addingExecutor', (_, res)=>{
    res.render('addEmployee.hbs');
});

app.post('/insertEmployee', urlcodedParsers, (req, res)=>{
    if(!req.body) return res.sendStatus(400);

    pool.query('INSERT INTO employee (firstName, lastName, jobTitle) VALUES (?,?,?)', [req.body.firstName, req.body.lastName, req.body.jobTitle], (err)=> {if(err) return console.log(err)});

    return res.redirect('listExecutor');
});

app.get('/listExecutor', (_, res)=>{

    let employee;

    pool.query('SELECT * FROM employee', (err, data)=>{
        if(err) return console.log(err);
        
        employee = data;

        let free = [], work = [];

        pool.query('SELECT * FROM projects', (err, data)=>{
            if(err) return console.log(err);
    
            for (let i = 0; i < employee.length; i++) {
    
                let notWork = true;
    
                for (let j = 0; j < data.length; j++) {
                    if(data[j].performers == employee[i].id && data[j].status == 'В работе'){
                        notWork = !notWork;
                        work.push({
                            'idUser': employee[i].id, 
                            'firstName': employee[i].firstName, 
                            'lastName': employee[i].lastName, 
                            'jobTitle': employee[i].jobTitle,
                            'idProject': data[j].id, 
                            'projectName': data[j].title,
                        });
                    }          
                }
    
                if(notWork){
                    free.push({
                        'id': employee[i].id, 
                        'firstName': employee[i].firstName, 
                        'lastName': employee[i].lastName, 
                        'jobTitle': employee[i].jobTitle,
                    });
                }
            }    
    
            res.render('listExecutor.hbs', {
                free: free,
                work: work,
            });
    
        });
    });
});

app.post('/getInfoUser/:id', urlcodedParsers, (req, res)=>{
    if(!req.body) return res.sendStatus(400);

    let employeeInfo;

    pool.query('SELECT * FROM employee', (err, data)=>{
        if(err) return console.log(err);

        for (let i = 0; i < data.length; i++) {
            if(data[i].id == req.params.id){
                employeeInfo = data[i];
                break;
            }            
        }
    });

    pool.query('SELECT * FROM projects', (err, data)=>{
        if(err) return console.log(err);

        let listProject = [];

        for (let i = 0; i < data.length; i++) {
            if(+data[i].performers == employeeInfo.id){
                listProject.push({'id': data[i].id, 'title': data[i].title, 'state': data[i].status});
            }    
        }
        
        if(listProject.length == 0){
            return res.render('executor.hbs', {
                id: employeeInfo.id,
                firstName: employeeInfo.firstName,
                lastName: employeeInfo.lastName,
            });
        }

        return res.render('executor.hbs', {
            id: employeeInfo.id,
            firstName: employeeInfo.firstName,
            lastName: employeeInfo.lastName,
            listProjects: listProject,
        }); 
    });
});

app.post('/delEmployee/:id', urlcodedParsers, (req, res)=>{
    if(!req.body) return res.sendStatus(400);

    pool.query('DELETE FROM employee WHERE id=?', [req.params.id], (err)=> {if(err) return console.log(err)});

    res.redirect('/listExecutor');
});

app.listen(3000, ()=>{
    console.log('Server ative. URL: http://localhost:3000/');
});