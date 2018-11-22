using System;
using SportChallenge.Core.Models;
using SportChallenge.Core.Services.Contracts;

namespace SportChallenge.Core.Services
{
    public class GameResultFactory : IGameResultFactory
    {
        public GameResult Create(Game game, int homeResult, int guestResult)
        {
            if (homeResult < 0)
            {
                throw new ArgumentException("Home team result cannot be negative", nameof(homeResult));
            }

            if (guestResult < 0)
            {
                throw new ArgumentException("Guest team result cannot be negative", nameof(guestResult));
            }

            return new GameResult
            {
                GameId = game.Id,
                GuestTeamResult = guestResult,
                HomeTeamResult = homeResult
            };
        }
    }
}
