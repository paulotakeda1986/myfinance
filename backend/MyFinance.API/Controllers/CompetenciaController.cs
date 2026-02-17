using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyFinance.API.DTOs.Competencia;
using MyFinance.API.Models;
using MyFinance.API.Repositories;
using System.Security.Claims;

namespace MyFinance.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CompetenciaController : ControllerBase
    {
        private readonly IUnitOfWork _uow;

        public CompetenciaController(IUnitOfWork uow)
        {
            _uow = uow;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                throw new UnauthorizedAccessException("User ID not found in token.");
            }
            return userId;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CompetenciaResponse>>> GetAll()
        {
            try
            {
                var userId = GetUserId();
                var competencias = await _uow.Competencias.FindAsync(c => c.UsuarioId == userId);
                
                // Sort by Exercicio desc, Mes desc
                var ordered = competencias
                    .OrderByDescending(c => c.Exercicio)
                    .ThenByDescending(c => c.Mes)
                    .Select(c => new CompetenciaResponse(
                        c.Id,
                        c.Mes,
                        c.Exercicio,
                        $"{CreateMonthName(c.Mes)}/{c.Exercicio}"
                    ));

                return Ok(ordered);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CompetenciaResponse>> GetById(long id)
        {
            try
            {
                var userId = GetUserId();
                var c = await _uow.Competencias.GetByIdAsync(id);

                if (c == null || c.UsuarioId != userId)
                {
                    return NotFound();
                }

                return Ok(new CompetenciaResponse(
                    c.Id,
                    c.Mes,
                    c.Exercicio,
                    $"{CreateMonthName(c.Mes)}/{c.Exercicio}"
                ));
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        [HttpPost]
        public async Task<ActionResult<CompetenciaResponse>> Create(CreateCompetenciaRequest request)
        {
            try
            {
                var userId = GetUserId();

                // Check if already exists
                var existing = await _uow.Competencias.FindAsync(c => c.UsuarioId == userId && c.Mes == request.Mes && c.Exercicio == request.Exercicio);
                if (existing.Any())
                {
                    return Conflict("Competencia already exists for this period.");
                }

                var competencia = new Competencia
                {
                    UsuarioId = userId,
                    Mes = request.Mes,
                    Exercicio = request.Exercicio,
                    CriadoEm = DateTime.UtcNow
                };

                await _uow.Competencias.AddAsync(competencia);
                await _uow.CommitAsync();

                return CreatedAtAction(nameof(GetById), new { id = competencia.Id }, new CompetenciaResponse(
                    competencia.Id,
                    competencia.Mes,
                    competencia.Exercicio,
                    $"{CreateMonthName(competencia.Mes)}/{competencia.Exercicio}"
                ));
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
             try
            {
                var userId = GetUserId();
                var c = await _uow.Competencias.GetByIdAsync(id);

                if (c == null || c.UsuarioId != userId)
                {
                    return NotFound();
                }

                _uow.Competencias.Delete(c);
                await _uow.CommitAsync();

                return NoContent();
            }
             catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        private string CreateMonthName(int mes)
        {
            return System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(mes);
        }
    }
}
