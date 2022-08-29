// @ts-ignore
import FantasyFootballClient from "@core/fantasyfootball-league-client"
// @ts-ignore
import conf from "../conf/config.json";

const main = async () => {
  const client = new FantasyFootballClient(conf.appkey, conf.webkey);

  let user = await client.login(conf.username, conf.password);
  console.log(JSON.parse(JSON.stringify(user)));

  if (user.token) {
    let leagues = await client.getLeagues(user.token);
    console.log(JSON.parse(JSON.stringify(leagues)));

    let league = await client.getLeague(user.token, leagues[0].id);
    console.log(JSON.parse(JSON.stringify(league.role)));

    for(let team of league.teams){
      console.log(JSON.parse(JSON.stringify(team)))
    }    

    console.log(JSON.parse(JSON.stringify(Object.fromEntries(league.players))));

    let result = await client.buyPlayer(user.token, leagues[0].id, 5453, 8819567, 20)
    console.log(result)

    result = await client.releasePlayer(user.token, leagues[0].id, 5453, 8819567, 20)
    console.log(result)
  }
};

main();
