using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyFinance.API.Models;

[Table("fatura_cartao_credito")]
public class FaturaCartaoCredito
{
    [Key]
    [Column("id_fatura_cartao_credito")]
    public long Id { get; set; }

    [Column("id_cartao_credito")]
    public long CartaoCreditoId { get; set; }
    public CartaoCredito? CartaoCredito { get; set; }

    [Column("id_competencia")]
    public long CompetenciaId { get; set; }
    public Competencia? Competencia { get; set; }

    [Column("valor_fatura_cartao_credito")]
    public decimal Valor { get; set; }

    [Column("fl_fatura_cartao_credito_fechada")]
    public bool Fechada { get; set; }

    [Column("data_fechamento_fatura_cartao_credito")]
    public DateOnly? DataFechamento { get; set; }

    [Column("id_usuario")]
    public long UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }

    [Column("criado_em")]
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
}
