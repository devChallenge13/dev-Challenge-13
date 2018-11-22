using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using SportChallenge.Core.DbContexts;
using SportChallenge.Core.DbContexts.Contracts;
using SportChallenge.Core.Models;
using SportChallenge.Core.Repositories;
using SportChallenge.Core.Services.Contracts;

namespace SportChallenge.MediatorRequests
{
    public class CreateGameResultRequest : IRequest<GameResult>
    {
        public string TournamentName { get; }
        public string HomeTeamName { get; }
        public string GuestTeamName { get; }
        public int HomeTeamResult { get; }
        public int GuestTeamResult { get; }

        public CreateGameResultRequest(string tournamentName, string guestTeamName,
            int guestTeamResult, string homeTeamName, int homeTeamResult)
        {
            GuestTeamName = guestTeamName;
            GuestTeamResult = guestTeamResult;
            HomeTeamName = homeTeamName;
            HomeTeamResult = homeTeamResult;
            TournamentName = tournamentName;
        }
    }

    public class CreateGameResultHandler : IRequestHandler<CreateGameResultRequest, GameResult>
    {
        private readonly IContextFactory<SportContext> _contextFactory;
        private readonly IGameResultFactory _gameResultFactory;

        public CreateGameResultHandler(IContextFactory<SportContext> contextFactory,
            IGameResultFactory gameResultFactory)
        {
            _contextFactory = contextFactory;
            _gameResultFactory = gameResultFactory;
        }

        public async Task<GameResult> Handle(CreateGameResultRequest request, CancellationToken cancellationToken)
        {
            if (request.HomeTeamName == request.GuestTeamName)
            {
                throw new ArgumentException("Home and guest team name cannot be same");
            }

            using (var context = _contextFactory.CreateContext())
            {
                var teamRepository = new DbRepository<Team>(context);

                var homeTeam = await teamRepository
                    .SingleOrDefaultAsync(x => x.Tournament.Name == request.TournamentName &&
                                               x.Name == request.HomeTeamName);

                var guestTeam = await teamRepository
                    .SingleOrDefaultAsync(x => x.Tournament.Name == request.TournamentName &&
                                               x.Name == request.GuestTeamName);

                if (homeTeam == null)
                {
                    throw new ArgumentException($"Team with name {request.HomeTeamName} " +
                                                $"doesn't exist in tournament {request.TournamentName}");
                }

                if (guestTeam == null)
                {
                    throw new ArgumentException($"Team with name {request.GuestTeamName} " +
                                                $"doesn't exist in tournament {request.TournamentName}");
                }

                var gameRepository = new GameRepository(context);

                var game = await gameRepository.GetGame(homeTeam.Id, guestTeam.Id);

                var gameResultRepository = new DbRepository<GameResult>(context);

                if (game.Result == null)
                {
                    var gameResult = _gameResultFactory.Create(game, request.HomeTeamResult,
                        request.GuestTeamResult);

                    await gameResultRepository.AddAsync(gameResult);

                    return gameResult;
                }

                game.Result.GuestTeamResult = request.GuestTeamResult;
                game.Result.HomeTeamResult = request.HomeTeamResult;

                await gameResultRepository.UpdateAsync(game.Result);

                return game.Result;
            }
        }
    }
}
