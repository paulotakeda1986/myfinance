namespace MyFinance.API.DTOs.Fatura;

public record FaturaResponse(
    long Id,
    long CartaoCreditoId,
    string CartaoNome,
    long CompetenciaId,
    string CompetenciaFormatada, // ex: "02/2026"
    decimal ValorTotal,
    bool Fechada,
    DateOnly? DataFechamento
);

public record PagarFaturaRequest(
    long CarteiraId // Optional if we want to override the linked one, but the user said "carteira vinculada"
);
