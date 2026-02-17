using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyFinance.API.Models;

[Table("meta_financeira")]
public class MetaFinanceira
{
    [Key]
    [Column("id_meta_financeira")]
    public long Id { get; set; }

    [Column("id_usuario")]
    public long UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }

    [Column("nome")]
    public string Nome { get; set; } = string.Empty;

    [Column("descricao")]
    public string? Descricao { get; set; }

    [Column("valor_meta")]
    public decimal ValorMeta { get; set; }

    [Column("valor_atual")]
    public decimal ValorAtual { get; set; }

    [Column("data_inicio")]
    public DateOnly DataInicio { get; set; }

    [Column("data_fim")]
    public DateOnly? DataFim { get; set; }

    [Column("fl_atingida")]
    public bool Atingida { get; set; }

    [Column("criado_em")]
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
}
