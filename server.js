'use strict';
// http://localhost:3001/api/tasks?filter= nomefiltro
const express = require('express');
const dayjs= require('dayjs');
const morgan = require('morgan'); 
const {check, validationResult} = require('express-validator'); 
const dao = require('./dao');

const app = express();
const port = 3001;

app.use(morgan('dev'));
app.use(express.json());

/*** API ***/

//retrieve the list of all the available tasks
app.get('/api/tasks', (req, res) => {
  if(req.query.filter){
    let filter = req.query.filter
    dao.getFilteredTasks(filter)
    .then(tasks => res.json(tasks))
    .catch(()=> res.status(500).end());
  }
  else{

    dao.getAll()
    .then(tasks => res.json(tasks))
    .catch(()=> res.status(500).end());
  }
});

//retrieve a task given id
//req.params.id estrapolo id dalla mia richiesta http
app.get('/api/tasks/:id', (req, res) => {
  dao.getTask(req.params.id)
  .then(task => res.json(task))
  .catch(()=> res.status(500).end());
});

/* update an existing task */
app.put('/api/tasks/:id', [
  check('description').notEmpty(),
  check('deadline').isISO8601(),
  check('important').isNumeric(),
  check('private').isNumeric(),
  check('completed').isNumeric(),
  check('user').isNumeric()
], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) /*se ci sono errori*/
    return res.status(422).json({errors: errors.array()});
  //fare controllo che task non ci sia già
  const taskToUpdate = req.body;
  const id = req.params.id;
  dao.updateTask(taskToUpdate, id).then(() =>  res.status(201).end()).
      catch(() => res.status(503).json({error: `Database error during the update.`}));
});

/* add a new task*/
app.post('/api/tasks/', [
    check('description').isAlpha(),
    check('deadline').isISO8601(),
    check('important').isNumeric(),
    check('private').isNumeric(),
    check('completed').isNumeric(),
    check('user').isNumeric()
  ], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) /*se ci sono errori*/
      return res.status(422).json({errors: errors.array()});
    //fare controllo che task non ci sia già
    const taskToAdd = req.body;
    dao.createTask(taskToAdd).then(() =>  res.status(201).end()).
        catch(() => res.status(503).json({error: `Database error during the creation of task ${task.id}.`}));
  });
  


 // delete an existing task
 app.delete('/api/tasks/:id', (req, res) => {
  dao.deleteTask(req.params.id).then(() =>  res.status(204).end()).
  catch(() => res.status(503).json({error: `Database error during the delete.`}));
});

// Activate the server
app.listen(port, ()=> {
  console.log(`Server started at http://localhost:${port}`);
})