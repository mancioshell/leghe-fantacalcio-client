# Fantasy Football Client

A NodeJs client to interact with https://leghe.fantacalcio.it/

## Installation

```
npm i fantasy-football-wrapper
```

## Configuration

Create a file credentials.json in a conf directory.

```
{
    "username": "YOUR_USERNAME",
    "password": "YOUR_PASSWORD",
    "appkey": "c3885bc5a83a16e6366083570a0a576d9eda44ef",
    "webkey": "4ab27d6de1e92c810c6d4efc8607065a735b917f",
     "refreshInterval": 60000 // optional
}

```

## Examples

### Get your leagues

```js

const FantasyFootballClient = require("fantasy-football-wrapper").default;
const conf = require("./conf/config.json");

const main = async () => {
    
  const client = new FantasyFootballClient(
    conf.appkey,
    conf.webkey    
  );

  let user = await client.login(conf.username, conf.password);
  console.log(user.leagues);

};

main()
```

### Get Released Player List

```js

const FantasyFootballClient = require("fantasy-football-wrapper").default;
const conf = require("./conf/config.json");

const main = async () => {
    
  const client = new FantasyFootballClient(
    conf.appkey,
    conf.webkey    
  );

  let user = await client.login(conf.username, conf.password);
  
  let userToken = user.token
  let leagueToken = user.leagues[0].token
  let leagueAlias = user.leagues[0].alias

  let playerList = await client.getPlayerList(userToken, leagueToken, leagueAlias)
  console.log(playerList)

};

main()
```

### Get League's Teams

```js

const FantasyFootballClient = require("fantasy-football-wrapper").default;
const conf = require("./conf/config.json");

const main = async () => {
    
  const client = new FantasyFootballClient(
    conf.appkey,
    conf.webkey    
  );

  let user = await client.login(conf.username, conf.password);
  
  let userToken = user.token
  let leagueToken = user.leagues[0].token
  let leagueAlias = user.leagues[0].alias

  let teams = await client.getTeams(userToken, leagueToken, leagueAlias);
  console.log(
    util.inspect(teams, { showHidden: false, depth: null, colors: true })
  );

};

main()
```


### Buy a Player

```js

const FantasyFootballClient = require("fantasy-football-wrapper").default;
const conf = require("./conf/config.json");

const main = async () => {
    
  const client = new FantasyFootballClient(
    conf.appkey,
    conf.webkey    
  );

  let user = await client.login(conf.username, conf.password);
  
  let userToken = user.token
  let leagueToken = user.leagues[0].token
  let leagueAlias = user.leagues[0].alias

  let result = await client.buyPlayer(userToken, leagueToken, leagueAlias, 335, 1202003, 20)
  console.log(result)

};

main()
```

### Release a Player

```js

const FantasyFootballClient = require("fantasy-football-wrapper").default;
const conf = require("./conf/config.json");

const main = async () => {
    
  const client = new FantasyFootballClient(
    conf.appkey,
    conf.webkey    
  );

  let user = await client.login(conf.username, conf.password);
  
  let userToken = user.token
  let leagueToken = user.leagues[0].token
  let leagueAlias = user.leagues[0].alias

  let result = await client.releasePlayer(userToken, leagueToken, leagueAlias, 335, 1202003, 20)
  console.log(result)

};

main()
```