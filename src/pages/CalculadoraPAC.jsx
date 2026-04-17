import { useMemo, useState } from "react";

function CalculadoraPAC({ setVista }) {
  const tanques = {
    "TQ1 - 10000": { area: 2.6267, radio: 0.9144 },
    "TQ2 - 10000": { area: 2.6746, radio: 0.9227 },
    "TQ3 - 15000": { area: 3.8484, radio: 1.1068 }
  };

  const [tanque, setTanque] = useState("TQ1 - 10000");
  const [alturaInicial, setAlturaInicial] = useState("2.00");

  const [filas, setFilas] = useState([
    {
      horaInicio: "07:00",
      horaFinal: "08:00",
      caudal: "100",
      densidad: "1.33"
    }
  ]);

  const areaTanque = tanques[tanque].area;
  const radioTanque = tanques[tanque].radio;

  const agregarFila = () => {
    setFilas([
      ...filas,
      {
        horaInicio: "",
        horaFinal: "",
        caudal: "",
        densidad: "1.33"
      }
    ]);
  };

  const eliminarFila = (index) => {
    if (filas.length === 1) {
      alert("Debe quedar al menos una fila.");
      return;
    }

    const nuevas = filas.filter((_, i) => i !== index);
    setFilas(nuevas);
  };

  const limpiarTabla = () => {
    setFilas([
      {
        horaInicio: "07:00",
        horaFinal: "08:00",
        caudal: "100",
        densidad: "1.33"
      }
    ]);
    setAlturaInicial("2.00");
    setTanque("TQ1 - 10000");
  };

  const actualizarFila = (index, campo, valor) => {
    const nuevas = [...filas];
    nuevas[index][campo] = valor;
    setFilas(nuevas);
  };

  const resultados = useMemo(() => {
    const toMinutes = (hora) => {
      if (!hora || !hora.includes(":")) return null;
      const [h, m] = hora.split(":").map(Number);
      if (Number.isNaN(h) || Number.isNaN(m)) return null;
      return h * 60 + m;
    };

    const alturaBase = parseFloat(alturaInicial);
    let alturaAcumulada = Number.isNaN(alturaBase) ? 0 : alturaBase;

    const detalle = filas.map((fila, index) => {
      const inicio = toMinutes(fila.horaInicio);
      const fin = toMinutes(fila.horaFinal);
      const caudal = parseFloat(fila.caudal);
      const densidad = parseFloat(fila.densidad);

      let tiempoMin = 0;
      let consumoG = 0;
      let consumoKg = 0;
      let descensoM = 0;

      const filaValida =
        inicio !== null &&
        fin !== null &&
        !Number.isNaN(caudal) &&
        !Number.isNaN(densidad) &&
        caudal >= 0 &&
        densidad > 0;

      if (filaValida) {
        if (fin >= inicio) {
          tiempoMin = fin - inicio;
        } else {
          tiempoMin = 24 * 60 - inicio + fin;
        }

        consumoG = tiempoMin * caudal * densidad;
        consumoKg = consumoG / 1000;

        const volumenM3 = consumoKg / (densidad * 1000);
        descensoM = volumenM3 / areaTanque;

        alturaAcumulada = Math.max(alturaAcumulada - descensoM, 0);
      }

      return {
        no: index + 1,
        horaInicio: fila.horaInicio || "-",
        horaFinal: fila.horaFinal || "-",
        tiempoMin,
        caudalPac: Number.isNaN(caudal) ? 0 : caudal,
        densidadPac: Number.isNaN(densidad) ? 0 : densidad,
        consumoG,
        consumoKg,
        descensoM,
        alturaEstimada: alturaAcumulada
      };
    });

    const consumoTotalG = detalle.reduce((acc, fila) => acc + fila.consumoG, 0);
    const consumoTotalKg = detalle.reduce((acc, fila) => acc + fila.consumoKg, 0);
    const descensoTotalM = detalle.reduce((acc, fila) => acc + fila.descensoM, 0);

    const alturaActual = Math.max(
      (Number.isNaN(parseFloat(alturaInicial)) ? 0 : parseFloat(alturaInicial)) - descensoTotalM,
      0
    );

    return {
      detalle,
      consumoTotalG,
      consumoTotalKg,
      descensoTotalM,
      alturaActual
    };
  }, [filas, alturaInicial, areaTanque]);

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
      <div
        style={{
          display: "inline-block",
          background: "#d9f2ff",
          color: "#0a4d6a",
          padding: "6px 14px",
          borderRadius: "999px",
          fontWeight: "bold",
          marginBottom: "16px"
        }}
      >
        Calculadora PAC
      </div>

      <h2 style={{ marginTop: 0, color: "#0b4f6c", marginBottom: "8px" }}>
        Consumo y altura de PAC
      </h2>

      <p style={{ color: "#5b7482", lineHeight: "1.6", marginTop: 0 }}>
        El cálculo se actualiza automáticamente al cambiar cualquier dato.
        Si la hora final es menor que la inicial, el sistema asume cruce de medianoche.
      </p>

      <div
        style={{
          background: "linear-gradient(135deg, #eef9ff, #f8fdff)",
          border: "1px solid #dbeaf3",
          borderRadius: "18px",
          padding: "18px",
          marginTop: "18px",
          marginBottom: "20px"
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "16px"
          }}
        >
          <div>
            <label style={labelStyle}>Tanque</label>
            <select
              value={tanque}
              onChange={(e) => setTanque(e.target.value)}
              style={inputStyle}
            >
              {Object.keys(tanques).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Altura inicial del tanque (m)</label>
            <input
              type="number"
              step="0.01"
              value={alturaInicial}
              onChange={(e) => setAlturaInicial(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: "14px",
            padding: "14px",
            borderRadius: "14px",
            background: "#f4fbff",
            color: "#0b4f6c",
            fontWeight: "bold",
            border: "1px solid #dbeaf3"
          }}
        >
          Tanque seleccionado: {tanque} | Radio: {radioTanque.toFixed(4)} m | Área: {areaTanque.toFixed(4)} m²
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "18px"
        }}
      >
        <button onClick={agregarFila} style={botonAzul}>
          Agregar fila
        </button>

        <button onClick={limpiarTabla} style={botonGris}>
          Limpiar tabla
        </button>

        <button onClick={() => setVista("menu")} style={botonGris}>
          Volver al menú
        </button>
      </div>

      <div
        style={{
          overflowX: "auto",
          background: "white",
          borderRadius: "18px",
          border: "1px solid #dceaf3",
          boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
          marginBottom: "22px"
        }}
      >
        <table style={tablaStyle}>
          <thead>
            <tr>
              <th style={thStyle}>No.</th>
              <th style={thStyle}>Hora inicio</th>
              <th style={thStyle}>Hora final</th>
              <th style={thStyle}>Caudal PAC (mL/min)</th>
              <th style={thStyle}>Densidad PAC (g/mL)</th>
              <th style={thStyle}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((fila, index) => (
              <tr key={index}>
                <td style={tdStyle}>{index + 1}</td>

                <td style={tdStyle}>
                  <input
                    type="time"
                    value={fila.horaInicio}
                    onChange={(e) =>
                      actualizarFila(index, "horaInicio", e.target.value)
                    }
                    style={inputTablaStyle}
                  />
                </td>

                <td style={tdStyle}>
                  <input
                    type="time"
                    value={fila.horaFinal}
                    onChange={(e) =>
                      actualizarFila(index, "horaFinal", e.target.value)
                    }
                    style={inputTablaStyle}
                  />
                </td>

                <td style={tdStyle}>
                  <input
                    type="number"
                    step="0.1"
                    value={fila.caudal}
                    onChange={(e) =>
                      actualizarFila(index, "caudal", e.target.value)
                    }
                    style={inputTablaStyle}
                  />
                </td>

                <td style={tdStyle}>
                  <input
                    type="number"
                    step="0.01"
                    value={fila.densidad}
                    onChange={(e) =>
                      actualizarFila(index, "densidad", e.target.value)
                    }
                    style={inputTablaStyle}
                  />
                </td>

                <td style={tdStyle}>
                  <button
                    onClick={() => eliminarFila(index)}
                    style={botonEliminar}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "24px"
        }}
      >
        <TarjetaMetrica
          titulo="Consumo total (g)"
          valor={resultados.consumoTotalG.toFixed(2)}
        />
        <TarjetaMetrica
          titulo="Consumo total (kg)"
          valor={resultados.consumoTotalKg.toFixed(4)}
        />
        <TarjetaMetrica
          titulo="Descenso total (m)"
          valor={resultados.descensoTotalM.toFixed(4)}
        />
        <TarjetaMetrica
          titulo="Altura actual estimada (m)"
          valor={resultados.alturaActual.toFixed(4)}
        />
      </div>

      <h3 style={{ color: "#0b4f6c", marginBottom: "12px" }}>
        Detalle por registro
      </h3>

      <div
        style={{
          overflowX: "auto",
          background: "white",
          borderRadius: "18px",
          border: "1px solid #dceaf3",
          boxShadow: "0 4px 14px rgba(0,0,0,0.04)"
        }}
      >
        <table style={tablaStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Consumo No.</th>
              <th style={thStyle}>Hora inicio</th>
              <th style={thStyle}>Hora final</th>
              <th style={thStyle}>Tiempo (min)</th>
              <th style={thStyle}>Caudal PAC (mL/min)</th>
              <th style={thStyle}>Densidad PAC (g/mL)</th>
              <th style={thStyle}>Consumo (g)</th>
              <th style={thStyle}>Consumo (kg)</th>
              <th style={thStyle}>Descenso altura (m)</th>
              <th style={thStyle}>Altura estimada (m)</th>
            </tr>
          </thead>
          <tbody>
            {resultados.detalle.map((fila) => (
              <tr key={fila.no}>
                <td style={tdStyle}>{fila.no}</td>
                <td style={tdStyle}>{fila.horaInicio}</td>
                <td style={tdStyle}>{fila.horaFinal}</td>
                <td style={tdStyle}>{fila.tiempoMin.toFixed(1)}</td>
                <td style={tdStyle}>{fila.caudalPac.toFixed(1)}</td>
                <td style={tdStyle}>{fila.densidadPac.toFixed(2)}</td>
                <td style={tdStyle}>{fila.consumoG.toFixed(2)}</td>
                <td style={tdStyle}>{fila.consumoKg.toFixed(4)}</td>
                <td style={tdStyle}>{fila.descensoM.toFixed(4)}</td>
                <td style={tdStyle}>{fila.alturaEstimada.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: "22px",
          background: "#eef8ff",
          borderLeft: "6px solid #0b4f6c",
          padding: "16px",
          borderRadius: "14px",
          color: "#12384a",
          lineHeight: "1.8"
        }}
      >
        <b>Resumen final:</b>
        <br />
        Tanque: {tanque}
        <br />
        Área del tanque: {areaTanque.toFixed(4)} m²
        <br />
        Altura inicial: {(parseFloat(alturaInicial) || 0).toFixed(2)} m
        <br />
        Descenso total de altura: {resultados.descensoTotalM.toFixed(4)} m
        <br />
        Altura actual estimada: {resultados.alturaActual.toFixed(4)} m
      </div>

      <div
        style={{
          marginTop: "16px",
          background: "#f8fcff",
          borderLeft: "6px solid #2563eb",
          padding: "16px",
          borderRadius: "14px",
          color: "#12384a",
          lineHeight: "1.8"
        }}
      >
        <b>Fórmulas usadas:</b>
        <br />
        Tiempo (min) = Hora final - Hora inicio
        <br />
        Si Hora final es menor que Hora inicio, se asume cruce de medianoche.
        <br />
        Consumo (g) = Tiempo (min) × Caudal PAC (mL/min) × Densidad (g/mL)
        <br />
        Consumo (kg) = Consumo (g) / 1000
        <br />
        Descenso de altura (m) = [Consumo (kg) / (Densidad × 1000)] / Área
      </div>
    </div>
  );
}

function TarjetaMetrica({ titulo, valor }) {
  return (
    <div
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f9fcff 100%)",
        border: "1px solid #dbe8f2",
        padding: "18px",
        borderRadius: "18px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
      }}
    >
      <div
        style={{
          color: "#4f6674",
          fontWeight: "bold",
          marginBottom: "10px",
          fontSize: "0.95rem"
        }}
      >
        {titulo}
      </div>

      <div
        style={{
          color: "#0b4f6c",
          fontWeight: "800",
          fontSize: "2rem",
          lineHeight: 1.1
        }}
      >
        {valor}
      </div>
    </div>
  );
}

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

const botonEliminar = {
  padding: "8px 12px",
  background: "linear-gradient(135deg, #dc2626, #ef4444)",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 6px 12px rgba(220,38,38,0.18)"
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

const inputTablaStyle = {
  width: "100%",
  padding: "8px",
  borderRadius: "8px",
  border: "1px solid #dbe3ea",
  fontSize: "14px",
  boxSizing: "border-box",
  background: "white"
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#0b4f6c",
  fontWeight: "bold"
};

const tablaStyle = {
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

export default CalculadoraPAC;