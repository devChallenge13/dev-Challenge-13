using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SportChallenge.Core.Models;

namespace SportChallenge.Core.EntityConfigurations
{
    public class GameEntityConfiguration : IEntityTypeConfiguration<Game>
    {
        public void Configure(EntityTypeBuilder<Game> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne(x => x.HomeTeam).WithMany().HasForeignKey(x => x.HomeTeamId);
            builder.HasOne(x => x.GuestTeam).WithMany().HasForeignKey(x => x.GuestTeamId);
        }
    }
}
