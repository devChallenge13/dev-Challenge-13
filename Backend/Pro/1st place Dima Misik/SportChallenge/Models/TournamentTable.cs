using System.Collections.Generic;

namespace SportChallenge.Models
{
    public class TournamentTable
    {
        public string TournamentName { get; set; }
        public IEnumerable<TournamentRow> Table { get; set; }
    }
}
