using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyFinance.API.Models;

[Table("parcela_lancamento")]
public class ParcelaLancamento
{
    [Key]
    [Column("id_parcela_lancamento")]
    public long Id { get; set; }

    [Column("id_lancamento_financeiro")]
    public long LancamentoFinanceiroId { get; set; }
    public LancamentoFinanceiro? LancamentoFinanceiro { get; set; }

    [Column("numero_parcela")]
    public int NumeroParcela { get; set; }

    [Column("total_parcelas")]
    public int TotalParcelas { get; set; }

    [Column("valor_parcela")]
    public decimal Valor { get; set; }

    [Column("data_vencimento")]
    public DateOnly DataVencimento { get; set; }

    [Column("fl_pago")]
    public bool Pago { get; set; }

    [Column("id_fatura_cartao_credito")]
    public long? FaturaCartaoId { get; set; }
    public FaturaCartaoCredito? FaturaCartao { get; set; }

    [Column("criado_em")]
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
}
