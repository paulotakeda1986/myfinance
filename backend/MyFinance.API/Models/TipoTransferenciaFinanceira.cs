using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyFinance.API.Models;

[Table("tipo_transferencia_financeira")]
public class TipoTransferenciaFinanceira
{
    [Key]
    [Column("id_tipo_transferencia_financeira")]
    public long Id { get; set; }

    [Required]
    [Column("nome")]
    public string Nome { get; set; } = string.Empty;

    [Column("criado_em")]
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
}
