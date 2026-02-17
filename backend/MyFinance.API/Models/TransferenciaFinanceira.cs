using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyFinance.API.Models;

[Table("transferencia_financeira")]
public class TransferenciaFinanceira
{
    [Key]
    [Column("id_transferencia_financeira")]
    public long Id { get; set; }

    [Column("id_tipo_transferencia_financeira")]
    public long TipoTransferenciaId { get; set; }
    public TipoTransferenciaFinanceira? TipoTransferencia { get; set; }

    [Column("data_transferencia")]
    public DateOnly DataTransferencia { get; set; }

    [Column("descricao_transferencia")]
    public string Descricao { get; set; } = string.Empty;

    [Column("valor_transferencia")]
    public decimal Valor { get; set; }

    [Column("id_carteira_origem")]
    public long? CarteiraOrigemId { get; set; }
    public Carteira? CarteiraOrigem { get; set; }

    [Column("id_carteira_destino")]
    public long? CarteiraDestinoId { get; set; }
    public Carteira? CarteiraDestino { get; set; }

    [Column("id_usuario")]
    public long UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }

    [Column("criado_em")]
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
}
