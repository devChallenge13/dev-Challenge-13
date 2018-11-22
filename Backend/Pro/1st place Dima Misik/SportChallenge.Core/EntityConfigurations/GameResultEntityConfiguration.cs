using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SportChallenge.Core.Models;

namespace SportChallenge.Core.EntityConfigurations
{
    public class GameResultEntityConfiguration : IEntityTypeConfiguration<GameResult>
    {
        public void Configure(EntityTypeBuilder<GameResult> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.GuestTeamResult).IsRequired();
            builder.Property(x => x.HomeTeamResult).IsRequired();
            builder.HasOne(x => x.Game).WithOne(x => x.Result)
                .HasForeignKey<GameResult>(x => x.GameId);
        }
    }
}
