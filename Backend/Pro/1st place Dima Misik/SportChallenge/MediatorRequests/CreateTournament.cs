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
    public class CreateTournamentRequest : IRequest<Tournament>
    {
        public string TournamentName { get; }
        public int TeamsCount { get; }

        public CreateTournamentRequest(string tournamentName, int teamsCount)
        {
            TeamsCount = teamsCount;
            TournamentName = tournamentName;
        }
    }

    public class CreateTournamentHandler : IRequestHandler<CreateTournamentRequest, Tournament>
    {
        private readonly ITournamentFactory _tournamentFactory;
        private readonly IRoundsService _roundsService;
        private readonly IContextFactory<SportContext> _contextFactory;

        public CreateTournamentHandler(ITournamentFactory tournamentFactory, IRoundsService roundsService,
            IContextFactory<SportContext> contextFactory)
        {
            _tournamentFactory = tournamentFactory;
            _roundsService = roundsService;
            _contextFactory = contextFactory;
        }

        public async Task<Tournament> Handle(CreateTournamentRequest request, CancellationToken cancellationToken)
        {
            using (var context = _contextFactory.CreateContext())
            using (var transaction = context.Database.BeginTransaction())
            {
                var tournament = _tournamentFactory.Create(request.TournamentName, request.TeamsCount);

                var tournamentRepository = new DbRepository<Tournament>(context);
                await tournamentRepository.AddAsync(tournament);

                var rounds = _roundsService.CreateRoundsPerTournament(tournament);

                var roundRepository = new DbRepository<Round>(context);

                foreach (var round in rounds)
                {
                    await roundRepository.AddAsync(round);
                }

                transaction.Commit();

                return tournament;
            }
        }
    }
}
