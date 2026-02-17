namespace MyFinance.API.DTOs.CartaoCredito;

public record CartaoCreditoResponse(
    long Id,
    string Nome,
    long? BancoId,
    string? BancoNome,
    long? CarteiraId,
    string? CarteiraNome,
    decimal LimiteTotal,
    decimal LimiteAtual,
    bool Ativo
);

public record CreateCartaoCreditoRequest(
    string Nome,
    long? BancoId,
    decimal LimiteTotal,
    long? CarteiraId
);

public record UpdateCartaoCreditoRequest(
    string Nome,
    long? BancoId,
    decimal LimiteTotal,
    bool Ativo,
    long? CarteiraId
);
