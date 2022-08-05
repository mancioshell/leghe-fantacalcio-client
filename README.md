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
    "webkey": "4ab27d6de1e92c810c6d4efc8607065a735b917f"
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
    conf.webkey,
    conf.username,
    conf.password
  );

  await client.login();

  let leagues = await client.getLeagues();
  console.log(leagues);

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
    conf.webkey,
    conf.username,
    conf.password
  );

  await client.login();

  let leagues = await client.getLeagues();

  await client.setCurrentLeague(leagues[0]._id)

  let playerList = await client.getReleasedList()  
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
    conf.webkey,
    conf.username,
    conf.password
  );

  await client.login();

  let leagues = await client.getLeagues();

  await client.setCurrentLeague(leagues[0]._id)

  let teams = await client.getTeams()
  console.log(teams)

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
    conf.webkey,
    conf.username,
    conf.password
  );

  await client.login();

  let leagues = await client.getLeagues();

  await client.setCurrentLeague(leagues[0]._id)

  let result = await client.buyPlayer(335, 1202003, 20)
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
    conf.webkey,
    conf.username,
    conf.password
  );

  await client.login();

  let leagues = await client.getLeagues();

  await client.setCurrentLeague(leagues[0]._id)

  let result = await client.releasePlayer(335, 1202003, 20)
  console.log(result)

};

main()
```