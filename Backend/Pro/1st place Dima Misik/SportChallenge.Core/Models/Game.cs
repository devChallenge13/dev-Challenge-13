namespace SportChallenge.Core.Models
{
    public class Game : IIDentifiable
    {
        public int Id { get; set; }
        public Team HomeTeam { get; set; }
        public Team GuestTeam { get; set; }
        public Round Round { get; set; }
        public int HomeTeamId { get; set; }
        public int GuestTeamId { get; set; }
        public GameResult Result { get; set; }
    }
}
