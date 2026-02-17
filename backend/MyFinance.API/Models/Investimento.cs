using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyFinance.API.Models;

[Table("investimento")]
public class Investimento
{
    [Key]
    [Column("id_investimento")]
    public long Id { get; set; }

    [Column("id_usuario")]
    public long UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }

    [Column("nome")]
    public string Nome { get; set; } = string.Empty;

    [Column("tipo")]
    public string Tipo { get; set; } = string.Empty;

    [Column("valor_inicial")]
    public decimal ValorInicial { get; set; }

    [Column("valor_atual")]
    public decimal ValorAtual { get; set; }

    [Column("data_inicio")]
    public DateOnly DataInicio { get; set; }

    [Column("data_resgate")]
    public DateOnly? DataResgate { get; set; }

    [Column("rendimento_percentual")]
    public decimal? RendimentoPercentual { get; set; }

    [Column("criado_em")]
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
}
