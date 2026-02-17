using Microsoft.EntityFrameworkCore;
using MyFinance.API.Data;
using MyFinance.API.Models;

namespace MyFinance.API.Repositories;

public class UsuarioRepository : Repository<Usuario>, IUsuarioRepository
{
    public UsuarioRepository(MyFinanceDbContext context) : base(context)
    {
    }

    public async Task<Usuario?> GetByEmailAsync(string email)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<Usuario?> GetByLoginAsync(string login)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.Login == login);
    }
}
