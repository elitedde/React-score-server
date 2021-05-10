const e = require('express');
const sqlite = require('sqlite3');

const db = new sqlite.Database('tasks.db', (err) => { if (err) throw err; });

//retrieve the list of all the available tasks
exports.getAll = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM tasks' ;
    db.all(sql, [], (err, rows) => {
      if(err)
        reject(err);
      else {
        const tasks = rows.map((e) => ({description: e.description,important: e.important,private: e.private, deadline: e.deadline,completed: e.completed,user: e.user}));
        resolve(tasks);
      }
    });
  });
};
//retrieve a task, given its id
exports.getTask = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM tasks WHERE id=?' ;
    db.get(sql, [id], (err, e) => {
      if(err)
        reject(err);
      else {
        const task = {description: e.description,important: e.important,private: e.private, deadline: e.deadline,completed: e.completed,user: e.user};
        resolve(task);
      }
    });
  });
};
/* update an existing task */
exports.updateExam = (task) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE tasks SET description=? important=? private=? date=DATE(?) completed=? WHERE id = ?';
      db.run(sql, [task.description,task.important,task.private, task.deadline, task.completed], function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
    });
  };
// add a new task
exports.createTask = (task) => {
    return new Promise((resolve, reject) => {
      const s = 'SELECT MAX(id) FROM tasks';
      newid= db.get(s,id) + 1;
      const sql = 'INSERT INTO tasks(id, description, important, private, deadline, completed, user) VALUES(?,?,?,?, DATE(?),?,?)';
      db.run(sql, [id, task.description,task.important,task.private, task.deadline, task.completed, task.user], function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
    });
  };
// delete an existing exam
exports.deleteTask = (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM tasks WHERE id = ?';
      db.run(sql, [id], (err) => {
        if (err) {
          reject(err);
          return;
        } else
          resolve(null);
      });
    });
  }
/*this.getAfterDeadline = (deadline) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM tasks WHERE deadline > ?';
    db.all(sql, [deadline.format()], (err, rows) => {
      if(err)
        reject(err);
      else {
        const tasks = rows.map(record => new Task(record.id, record.description, record.important == 1, record.private == 1, record.deadline));
        resolve(tasks);
      }
    });
  });
};*/


