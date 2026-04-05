using OllamaSharp;
using Vyapak.Models;

namespace Vyapak.Services;

public class OllamaService(IOllamaApiClient ollamaClient)
{
    private readonly IOllamaApiClient _ollamaClient = ollamaClient;

    public async Task<string> GetResponseAsync(string prompt, string model)
    {
        _ollamaClient.SelectedModel = model;
        var response = "";
        await foreach (var stream in _ollamaClient.GenerateAsync(prompt))
        {
            response += stream?.Response;
        }
        return response;
    }

    public async Task<IEnumerable<string>> GetAvailableModelsAsync()
    {
        var models = await _ollamaClient.ListLocalModelsAsync();
        return models.Select(m => m.Name);
    }

    public async Task<string?> GetDefaultModelAsync()
    {
        var models = await GetAvailableModelsAsync();
        return models.FirstOrDefault();
    }
}
