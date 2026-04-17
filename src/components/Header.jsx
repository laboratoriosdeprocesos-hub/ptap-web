function Header({ nombreUsuario, onCerrarSesion }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #83b3cf 0%, #64bda7 55%, #9d9dc4 100%)",
        color: "white",
        padding: "22px 24px",
        boxShadow: "0 6px 22px rgba(110, 49, 49, 0.12)"
      }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap"
        }}
      >
        <div style={{ minWidth: "280px", flex: 1 }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.16)",
              padding: "6px 12px",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: "bold",
              marginBottom: "12px",
              border: "1px solid rgba(255,255,255,0.18)"
            }}
          >
            SERVAF · Plataforma operativa
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(1.6rem, 2.8vw, 2.5rem)",
              lineHeight: 1.2,
              fontWeight: "1000"
            }}
          >
            Herramienta de apoyo para PTAP Diviso y Caldas 💧
          </h1>

          <p
            style={{
              margin: "10px 0 0 0",
              color: "rgba(238, 238, 241, 0.92)",
              lineHeight: 1.8,
              maxWidth: "760px",
              fontSize: "0.98rem"
            }}
          >
            Sistema para apoyo en recomendación de PAC, cálculo de consumo,
            seguimiento operativo y análisis de datos de planta.
          </p>
        </div>

        <div
          style={{
            background: "rgba(201, 166, 166, 0.14)",
            border: "1px solid rgba(255,255,255,0.22)",
            borderRadius: "18px",
            padding: "14px 16px",
            minWidth: "240px",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)"
          }}
        >
          <div
            style={{
              fontSize: "13px",
              opacity: 0.9,
              marginBottom: "6px"
            }}
          >
            Sesión activa
          </div>

          <div
            style={{
              fontWeight: "700",
              fontSize: "1rem",
              marginBottom: "12px"
            }}
          >
            {nombreUsuario}
          </div>

          <button
            onClick={onCerrarSesion}
            style={{
              width: "100%",
              padding: "10px 14px",
              background: "linear-gradient(135deg, #ffffff, #eef4ff)",
              color: "#273236",
              border: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 6px 14px rgba(0,0,0,0.10)"
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;