using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using webapi.Controllers;
using webapi.Data;
using webapi.Models;

namespace TodoUnitTest
{
    [TestClass]
    public class ToDoUnitTests
    {
        private readonly webapiContext _context;
        private readonly TodoItemsController _controller;
        private DateTime date = new DateTime();

        public ToDoUnitTests()
        {
            // Use an in-memory database for testing
            var options = new DbContextOptionsBuilder<webapiContext>()
                .UseInMemoryDatabase("TodoDatabase").Options;


            _context = new webapiContext(options);
            _controller = new TodoItemsController(_context);
        }

        [TestMethod]
        public void GetTodoItem_ReturnsAllTodosByFilter()
        {
            var expectedTodos = new List<TodoItem>
            {
                new TodoItem { Id = 1, Name = "Task 1", Description = "CCC", DueDate=date.AddDays(1),
                    Status=StatusType.NotStarted,Priority= PriorityType.Low,
                    Creator="", DateCreated=date,DateModified=date },
                 new TodoItem { Id = 2, Name = "Task 2", Description = "BBB", DueDate=date.AddDays(1),
                    Status=StatusType.InProgress,Priority= PriorityType.Medium,
                    Creator="", DateCreated=date,DateModified=date },
                  new TodoItem { Id = 3, Name = "Task 3", Description = "CCC", DueDate=date.AddDays(3),
                    Status=StatusType.Completed,Priority= PriorityType.High,
                    Creator="", DateCreated=date,DateModified=date },
            };
            _context.TodoItems.AddRange(expectedTodos);
            _context.SaveChanges();

            // TODO : UseInMemoryDatabase limitation, not able to support special filtering for unit test
            var result = _controller.GetTodoItem("-", "-").Result;

            Assert.IsNotNull(result.Value);
            Assert.AreEqual(expectedTodos.Count, result.Value.Count());

            var items = result.Value;
            for (int i = 0; i < expectedTodos.Count; i++)
            {
                Assert.AreEqual(expectedTodos[i].Id, items.ElementAt(i).Id);
                Assert.AreEqual(expectedTodos[i].Name, items.ElementAt(i).Name);
                Assert.AreEqual(expectedTodos[i].Description, items.ElementAt(i).Description);
                Assert.AreEqual(expectedTodos[i].DueDate, items.ElementAt(i).DueDate);
                Assert.AreEqual(expectedTodos[i].Status, items.ElementAt(i).Status);
                Assert.AreEqual(expectedTodos[i].Priority, items.ElementAt(i).Priority);
                Assert.AreEqual(expectedTodos[i].Creator, items.ElementAt(i).Creator);
                Assert.AreEqual(expectedTodos[i].DateCreated, items.ElementAt(i).DateCreated);
                Assert.AreEqual(expectedTodos[i].DateModified, items.ElementAt(i).DateModified);
            }
        }

        [TestMethod]
        public void GetTodoById_ReturnsTodoById()
        {
            var todo = new TodoItem
            {
                Id = 4,
                Name = "Task 4",
                Description = "Test 4",
                DueDate = date.AddDays(5),
                Status = StatusType.InProgress,
                Priority = PriorityType.Medium,
                Creator = "",
                DateCreated = date,
                DateModified = date
            };

            _context.TodoItems.Add(todo);
            _context.SaveChanges();

            var result = _controller.GetTodoItem(4).Result;

            Assert.IsNotNull(result.Value);
            Assert.AreEqual(todo.Id, result.Value.Id);
            Assert.AreEqual(todo.Name, result.Value.Name);
            Assert.AreEqual(todo.Description, result.Value.Description);
            Assert.AreEqual(todo.DueDate, result.Value.DueDate);
            Assert.AreEqual(todo.Status, result.Value.Status);
            Assert.AreEqual(todo.Priority, result.Value.Priority);
            Assert.AreEqual(todo.Creator, result.Value.Creator);
            Assert.AreEqual(todo.DateCreated, result.Value.DateCreated);
            Assert.AreEqual(todo.DateModified, result.Value.DateModified);
        }

        [TestMethod]
        public void UpdateTodo_UpdatesExistingTodo()
        {
            var updatedTodo =
                  new TodoItem
                  {
                      Id = 3,
                      Name = "Task 3",
                      Description = "123",
                      DueDate = date.AddDays(7),
                      Status = StatusType.Completed,
                      Priority = PriorityType.Low,
                      Creator = "",
                      DateCreated = date,
                      DateModified = date
                  };

            _controller.PutTodoItem(updatedTodo.Id, updatedTodo).Wait();
            var result = _controller.GetTodoItem(3).Result;

            Assert.IsNotNull(result.Value);
            Assert.AreEqual(updatedTodo.Id, result.Value.Id);
            Assert.AreEqual(updatedTodo.Name, result.Value.Name);
            Assert.AreEqual(updatedTodo.Description, result.Value.Description);
            Assert.AreEqual(updatedTodo.DueDate, result.Value.DueDate);
            Assert.AreEqual(updatedTodo.Status, result.Value.Status);
            Assert.AreEqual(updatedTodo.Priority, result.Value.Priority);
            Assert.AreEqual(updatedTodo.Creator, result.Value.Creator);
        }

        [TestMethod]
        public void AddTodo_ReturnsNewTodo()
        {
            var addTodo =
                  new TodoItem
                  {
                      Id = 7,
                      Name = "New Task 15",
                      Description = "Is New Task 15",
                      DueDate = date.AddDays(88),
                      Status = StatusType.InProgress,
                      Priority = PriorityType.Low,
                      Creator = "",
                  };

            _controller.PostTodoItem(addTodo).Wait();
            var result = _controller.GetTodoItem(7).Result;

            Assert.IsNotNull(result.Value);
            Assert.AreEqual(addTodo.Name, result.Value.Name);
            Assert.AreEqual(addTodo.Description, result.Value.Description);
            Assert.AreEqual(addTodo.DueDate, result.Value.DueDate);
            Assert.AreEqual(addTodo.Status, result.Value.Status);
            Assert.AreEqual(addTodo.Priority, result.Value.Priority);
            Assert.AreEqual(addTodo.Creator, result.Value.Creator);
        }

        [TestMethod]
        public void DeleteTodo_RemovesTodo()
        {
            var deletedTodo =
                  new TodoItem
                  {
                      Id = 6,
                      Name = "Task 6",
                      Description = "Test 6",
                      DueDate = date.AddDays(14),
                      Status = StatusType.Completed,
                      Priority = PriorityType.Medium,
                      Creator = "",
                      DateCreated = date,
                      DateModified = date
                  };
            _context.TodoItems.Add(deletedTodo);
            _context.SaveChanges();

            _controller.DeleteTodoItem(3).Wait();

            Assert.IsNull(_context.TodoItems.Find(3));
        }
    }
}
