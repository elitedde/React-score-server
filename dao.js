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
exports.updateTask = (task, id) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE tasks SET description=?, important=?, private=?, deadline=DATE(?), completed=?, user=? WHERE id = ?';
      db.run(sql, [task.description,task.important,task.private, task.deadline, task.completed, task.user, id], function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  };
  const getMaxId = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT MAX(id) FROM tasks';
        db.get(sql, [], (err, row) => {
        if (err) {
            reject(err);
            return;
        }
        else{
            if(row===undefined)
                resolve(0);
            else
                resolve(row);
        }    
        });
    })
}
// add a new task
exports.createTask = (task) => {
  return new Promise((resolve, reject) => {
    
    const sql = 'INSERT INTO tasks(id,description,important,private,deadline,completed,user) VALUES(?, ?, ?, ?, ?, ?, ?)';
    let rows;
    getMaxId().then((x) => rows = x).catch((err) => reject(err));    
    
    let numRows = rows+1;
    
    db.run(sql, [numRows, task.description, task.important, task.private, task.deadline, task.completed, task.user], function (err) {
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
          resolve();
      });
    });
  };
  exports.getFilteredTasks = (filter) => {
    return new Promise((resolve, reject) => {
      let sql;
      if(filter == "next7days")
        sql = 'SELECT * FROM tasks WHERE deadline >= "' + dayjs().format("YYYY-MM-DD HH:mm") + '" AND deadline <= "' + dayjs().add(7,'day').format("YYYY-MM-DD HH:mm") + '"';
      else if(filter == "all")
        sql = 'SELECT * FROM tasks';
      else if(filter == "today")
        sql = 'SELECT * FROM tasks WHERE DATE(deadline) = ' + dayjs().format("YYYY-MM-DD");
      else
      //tutti gli altri filtri
        sql = 'SELECT * FROM tasks WHERE '+ filter + '=1';     
        db.all(sql, [], (err, rows) => {  
        if (err) {
          reject(err);
          return;
        }

        const tasks = rows.map((t) => ({ id: t.id, description: t.description, important:t.important, private: t.private,
              deadline: t.deadline, completed: t.completed, user: t.user }));
        resolve(tasks);
      });
    });
  };


