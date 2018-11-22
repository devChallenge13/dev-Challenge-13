using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.AspNetCore.Mvc;
using SportChallenge.MediatorRequests;
using SportChallenge.Models;

namespace SportChallenge.Controllers
{
    /// <summary>
    /// Tournament controller
    /// </summary>
	[Route("api/[controller]")]
	[ApiController]
    public class TournamentController : ControllerBase
    {
		private readonly IMediator _mediator;

        public TournamentController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Create tournament
        /// </summary>
        /// <param name="model">Includes tournament name and teams number</param>
        /// <returns></returns>
        [HttpPut("")]
        [ProducesResponseType(200)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> CreateTournament(TournamentCreateModel model)
        {
            var request = new CreateTournamentRequest(model.TournamentName, model.TeamsCount);
            var tournament = await _mediator.Send(request);

            return Ok(tournament.Name);
        }

        /// <summary>
        /// Get tournament information in JSON (all games)
        /// </summary>
        /// <param name="tournamentName">Tournament name</param>
        /// <returns></returns>
        [HttpGet("all")]
        [HttpGet("")]
        [ProducesResponseType(typeof(TournamentModel), 200)]
        [ProducesResponseType(500)]
        public Task<IActionResult> GetTournament(string tournamentName)
        {
            return GetTournament(tournamentName, GameType.All);
        }

        /// <summary>
        /// Get tournament information in JSON (only played games)
        /// </summary>
        /// <param name="tournamentName">Tournament name</param>
        /// <returns></returns>
        [HttpGet("played")]
        [ProducesResponseType(typeof(TournamentModel), 200)]
        [ProducesResponseType(500)]
        public Task<IActionResult> GetPlayedTournament(string tournamentName)
        {
            return GetTournament(tournamentName, GameType.Played);
        }

        /// <summary>
        /// Get tournament information in JSON (only planned games)
        /// </summary>
        /// <param name="tournamentName">Tournament name</param>
        /// <returns></returns>
        [HttpGet("planned")]
        [ProducesResponseType(typeof(TournamentModel), 200)]
        [ProducesResponseType(500)]
        public Task<IActionResult> GetPlanedTournament(string tournamentName)
        {
            return GetTournament(tournamentName, GameType.Planned);
        }

        /// <summary>
        /// Get tournament information in JSON (table format)
        /// </summary>
        /// <param name="tournamentName">Tournament name</param>
        /// <returns></returns>
        [HttpGet("table")]
        [ProducesResponseType(typeof(TournamentTable), 200)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> GetTournamentTable(string tournamentName)
        {
            var request = new GetTournamentTableRequest(tournamentName);
            var result = await _mediator.Send(request);

            return Ok(result);
        }

        /// <summary>
        /// Returns tournament CSV
        /// </summary>
        /// <param name="tournamentName">Tournament name</param>
        /// <returns></returns>
        [HttpGet("csv")]
        [ProducesResponseType(200)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> ToCsv(string tournamentName)
        {
            var request = new ToScvRequest(tournamentName);
            var result = await _mediator.Send(request);

            return File(result, System.Net.Mime.MediaTypeNames.Application.Octet,
                $"{tournamentName}.csv");
        }

        /// <summary>
        /// Update tournament using CSV
        /// </summary>
        /// <param name="tournamentName">Tournament name</param>
        /// <returns></returns>
        [HttpPut("csv")]
        [ProducesResponseType(200)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> FromCsv(string tournamentName)
        {
            Request.EnableRewind();

            var request = new FromScvRequest(Request.Form.Files.First(), tournamentName);
            await _mediator.Send(request);

            return Ok();
        }

        private async Task<IActionResult> GetTournament(string tournamentName, GameType gameType)
        {
            var request = new GetTournamentRequest(tournamentName, gameType);
            var result = await _mediator.Send(request);

            return Ok(result);
        }
    }
}
