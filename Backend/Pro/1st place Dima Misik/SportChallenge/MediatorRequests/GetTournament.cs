using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using SportChallenge.Core.DbContexts;
using SportChallenge.Core.DbContexts.Contracts;
using SportChallenge.Core.Models;
using SportChallenge.Core.Repositories;
using SportChallenge.Models;

namespace SportChallenge.MediatorRequests
{
    public enum GameType
    {
        Played,
        Planned,
        All
    }

    public class GetTournamentRequest : IRequest<TournamentModel>
    {
        public string TournamentName { get; }
        public GameType GameType { get; }

        public GetTournamentRequest(string tournamentName, GameType gameType)
        {
            TournamentName = tournamentName;
            GameType = gameType;
        }
    }

    public class GetTournamentHandler : IRequestHandler<GetTournamentRequest, TournamentModel>
    {
        private readonly IContextFactory<SportContext> _contextFactory;

        public GetTournamentHandler(IContextFactory<SportContext> contextFactory)
        {
            _contextFactory = contextFactory;
        }

        public async Task<TournamentModel> Handle(GetTournamentRequest request, CancellationToken cancellationToken)
        {
            var games = await GetGames(request.TournamentName, request.GameType);

            return new TournamentModel
            {
                TournamentName = request.TournamentName,
                Rounds = games.Select(x => x.Round).Distinct()
                    .Select(x => new RoundModel
                    {
                        Number = x.Number,
                        Games = x.Games.Select(g => new GameModel
                        {
                            HomeTeam = g.HomeTeam.Name,
                            GuestTeam = g.GuestTeam.Name,
                            Result = g.Result == null
                                ? null
                                : new ResultModel
                                {
                                    Guest = g.Result.GuestTeamResult,
                                    Home = g.Result.HomeTeamResult
                                }
                        }).ToArray()
                    })
                    .ToArray()
            };
        }

        private async Task<Game[]> GetGames(string tournamentName, GameType gameType)
        {
            using (var context = _contextFactory.CreateContext())
            {
                var tournamentRepository = new DbRepository<Tournament>(context);
                var tournament = await tournamentRepository
                    .SingleOrDefaultAsync(x => x.Name == tournamentName);

                if (tournament == null)
                {
                    return new Game[0];
                }

                var gamesRepository = new GameRepository(context);

                switch (gameType)
                {
                    case GameType.Played:
                        return await gamesRepository.GetPlayedTournamentGames(tournament.Id);
                    case GameType.Planned:
                        return await gamesRepository.GetPlannedTournamentGames(tournament.Id);
                    case GameType.All:
                        return await gamesRepository.GetTournamentGames(tournament.Id);
                    default:
                        throw new ArgumentOutOfRangeException(nameof(gameType), gameType, null);
                }
            }
        }
    }
}
