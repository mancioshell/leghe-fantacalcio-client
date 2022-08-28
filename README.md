# Leghe Fantacalcio Client

A Typescript client to interact with https://leghe.fantacalcio.it/

## Installation

```
npm i leghe-fantacalcio-client
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

const FantasyFootballClient = require("leghe-fantacalcio-client").default;
const conf = require("./conf/config.json");

const main = async () => {
    
  const client = new FantasyFootballClient(
    conf.appkey,
    conf.webkey    
  );

  let user = await client.login(conf.username, conf.password);
  let leagues = await client.getLeagues(user.token);
  console.log(leagues);

};

main()
```

### Get league by id

```js

const FantasyFootballClient = require("leghe-fantacalcio-client").default;
const conf = require("./conf/config.json");

const main = async () => {
    
  const client = new FantasyFootballClient(
    conf.appkey,
    conf.webkey    
  );

  let user = await client.login(conf.username, conf.password);
  let leagues = await client.getLeagues(user.token);
  let league = await client.getLeague(user.token, leagues[0].id);
  console.log(league);

};

main()
```

### Get League's Teams

```js

const FantasyFootballClient = require("leghe-fantacalcio-client").default;
const conf = require("./conf/config.json");

const main = async () => {
    
  const client = new FantasyFootballClient(
    conf.appkey,
    conf.webkey    
  );

  let user = await client.login(conf.username, conf.password);
  let leagues = await client.getLeagues(user.token);
  let league = await client.getLeague(user.token, leagues[0].id);
  console.log(league.teams);

};

main()
```


### Buy a Player

```js
const FantasyFootballClient = require("leghe-fantacalcio-client").default;
const conf = require("./conf/config.json");

const main = async () => {
    
  const client = new FantasyFootballClient(
    conf.appkey,
    conf.webkey    
  );

  let user = await client.login(conf.username, conf.password);
  let leagues = await client.getLeagues(user.token);

  let playerId = 5453
  let teamId = 2321312
  let price = 20

  let result = await client.buyPlayer(user.token, leagues[0].id, playerId, teamId, price)
  console.log(result)

};

main()
```

### Release a Player

```js
const FantasyFootballClient = require("leghe-fantacalcio-client").default;
const conf = require("./conf/config.json");

const main = async () => {
    
  const client = new FantasyFootballClient(
    conf.appkey,
    conf.webkey    
  );

  let user = await client.login(conf.username, conf.password);
  let leagues = await client.getLeagues(user.token);

  let playerId = 5453
  let teamId = 2321312
  let price = 20

  let result = await client.releasePlayer(user.token, leagues[0].id, playerId, teamId, price)
  console.log(result)

};

main()
```