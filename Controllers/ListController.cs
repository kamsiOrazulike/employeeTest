using InterviewTest.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using System.Collections.Generic;



namespace InterviewTest.Controllers
{
    [ApiController]
    [Route("List")]
    public class ListController : ControllerBase
    {
        public ListController()
        {
        }

        /*
         * List API methods goe here
         * */

        public class NewEmployee
        {
            public string oldName { get; set; }
            public string newName { get; set; }
            public int newValue { get; set; }
        }

        [HttpPost]
        [Route("[action]")]
        public void editDetails([FromBody] List<Employee> employees)
        {
            cleanUp();
            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                using (var transaction = connection.BeginTransaction())
                {

                    var insertCmd = connection.CreateCommand();
                    insertCmd.CommandText = @"INSERT INTO Employees VALUES ";
                    foreach (var employee in employees)
                    {
                        insertCmd.CommandText += "('" + employee.Name + "', " + employee.Value + "),";
                    }
                    insertCmd.CommandText = insertCmd.CommandText.Remove(insertCmd.CommandText.Length - 1);
                    insertCmd.CommandText += ";";
                    insertCmd.ExecuteNonQuery();
                    transaction.Commit();
                }
            }
        }

        public void cleanUp()
        {
            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                using (var transaction = connection.BeginTransaction())
                {
                    var insertCmd = connection.CreateCommand();
                    insertCmd.CommandText = @"DELETE FROM Employees;";
                    insertCmd.ExecuteNonQuery();
                    transaction.Commit();
                }
            }
        }


        [HttpPost("[action]")]
        public void addDetails([FromBody] Employee employee)
        {
            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                using (var transaction = connection.BeginTransaction())
                {
                    var insertCmd = connection.CreateCommand();
                    insertCmd.CommandText = @"INSERT INTO Employees VALUES ('" + employee.Name + "', " + employee.Value + ");";
                    insertCmd.ExecuteNonQuery();
                    transaction.Commit();
                }
            }
        }

        [HttpPost("[action]")]
        public bool removeDetails(Employee employee)
        {

            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var sqlCmd = connection.CreateCommand();
                sqlCmd.CommandText = @"DELETE FROM Employees
                                       WHERE Name = @name";
                var parameters = new List<SqliteParameter>() { new SqliteParameter("name", employee.Name) };
                sqlCmd.Parameters.AddRange(parameters);
                sqlCmd.ExecuteNonQuery();
            }

            return true;
        }
    }
}
