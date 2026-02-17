using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyFinance.API.Models;

[Table("lancamento_financeiro")]
public class LancamentoFinanceiro
{
    [Key]
    [Column("id_lancamento_financeiro")]
    public long Id { get; set; }

    [Column("id_usuario")]
    public long UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }

    [Column("data_lancamento_financeiro")]
    public DateOnly DataLancamento { get; set; }

    [Column("id_tipo_lancamento_financeiro")]
    public long TipoLancamentoId { get; set; }
    public TipoLancamentoFinanceiro? TipoLancamento { get; set; }

    [Column("id_competencia")]
    public long? CompetenciaId { get; set; }
    public Competencia? Competencia { get; set; }

    [Column("id_fatura_cartao_credito")]
    public long? FaturaCartaoId { get; set; }
    public FaturaCartaoCredito? FaturaCartao { get; set; }

    [Column("id_carteira")]
    public long? CarteiraId { get; set; }
    public Carteira? Carteira { get; set; }

    [Column("id_categoria_receita")]
    public long? CategoriaReceitaId { get; set; }
    public CategoriaReceita? CategoriaReceita { get; set; }

    [Column("id_categoria_despesa")]
    public long? CategoriaDespesaId { get; set; }
    public CategoriaDespesa? CategoriaDespesa { get; set; }

    [Column("id_transferencia_financeira")]
    public long? TransferenciaId { get; set; }
    public TransferenciaFinanceira? Transferencia { get; set; }

    [Column("descricao")]
    public string Descricao { get; set; } = "Lançamento financeiro";

    [Column("valor_lancamento_financeiro")]
    public decimal Valor { get; set; }

    [Column("fl_parcelado")]
    public bool Parcelado { get; set; }

    [Column("numero_parcela")]
    public int? NumeroParcela { get; set; }

    [Column("total_parcelas")]
    public int? TotalParcelas { get; set; }

    [Column("fl_fixo")]
    public bool Fixo { get; set; }

    [Column("fl_efetivada")]
    public bool Efetivada { get; set; }

    [Column("criado_em")]
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
}
