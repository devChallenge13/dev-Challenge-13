using System;
using System.Collections.Generic;
using System.Text;
using Shouldly;
using SportChallenge.Core.Models;
using SportChallenge.Core.Services;
using SportChallenge.Core.Services.Contracts;
using Xunit;

namespace SportChallenge.UnitTests
{
    public class GameResultFactoryTests
    {
        private readonly IGameResultFactory _factory;

        public GameResultFactoryTests()
        {
            _factory = new GameResultFactory();
        }

        [Fact]
        public void CreateShouldDoIt()
        {
            // Arrange
            var game = new Game
            {
                Id = 5
            };

            // Act
            var result = _factory.Create(game, 5, 2);

            // Assert
            result.GameId.ShouldBe(game.Id);
            result.HomeTeamResult.ShouldBe(5);
            result.GuestTeamResult.ShouldBe(2);
        }

        [Theory]
        [InlineData(-1, 1)]
        [InlineData(1, -1)]
        [InlineData(-1, -1)]
        [InlineData(-2, 5)]
        [InlineData(5, -3)]
        public void CreateShouldFail(int homeResult, int guestResult)
        {
            // Arrange
            var game = new Game
            {
                Id = 5
            };

            // Act
            Action act = () => _factory.Create(game, homeResult, guestResult);

            // Assert
            act.ShouldThrow<ArgumentException>();
        }
    }
}
