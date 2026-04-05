using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vyapak.Data;
using Vyapak.Models;
using Vyapak.Services;

namespace Vyapak.Controllers;

[ApiController]
[Route("api")]
public class ChatController(AppDbContext db, OllamaService ollama) : ControllerBase
{
    private readonly AppDbContext _db = db;
    private readonly OllamaService _ollama = ollama;

    [HttpGet("logs")]
    public async Task<ActionResult<IEnumerable<ChatMessage>>> GetLogs()
    {
        var today = DateTime.UtcNow.Date;
        var logs = await _db.ChatMessages
            .Where(m => m.CreatedAt >= today)
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync();
        
        return Ok(logs);
    }

    [HttpGet("models")]
    public async Task<ActionResult<IEnumerable<string>>> GetModels()
    {
        var models = await _ollama.GetAvailableModelsAsync();
        return Ok(models);
    }

    [HttpPost("chat")]
    public async Task<ActionResult<ChatMessage>> PostChat([FromBody] ChatRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Prompt))
            return BadRequest("Prompt cannot be empty.");

        var availableModels = await _ollama.GetAvailableModelsAsync();
        var selectedModel = request.Model;

        if (string.IsNullOrEmpty(selectedModel) || !availableModels.Contains(selectedModel))
        {
            selectedModel = availableModels.FirstOrDefault();
            if (string.IsNullOrEmpty(selectedModel))
            {
                return StatusCode(500, "No models available on the Ollama server.");
            }
        }

        var response = await _ollama.GetResponseAsync(request.Prompt, selectedModel);
        
        var message = new ChatMessage
        {
            Prompt = request.Prompt,
            Response = response,
            CreatedAt = DateTime.UtcNow
        };

        _db.ChatMessages.Add(message);
        await _db.SaveChangesAsync();

        return Ok(message);
    }
}

public record ChatRequest(string Prompt, string? Model);
