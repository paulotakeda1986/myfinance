using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyFinance.API.Models;

[Table("alerta_financeiro")]
public class AlertaFinanceiro
{
    [Key]
    [Column("id_alerta_financeiro")]
    public long Id { get; set; }

    [Column("id_usuario")]
    public long UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }

    [Column("tipo_alerta")]
    public string TipoAlerta { get; set; } = string.Empty;

    [Column("mensagem")]
    public string Mensagem { get; set; } = string.Empty;

    [Column("data_alerta")]
    public DateTime DataAlerta { get; set; } = DateTime.UtcNow;

    [Column("fl_lido")]
    public bool Lido { get; set; }
}
