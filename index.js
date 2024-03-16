import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors'

import {registerValidation, loginValidation, postCreateValidation} from './validations.js';

import {handleValidationsErrors, checkAuth} from './utils/index.js';
import {UserController, PostController} from './controllers/index.js';

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('BD ok'))
    .catch((err) => console.log('BD error',err));

const app=express(); //создание express  приложениея (дальше идет его настройка)

const storage = multer.diskStorage({//созание хранилища
    destination: (_, __, cb) => {
        cb(null, 'uploads');// не получвет никаких ошибок и сохрнаить все файлы в папку uploads
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });//для дальнейшего использования express

app.use(express.json());//распознование файлов формата  .json
app.use(cors());
app.use('/uploads', express.static('uploads'));// проверка запроса и получение с помошью функции static нужный файл
// static - значит сервер отправит файл обратно, как есть, без изменений или обработки.

app.post('/auth/login',loginValidation, handleValidationsErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationsErrors,  UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload',checkAuth, upload.single('image'), (req, res) => {
    res.json({//для загрузки аватарки
        url: `/uploads/${req.file.originalname}`,
    });
})


app.get('/tags', PostController.getLastTags);

//если реализовано CRUD то нельзя писать /posts/create /posts/read /posts/update /posts/delete желательно один путь /posts и несколько методов 
app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts',checkAuth, postCreateValidation, handleValidationsErrors, PostController.create);
app.delete('/posts/:id',checkAuth, PostController.remove);
app.patch('/posts/:id',checkAuth, postCreateValidation, handleValidationsErrors, PostController.update);

//тестовый route get на главный путь, req - переменная хранящая что мне прислал клиент, res - что передается пользователю
/*
app.get('/', (req,res) => {
    res.send('Hello world!');
});
*/

//запуск веб-сервера,первый параметр - на какой порт прикрепить приложение, второй параметр - функция на проверку ошибки
app.listen(process.env.PORT || 4444,(err)=>{
    if(err){
        return console.log(err);
    }
    console.log('Server ok');
});