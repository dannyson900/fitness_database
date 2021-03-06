

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

let connection = null;

const app = express();
app.use(express.json());
app.use(cors());

//call to connect to our database
app.post("/connect-database", (req,res) => {
  const user = req.body.username;
  const password = req.body.password;
  connection = mysql.createConnection({
    host: 'localhost',
    user: user,
    password: password,
    database: 'fitness_db'
  });

  connection.connect(function(err) {
    if (err) {
      console.log('Could not connect, enter correct username and password!');
      res.status(404).send("Failure");
    } else {
      console.log('Connected to the MySQL server.');
      res.status(200).send("Success");
    }
  });
});


//user calls to validate login and registration
app.get("/check-user-exists", (req,res) => {
  const user = req.query.username;
  let sql = `CALL userExists(\"${user}\")`;
  connection.query(sql, (error, results) => {
    if (error) {
      console.log(error.message);
    } else {
      let numtuples = JSON.parse(JSON.stringify(results[0].length));
      if (numtuples == 0) {
        res.status(200).send("Success");
      } else {
        res.status(401).send("User Already Exists!");
      }
    }
  });
});

app.post("/register-user", (req,res) => {
  const user = req.body.username;
  const password = req.body.password;
  const date = new Date().toJSON().slice(0, 10);
  let sql = `CALL insertUser(\"${user}\", \"${password}\",\"${date}\")`;
  connection.query(sql, (error) => {
    if (error) {
      console.log(error.message);
    } else {
      res.status(200).send("Created Account Successfully!");
    }
  });
});

app.get("/login-user", (req,res) => {
  const user = req.query.username;
  const pass = req.query.password;
  let sql = `SELECT loginUser(\"${user}\", \"${pass}\") AS output`;
  connection.query(sql, (err,results) => {
    if (err) {
      console.log(err);
    } else {
       let output = JSON.parse(JSON.stringify(results[0].output));
       if (output == 1) {
       res.status(200).send("Login succesful");
       } else {
       res.status(401).send("account not found");
       }
    } 
  });
});

//viewing our achievements and user achievements unlocked
app.get("/userAchievements", (req,res) => {
  const user = req.query.username;
  let sql = `CALL findUserAchievements(\"${user}\")`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      let numtuples = JSON.parse(JSON.stringify(results[0].length));
      if (numtuples > 0) {
         res.send(results[0]);
      }
    }
  });
});

app.get("/viewAchievements", (req,res) => {
  let sql = `CALL viewAchievements()`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      let numtuples = JSON.parse(JSON.stringify(results[0].length));
      if (numtuples > 0) {
         res.send(results[0]);
      }
    }
  })
});



//CRUD for workout log
app.get("/viewWorkoutDifficulty", (req,res) => {
  const param = req.query.difficulty;
  let sql = `Call findWorkOutByDifficulty(\"${param}\")`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err); 
    } else {
      let numtuples = JSON.parse(JSON.stringify(results[0].length));
      if (numtuples > 0) {
         res.send(results[0]);
      }
    }
  });
});

app.get("/viewWorkoutAll", (req, res) => {
  let sql = `Call viewAllWorkouts()`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err); 
    } else {
      let numtuples = JSON.parse(JSON.stringify(results[0].length));
      if (numtuples > 0) {
         res.send(results[0]);
      }
    }
  });
});

app.get("/viewWorkoutExercise", (req,res) => {
  const param = req.query.value;
  let sql = `Call findWorkOutByExercise(\"${param}\")`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err); 
    } else {
      let numtuples = JSON.parse(JSON.stringify(results[0].length));
      if (numtuples > 0) {
         res.send(results[0]);
      }
    }
  });
});

app.get("/viewWorkoutEquipment", (req,res) =>{
  const param = req.query.value;
  let sql = `Call findWorkOutByEquipment(\"${param}\")`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err); 
    } else {
      let numtuples = JSON.parse(JSON.stringify(results[0].length));
      if (numtuples > 0) {
         res.send(results[0]);
      }
    }
  });
});

app.get("/viewWorkoutName", (req,res) => {
  const param = req.query.value;
  let sql = `Call workOutExists(\"${param}\")`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err); 
    } else {
      let numtuples = JSON.parse(JSON.stringify(results[0].length));
      if (numtuples > 0) {
         res.send(results[0]);
      }
    }
  });
});

app.get("/viewWorkoutMuscle", (req,res) => {
  const param = req.query.value;
  let sql = `Call findWorkOutByMuscleGroup(\"${param}\")`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err); 
    } else {
      let numtuples = JSON.parse(JSON.stringify(results[0].length));
      if (numtuples > 0) {
         res.send(results[0]);
      }
    }
  });
});

app.post("/logWorkout", (req,res) => {
  const username = req.body.username;
  const w_id = req.body.id;
  const description = req.body.desc;
  const length = req.body.length;
  const date = new Date().toJSON().slice(0, 10);
  let sql = `CALL logWorkout(\"${date}\",\"${description}\",\"${username}\",\"${w_id}\",\"${length}\")`;
  connection.query(sql, (err) => {
    if (err) {
      res.status(401).send('error creating workout log!');
    } else {
      res.status(200).send('created workout log!');
    }
  });
});

app.get("/viewWorkoutLogs", (req, res) => {
  const username = req.query.username;
  let sql = `CALL getWorkoutLogsFromUser(\"${username}\");`
  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(results[0]);
    }
  });
});

