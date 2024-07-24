import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-responsive-bs5";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function App() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState(0);
  const [pais, setPais] = useState("");
  const [cargo, setCargo] = useState("");
  const [años, setAños] = useState(0);
  const [id, setId] = useState(null);
  const [editar, setEditar] = useState(false);
  const [empleadosList, setEmpleados] = useState([]);
  const [bgColor, setBgColor] = useState("#f0f0f0");

  useEffect(() => {
    document.body.style.backgroundColor = bgColor;
  }, [bgColor]);

  const add = () => {
    Axios.post("http://localhost:3001/create", {
      nombre,
      edad,
      pais,
      cargo,
      años,
    })
      .then(() => {
        setBgColor("#e0f7fa");
        getEmpleados();
        limpiarCampos();
        Swal.fire({
          title: "<strong>REGISTRADO EXITOSAMENTE</strong>",
          html: "<h2>El Empleado <strong>" + nombre + "</strong></h2>",
          icon: "success",
          timer: 1500,
        });

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((err) => {
        alert("Error al registrar el empleado: " + err.message);
      });
  };

  const limpiarCampos = () => {
    setAños("");
    setNombre("");
    setCargo("");
    setEdad("");
    setPais("");
    setId("");
    setEditar(false);
  };

  const update = () => {
    Axios.put("http://localhost:3001/update", {
      id,
      nombre,
      edad,
      pais,
      cargo,
      años,
    })
      .then(() => {
        getEmpleados();
        limpiarCampos();
        Swal.fire({
          title: "<strong>ACTUALIZACIÓN EXITOSA</strong>",
          html:
            "<i>El Empleado <strong>" +
            nombre +
            " fue actualizado con éxito</strong></i>",
          icon: "success",
         
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((err) => {
        alert("Error al actualizar el empleado: " + err.message);
      });
  };

  const editarEmpleado = (val) => {
    setEditar(true);
    setNombre(val.nombre);
    setEdad(val.edad);
    setPais(val.pais);
    setCargo(val.cargo);
    setAños(val.años);
    setId(val.id);
  };

  const deleteEmployee = (id) => {
    MySwal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/delete/${id}`)
          .then(() => {
            getEmpleados();
            MySwal.fire({
              title: "<strong>ELIMINADO EXITOSAMENTE</strong>",
              html: <i>El Empleado con ID <strong>${id}</strong> fue eliminado con éxito</i>,
              icon: "success",
              timer: 2500,
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          })
          .catch((err) => {
            MySwal.fire({
              title: "<strong>Error al eliminar</strong>",
              text: err.message,
              icon: "error",
            });
          });
      }
    });
  };

  const getEmpleados = () => {
    Axios.get("http://localhost:3001/empleados")
      .then((response) => {
        setEmpleados(response.data);
      })
      .catch((err) => {
        alert("Error al obtener empleados: " + err.message);
      });
  };

  useEffect(() => {
    getEmpleados();
  }, []);

  useEffect(() => {
    $("#empleadosTable").DataTable().destroy();

    if (empleadosList.length > 0) {
      $("#empleadosTable").DataTable({
        responsive: true,
      });
    }
  }, [empleadosList]);

  return (
    <div className="container my-5">
      <div className="card text-center shadow-lg">
        <div className="card-header bg-primary text-white">
          <h4>Registro de Empleados</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 col-lg-4 mb-3">
              <div className="input-group shadow-sm">
                <span className="input-group-text bg-info text-white" id="basic-addon1">
                  Nombre:
                </span>
                <input
                  type="text"
                  onChange={(event) => setNombre(event.target.value)}
                  className="form-control"
                  value={nombre}
                  placeholder="Ingrese un nombre"
                  aria-label="Nombre"
                  aria-describedby="basic-addon1"
                />
              </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-3">
              <div className="input-group shadow-sm">
                <span className="input-group-text bg-info text-white" id="basic-addon1">
                  Edad:
                </span>
                <input
                  type="number"
                  onChange={(event) => setEdad(parseInt(event.target.value))}
                  className="form-control"
                  value={edad}
                  placeholder="Ingrese una edad"
                  aria-label="Edad"
                  aria-describedby="basic-addon1"
                />
              </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-3">
              <div className="input-group shadow-sm">
                <span className="input-group-text bg-info text-white" id="basic-addon1">
                  País:
                </span>
                <input
                  type="text"
                  onChange={(event) => setPais(event.target.value)}
                  className="form-control"
                  value={pais}
                  placeholder="Ingrese un país"
                  aria-label="País"
                  aria-describedby="basic-addon1"
                />
              </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-3">
              <div className="input-group shadow-sm">
                <span className="input-group-text bg-info text-white" id="basic-addon1">
                  Cargo:
                </span>
                <input
                  type="text"
                  onChange={(event) => setCargo(event.target.value)}
                  className="form-control"
                  value={cargo}
                  placeholder="Ingrese un cargo"
                  aria-label="Cargo"
                  aria-describedby="basic-addon1"
                />
              </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-3">
              <div className="input-group shadow-sm">
                <span className="input-group-text bg-info text-white" id="basic-addon1">
                  Años de experiencia:
                </span>
                <input
                  type="number"
                  onChange={(event) => setAños(parseInt(event.target.value))}
                  className="form-control"
                  value={años}
                  placeholder="Ingrese años de experiencia"
                  aria-label="Años"
                  aria-describedby="basic-addon1"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer text-muted">
          {editar ? (
            <div>
              <button className="btn btn-success m-2" onClick={update}>
                Actualizar
              </button>
              <button className="btn btn-dark m-2" onClick={limpiarCampos}>
                Cancelar
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={add}>
              Registrar
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 shadow-lg p-3 mb-5 bg-body rounded">
        <h4>Lista de Empleados</h4>
        <table id="empleadosTable" className="table table-striped table-hover">
          <thead>
            <tr>
              <th className="bg-primary text-white">#</th>
              <th className="bg-primary text-white">Nombre</th>
              <th className="bg-primary text-white">Edad</th>
              <th className="bg-primary text-white">País</th>
              <th className="bg-primary text-white">Cargo</th>
              <th className="bg-primary text-white">Experiencia</th>
              <th className="bg-primary text-white">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleadosList.map((val) => (
              <tr key={val.id}>
                <th scope="row">{val.id}</th>
                <td>{val.nombre}</td>
                <td>{val.edad}</td>
                <td>{val.pais}</td>
                <td>{val.cargo}</td>
                <td>{val.años}</td>
                <td>
                  <div className="btn-group" role="group" aria-label="Acciones">
                    <button
                      type="button"
                      onClick={() => editarEmpleado(val)}
                      className="btn btn-info"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteEmployee(val.id)}
                      className="btn btn-danger"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
