function MenuPrincipal({ setVista, botonAzul, botonVerde }) {
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
          marginBottom: "14px"
        }}
      >
        Menú principal
      </div>

      <h2
        style={{
          marginTop: 0,
          color: "#0b4f6c",
          marginBottom: "8px"
        }}
      >
        Selecciona una herramienta
      </h2>

      <p
        style={{
          color: "#5b7482",
          lineHeight: "1.6",
          marginTop: 0,
          marginBottom: "22px"
        }}
      >
        Accede a los módulos operativos disponibles para apoyo en análisis,
        recomendación de PAC y cálculo de consumo en planta.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
          gap: "22px"
        }}
      >
        <div
          style={{
            background: "linear-gradient(180deg, #ffffff 0%, #f8fcff 100%)",
            border: "1px solid #dbeaf3",
            borderRadius: "22px",
            padding: "24px",
            boxShadow: "0 8px 22px rgba(0,0,0,0.05)"
          }}
        >
          <div
            style={{
              width: "58px",
              height: "58px",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.6rem",
              background: "linear-gradient(135deg, #dbeafe, #eff6ff)",
              marginBottom: "16px"
            }}
          >
            📊
          </div>

          <h3
            style={{
              marginTop: 0,
              marginBottom: "10px",
              color: "#0b4f6c",
              fontSize: "1.25rem"
            }}
          >
            Recomendación PAC
          </h3>

          <p
            style={{
              color: "#5b7482",
              lineHeight: "1.65",
              marginBottom: "20px",
              minHeight: "78px"
            }}
          >
            Consulta datos históricos similares, apoya la selección de dosis y
            visualiza resultados para pruebas de jarras y condiciones actuales
            del agua.
          </p>

          <button
            onClick={() => setVista("recomendacion")}
            style={botonAzul}
          >
            Entrar a recomendación PAC
          </button>
        </div>

        <div
          style={{
            background: "linear-gradient(180deg, #ffffff 0%, #f8fcff 100%)",
            border: "1px solid #dbeaf3",
            borderRadius: "22px",
            padding: "24px",
            boxShadow: "0 8px 22px rgba(0,0,0,0.05)"
          }}
        >
          <div
            style={{
              width: "58px",
              height: "58px",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.6rem",
              background: "linear-gradient(135deg, #dcfce7, #ecfdf5)",
              marginBottom: "16px"
            }}
          >
            🧪
          </div>

          <h3
            style={{
              marginTop: 0,
              marginBottom: "10px",
              color: "#0b4f6c",
              fontSize: "1.25rem"
            }}
          >
            Calculadora PAC
          </h3>

          <p
            style={{
              color: "#5b7482",
              lineHeight: "1.65",
              marginBottom: "20px",
              minHeight: "78px"
            }}
          >
            Calcula consumo de PAC, descenso de altura y altura estimada del
            tanque a partir de uno o varios registros operativos.
          </p>

          <button
            onClick={() => setVista("calculadora")}
            style={botonVerde}
          >
            Entrar a calculadora PAC
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuPrincipal;