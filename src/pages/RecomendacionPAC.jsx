import { useEffect, useState } from "react";

function RecomendacionPAC({ setVista }) {
  useEffect(() => {
    fetch("https://ptap-backend.onrender.com")
    .catch(() => {}) //evita errores en consola
  },[])
  const [planta, setPlanta] = useState("Caldas");
  const [modulo, setModulo] = useState("Módulo 500");

  const [caudal, setCaudal] = useState("170");
  const [turbiedad, setTurbiedad] = useState("50");
  const [ph, setPh] = useState("7.35");
  const [alcalinidadCruda, setAlcalinidadCruda] = useState("17");
  const [alcalinidadEncalada, setAlcalinidadEncalada] = useState("16");
  const [densidadPac, setDensidadPac] = useState("1.33");
  const [vecinosDeseados, setVecinosDeseados] = useState("8");

  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const esDiviso = planta === "Diviso";

  const calcularRecomendacion = async () => {
    setError("");
    setResultado(null);

    try {
      setCargando(true);

      const response = await fetch("https://ptap-backend.onrender.com/recomendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          planta,
          modulo: esDiviso ? modulo : null,
          caudal: Number(caudal),
          turbiedad: Number(turbiedad),
          ph: Number(ph),
          alcalinidad_cruda: Number(alcalinidadCruda),
          alcalinidad_encalada: esDiviso ? Number(alcalinidadEncalada) : null,
          densidad_pac: Number(densidadPac),
          vecinos_deseados: Number(vecinosDeseados)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "No se pudo calcular la recomendación.");
      }

      setResultado(data);
    } catch (err) {
      setError(err.message || "Error conectando con el backend.");
    } finally {
      setCargando(false);
    }
  };

  const limpiar = () => {
    setPlanta("Caldas");
    setModulo("Módulo 500");
    setCaudal("170");
    setTurbiedad("50");
    setPh("7.35");
    setAlcalinidadCruda("17");
    setAlcalinidadEncalada("16");
    setDensidadPac("1.33");
    setVecinosDeseados("8");
    setResultado(null);
    setError("");
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.96)",
        borderRadius: "24px",
        padding: "24px",
        boxShadow: "0 10px 30px rgba(7,62,94,0.10)",
        border: "1px solid rgba(7,62,94,0.08)"
      }}
    >
      <div style={badgeStyle}>Recomendación PAC</div>

      <h2 style={{ marginTop: 0, color: "#0b4f6c", marginBottom: "8px" }}>
        Recomendación automática de PAC
      </h2>

      <p style={{ color: "#5b7482", lineHeight: "1.6", marginTop: 0 }}>
        Consulta dosis sugeridas, 6 jarras y casos históricos similares a partir del Excel.
      </p>

      <div style={panelStyle}>
        <h3 style={subtituloStyle}>Selección de planta</h3>

        <div style={gridStyle}>
          <div>
            <label style={labelStyle}>Planta</label>
            <select
              value={planta}
              onChange={(e) => setPlanta(e.target.value)}
              style={inputStyle}
            >
              <option value="Caldas">Caldas</option>
              <option value="Diviso">Diviso</option>
            </select>
          </div>

          {esDiviso && (
            <div>
              <label style={labelStyle}>Módulo</label>
              <select
                value={modulo}
                onChange={(e) => setModulo(e.target.value)}
                style={inputStyle}
              >
                <option value="Módulo 500">Módulo 500</option>
                <option value="Módulo 150">Módulo 150</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div style={panelStyle}>
        <h3 style={subtituloStyle}>Datos del caso actual</h3>

        <div style={gridStyle}>
          <div>
            <label style={labelStyle}>Caudal a tratar (L/s)</label>
            <input
              type="number"
              value={caudal}
              onChange={(e) => setCaudal(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Turbiedad de agua cruda (UNT)</label>
            <input
              type="number"
              step="0.1"
              value={turbiedad}
              onChange={(e) => setTurbiedad(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>pH de agua cruda</label>
            <input
              type="number"
              step="0.01"
              value={ph}
              onChange={(e) => setPh(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Alcalinidad de agua cruda (mg/L)</label>
            <input
              type="number"
              step="0.1"
              value={alcalinidadCruda}
              onChange={(e) => setAlcalinidadCruda(e.target.value)}
              style={inputStyle}
            />
          </div>

          {esDiviso && (
            <div>
              <label style={labelStyle}>Alcalinidad de agua encalada (mg/L)</label>
              <input
                type="number"
                step="0.1"
                value={alcalinidadEncalada}
                onChange={(e) => setAlcalinidadEncalada(e.target.value)}
                style={inputStyle}
              />
            </div>
          )}

          <div>
            <label style={labelStyle}>Densidad del PAC (g/mL)</label>
            <input
              type="number"
              step="0.01"
              value={densidadPac}
              onChange={(e) => setDensidadPac(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Cantidad de datos históricos</label>
            <input
              type="number"
              min="5"
              max="30"
              value={vecinosDeseados}
              onChange={(e) => setVecinosDeseados(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "18px" }}>
          <button onClick={calcularRecomendacion} style={botonAzul}>
            {cargando ? "Calculando..." : "Calcular rango PAC"}
          </button>
          <button onClick={limpiar} style={botonGris}>Limpiar</button>
          <button onClick={() => setVista("menu")} style={botonGris}>Volver al menú</button>
        </div>
      </div>

      {error && <div style={errorBoxStyle}>{error}</div>}

      {resultado && (
        <>
          <div style={metricGridStyle}>
            <TarjetaMetrica titulo="Casos usados" valor={resultado.n} />
            <TarjetaMetrica titulo="PAC promedio" valor={Number(resultado.pac_promedio).toFixed(1)} />
            <TarjetaMetrica titulo="PAC mínimo" valor={Number(resultado.pac_min).toFixed(1)} />
            <TarjetaMetrica titulo="PAC máximo" valor={Number(resultado.pac_max).toFixed(1)} />
          </div>

          {resultado.tolerancia_usada && (
            <div style={infoBoxStyle}>
              <b>Tolerancias usadas:</b>
              <br />
              Caudal ±{resultado.tolerancia_usada.caudal},
              {" "}Turbiedad ±{resultado.tolerancia_usada.turb},
              {" "}pH ±{resultado.tolerancia_usada.ph},
              {" "}Alcalinidad cruda ±{resultado.tolerancia_usada.alc}
              {"alc_enc" in resultado.tolerancia_usada
                ? `, Alcalinidad encalada ±${resultado.tolerancia_usada.alc_enc}`
                : ""}
            </div>
          )}

          <div style={panelStyle}>
            <h3 style={subtituloStyle}>Dosis sugeridas para 6 jarras</h3>
            <div style={tableWrapStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Jarra</th>
                    <th style={thStyle}>Caudal PAC recomendado (mL/min)</th>
                    <th style={thStyle}>Dosis PAC recomendada (mg/L)</th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.tabla_jarras.map((fila, i) => (
                    <tr key={i}>
                      <td style={tdStyle}>{fila["Jarra"]}</td>
                      <td style={tdStyle}>{fila["Caudal PAC recomendado (mL/min)"]}</td>
                      <td style={tdStyle}>{fila["Dosis PAC recomendada (mg/L)"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={panelStyle}>
            <h3 style={subtituloStyle}>Casos históricos similares</h3>
            <div style={tableWrapStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    {resultado.similares_filtrados.length > 0 &&
                      Object.keys(resultado.similares_filtrados[0]).map((col, i) => (
                        <th key={i} style={thStyle}>{col}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {resultado.similares_filtrados.map((fila, i) => (
                    <tr key={i}>
                      {Object.values(fila).map((valor, j) => (
                        <td key={j} style={tdStyle}>
                          {typeof valor === "number" ? valor.toFixed(3) : valor}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function TarjetaMetrica({ titulo, valor }) {
  return (
    <div style={metricCardStyle}>
      <div style={{ color: "#4f6674", fontWeight: "bold", marginBottom: "10px", fontSize: "0.95rem" }}>
        {titulo}
      </div>
      <div style={{ color: "#0b4f6c", fontWeight: "800", fontSize: "2rem", lineHeight: 1.1 }}>
        {valor}
      </div>
    </div>
  );
}

const badgeStyle = {
  display: "inline-block",
  background: "#d9f2ff",
  color: "#0a4d6a",
  padding: "6px 14px",
  borderRadius: "999px",
  fontWeight: "bold",
  marginBottom: "16px"
};

const panelStyle = {
  background: "linear-gradient(135deg, #eef9ff, #f8fdff)",
  border: "1px solid #dbeaf3",
  borderRadius: "18px",
  padding: "18px",
  marginBottom: "22px"
};

const subtituloStyle = {
  marginTop: 0,
  color: "#0b4f6c",
  marginBottom: "14px"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "16px"
};

const metricGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px",
  marginBottom: "22px"
};

const metricCardStyle = {
  background: "linear-gradient(180deg, #ffffff 0%, #f9fcff 100%)",
  border: "1px solid #dbe8f2",
  padding: "18px",
  borderRadius: "18px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #cfd8e3",
  fontSize: "15px",
  boxSizing: "border-box",
  background: "white"
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#0b4f6c",
  fontWeight: "bold"
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

const errorBoxStyle = {
  background: "#fff1f2",
  border: "1px solid #fecdd3",
  color: "#be123c",
  padding: "14px",
  borderRadius: "12px",
  marginBottom: "18px",
  fontWeight: "bold"
};

const infoBoxStyle = {
  background: "#eef8ff",
  borderLeft: "6px solid #0b4f6c",
  padding: "16px",
  borderRadius: "14px",
  color: "#12384a",
  lineHeight: "1.8",
  marginBottom: "20px"
};

const tableWrapStyle = {
  overflowX: "auto",
  background: "white",
  borderRadius: "18px",
  border: "1px solid #dceaf3",
  boxShadow: "0 4px 14px rgba(0,0,0,0.04)"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "white"
};

const thStyle = {
  background: "#f3faff",
  color: "#0b4f6c",
  padding: "12px",
  border: "1px solid #dceaf3",
  textAlign: "center",
  fontWeight: "bold"
};

const tdStyle = {
  padding: "10px",
  border: "1px solid #dceaf3",
  textAlign: "center"
};

export default RecomendacionPAC;