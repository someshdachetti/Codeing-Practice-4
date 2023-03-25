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
    SELECT
   *
   FROM 

   cricket_team;`;
    let player = await db.all(getPlayer);
    response.send(
      player.map((eachPlayer) => snake_Case_to_camelCase(eachPlayer))
    );
  } catch (e) {
    console.log(`DataBase Error ${e.message}`);
  }
});

app.post("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = request.body;

  let addingplayer = `
    INSERT INTO
    cricket_team (player_name,
    jersey_number,role)
   
    VALUES 

    (player_name ='${playerName}',
    jersey_number${jerseyNumber},
    role = '${role}');
   
    WHERE 
    player_id = ${playerId}`;

  let addplayer = await db.run(addingplayer);
  response.send("player Add to team");
});

app.get("/player/:playerId", async (request, response) => {
  let { playerId } = request.params;
  let getPlayer = `
    SELECT *
    FROM cricket_team
    where 
    player_id = ${playerId};`;

  let result = await db.get(getPlayer);
  response.send(snake_Case_to_camelCase(result));
});

app.put("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;

  const { player_name, jersey_number, role } = request.body;

  let updatePlayer = `
UPDATE 
cricket_team

SET
player_name= '${playerName}',
jersey_number = ${jerseyNumber},
role = ${role};

WHERE 
player_id = ${playerId};`;

  await db.run(updatePlayer);
  response.send("Player Details Updated");
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

module.exports = app;
