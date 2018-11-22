using System.Collections.Generic;
using System.Linq;
using SportChallenge.Core.Extensions;
using SportChallenge.Core.Models;
using SportChallenge.Core.Services.Contracts;

namespace SportChallenge.Core.Services
{
    public class RoundsService : IRoundsService
    {
        private readonly IGameFactory _gameFactory;

        public RoundsService(IGameFactory gameFactory)
        {
            _gameFactory = gameFactory;
        }

        public Round[] CreateRoundsPerTournament(Tournament tournament)
        {
            var rounds = new List<Round>();

            for (var i = 0; i < tournament.Teams.Count - 1; i++)
            {
                for (var j = i + 1; j < tournament.Teams.Count; j++)
                {
                    var team1 = tournament.Teams.ElementAt(i);
                    var team2 = tournament.Teams.ElementAt(j);

                    var game1 = _gameFactory.CreateGame(team1, team2);
                    var game2 = _gameFactory.CreateGame(team2, team1);

                    AddGameToRound(rounds, game1);
                    AddGameToRound(rounds, game2);
                }
            }

            return rounds.ToArray();
        }

        private void AddGameToRound(ICollection<Round> rounds, Game game)
        {
            var addedToRound = rounds.Any(round => round.TryAddToRound(game));

            if (!addedToRound)
            {
                var round = new Round
                {
                    Number = rounds.Count + 1,
                    Games = new List<Game>()
                };

                round.TryAddToRound(game);
                rounds.Add(round);
            }
        }
    }
}
