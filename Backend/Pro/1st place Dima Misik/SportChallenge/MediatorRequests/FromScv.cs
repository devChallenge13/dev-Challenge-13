using System;
using System.IO;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace SportChallenge.MediatorRequests
{
    public class FromScvRequest : IRequest
    {
        public string TournamentName { get; }
        public IFormFile File { get; }

        public FromScvRequest(IFormFile file, string tournamentName)
        {
            File = file;
            TournamentName = tournamentName;
        }
    }

    public class FromScvHandler : IRequestHandler<FromScvRequest>
    {
        private readonly IMediator _mediator;

        public FromScvHandler(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task<Unit> Handle(FromScvRequest request, CancellationToken cancellationToken)
        {
            using (var reader = new StreamReader(request.File.OpenReadStream()))
            {
                var text = reader.ReadToEnd();
                var strs = text.Split(Environment.NewLine);

                for (var i = 0; i < strs.Length; i++)
                {
                    if (strs[i].StartsWith(";round"))
                    {
                        ++i;

                        do
                        {
                            var teamStr = strs[i];

                            var teams = teamStr.Split(";");

                            var scores = teams[2].Split(":");
                            var homeScore = int.Parse(scores[0]);
                            var guestScore = int.Parse(scores[1]);

                            var gameResultRequest = new CreateGameResultRequest(request.TournamentName,
                                teams[1], guestScore, teams[0], homeScore);

                            await _mediator.Send(gameResultRequest, cancellationToken);

                            ++i;
                        } while (i < strs.Length && !string.IsNullOrEmpty(strs[i]));
                    }
                }
            }

            return Unit.Value;
        }
    }
}
