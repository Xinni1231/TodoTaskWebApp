using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapi.Data;
using webapi.Models;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoItemsController : ControllerBase
    {
        private readonly webapiContext _context;

        public TodoItemsController(webapiContext context)
        {
            _context = context;
        }

        // GET: api/TodoItems
        // GET: api/TodoItems
        [HttpGet("ids")]
        public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodoItem(string sortName, string filters)
        {
            if (_context.TodoItems == null)
            {
                return NotFound();
            }

            List<string> filter_queries = new List<string>();
            string sql_query = String.Empty;

            // filtered query
            var filter = filters.Split("_");
            if (filter.Length > 0)
            {
                foreach (var inner_fil in filter)
                {
                    var tokens = inner_fil.Split("-");
                    if (tokens.Length == 2)
                    {
                        int val = -1;
                        string key = tokens[0];
                        switch (key)
                        {
                            case "duedate":
                                if (int.TryParse(tokens[1], out val) && val >= 0)
                                {
                                    filter_queries.Add($"DATEDIFF(day, DateCreated, DueDate) <= {val}");
                                }
                                break;
                            case "status":
                                if (int.TryParse(tokens[1], out val) && val >= 0)
                                {
                                    filter_queries.Add($"Status & {val} > 0");
                                }
                                break;
                            case "priority":
                                if (int.TryParse(tokens[1], out val) && val >= 0)
                                {
                                    filter_queries.Add($"Priority & {val} > 0");
                                }
                                break;
                            default:
                                break;
                        }
                    }
                }
            }

            int count = filter_queries.Count;
            if (count > 0)
            {
                sql_query += $"WHERE ";
            }
            for (int i = 0; i < count; i++)
            {
                sql_query += (i == count - 1) ? filter_queries[i] + " " : filter_queries[i] + " AND ";
            }

            // sorting query
            switch (sortName)
            {
                case "duedate_desc":
                    sql_query += $"ORDER BY DueDate DESC";
                    break;
                case "duedate":
                    sql_query += $"ORDER BY DueDate";
                    break;
                case "status_desc":
                    sql_query += $"ORDER BY Status DESC";
                    break;
                case "status":
                    sql_query += $"ORDER BY Status";
                    break;
                case "name_desc":
                    sql_query += $"ORDER BY Name DESC";
                    break;
                case "name":
                    sql_query += $"ORDER BY Name";
                    break;
                case "priority_desc":
                    sql_query += $"ORDER BY Priority DESC";
                    break;
                case "priority":
                    sql_query += $"ORDER BY Priority";
                    break;
                default:
                    break;
            }

            return await _context.TodoItems.FromSqlRaw($"SELECT * FROM TodoList {sql_query}").ToListAsync();
        }

        // GET: api/TodoItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TodoItem>> GetTodoItem(int id)
        {
            if (_context.TodoItems == null)
            {
                return NotFound();
            }
            var todoItem = await _context.TodoItems.FindAsync(id);

            if (todoItem == null)
            {
                return NotFound();
            }

            return todoItem;
        }

        // PUT: api/TodoItems/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTodoItem(int id, TodoItem todoItem)
        {
            if (id != todoItem.Id || !todoItem.ValidateRecord())
            {
                return BadRequest();
            }

            todoItem.UpdateRecordDatetime();
            _context.Entry(todoItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TodoItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/TodoItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TodoItem>> PostTodoItem(TodoItem todoItem)
        {
            if (_context.TodoItems == null)
            {
                return Problem("Entity set 'webapiContext.TodoItem'  is null.");
            }
            if(!todoItem.ValidateRecord())
            {
                return BadRequest();
            }

            todoItem.CreateRecordDatetime();
            _context.TodoItems.Add(todoItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTodoItem", new { id = todoItem.Id }, todoItem);
        }

        // DELETE: api/TodoItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodoItem(int id)
        {
            if (_context.TodoItems == null)
            {
                return NotFound();
            }
            var todoItem = await _context.TodoItems.FindAsync(id);
            if (todoItem == null)
            {
                return NotFound();
            }

            _context.TodoItems.Remove(todoItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TodoItemExists(int id)
        {
            return (_context.TodoItems?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
