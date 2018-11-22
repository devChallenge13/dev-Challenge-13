using System;
using System.Linq;
using Shouldly;
using SportChallenge.Core.Services;
using SportChallenge.Core.Services.Contracts;
using Xunit;

namespace SportChallenge.UnitTests
{
    public class TournamentFactoryTests
    {
        private readonly ITournamentFactory _factory;

        public TournamentFactoryTests()
        {
            _factory = new TournamentFactory();
        }

        [Fact]
        public void CreateShouldDoIt()
        {
            // Arrange
            // Act
            var tournament = _factory.Create("name", 5);

            // Assert
            tournament.Name.ShouldBe("name");
            tournament.Teams.Count.ShouldBe(5);
            tournament.Teams.All(x => x.Name.StartsWith("team")).ShouldBeTrue();
        }

        [Theory]
        [InlineData(1)]
        [InlineData(0)]
        [InlineData(-1)]
        public void CreateShouldFail(int teamCount)
        {
            // Arrange
            // Act
            Action act = () => _factory.Create("name", teamCount);

            // Assert
            act.ShouldThrow<ArgumentException>();
        }
    }
}
