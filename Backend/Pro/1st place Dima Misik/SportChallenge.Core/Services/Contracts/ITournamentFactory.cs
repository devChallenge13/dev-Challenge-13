using SportChallenge.Core.Models;

namespace SportChallenge.Core.Services.Contracts
{
    public interface ITournamentFactory
    {
        Tournament Create(string name, int teamsCount);
    }
}
