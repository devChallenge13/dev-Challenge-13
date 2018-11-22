using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using SportChallenge.Core.DbContexts.Contracts;

namespace SportChallenge.Core.DbContexts
{
    public class SportContextFactory : IContextFactory<SportContext>
    {
        private readonly DbContextOptions _options;

        public SportContextFactory(DbContextOptions options)
        {
            _options = options;
        }

        public SportContext CreateContext()
        {
            return new SportContext(_options);
        }
    }
}
