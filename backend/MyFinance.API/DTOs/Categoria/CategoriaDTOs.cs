using System.ComponentModel.DataAnnotations;

namespace MyFinance.API.DTOs.Categoria
{
    public record CreateCategoriaRequest(
        [Required] string Nome,
        bool Fixo = false,
        decimal ValorFixo = 0
    );

    public record UpdateCategoriaRequest(
        [Required] string Nome,
        bool Fixo,
        decimal ValorFixo
    );

    public record CategoriaResponse(
        long Id,
        string Nome,
        bool Fixo,
        decimal ValorFixo,
        string Tipo // "Receita" or "Despesa"
    );
}
