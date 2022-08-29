class LeagueNotFound extends Error {
  constructor(id: number) {
    super(`No league with this id ${id}`);
  }
}

class TeamNotFound extends Error {
  constructor(teamId: number, leagueId: number) {
    super(`No team with id ${teamId} in league with id ${leagueId}`);
  }
}

class PlayerNotFound extends Error {
  constructor(id: number) {
    super(`No player with this id ${id}`);
  }
}

class PlayerInTeamNotFound extends Error {
  constructor(playerId: number, teamId: number) {
    super(`No player with id ${playerId} in team ${teamId}`);
  }
}

class GenericError extends Error {
  constructor(operation: string) {
    super(`Something went wrong during operation ${operation}`);
  }
}

export default LeagueNotFound;
export { LeagueNotFound, TeamNotFound, PlayerNotFound, PlayerInTeamNotFound, GenericError };
