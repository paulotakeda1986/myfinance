using MyFinance.API.Data;
using MyFinance.API.Models;

namespace MyFinance.API.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly MyFinanceDbContext _context;

    public UnitOfWork(MyFinanceDbContext context)
    {
        _context = context;
    }

    private IUsuarioRepository? _usuarios;
    public IUsuarioRepository Usuarios => _usuarios ??= new UsuarioRepository(_context);

    private IRepository<Banco>? _bancos;
    public IRepository<Banco> Bancos => _bancos ??= new Repository<Banco>(_context);

    private IRepository<TipoCarteira>? _tiposCarteira;
    public IRepository<TipoCarteira> TiposCarteira => _tiposCarteira ??= new Repository<TipoCarteira>(_context);

    private IRepository<Carteira>? _carteiras;
    public IRepository<Carteira> Carteiras => _carteiras ??= new Repository<Carteira>(_context);

    private IRepository<Competencia>? _competencias;
    public IRepository<Competencia> Competencias => _competencias ??= new Repository<Competencia>(_context);

    private IRepository<CategoriaDespesa>? _categoriasDespesa;
    public IRepository<CategoriaDespesa> CategoriasDespesa => _categoriasDespesa ??= new Repository<CategoriaDespesa>(_context);

    private IRepository<CategoriaReceita>? _categoriasReceita;
    public IRepository<CategoriaReceita> CategoriasReceita => _categoriasReceita ??= new Repository<CategoriaReceita>(_context);

    private IRepository<TipoLancamentoFinanceiro>? _tiposLancamento;
    public IRepository<TipoLancamentoFinanceiro> TiposLancamento => _tiposLancamento ??= new Repository<TipoLancamentoFinanceiro>(_context);

    private IRepository<TipoTransferenciaFinanceira>? _tiposTransferencia;
    public IRepository<TipoTransferenciaFinanceira> TiposTransferencia => _tiposTransferencia ??= new Repository<TipoTransferenciaFinanceira>(_context);

    private IRepository<LancamentoFinanceiro>? _lancamentos;
    public IRepository<LancamentoFinanceiro> Lancamentos => _lancamentos ??= new Repository<LancamentoFinanceiro>(_context);

    private IRepository<TransferenciaFinanceira>? _transferencias;
    public IRepository<TransferenciaFinanceira> Transferencias => _transferencias ??= new Repository<TransferenciaFinanceira>(_context);

    private IRepository<CartaoCredito>? _cartoesCredito;
    public IRepository<CartaoCredito> CartoesCredito => _cartoesCredito ??= new Repository<CartaoCredito>(_context);

    private IRepository<FaturaCartaoCredito>? _faturasCartaoCredito;
    public IRepository<FaturaCartaoCredito> FaturasCartaoCredito => _faturasCartaoCredito ??= new Repository<FaturaCartaoCredito>(_context);
    
    private IRepository<ParcelaLancamento>? _parcelas;
    public IRepository<ParcelaLancamento> Parcelas => _parcelas ??= new Repository<ParcelaLancamento>(_context);

    private IRepository<MetaFinanceira>? _metas;
    public IRepository<MetaFinanceira> Metas => _metas ??= new Repository<MetaFinanceira>(_context);

    private IRepository<Investimento>? _investimentos;
    public IRepository<Investimento> Investimentos => _investimentos ??= new Repository<Investimento>(_context);

    private IRepository<AlertaFinanceiro>? _alertas;
    public IRepository<AlertaFinanceiro> Alertas => _alertas ??= new Repository<AlertaFinanceiro>(_context);

    public async Task<int> CommitAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
