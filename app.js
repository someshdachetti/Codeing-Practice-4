let express = require("express");
let { open } = require("sqlite");
let sqlite3 = require("sqlite3");

let path = require("path");
let dataBase = path.join(__dirname, "cricketTeam.db");

let db = null;
let app = express();
app.use(express.json());

let start = async () => {
  try {
    db = await open({
      filename: dataBase,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => console.log("Server Running at http://localHost"));
  } catch (e) {
    console.log(`Database Error: ${e.message}`);
    process.exit(1);
  }
};
start();

const snake_Case_to_camelCase = (DataBase) => {
  return {
    playerId: DataBase.player_id,
    playerName: DataBase.player_name,
    jerseyNumber: DataBase.jersey_number,
    role: DataBase.role,
  };
};

app.get("/players/", async (request, response) => {
  try {
    const getPlayer = `
   select 
   *
   from 
   cricket_team;`;
    let Player = await db.all(getPlayer);
    response.send(Player.map((eachPlayer) => snake_Case_to_camelCase(Player)));
  } catch (e) {
    console.log(`DataBase Error ${e.message}`);
  }
});

app.post("/players/", async (request, response) => {
  let { playerName, jerseyNumber, role } = request.body;

  try {
    let addingplayer = `
    INSERT INTO
    cricket_team (player_name,
    jersey_number,role)
    VALUES 

    ('${playerName}',${jerseyNumber},'${role}');`;

    let addplayer = await db.run(addingplayer);
    response.send("player Add to team");
  } catch (e) {
    console.log(`DataBase Error : ${e.message}`);
  }
});

app.get("/player/:playerId", async (request, response) => {
  let { playerId } = request.params;

  try {
    let getPlayer = `
    SELECT *
    FROM cricket_team
    where 
    player_id = ${playerId};`;

    let result = await db.get(getPlayer);
    response.send(snake_Case_to_camelCase(getPlayer));
  } catch (e) {
    console.log(`DataBase ${e.message}`);
  }
});

app.put("/players/:playerId", async (request, response) => {
  let { playerId } = request.params;
  let { playerName, jerseyNumber, role } = request.body;

  try {
    let updatePlayer = `
UPDATE 
cricket_team
SET
player_id = '${playerName}',
jersey_number =${jerseyNumber},
role = '${role}';`;

    await db.run(updatePlayer);
    response.send("Player Details Updated");
  } catch (e) {
    console.log(`data Base ${e.message}`);
  }
});

app.delete("/players/:playerId", async (request, response) => {
  let { playerId } = request.params;

  let deletePLayer = `
    SELECT *
    FROM cricket_team
    
    WHERE 
    player_id = ${playerId};`;

  await db.get(deletePLayer);
  response.send("Player Removed");
});
