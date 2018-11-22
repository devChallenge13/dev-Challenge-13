using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using SportChallenge.Core.DbContexts;
using SportChallenge.Core.DbContexts.Contracts;
using SportChallenge.Core.Models;
using SportChallenge.Core.Repositories;

namespace SportChallenge.MediatorRequests
{
    public class ToScvRequest : IRequest<Stream>
    {
        public string TournamentName { get; }

        public ToScvRequest(string tournamentName)
        {
            TournamentName = tournamentName;
        }
    }

    public class ToScvHanlder : IRequestHandler<ToScvRequest, Stream>
    {
        private readonly IContextFactory<SportContext> _contextFactory;
        private readonly IMediator _mediator;

        public ToScvHanlder(IContextFactory<SportContext> contextFactory, IMediator mediator)
        {
            _contextFactory = contextFactory;
            _mediator = mediator;
        }

        public async Task<Stream> Handle(ToScvRequest request, CancellationToken cancellationToken)
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

                var getTableRequest = new GetTournamentTableRequest(request.TournamentName);
                var table = await _mediator.Send(getTableRequest);

                var stringBuilder = new StringBuilder();

                // header
                stringBuilder.AppendLine("Team;Meets;Wins;Draws;Loses;Point");

                // table
                foreach (var tournamentRow in table.Table)
                {
                    stringBuilder.AppendLine($"{tournamentRow.TeamName};{tournamentRow.Meets};" +
                                             $"{tournamentRow.Win};{tournamentRow.Draw};" +
                                             $"{tournamentRow.Lose};{tournamentRow.Points}");
                }

                stringBuilder.AppendLine();

                // rounds
                foreach (var round in games.GroupBy(x => x.Round).OrderBy(x => x.Key.Number))
                {
                    stringBuilder.AppendLine($";round {round.Key.Number}");

                    //games
                    foreach (var game in round.ToList())
                    {
                        stringBuilder.AppendLine($"{game.HomeTeam.Name};{game.GuestTeam.Name}" +
                                                 $";{game.Result.HomeTeamResult}:{game.Result.GuestTeamResult}");
                    }

                    stringBuilder.AppendLine();
                }

                return new MemoryStream(Encoding.UTF8.GetBytes(stringBuilder.ToString()));
            }
        }
    }
}
