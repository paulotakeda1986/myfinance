using MyFinance.API.Models;

namespace MyFinance.API.Repositories;

public interface IUsuarioRepository : IRepository<Usuario>
{
    Task<Usuario?> GetByEmailAsync(string email);
    Task<Usuario?> GetByLoginAsync(string login);
}
