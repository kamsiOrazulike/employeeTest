import React, { Component } from "react";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      sum: [],
      newEmployee: { name: "", value: "" },
    };
  }

  componentDidMount() {
    this.refreshData();
  }

  getData = (url) => {
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (url === "/Employees") {
          data = data.map((employee) => {
            employee.index = employee.name;
            return employee;
          });
          this.setState({ employees: data });
        } else if (url === "/Employees/GetSum") {
          this.setState({ sum: data });
        }
      });
  };

  addEmployee = () => {
    const data = {
      Name: this.state.newEmployee.name,
      Value: this.state.newEmployee.value,
    };

    const res = {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    };
    fetch("List/addDetails", res).then((Response) => {
      if (Response.ok) {
        this.refreshData();
        this.setState({ newEmployee: { name: "", value: "" } });
        alert(`New Employee Added!`);
        return Response;
      }
    });
  };

  incrementFields = () => {
    const res = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/Employees/incrementValue", res).then((Response) => {
      if (!Response.ok) {
        throw Error(Response.status);
      }
      this.refreshData();
      return Response;
    });
  };

  deleteEmployee = (index) => {
    const data = {
      name: index,
    };

    const res = {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    };
    fetch("List/removeDetails", res).then((Response) => {
      if (Response.ok) {
        alert(`Employee deleted!`);
        this.refreshData();
        return Response;
      }
    });
  };

  updateDetails() {
    var employees = this.state.employees;

    const res = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employees),
    };

    fetch("List/editDetails", res)
      .then((Response) => {
        if (Response.ok) {
          this.refreshData();
          console.log("Changes registered.");
          return Response;
        } else {
          throw Error(Response.status);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  refreshData = () => {
    this.getData("/Employees");
    this.getData("/Employees/GetSum");
  };

  nameHandler = (index, value) => {
    this.setState(() => {
      const items = [...this.state.employees];
      items[index].name = value;
      return { employees: items };
    });
  };

  valueHandler = (index, value) => {
    this.setState(() => {
      const items = [...this.state.employees];
      items[index].value = value;
      return { employees: items };
    });
  };

  newNameHandler = (e) => {
    e.persist();
    this.setState(() => {
      const newEmployee = this.state.newEmployee;
      newEmployee.name = e.target.value;
      return { newEmployee: newEmployee };
    });
  };

  newValueHandler = (e) => {
    e.persist();
    this.setState(() => {
      const newEmployee = this.state.newEmployee;
      newEmployee.value = e.target.value;
      return { newEmployee: newEmployee };
    });
  };

  render() {
    return (
      <>
        <h1 style={{ color: "#fff" }}>Employee list</h1>

        <div
          style={{
            color: "#fff",
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "row",
          }}
        >
          <button
            key="addValue-button"
            onClick={this.incrementFields}
            style={{
              position: "fixed",
              float: "right",
              bottom: "0%",
              left: "2%",
              right: "15%",
              fontSize: "1rem",
              background: "#99a7ff",
              borderRadius: "1rem",
              padding: "1rem 2rem",
              width: "30%",
              zIndex: "9999",
            }}
          >
            Increment Fields
          </button>
          <table
            style={{
              float: "left",
              padding: "1em",
              height: "10rem",
              width: "30%",
              textAlign: "left",
              color: "#fff",
              border: "1px solid #ddd",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "18px 1rem",
                    border: "1px solid #ddd",
                  }}
                >
                  List of sum of Values for all Names that begin with A, B or C
                  greater than 11171:{" "}
                </th>
              </tr>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "18px 1rem",
                    border: "1px solid #ddd",
                  }}
                >
                  Letter
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "18px 1rem",
                    border: "1px solid #ddd",
                  }}
                >
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {this.state.sum.map((obj) => (
                <tr key={obj.letter}>
                  <td
                    style={{
                      border: "1px solid #fff",
                      borderRadius: "0.2rem",
                      padding: "0.8rem 0.8rem",
                    }}
                  >
                    {obj.letter}
                  </td>
                  <td
                    style={{
                      border: "1px solid #fff",
                      borderRadius: "0.2rem",
                      padding: "0.8rem 0.8rem",
                    }}
                  >
                    {obj.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <table
            style={{
              border: "1px solid #ddd",
              textAlign: "left",
              borderCollapse: "collapse",
              marginLeft: "5em",
              color: "#fff",
            }}
            aria-labelledby="tabelLabel"
          >
            <thead>
              <tr>
                <th style={{ padding: "18px 1rem", border: "1px solid #ddd" }}>
                  <b>Name</b>
                </th>
                <th style={{ padding: "18px 1rem", border: "1px solid #ddd" }}>
                  <b>Value</b>
                </th>
                <th
                  colSpan={2}
                  style={{ padding: "18px 3rem", border: "1px solid #ddd" }}
                >
                  <b>Operations</b>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* NOTE: Create new Employee HERE */}
              <tr
                style={{ background: "#52796F", position: "sticky", top: "0%" }}
              >
                <td style={{ padding: "10px 18px" }}>
                  <input
                    value={this.state.newEmployee.name}
                    onChange={this.newNameHandler}
                    style={{
                      background: "none",
                      color: "#fff",
                      border: "1px solid #fff",
                      borderRadius: "0.2rem",
                      padding: "0.8rem 0.8rem",
                    }}
                    required
                  />
                </td>
                <td style={{ padding: "10px 18px" }}>
                  <input
                    value={this.state.newEmployee.value}
                    onChange={this.newValueHandler}
                    style={{
                      background: "none",
                      color: "#fff",
                      border: "1px solid #fff",
                      borderRadius: "0.2rem",
                      padding: "0.8rem 0.8rem",
                    }}
                    required
                  />
                </td>
                <td colSpan={2} style={{ padding: "10px 10px" }}>
                  <button
                    onClick={this.addEmployee.bind(this)}
                    style={{
                      background: "#48bd67",
                      borderRadius: "0.4rem",
                      padding: "5px 15px",
                      width: "100%",
                    }}
                  >
                    Add Employee
                  </button>
                </td>
              </tr>
              {/* NOTE: Employee inputs HERE */}
              {this.state.employees.map((person, key) => (
                <tr key={key}>
                  <td style={{ padding: "10px 18px" }}>
                    <input
                      value={person.name || ""}
                      onChange={(e) => this.nameHandler(key, e.target.value)}
                      onBlur={this.updateDetails.bind(this)}
                      style={{
                        background: "none",
                        color: "#fff",
                        border: "1px solid #fff",
                        borderRadius: "0.2rem",
                        padding: "0.8rem 0.8rem",
                      }}
                    />
                  </td>
                  <td style={{ padding: "10px 18px" }}>
                    <input
                      value={person.value || ""}
                      onChange={(e) => this.valueHandler(key, e.target.value)}
                      onBlur={this.updateDetails.bind(this)}
                      style={{
                        background: "none",
                        color: "#fff",
                        border: "1px solid #fff",
                        borderRadius: "0.2rem",
                        padding: "0.8rem 0.8rem",
                      }}
                    />
                  </td>

                  <td style={{ padding: "10px 10px" }}>
                    <button
                      onClick={() => this.deleteEmployee(person.index)}
                      style={{
                        background: "#ff6666",
                        borderRadius: "0.4rem",
                        padding: "5px 15px",
                        width: "100%",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}
