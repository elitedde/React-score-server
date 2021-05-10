'use strict';
//usare npx nodemon 
const express = require('express');
const dayjs= require('dayjs');
const morgan = require('morgan'); // logging middleware
const {check, validationResult} = require('express-validator'); // validation middleware
const dao = require('./dao'); // module for accessing the DB

// init express
const app = express();
const port = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json()); // for parsing json request body

/*** API ***/

//retrieve the list of all the available tasks
app.get('/api/tasks', (req, res) => {
  dao.getAll()
  .then(tasks => res.json(tasks))
  .catch(()=> res.status(500).end());
});
//retrieve a task given id
app.get('/api/tasks/:id', (req, res) => {
  dao.getTask(req.params.id)
  .then(task => res.json(task))
  .catch(()=> res.status(500).end());
});
/* update an existing task */
app.put('/api/tasks/:id', [
  /*check('description').isAlpha(),*/
  /*check('date').isDate({format: 'YYYY-MM-DD', strictMode: true}),
  check('date').isAfter(dayjs()),
  check('important').isBoolean(),
  check('private').isBoolean(),
  check('completed').isBoolean()*/
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) /*se ci sono errori*/
    return res.status(422).json({errors: errors.array()});
    
/*qua ho oggetto da aggiornare*/
  const taskToUpdate = req.body;
  /*if(req.params.id === taskToUpdate.id) {*/
    try {
      /*qua non ho problemi*/
      await dao.updateTask(taskToUpdate, req.params.id);
      res.status(200).end();
    } catch(err) {
      /*mando json indietro con stringa di errore*/
      res.status(503).json({error: `Database error during the update of task ${req.params.id}`});
    }
 /* }
  else return res.status(503).json({error: `Wrong id in the request body.`});*/
  
});

/* add a new task*/
app.post('/api/tasks/', [
    check('description').isAlpha(),
    check('date').isDate({format: 'YYYY-MM-DD', strictMode: true}),
    check('date').isAfter(dayjs()),
    /*check('important').isBoolean(),
    check('private').isBoolean(),
    check('completed').isBoolean()*/
  ], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) /*se ci sono errori*/
      return res.status(422).json({errors: errors.array()});
      
    //fare controllo che task non ci sia già
    const taskToAdd = req.body;
      try {
        /*qua non ho problemi*/
        await dao.addTask(taskToAdd);
        res.status(201).end();
      } catch(err) {
        /*mando json indietro con stringa di errore*/
        res.status(503).json({error: `Database error during the adding of the task ${taskToAdd.id}`});
      }
    
});
//?important=parametro con true false
 // delete an existing exam
 app.delete('/api/tasks/:id', async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) /*se ci sono errori*/
      return res.status(503);
      
    const taskToDelete = req.params.id;
    /*if(req.params.id === taskToDelete) {*/
      try {
        await dao.deleteTask(taskToDelete);
        res.status(204).end();
      } catch(err) {
        res.status(503).json({error: `Database error during the update of task ${taskToDelete}`});
      }
    /*}
    else return res.status(503).json({error: `Wrong id in the request body.`});*/
    
  });
// Activate the server
app.listen(port, ()=> {
  console.log(`Server started at http://localhost:${port}`);
})