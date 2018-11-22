using System.Linq;
using SportChallenge.Core.Models;

namespace SportChallenge.Core.Extensions
{
    public static class RoundExtension
    {
        public static bool TryAddToRound(this Round round, Game game)
        {
            if (round.Games.Any(roundGame => roundGame.HomeTeam.Id.Equals(game.HomeTeam.Id) ||
                                             roundGame.HomeTeam.Id.Equals(game.GuestTeam.Id) ||
                                             roundGame.GuestTeam.Id.Equals(game.HomeTeam.Id) ||
                                             roundGame.GuestTeam.Id.Equals(game.GuestTeam.Id)))
            {
                return false;
            }

            round.Games.Add(game);

            return true;
        }
    }
}
