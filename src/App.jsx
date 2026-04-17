import RecomendacionPAC from "./pages/RecomendacionPAC.jsx";
import { useState } from "react";
import Header from "./components/Header.jsx";
import MenuPrincipal from "./components/MenuPrincipal.jsx";
import CalculadoraPAC from "./pages/CalculadoraPAC.jsx";

function App() {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [autenticado, setAutenticado] = useState(false);
  const [vista, setVista] = useState("menu");

  const usuarios = [
    { user: "admin", pass: "1234", nombre: "Administrador" },
    { user: "operador", pass: "1234", nombre: "Operador" },
    { user: "visor", pass: "1234", nombre: "Visor" }
  ];

  const usuarioValido = usuarios.find(
    (u) => u.user === usuario && u.pass === clave
  );

  const login = () => {
    if (usuarioValido) {
      setAutenticado(true);
      setVista("menu");
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  const cerrarSesion = () => {
    setAutenticado(false);
    setUsuario("");
    setClave("");
    setVista("menu");
  };

  if (!autenticado) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #89f1b1, #76cadf)",
          padding: "20px",
          boxSizing: "border-box"
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "360px",
            background: "white",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
            textAlign: "center",
            boxSizing: "border-box"
          }}
        >
          <h2 style={{ marginBottom: "20px", color: "#6b80b6" }}>
            INGRESO 💧
          </h2>

          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            style={inputLoginStyle}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            style={inputLoginStyle}
          />

          <button onClick={login} style={botonLoginStyle}>
            Ingresar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f4fbff 0%, #eef8ff 45%, #f8fcff 100%)",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <Header
        nombreUsuario={usuarioValido?.nombre || usuario}
        onCerrarSesion={cerrarSesion}
      />

      <div
        style={{
          maxWidth: "1180px",
          margin: "30px auto",
          padding: "0 20px",
          boxSizing: "border-box"
        }}
      >
        {vista === "menu" && (
          <MenuPrincipal
            setVista={setVista}
            botonAzul={botonAzul}
            botonVerde={botonVerde}
          />
        )}

        {vista === "recomendacion" && (
          <RecomendacionPAC setVista={setVista} />
        )}

        {vista === "calculadora" && (
          <CalculadoraPAC setVista={setVista} />
        )}
      </div>
    </div>
  );
}


const inputLoginStyle = {
  width: "100%",
  marginBottom: "12px",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #cfd8e3",
  fontSize: "15px",
  boxSizing: "border-box"
};

const botonLoginStyle = {
  width: "100%",
  padding: "12px",
  background: "linear-gradient(135deg, #0f766e, #10b981)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontSize: "15px",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 6px 14px rgba(16,185,129,0.22)"
};

const botonAzul = {
  padding: "12px 16px",
  background: "linear-gradient(135deg, #2563eb, #3b82f6)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 6px 14px rgba(37,99,235,0.25)"
};

const botonVerde = {
  padding: "12px 16px",
  background: "linear-gradient(135deg, #0f766e, #10b981)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 6px 14px rgba(16,185,129,0.22)"
};

const botonGris = {
  padding: "12px 16px",
  background: "linear-gradient(135deg, #64748b, #7b8aa0)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 6px 14px rgba(100,116,139,0.20)"
};

export default App;