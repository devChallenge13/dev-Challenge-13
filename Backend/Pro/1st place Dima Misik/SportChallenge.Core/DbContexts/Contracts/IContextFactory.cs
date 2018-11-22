using Microsoft.EntityFrameworkCore;

namespace SportChallenge.Core.DbContexts.Contracts
{
    public interface IContextFactory<out TContext>
        where TContext : DbContext
    {
        TContext CreateContext();
    }
}