using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using SportChallenge.Core.Models;

namespace SportChallenge.Core.Repositories.Contracts
{
	public interface IDbRepository<TEntity>
		where TEntity : class, IIDentifiable
	{
		Task<TEntity[]> FindAsync(Expression<Func<TEntity, bool>> predicate);
		Task<TEntity> SingleOrDefaultAsync(Expression<Func<TEntity, bool>> predicate);
		Task AddAsync(TEntity entity);
		Task UpdateAsync(TEntity entity);
	}
}
