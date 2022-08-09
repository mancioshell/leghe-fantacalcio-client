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

  let leagues = await client.getLeagues(user.token)
  console.log(leagues)

  let league = await client.getLeague(user.token, leagues[0].id)
  //console.log(league)

  let roles = await client.getRolesByLeague(user.token, leagues[0].id)
  console.log(roles)

  console.log(
    util.inspect(league.teams, { showHidden: false, depth: null, colors: true })
  );

  //console.log(league.players)

  let result = await client.buyPlayer(user.token, leagues[0].id, 335, 1202003, 20)
  console.log(result)
  
  result = await client.releasePlayer(user.token, leagues[0].id, 335, 1202003, 20)
  console.log(result)

};

main();
