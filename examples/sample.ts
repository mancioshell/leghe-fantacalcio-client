import FantasyFootballClient from "../";
import conf from "../conf/config.json";
import util from "util";

const main = async () => {
  const client = new FantasyFootballClient(
    conf.appkey,
    conf.webkey,
    conf.username,
    conf.password
  );

  await client.login()

  let leagues = await client.getLeagues();
  console.log(leagues)

  await client.setCurrentLeague(leagues[0].id);

  let teams = await client.getTeams();
  console.log(
    util.inspect(teams, { showHidden: false, depth: null, colors: true })
  );

  let playerList = await client.getPlayerList()
  console.log(playerList)

  let result = await client.buyPlayer(335, 1202003, 20)
  console.log(result)
  
  result = await client.releasePlayer(335, 1202003, 20)
  console.log(result)

};

main();
