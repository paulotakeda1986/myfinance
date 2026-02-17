using System.Linq.Expressions;

namespace MyFinance.API.Repositories;

public interface IRepository<T> where T : class
{
    Task<IEnumerable<T>> GetAllAsync();
    Task<T?> GetByIdAsync(long id);
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
    Task AddAsync(T entity);
    void Update(T entity); // In EF Core update is synchronous tracking, but can be async if we use Add/Attach logic differently. Usually Update is void.
    void Delete(T entity);
}
