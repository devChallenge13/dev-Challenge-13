using SportChallenge.Core.Models;

namespace SportChallenge.Core.Services.Contracts
{
    public interface IGameFactory
    {
        Game CreateGame(Team home, Team guest);
    }
}
