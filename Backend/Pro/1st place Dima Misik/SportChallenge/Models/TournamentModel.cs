namespace SportChallenge.Models
{
    public class TournamentModel
    {
        public string TournamentName { get; set; }
        public RoundModel[] Rounds { get; set; }
    }
}
