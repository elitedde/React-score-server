'use strict';
//usare npx nodemon 
const express = require('express');
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

// GET /api/exams ritorna una promise
/*se va tutto bene .then() prendo arrayoggetti */
/*se c'è errore .catch() error 500 .end() serve per inviare risposta*/
/*lanciando vedo elenco esami*/
app.get('/api/exams', (req, res) => {
  dao.listExams()
  .then(exams => res.json(exams))
  .catch(()=> res.status(500).end());
});

// PUT /api/exams/<code>
/*bisogna cercare reqbin e inserire localhost3001 min7, in content devo avere .json e inserisco oggetto json che */
/*voglio aggiornare* e con send vedo 200ok/
/*i check mi servono per fare validazione strictMode: true accetto data solo in questo formato*/
app.put('/api/exams/:code', [
  check('code').isLength({min:7, max:7}),
  check('score').isInt({min: 18, max: 31}),
  check('date').isDate({format: 'YYYY-MM-DD', strictMode: true})
  /*potrei aggiungere date.isafter() come ulteriore check */
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) /*se ci sono errori*/
    return res.status(422).json({errors: errors.array()});
    
/*qua ho oggetto da aggiornare*/
  const examToUpdate = req.body;
  if(req.params.code === examToUpdate.code) {
    try {
      /*qua non ho problemi*/
      await dao.updateExam(examToUpdate);
      res.status(200).end();
    } catch(err) {
      /*mando json indietro con stringa di errore*/
      res.status(503).json({error: `Database error during the update of exam ${examToUpdate.code}`});
    }
  }
  else return res.status(503).json({error: `Wrong code in the request body.`});
  
});

// Activate the server
app.listen(port, ()=> {
  console.log(`Server started at http://localhost:${port}`);
})