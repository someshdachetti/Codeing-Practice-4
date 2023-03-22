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
  const getPlayer = `
   select 
   *
   from 
   cricket_team`;
  let Player = await db.all(getPlayer);
  response.send(
    Player.map((eachPlayer) => snake_Case_to_camelCase(eachPlayer))
  );
});

app.get("/players/:playerId", async (request, response) => {
  let { playerId } = request.params;

  let getplayerQuery = `
       
  SELECT 
  *
  
  FROM 
  cricket_team

  WHERE 
  player_id = ${playerId};`;
  
  let player = await db.get(getplayerQuery);
  response.send(snake_Case_to_camelCase(player));
});

app.post('/players/', async (request,response)=>

    let {playerName,jerseyNumber,role} = request.body

    let addingplayer = `
    INSERT INTO
    cricket_team (player_name,jersey_number,role)
    VALUES 
    ('${playerName}',${jerseyNumber},'${role}');`;
    let addplayer = await db.run(addingplayer)
    response.send("player Add to team")

);