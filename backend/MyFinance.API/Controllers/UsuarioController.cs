using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyFinance.API.Models;
using MyFinance.API.Repositories;
using System.Security.Claims;

namespace MyFinance.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsuarioController : ControllerBase
    {
        private readonly IUnitOfWork _uow;

        public UsuarioController(IUnitOfWork uow)
        {
            _uow = uow;
        }

        [HttpGet("me")]
        public async Task<ActionResult<Usuario>> GetMe()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized();
            }

            var usuario = await _uow.Usuarios.GetByIdAsync(userId);
            if (usuario == null)
            {
                return NotFound();
            }

            // Ensure password is not returned
            usuario.Senha = string.Empty;

            return Ok(usuario);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Usuario usuario)
        {
            if (id != usuario.Id)
            {
                return BadRequest();
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int currentUserId))
            {
                return Unauthorized();
            }

            // Prevent users from updating other users' profiles
            if (id != currentUserId)
            {
                return Forbid();
            }

            var existingUser = await _uow.Usuarios.GetByIdAsync(id);
            if (existingUser == null)
            {
                return NotFound();
            }

            // Update allowed fields
            existingUser.Email = usuario.Email;
            existingUser.Login = usuario.Login;
            
            // If phone is added to model later, update it here

            _uow.Usuarios.Update(existingUser);
            await _uow.CommitAsync();

            return NoContent();
        }
    }
}
