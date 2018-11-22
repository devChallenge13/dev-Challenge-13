using SportChallenge.Core.Constants;

namespace SportChallenge.Models
{
    public class TournamentRow
    {
        public string TeamName { get; set; }
        public int Win { get; set; }
        public int Lose { get; set; }
        public int Draw { get; set; }

        public int Meets => Win + Lose + Draw;
        public int Points => Win * GameConstants.WinMultiplier +
                             Lose * GameConstants.LostMultiplier +
                             Draw * GameConstants.DrawMultiplier;
    }
}
