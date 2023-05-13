const http = require('http');
const express = require('express');
const cors = require("cors");
const ToDo = require("./db/models/ToDo.model");
const { initDB } = require('./db');

const port = 3100;

const app = express();

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

http.createServer(app).listen(port, () => {
    console.log(`Server running on ${port}`);
});


//задание 1

app.get("/sum",(req, res) => {
    const a = Number(req.body.a);
    const b = Number(req.body.b);
    if (isNaN(a) || isNaN(b)) {
        res.status(400).send('Ошибка: оба аргумента должны быть числами');
    }
    else {
        console.log('req.body =', req.body);
        res.json({sum: req.body.a + req.body.b});
    }
});

app.post("/reverse-case",(req, res) => {
    const { str } = req.body;
    if (!str) {
        res.status(400).send('Ошибка: строка не задана');
    } else {
        const reversed = str
            .split('')
            .map((char) => {
                if (char === char.toUpperCase()) {
                    return char.toLowerCase();
                } else {
                    return char.toUpperCase();
                }
            })
            .join('')
        console.log('req.body =', req.body);
        res.json(`Перевернутая строка: ${reversed}`);
    }
});

app.put("/obj-to-array",(req, res) => {
    const obj = req.body;
    const arr = [];
    for (let key in obj) {
        arr.push({
            key: key,
            value: obj[key]
        });
    }
    console.log('req.body =', req.body);
    res.json(arr);
});

app.patch("/reverse-array",(req, res) => {
    const arr = req.body;
    console.log('req.body =', req.body);
    const reversedArr = arr.reverse();
    res.json(reversedArr);
});

app.delete("/duplicates",(req, res) => {
    const arr = req.body;
    console.log('req.body =', req.body);
    const uniqueArr = [...new Set(arr)];
    res.json(uniqueArr);
});


//задание 2
initDB();

//Create
app.post("/todos", async (req, res) => {
    try {
        const todo = await ToDo.create({
            title: req.body.title,
            description: req.body.description,
            isCompleted: req.body.isCompleted,
        });
        res.json(todo);
    } catch (error){
        res.status(500).json({message: error.message})
    }
});

//READ-All
app.get("/todos", async (req, res) => {
    try {
        const todoList = await ToDo.findAll();
        res.json({todoList});
    } catch (error){
        res.status(500).json({message: error.message})
    }
});


//READ-BY-ID
app.get("/todos/:id", async (req, res) => {
    try {
        const todo = await ToDo.findByPk(req.params.id);
        res.json({todo});
    } catch (error){
        res.status(500).json({ message: error.message})
    }
});

//UPDATE_BY_ID
app.patch("/todos/:id", async (req, res) => {
    try {
        const todo = await ToDo.findByPk(req.params.id);
        await todo.update({
            title: req.body.title,
            description: req.body.description,
            isCompleted: req.body.isCompleted,
        });
        res.json({todo});
    } catch (error){
        res.status(500).json({ message: error.message})
    }
});

//DELETE-BY-ID
app.delete("/todos/:id", async (req, res) => {
    try {
        const todo = await ToDo.findByPk(req.params.id);
        await todo.destroy();
        res.json({message: "Задача очищена"});
    } catch (error){
        res.status(500).json({ message: error.message})
    }
});

//DELETE
app.delete("/todos", async (req, res) => {
    try {
        await ToDo.destroy({
            truncate:true
        })
        res.json({message: "База данных очищена"});
    } catch (error){
        res.status(500).json({ message: error.message})
    }
});
