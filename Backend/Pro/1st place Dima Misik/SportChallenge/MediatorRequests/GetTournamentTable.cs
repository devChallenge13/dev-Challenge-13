using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using SportChallenge.Core.DbContexts;
using SportChallenge.Core.DbContexts.Contracts;
using SportChallenge.Core.Extensions;
using SportChallenge.Core.Models;
using SportChallenge.Core.Repositories;
using SportChallenge.Models;

namespace SportChallenge.MediatorRequests
{
    public class GetTournamentTableRequest : IRequest<TournamentTable>
    {
        public string TournamentName { get; }

        public GetTournamentTableRequest(string tournamentName)
        {
            TournamentName = tournamentName;
        }
    }

    public class GetTournamentTableHandler : IRequestHandler<GetTournamentTableRequest, TournamentTable>
    {
        private readonly IContextFactory<SportContext> _contextFactory;

        public GetTournamentTableHandler(IContextFactory<SportContext> contextFactory)
        {
            _contextFactory = contextFactory;
        }

        public async Task<TournamentTable> Handle(GetTournamentTableRequest request, CancellationToken cancellationToken)
        {
            using (var context = _contextFactory.CreateContext())
            {
                var tournamentRepository = new DbRepository<Tournament>(context);
                var tournament = await tournamentRepository
                    .SingleOrDefaultAsync(x => x.Name == request.TournamentName);

                if (tournament == null)
                {
                    return null;
                }

                var gamesRepository = new GameRepository(context);
                var games = await gamesRepository.GetPlayedTournamentGames(tournament.Id);

                var teamRepository = new DbRepository<Team>(context);
                var teams = await teamRepository.FindAsync(x => x.Tournament.Id == tournament.Id);

                var table = new TournamentTable
                {
                    TournamentName = tournament.Name,
                    Table = teams.Select(t => new TournamentRow
                    {
                        TeamName = t.Name,
                        Win = games.Count(g => g.HasWinner() && g.GetWinner() == t.Id),
                        Lose = games.Count(g => g.HasWinner() && g.GetLoser() == t.Id),
                        Draw = games.Count(g => g.IsDraw() && (g.GuestTeamId == t.Id || g.HomeTeamId == t.Id))
                    })
                };

                return table;
            }
        }
    }
}
