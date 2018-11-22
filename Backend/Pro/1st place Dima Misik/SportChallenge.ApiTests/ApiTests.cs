using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Shouldly;
using SportChallenge.Models;
using Xunit;

namespace SportChallenge.ApiTests
{
    public class ApiTests : IClassFixture<WebApplicationFactory<Startup>>
    {
        private readonly WebApplicationFactory<Startup> _factory;

        public ApiTests(WebApplicationFactory<Startup> factory)
        {
            var directory = Directory.GetCurrentDirectory();
            _factory = factory.WithWebHostBuilder(builder => builder
                .ConfigureAppConfiguration((builderContext, config) =>
                {
                    config.AddJsonFile(Path.Combine(directory, "testsettings.json"), optional: false, reloadOnChange: true);
                }));
        }

        [Fact]
        public async Task GetTournamentEndpointShouldExists()
        {
            using (var httpClient = _factory.CreateClient())
            using (var request = new HttpRequestMessage(HttpMethod.Get, "api/tournament/?tournamentName=first"))
            {
                using (var response = await httpClient.SendAsync(request))
                {
                    response.StatusCode.ShouldBe(HttpStatusCode.OK);
                }
            }
        }

        [Fact]
        public async Task CreateTournamentEndpointShouldCreateItWithALotOfTeams()
        {
            using (var httpClient = _factory.CreateClient())
            using (var request = new HttpRequestMessage(HttpMethod.Put, "api/tournament/?tournamentName=first"))
            {
                var model = new TournamentCreateModel
                {
                    TournamentName = Guid.NewGuid().ToString(),
                    TeamsCount = 4
                };

                request.Content = new ObjectContent<TournamentCreateModel>(model,
                    new JsonMediaTypeFormatter(),
                    MediaTypeNames.Application.Json);

                using (var response = await httpClient.SendAsync(request))
                {
                    response.StatusCode.ShouldBe(HttpStatusCode.OK);

                    using (var getRequest = new HttpRequestMessage(HttpMethod.Get, 
                        $"api/tournament/?tournamentName={model.TournamentName}"))
                    using (var getResponse = await httpClient.SendAsync(getRequest))
                    {
                        response.StatusCode.ShouldBe(HttpStatusCode.OK);

                        var content = await getResponse.Content.ReadAsAsync<TournamentModel>();

                        var homeTeams = content.Rounds.SelectMany(x => x.Games)
                            .Select(x => x.HomeTeam)
                            .Distinct()
                            .ToArray();

                        var guestTeams = content.Rounds.SelectMany(x => x.Games)
                            .Select(x => x.HomeTeam)
                            .Distinct()
                            .ToArray();

                        homeTeams.Length.ShouldBe(guestTeams.Length);
                        homeTeams.Length.ShouldBe(model.TeamsCount);
                    }
                }
            }
        }

        [Fact]
        public async Task CreateTournamentEndpointShouldCreateItEventWoName()
        {
            using (var httpClient = _factory.CreateClient())
            using (var request = new HttpRequestMessage(HttpMethod.Put, "api/tournament/"))
            {
                var model = new TournamentCreateModel
                {
                    TeamsCount = 4
                };

                request.Content = new ObjectContent<TournamentCreateModel>(model,
                    new JsonMediaTypeFormatter(),
                    MediaTypeNames.Application.Json);

                using (var response = await httpClient.SendAsync(request))
                {
                    response.StatusCode.ShouldBe(HttpStatusCode.OK);
                }
            }
        }

        [Fact]
        public async Task CreateTournamentEndpointShouldFailIfTeamsCountLessThanTwo()
        {
            using (var httpClient = _factory.CreateClient())
            using (var request = new HttpRequestMessage(HttpMethod.Put, "api/tournament/"))
            {
                var model = new TournamentCreateModel
                {
                    TeamsCount = 1
                };

                request.Content = new ObjectContent<TournamentCreateModel>(model,
                    new JsonMediaTypeFormatter(),
                    MediaTypeNames.Application.Json);

                using (var response = await httpClient.SendAsync(request))
                {
                    response.StatusCode.ShouldNotBe(HttpStatusCode.OK);
                }
            }
        }

        [Fact]
        public async Task CreateTournamentEndpointShouldFailIfTournamentAlreadyExists()
        {
            using (var httpClient = _factory.CreateClient())
            using (var request1 = new HttpRequestMessage(HttpMethod.Put, "api/tournament/"))
            using (var request2 = new HttpRequestMessage(HttpMethod.Put, "api/tournament/"))
            {
                var model = new TournamentCreateModel
                {
                    TeamsCount = 2,
                    TournamentName = Guid.NewGuid().ToString()
                };

                request1.Content = new ObjectContent<TournamentCreateModel>(model,
                    new JsonMediaTypeFormatter(),
                    MediaTypeNames.Application.Json);

                request2.Content = new ObjectContent<TournamentCreateModel>(model,
                    new JsonMediaTypeFormatter(),
                    MediaTypeNames.Application.Json);

                using (var response1 = await httpClient.SendAsync(request1))
                using (var response2 = await httpClient.SendAsync(request2))
                {
                    response1.StatusCode.ShouldBe(HttpStatusCode.OK);
                    response2.StatusCode.ShouldNotBe(HttpStatusCode.OK);
                }
            }
        }
    }
}
