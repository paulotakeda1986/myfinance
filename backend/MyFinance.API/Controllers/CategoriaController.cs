using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyFinance.API.DTOs.Categoria;
using MyFinance.API.Models;
using MyFinance.API.Repositories;
using System.Security.Claims;

namespace MyFinance.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CategoriaController : ControllerBase
    {
        private readonly IUnitOfWork _uow;

        public CategoriaController(IUnitOfWork uow)
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

        #region Receita

        [HttpGet("receita")]
        public async Task<ActionResult<IEnumerable<CategoriaResponse>>> GetReceitas()
        {
            try
            {
                var userId = GetUserId();
                var categorias = await _uow.CategoriasReceita.FindAsync(c => c.UsuarioId == userId);
                
                var response = categorias.Select(c => new CategoriaResponse(
                    c.Id,
                    c.Nome,
                    c.Fixo,
                    c.ValorFixo,
                    "Receita"
                ));

                return Ok(response);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        [HttpGet("receita/{id}")]
        public async Task<ActionResult<CategoriaResponse>> GetReceita(long id)
        {
            try
            {
                var userId = GetUserId();
                var categoria = await _uow.CategoriasReceita.GetByIdAsync(id);

                if (categoria == null || categoria.UsuarioId != userId)
                {
                    return NotFound();
                }

                return Ok(new CategoriaResponse(
                    categoria.Id,
                    categoria.Nome,
                    categoria.Fixo,
                    categoria.ValorFixo,
                    "Receita"
                ));
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        [HttpPost("receita")]
        public async Task<ActionResult<CategoriaResponse>> CreateReceita(CreateCategoriaRequest request)
        {
            try
            {
                var userId = GetUserId();

                var categoria = new CategoriaReceita
                {
                    Nome = request.Nome,
                    Fixo = request.Fixo,
                    ValorFixo = request.ValorFixo,
                    UsuarioId = userId,
                    CriadoEm = DateTime.UtcNow
                };

                await _uow.CategoriasReceita.AddAsync(categoria);
                await _uow.CommitAsync();

                return CreatedAtAction(nameof(GetReceita), new { id = categoria.Id }, new CategoriaResponse(
                    categoria.Id,
                    categoria.Nome,
                    categoria.Fixo,
                    categoria.ValorFixo,
                    "Receita"
                ));
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        [HttpPut("receita/{id}")]
        public async Task<IActionResult> UpdateReceita(long id, UpdateCategoriaRequest request)
        {
            try
            {
                var userId = GetUserId();
                var categoria = await _uow.CategoriasReceita.GetByIdAsync(id);

                if (categoria == null || categoria.UsuarioId != userId)
                {
                    return NotFound();
                }

                categoria.Nome = request.Nome;
                categoria.Fixo = request.Fixo;
                categoria.ValorFixo = request.ValorFixo;

                _uow.CategoriasReceita.Update(categoria);
                await _uow.CommitAsync();

                return NoContent();
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        [HttpDelete("receita/{id}")]
        public async Task<IActionResult> DeleteReceita(long id)
        {
            try
            {
                var userId = GetUserId();
                var categoria = await _uow.CategoriasReceita.GetByIdAsync(id);

                if (categoria == null || categoria.UsuarioId != userId)
                {
                    return NotFound();
                }

                _uow.CategoriasReceita.Delete(categoria);
                await _uow.CommitAsync();

                return NoContent();
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        #endregion

        #region Despesa

        [HttpGet("despesa")]
        public async Task<ActionResult<IEnumerable<CategoriaResponse>>> GetDespesas()
        {
            try
            {
                var userId = GetUserId();
                var categorias = await _uow.CategoriasDespesa.FindAsync(c => c.UsuarioId == userId);
                
                var response = categorias.Select(c => new CategoriaResponse(
                    c.Id,
                    c.Nome,
                    c.Fixo,
                    c.ValorFixo,
                    "Despesa"
                ));

                return Ok(response);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        [HttpGet("despesa/{id}")]
        public async Task<ActionResult<CategoriaResponse>> GetDespesa(long id)
        {
            try
            {
                var userId = GetUserId();
                var categoria = await _uow.CategoriasDespesa.GetByIdAsync(id);

                if (categoria == null || categoria.UsuarioId != userId)
                {
                    return NotFound();
                }

                return Ok(new CategoriaResponse(
                    categoria.Id,
                    categoria.Nome,
                    categoria.Fixo,
                    categoria.ValorFixo,
                    "Despesa"
                ));
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        [HttpPost("despesa")]
        public async Task<ActionResult<CategoriaResponse>> CreateDespesa(CreateCategoriaRequest request)
        {
            try
            {
                var userId = GetUserId();

                var categoria = new CategoriaDespesa
                {
                    Nome = request.Nome,
                    Fixo = request.Fixo,
                    ValorFixo = request.ValorFixo,
                    UsuarioId = userId,
                    CriadoEm = DateTime.UtcNow
                };

                await _uow.CategoriasDespesa.AddAsync(categoria);
                await _uow.CommitAsync();

                return CreatedAtAction(nameof(GetDespesa), new { id = categoria.Id }, new CategoriaResponse(
                    categoria.Id,
                    categoria.Nome,
                    categoria.Fixo,
                    categoria.ValorFixo,
                    "Despesa"
                ));
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        [HttpPut("despesa/{id}")]
        public async Task<IActionResult> UpdateDespesa(long id, UpdateCategoriaRequest request)
        {
            try
            {
                var userId = GetUserId();
                var categoria = await _uow.CategoriasDespesa.GetByIdAsync(id);

                if (categoria == null || categoria.UsuarioId != userId)
                {
                    return NotFound();
                }

                categoria.Nome = request.Nome;
                categoria.Fixo = request.Fixo;
                categoria.ValorFixo = request.ValorFixo;

                _uow.CategoriasDespesa.Update(categoria);
                await _uow.CommitAsync();

                return NoContent();
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        [HttpDelete("despesa/{id}")]
        public async Task<IActionResult> DeleteDespesa(long id)
        {
            try
            {
                var userId = GetUserId();
                var categoria = await _uow.CategoriasDespesa.GetByIdAsync(id);

                if (categoria == null || categoria.UsuarioId != userId)
                {
                    return NotFound();
                }

                _uow.CategoriasDespesa.Delete(categoria);
                await _uow.CommitAsync();

                return NoContent();
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        #endregion
    }
}
