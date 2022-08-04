import FantasyFootballClient from "../";
import conf from "../conf/config.json"

const main = async () => {
  const client = new FantasyFootballClient(conf.appkey, conf.webkey, conf.username, conf.password);
  await client.login();

  let leagues = await client.getLeagues()
  console.log(leagues)

  await client.setCurrentLeague(360377)

  // let teams = await client.getTeams()
  // console.log(teams)

  let playerList = await client.getReleasedList()  
  console.log(playerList)

  // let result = await client.buyPlayer(335, 1202003, 20)
  // console.log(result)
  //result = await client.releasePlayer(335, 1202003, 20)
  //console.log(result)

  //let teams = await client.getTeams()
  //console.log(teams)
};

main();
