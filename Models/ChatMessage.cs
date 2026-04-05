using System.ComponentModel.DataAnnotations;

namespace Vyapak.Models;

public class ChatMessage
{
    [Key]
    public int Id { get; set; }
    public string Prompt { get; set; } = string.Empty;
    public string Response { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
