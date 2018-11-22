namespace SportChallenge.Core.Models
{
    public class Team : IIDentifiable
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public Tournament Tournament { get; set; }
    }
}
