const sqlite = require('sqlite3');

const db = new sqlite.Database('tasks.db', (err) => { if (err) throw err; });

this.getAll = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM tasks' ;
    db.all(sql, [], (err, rows) => {
      if(err)
        reject(err);
      else {
        const tasks = rows.map(record => new Task(record.id, record.description, record.important == 1, record.private == 1, record.deadline));
        resolve(tasks);
      }
    });
  });
};

this.getAfterDeadline = (deadline) => {
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
};

this.getWithWord = (word) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM tasks WHERE description LIKE ?";
    db.all(sql, ["%" + word + "%"], (err, rows) => {
      if(err)
        reject(err);
      else {
        const tasks = rows.map(record => new Task(record.id, record.description, record.important == 1, record.private == 1, record.deadline));
        resolve(tasks);
      }
    });
  });
};

