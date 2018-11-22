using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SportChallenge.Core.DbContexts;
using SportChallenge.Core.Models;
using SportChallenge.Core.Repositories.Contracts;

namespace SportChallenge.Core.Repositories
{
    public class DbRepository<TEntity> : IDbRepository<TEntity>
            where TEntity : class, IIDentifiable
    {
        protected readonly SportContext Context;

        public DbRepository(SportContext context)
        {
            Context = context;
        }

        public async Task<TEntity[]> FindAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await GetQuery(Context).Where(predicate).ToArrayAsync();
        }

        public async Task<TEntity> SingleOrDefaultAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await GetQuery(Context).SingleOrDefaultAsync(predicate);
        }

        public async Task AddAsync(TEntity entity)
        {
            await Context.Set<TEntity>().AddAsync(entity);
            await Context.SaveChangesAsync();
        }

        public async Task UpdateAsync(TEntity entity)
        {
            Context.Entry(entity).State = EntityState.Modified;
            await Context.SaveChangesAsync();
        }

        protected virtual IQueryable<TEntity> GetQuery(SportContext context)
        {
            return context.Set<TEntity>();
        }
    }
}
