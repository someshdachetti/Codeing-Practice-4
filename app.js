let express = require("express");
let { open } = require("sqlite");
let sqlite3 = require("sqlite3");

let path = require("path");
let dataBase = path.join(__dirname, "cricketTeam.db");

let db = null;
let app = express();

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

const snake_Case_to_camelCase = (Dbobjects) => {
  return {
    playerId: Dbobjects.player_id,
    playerName: Dbobjects.player_name,
    jerseyNumber: Dbobjects.jersey_number,
    role: Dbobjects.role,
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
