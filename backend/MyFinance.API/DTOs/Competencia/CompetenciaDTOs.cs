using System.ComponentModel.DataAnnotations;

namespace MyFinance.API.DTOs.Competencia
{
    public record CreateCompetenciaRequest(
        [Required] int Mes,
        [Required] int Exercicio
    );

    public record CompetenciaResponse(
        long Id,
        int Mes,
        int Exercicio,
        string Descricao // e.g. "Janeiro/2026"
    );
}