app.put("/updateWorkoutLog", (req,res) => {
  const username = req.body.username;
  const logId = req.body.logId;
  const desc = req.body.description;
  const date = req.body.date;
  const length = req.body.length;

  let sql = `CALL updateWorkoutLog(\"${logId}\",\"${username}\",\"${desc}\",\"${date}\",\"${length}\")`;
  connection.query(sql, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send('successfully udpated tuples');
    }
  });
});


app.delete("/deleteWorkoutLog", (req,res) => {
  const id = req.query.id;
  let sql = `CALL deleteWorkoutLog(\"${id}\")`;
  connection.query(sql, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.send("successfully deleted workout log!");
    }
  });
});


//CRUD for diet log
app.post("/addDietLog", (req,res) => {
  const username = req.body.username;
  const id = req.body.id;
  const description = req.body.description;
  const date = new Date().toJSON().slice(0, 10);
  let sql = `CALL logDiet(\"${date}\",\"${description}\",\"${username}\",\"${id}\")`;
  connection.query(sql, (err) => {
    if (err) {
      res.status(401).send('error creating workout log!');
    } else {
      res.status(200).send('created workout log!');
    }
  });
});

app.get("/viewAllDietLogs", (req,res) => {
  const username = req.query.username;
  let sql = `CALL viewDietLog(\"${username}\");`
  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(results[0]);
    }
  });
});

app.put("/editDietLog", (req,res) => {
  const username = req.body.username;
  const id = req.body.id;
  const date = req.body.date;
  const description = req.body.description;
  let sql = `CALL updateDietLog(\"${id}\",\"${username}\",\"${description}\",\"${date}\")`;
  connection.query(sql, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send('success updating your diet log');
    }
  });
});

app.delete("/deleteDietLog", (req,res) => {
  const id = req.query.id;
  let sql = `CALL deleteWorkoutLog(\"${id}\")`;
  connection.query(sql, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.send("successfully deleted workout log!");
    }
  });
});



//CRUD for meals
app.post("/addMeal", (req,res) => {
  const description = req.body.description;
  const calories = req.body.calories;
  const carbs = req.body.carbs;
  const protein = req.body.protein;
  const fat = req.body.fat;
  let sql = `CALL addMeal(\"${description}\",\"${calories}\",\"${carbs}\",\"${protein}\",\"${fat}\")`;
  connection.query(sql, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send('success editing a meal!');
    }
  });
});

app.put("/editMeal", (req,res) => {
  const id = req.body.id;
  const description = req.body.description;
  const calories = req.body.calories;
  const carbs = req.body.carbs;
  const protein = req.body.protein;
  const fat = req.body.fat;
  let sql = `CALL editMeal(\"${id}\",\"${description}\",\"${calories}\",\"${carbs}\",\"${protein}\",\"${fat}\")`;
  connection.query(sql, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send('success editing a meal!');
    }
  });
});

app.delete("/deleteMeal", (req,res) => {
  const id = req.query.id;
  let sql = `CALL deleteMeal(\"${id}\")`;
  connection.query(sql, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.send("successfully deleted workout log!");
    }
  });
});

app.get("/viewAllMeals", (req,res) => {
  let sql = `Call findAllMeals()`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err); 
    } else {
      let numtuples = JSON.parse(JSON.stringify(results[0].length));
      if (numtuples > 0) {
         res.send(results[0]);
      }
    }
  });
});

app.get("/viewAllMealsByCalories", (req,res) => {
  const symbol = req.query.symbol;
  const macroValue = req.query.macroValue;
  let sql = `Call findMealByCalories(\"${macroValue}\", \"${symbol}\")`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err); 
    } else {
      let numtuples = JSON.parse(JSON.stringify(results[0].length));
      if (numtuples > 0) {
         res.send(results[0]);
      }
    }
  });
});

app.get("/viewAllMealsByProtein", (req,res) => {
  const symbol = req.query.symbol;
  const macroValue = req.query.macroValue;
  let sql = `Call findMealByProtein(\"${macroValue}\", \"${symbol}\")`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err); 
    } else {
      let numtuples = JSON.parse(JSON.stringify(results[0].length));
      if (numtuples > 0) {
         res.send(results[0]);
      }
    }
  });
});

app.get("/viewAllMealsByFat", (req,res) => {
  const symbol = req.query.symbol;
  const macroValue = req.query.macroValue;
  let sql = `Call findMealByFat(\"${macroValue}\", \"${symbol}\")`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err); 
    } else {
      let numtuples = JSON.parse(JSON.stringify(results[0].length));
      if (numtuples > 0) {
         res.send(results[0]);
      }
    }
  });
});

app.get("/viewAllMealsByCarbs", (req,res) => {
  const symbol = req.query.symbol;
  const macroValue = req.query.macroValue;
  let sql = `Call findMealByCarbs(\"${macroValue}\", \"${symbol}\")`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err); 
    } else {
      let numtuples = JSON.parse(JSON.stringify(results[0].length));
      if (numtuples > 0) {
         res.send(results[0]);
      }
    }
  });

});



//update username and password
app.put("/updateUserAccount", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  let sql = `CALL updateUser(\"${username}\",\"${password}\")`;
  connection.query(sql, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.send("successfully updated user account");
    }
  });
});

//delete user account and anything associated with the user
app.delete("/deleteUserAccount", (req,res) => {
  const username = req.query.username;
  let sql = `CALL deleteUser(\"${username}\")`;
  connection.query(sql,(err) => {
    if (err) {
      console.log(err);
    } else {
      res.send("successfully updated user account");
    }
  });
});

app.listen(3001, () => {
  console.log("running server");
});








