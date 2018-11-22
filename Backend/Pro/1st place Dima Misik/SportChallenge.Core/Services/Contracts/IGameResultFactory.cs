using SportChallenge.Core.Models;

namespace SportChallenge.Core.Services.Contracts
{
    public interface IGameResultFactory
    {
        GameResult Create(Game game, int homeResult, int guestResult);
    }
}
