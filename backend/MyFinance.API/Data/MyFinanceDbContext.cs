using Microsoft.EntityFrameworkCore;
using MyFinance.API.Models;

namespace MyFinance.API.Data;

public class MyFinanceDbContext : DbContext
{
    public MyFinanceDbContext(DbContextOptions<MyFinanceDbContext> options) : base(options)
    {
    }

    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Banco> Bancos { get; set; }
    public DbSet<TipoCarteira> TiposCarteira { get; set; }
    public DbSet<Carteira> Carteiras { get; set; }
    public DbSet<Competencia> Competencias { get; set; }
    public DbSet<CategoriaDespesa> CategoriasDespesa { get; set; }
    public DbSet<CategoriaReceita> CategoriasReceita { get; set; }
    public DbSet<TipoLancamentoFinanceiro> TiposLancamento { get; set; }
    public DbSet<TipoTransferenciaFinanceira> TiposTransferencia { get; set; }
    public DbSet<LancamentoFinanceiro> Lancamentos { get; set; }
    public DbSet<TransferenciaFinanceira> Transferencias { get; set; }
    public DbSet<CartaoCredito> CartoesCredito { get; set; }
    public DbSet<FaturaCartaoCredito> FaturasCartao { get; set; }
    public DbSet<ParcelaLancamento> Parcelas { get; set; }
    public DbSet<MetaFinanceira> Metas { get; set; }
    public DbSet<Investimento> Investimentos { get; set; }
    public DbSet<AlertaFinanceiro> Alertas { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Apply naming convention explicitly if needed, but we are using Attributes.
        // We can add unique indexes defined in DBML here.

        modelBuilder.Entity<Usuario>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Usuario>()
            .HasIndex(u => u.Login)
            .IsUnique();

        modelBuilder.Entity<CategoriaDespesa>()
            .HasIndex(c => new { c.Nome, c.UsuarioId })
            .IsUnique();

        modelBuilder.Entity<CategoriaReceita>()
            .HasIndex(c => new { c.Nome, c.UsuarioId })
            .IsUnique();

        modelBuilder.Entity<Competencia>()
            .HasIndex(c => new { c.Mes, c.Exercicio, c.UsuarioId })
            .IsUnique();
    }
}
