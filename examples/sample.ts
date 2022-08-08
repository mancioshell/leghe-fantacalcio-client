import FantasyFootballClient from "../";
import conf from "../conf/config.json";
import util from "util";

const main = async () => {
  const client = new FantasyFootballClient(
    conf.appkey,
    conf.webkey
  );

  let user = await client.login(conf.username, conf.password)
  console.log(user)
  console.log(user.leagues)

  let userToken = user.token
  let leagueToken = user.leagues[0].token
  let leagueAlias = user.leagues[0].alias

  let teams = await client.getTeams(userToken, leagueToken, leagueAlias);
  console.log(
    util.inspect(teams, { showHidden: false, depth: null, colors: true })
  );

  let playerList = await client.getPlayerList(userToken, leagueToken, leagueAlias)
  console.log(playerList)

  let result = await client.buyPlayer(userToken, leagueToken, leagueAlias, 335, 1202003, 20)
  console.log(result)
  
  result = await client.releasePlayer(userToken, leagueToken, leagueAlias, 335, 1202003, 20)
  console.log(result)

};

main();
