using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SportChallenge.Core.Models;

namespace SportChallenge.Core.EntityConfigurations
{
    public class TeamEntityConfiguration : IEntityTypeConfiguration<Team>
    {
        public void Configure(EntityTypeBuilder<Team> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne(x => x.Tournament).WithMany(x => x.Teams);
            builder.Property(x => x.Name).IsRequired();
        }
    }
}
