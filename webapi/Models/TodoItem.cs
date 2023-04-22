using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapi.Models
{
    public enum PriorityType
    {
        Low =1, Medium=2, High=4
    }
    public enum StatusType
    {
        NotStarted=1, InProgress=2, Completed=4
    }


    [Table("TodoList")]
    public class TodoItem
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
        public StatusType Status { get; set; }
        public PriorityType Priority { get; set; }
        public string Creator { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }

        public void CreateRecordDatetime()
        {
            DateCreated = DateModified = DateTime.UtcNow;
        }

        public void UpdateRecordDatetime()
        {
            DateModified = DateTime.UtcNow;
        }

        public bool ValidateRecord()
        {
            return !String.IsNullOrEmpty(Name) &&
                !String.IsNullOrEmpty(Description) &&
                DueDate != DateTime.MinValue &&
                Enum.IsDefined(typeof(StatusType), Status) &&
                Enum.IsDefined(typeof(PriorityType), Priority);
        }
    }
}
