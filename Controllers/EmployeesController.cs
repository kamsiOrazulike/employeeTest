using InterviewTest.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using System;
using System.Collections.Generic;

namespace InterviewTest.Controllers
{
    [ApiController]
    [Route("Employees")]
    public class EmployeesController : ControllerBase
    {
        [HttpGet]
        public List<Employee> Get()
        {
            var employees = new List<Employee>();

            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = @"SELECT Name, Value FROM Employees";
                using (var reader = queryCmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        employees.Add(new Employee
                        {
                            Name = reader.GetString(0),
                            Value = reader.GetInt32(1)
                        });
                    }
                }
            }

            return employees;
        }

        [HttpPatch]
        [Route("[action]")]
        public bool incrementValue()
        {
            var sums = new List<object>();

            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var sqlCmd = connection.CreateCommand();
                sqlCmd.CommandText = @"UPDATE Employees
                                         SET Value =
                                         CASE
                                         	WHEN UPPER(SUBSTR(Name,1,1)) = 'E' THEN VALUE + 1
                                         	WHEN UPPER(SUBSTR(Name,1,1)) = 'G' THEN VALUE + 10
                                         	ELSE VALUE + 100
                                         END";
                sqlCmd.ExecuteNonQuery();
            }
            return true;
        }

        [HttpGet]
        [Route("[action]")]
        public List<object> GetSum()
        {
            var sums = new List<object>();

            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = @"select SUBSTR(NAME,1,1), SUM(VALUE)
                                            from employees
                                            where SUBSTR(NAME,1,1) in ('A','B','C')
                                            group by SUBSTR(NAME,1,1)
                                            having SUM(VALUE) >= 11171";
                using (var reader = queryCmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        sums.Add(new
                        {
                            Letter = reader.GetString(0),
                            Value = reader.GetInt32(1)
                        });
                    }
                }
            }

            return sums;
        }
    }
}
