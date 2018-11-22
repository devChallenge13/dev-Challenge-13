using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using SportChallenge.MediatorRequests;
using SportChallenge.Models;

namespace SportChallenge.Controllers
{
    /// <summary>
    /// Game controller
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
		private readonly IMediator _mediator;

        public GameController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Post game result
        /// </summary>
        /// <param name="tournamentName">Tournament name</param>
        /// <param name="saveResultModel">Game result</param>
        /// <returns>Ok</returns>
        [HttpPut("{tournamentName}")]
		[ProducesResponseType(200)]
		[ProducesResponseType(500)]
        public async Task<IActionResult> SaveResult(string tournamentName, SaveResultModel saveResultModel)
        {
            var request = new CreateGameResultRequest(tournamentName, 
                saveResultModel.GuestTeamName, saveResultModel.GuestTeamResult, 
                saveResultModel.HomeTeamName, saveResultModel.HomeTeamResult);

            await _mediator.Send(request);

            return Ok();
        }
    }
}
