using System.ComponentModel.DataAnnotations;

namespace MyFinance.API.DTOs.Carteira
{
    public record CreateCarteiraRequest(
        [Required] string Nome,
        long? BancoId,
        [Required] long TipoCarteiraId,
        decimal SaldoInicial = 0
    );

    public record UpdateCarteiraRequest(
        [Required] string Nome,
        long? BancoId,
        [Required] long TipoCarteiraId
    );

    public record CarteiraResponse(
        long Id,
        string Nome,
        long? BancoId,
        string? BancoNome,
        long TipoCarteiraId,
        string? TipoCarteiraNome,
        decimal SaldoInicial,
        decimal SaldoAtual
    );
}
