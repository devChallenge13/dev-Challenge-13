using SportChallenge.Core.Models;

namespace SportChallenge.Core.Extensions
{
    public static class GameExtension
    {
        public static bool HasWinner(this Game game)
        {
            return game.Result != null && game.Result.HomeTeamResult != game.Result.GuestTeamResult;
        }

        public static int? GetWinner(this Game game)
        {
            if (game.Result == null)
            {
                return null;
            }

            if (game.Result.GuestTeamResult > game.Result.HomeTeamResult)
            {
                return game.GuestTeamId;
            }

            if (game.Result.HomeTeamResult > game.Result.GuestTeamResult)
            {
                return game.HomeTeamId;
            }

            return null;
        }

        public static int? GetLoser(this Game game)
        {
            if (game.Result == null)
            {
                return null;
            }

            if (game.Result.GuestTeamResult > game.Result.HomeTeamResult)
            {
                return game.HomeTeamId;
            }

            if (game.Result.HomeTeamResult > game.Result.GuestTeamResult)
            {
                return game.GuestTeamId;
            }

            return null;
        }

        public static bool IsDraw(this Game game)
        {
            return game.Result != null && game.Result.HomeTeamResult == game.Result.GuestTeamResult;
        }
    }
}
