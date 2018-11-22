using SportChallenge.Core.Models;

namespace SportChallenge.Core.Services.Contracts
{
    public interface IRoundsService
    {
        Round[] CreateRoundsPerTournament(Tournament tournament);
    }
}
