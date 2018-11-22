namespace SportChallenge.Core.Models
{
    public class GameResult : IIDentifiable
    {
        public int Id { get; set; }
        public int HomeTeamResult { get; set; }
        public int GuestTeamResult { get; set; }
        public Game Game { get; set; }
        public int GameId { get; set; }
    }
}
