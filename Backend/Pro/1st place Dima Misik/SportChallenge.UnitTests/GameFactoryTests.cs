using Shouldly;
using SportChallenge.Core.Models;
using SportChallenge.Core.Services;
using SportChallenge.Core.Services.Contracts;
using Xunit;

namespace SportChallenge.UnitTests
{
    public class GameFactoryTests
    {
        private readonly IGameFactory _factory;

        public GameFactoryTests()
        {
            _factory = new GameFactory();
        }

        [Fact]
        public void CreateGameShouldDoIt()
        {
            // Arrange
            var home = new Team { Id = 1 };
            var guest = new Team { Id = 2 };

            // Act
            var game = _factory.CreateGame(home, guest);

            // Assert
            game.GuestTeam.ShouldBe(guest);
            game.GuestTeamId.ShouldBe(guest.Id);
            game.HomeTeam.ShouldBe(home);
            game.HomeTeamId.ShouldBe(home.Id);
            game.Result.ShouldBeNull();
        }
    }
}
