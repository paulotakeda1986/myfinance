using MyFinance.API.Models;

namespace MyFinance.API.Repositories;

public interface IUnitOfWork : IDisposable
{
    IUsuarioRepository Usuarios { get; }
    IRepository<Banco> Bancos { get; }
    IRepository<TipoCarteira> TiposCarteira { get; }
    IRepository<Carteira> Carteiras { get; }
    IRepository<Competencia> Competencias { get; }
    IRepository<CategoriaDespesa> CategoriasDespesa { get; }
    IRepository<CategoriaReceita> CategoriasReceita { get; }
    IRepository<TipoLancamentoFinanceiro> TiposLancamento { get; }
    IRepository<TipoTransferenciaFinanceira> TiposTransferencia { get; }
    IRepository<LancamentoFinanceiro> Lancamentos { get; }
    IRepository<TransferenciaFinanceira> Transferencias { get; }
    IRepository<CartaoCredito> CartoesCredito { get; }
    IRepository<FaturaCartaoCredito> FaturasCartaoCredito { get; }
    IRepository<ParcelaLancamento> Parcelas { get; }
    IRepository<MetaFinanceira> Metas { get; }
    IRepository<Investimento> Investimentos { get; }
    IRepository<AlertaFinanceiro> Alertas { get; }
    
    Task<int> CommitAsync();
}
