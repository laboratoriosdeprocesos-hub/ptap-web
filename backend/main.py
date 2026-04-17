from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
from typing import Optional
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import NearestNeighbors

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

CONFIGS = {
    "Caldas": {
        "archivo": DATA_DIR / "2026 PTAP CALDAS.xlsx",
        "nombre_app": "PTAP Caldas",
        "usa_alcalinidad_encalada": False
    },
    "Diviso - Modulo 500": {
        "archivo": DATA_DIR / "2026 PTAP DIVISO.xlsx",
        "nombre_app": "PTAP Diviso - Módulo 500",
        "usa_alcalinidad_encalada": True
    },
    "Diviso - Modulo 150": {
        "archivo": DATA_DIR / "2026 PTAP DIVISO.xlsx",
        "nombre_app": "PTAP Diviso - Módulo 150",
        "usa_alcalinidad_encalada": True
    }
}


class DatosPAC(BaseModel):
    planta: str
    modulo: Optional[str] = None
    caudal: float
    turbiedad: float
    ph: float
    alcalinidad_cruda: float
    alcalinidad_encalada: Optional[float] = None
    densidad_pac: float
    vecinos_deseados: int = 8


@app.get("/")
def home():
    return {"mensaje": "Backend PAC funcionando"}


def limpiar_columna_numerica(serie):
    return pd.to_numeric(
        serie.astype(str)
        .str.strip()
        .str.replace(" ", "", regex=False)
        .str.replace(",,", ",", regex=False)
        .str.replace(",", ".", regex=False),
        errors="coerce"
    )


def obtener_nombre_columna(df, candidatos):
    for col in candidatos:
        if col in df.columns:
            return col
    raise ValueError(f"No encontré ninguna de estas columnas: {candidatos}")


def resolver_config_key(planta: str, modulo: Optional[str]) -> str:
    if planta == "Caldas":
        return "Caldas"

    if planta == "Diviso":
        if modulo == "Módulo 500":
            return "Diviso - Modulo 500"
        if modulo == "Módulo 150":
            return "Diviso - Modulo 150"

    raise ValueError("Planta o módulo no válidos.")


def cargar_y_limpiar_excel(config_key: str):
    config = CONFIGS[config_key]
    archivo_excel = config["archivo"]

    if not archivo_excel.exists():
        raise FileNotFoundError(f"No encontré el archivo: {archivo_excel}")

    df = pd.read_excel(archivo_excel)

    if config_key == "Caldas":
        col_caudal = obtener_nombre_columna(df, [
            "Caudal A tratar (L/s)"
        ])
        col_turbiedad = obtener_nombre_columna(df, [
            "Turbiedad de agua cruda (UNT)"
        ])
        col_ph = obtener_nombre_columna(df, [
            "pH de agua cruda (Unid)",
            "pH de agua cruda"
        ])
        col_alcalinidad_cruda = obtener_nombre_columna(df, [
            "Alcalinidad de agua cruda (mg/L)"
        ])
        col_pac = obtener_nombre_columna(df, [
            "Caudal de dosificación del PAC (mL/min)"
        ])

        rename_map = {
            col_caudal: "caudal",
            col_turbiedad: "turbiedad",
            col_ph: "ph",
            col_alcalinidad_cruda: "alcalinidad_cruda",
            col_pac: "pac_ml_min",
        }

    else:
        if config_key == "Diviso - Modulo 500":
            col_caudal = obtener_nombre_columna(df, [
                "Caudal A tratar módulo de 500 (L/s)",
                "Caudal A tratar modulo de 500 (L/s)",
                "Caudal A tratar módulo 500 (L/s)",
                "Caudal A tratar modulo 500 (L/s)"
            ])
            col_pac = obtener_nombre_columna(df, [
                "Caudal de dosificación del PAC módulo de 500 (mL/min)",
                "Caudal de dosificacion del PAC modulo de 500 (mL/min)",
                "Caudal de dosificación del PAC módulo 500 (mL/min)",
                "Caudal de dosificacion del PAC modulo 500 (mL/min)"
            ])
        else:
            col_caudal = obtener_nombre_columna(df, [
                "Caudal A tratar módulo de 150 (L/s)",
                "Caudal A tratar modulo de 150 (L/s)",
                "Caudal A tratar módulo 150 (L/s)",
                "Caudal A tratar modulo 150 (L/s)"
            ])
            col_pac = obtener_nombre_columna(df, [
                "Caudal de dosificación del PAC módulo de 150 (mL/min)",
                "Caudal de dosificacion del PAC modulo de 150 (mL/min)",
                "Caudal de dosificación del PAC módulo 150 (mL/min)",
                "Caudal de dosificacion del PAC modulo 150 (mL/min)"
            ])

        col_turbiedad = obtener_nombre_columna(df, [
            "Turbiedad de agua cruda (UNT)",
            "Turbiedad de agua cruda (UNT).1"
        ])
        col_ph = obtener_nombre_columna(df, [
            "pH de agua cruda (Unid)",
            "pH de agua cruda"
        ])
        col_alcalinidad_cruda = obtener_nombre_columna(df, [
            "Alcalinidad de agua cruda (mg/L)"
        ])
        col_alcalinidad_encalada = obtener_nombre_columna(df, [
            "Alcalinidad de agua encalada (mg/L)",
            "Alcalinidad de agua encalda (mg/L)"
        ])

        rename_map = {
            col_caudal: "caudal",
            col_turbiedad: "turbiedad",
            col_ph: "ph",
            col_alcalinidad_cruda: "alcalinidad_cruda",
            col_alcalinidad_encalada: "alcalinidad_encalada",
            col_pac: "pac_ml_min",
        }

    df = df.rename(columns=rename_map)

    columnas_numericas = ["caudal", "turbiedad", "ph", "alcalinidad_cruda", "pac_ml_min"]

    if config["usa_alcalinidad_encalada"]:
        columnas_numericas.append("alcalinidad_encalada")

    for col in columnas_numericas:
        df[col] = limpiar_columna_numerica(df[col])

    df = df.dropna(subset=columnas_numericas).copy()
    return df


def cargar_cache_excels():
    cache = {}
    for key in CONFIGS.keys():
        cache[key] = cargar_y_limpiar_excel(key)
    return cache


DF_CACHE = cargar_cache_excels()


def obtener_tolerancias(config_key):
    if config_key == "Caldas":
        return [
            {"caudal": 15, "turb": 8, "ph": 0.15, "alc": 5},
            {"caudal": 25, "turb": 15, "ph": 0.25, "alc": 8},
            {"caudal": 40, "turb": 25, "ph": 0.35, "alc": 12},
        ]
    return [
        {"caudal": 20, "turb": 5, "ph": 0.20, "alc": 6, "alc_enc": 6},
        {"caudal": 35, "turb": 10, "ph": 0.30, "alc": 10, "alc_enc": 10},
        {"caudal": 60, "turb": 20, "ph": 0.45, "alc": 15, "alc_enc": 15},
        {"caudal": 90, "turb": 30, "ph": 0.60, "alc": 20, "alc_enc": 20},
    ]


def calcular_rango_pac(
    df: pd.DataFrame,
    config_key: str,
    caudal: float,
    turbiedad: float,
    ph: float,
    alcalinidad_cruda: float,
    densidad_pac: float,
    vecinos_deseados: int,
    alcalinidad_encalada: float = None
):
    config = CONFIGS[config_key]

    variables = ["caudal", "turbiedad", "ph", "alcalinidad_cruda"]

    nuevo_dict = {
        "caudal": caudal,
        "turbiedad": turbiedad,
        "ph": ph,
        "alcalinidad_cruda": alcalinidad_cruda
    }

    if config["usa_alcalinidad_encalada"]:
        variables.append("alcalinidad_encalada")
        nuevo_dict["alcalinidad_encalada"] = alcalinidad_encalada

    nuevo = pd.DataFrame([nuevo_dict])

    df_base = pd.DataFrame()
    tolerancia_usada = None
    intentos = obtener_tolerancias(config_key)

    for tol in intentos:
        filtro = (
            df["caudal"].between(caudal - tol["caudal"], caudal + tol["caudal"]) &
            df["turbiedad"].between(turbiedad - tol["turb"], turbiedad + tol["turb"]) &
            df["ph"].between(ph - tol["ph"], ph + tol["ph"]) &
            df["alcalinidad_cruda"].between(alcalinidad_cruda - tol["alc"], alcalinidad_cruda + tol["alc"])
        )

        if config["usa_alcalinidad_encalada"]:
            filtro = filtro & df["alcalinidad_encalada"].between(
                alcalinidad_encalada - tol["alc_enc"],
                alcalinidad_encalada + tol["alc_enc"]
            )

        df_base = df[filtro].copy()

        if len(df_base) >= 5:
            tolerancia_usada = tol
            break

    if len(df_base) < 5:
        return {
            "ok": False,
            "mensaje": "Muy pocos datos después del prefiltro, incluso ampliando tolerancias."
        }

    scaler = StandardScaler()
    X_hist = scaler.fit_transform(df_base[variables])
    X_new = scaler.transform(nuevo[variables])

    if config["usa_alcalinidad_encalada"]:
        pesos = np.array([3, 4, 3, 2, 2], dtype=float)
    else:
        pesos = np.array([3, 4, 3, 2], dtype=float)

    X_hist = X_hist * pesos
    X_new = X_new * pesos

    n_neighbors = min(vecinos_deseados, len(df_base))
    knn = NearestNeighbors(n_neighbors=n_neighbors)
    knn.fit(X_hist)
    distancias, indices = knn.kneighbors(X_new)

    similares = df_base.iloc[indices[0]].copy()
    similares["distancia"] = distancias[0]
    similares = similares.sort_values("distancia")

    q1 = similares["pac_ml_min"].quantile(0.25)
    q3 = similares["pac_ml_min"].quantile(0.75)
    iqr = q3 - q1

    lim_inf = q1 - 1.5 * iqr
    lim_sup = q3 + 1.5 * iqr

    similares_filtrados = similares[
        (similares["pac_ml_min"] >= lim_inf) &
        (similares["pac_ml_min"] <= lim_sup)
    ].copy()

    if len(similares_filtrados) < 3:
        similares_filtrados = similares.copy()

    pac_min = float(similares_filtrados["pac_ml_min"].min())
    pac_max = float(similares_filtrados["pac_ml_min"].max())
    pac_promedio = float(similares_filtrados["pac_ml_min"].mean())
    n = int(len(similares_filtrados))

    jarras_recomendadas = np.round(np.linspace(pac_min, pac_max, 6), 1)
    dosis_mgL = np.round((jarras_recomendadas * densidad_pac * 1000) / (60 * caudal), 2)

    tabla_jarras = pd.DataFrame({
        "Jarra": [1, 2, 3, 4, 5, 6],
        "Caudal PAC recomendado (mL/min)": jarras_recomendadas,
        "Dosis PAC recomendada (mg/L)": dosis_mgL
    })

    columnas_mostrar = ["caudal", "turbiedad", "ph", "alcalinidad_cruda"]

    if config["usa_alcalinidad_encalada"]:
        columnas_mostrar.append("alcalinidad_encalada")

    columnas_mostrar += ["pac_ml_min", "distancia"]

    similares_filtrados = similares_filtrados[columnas_mostrar].copy()

    nombres_mostrar = {
        "caudal": "Caudal a tratar (L/s)",
        "turbiedad": "Turbiedad de agua cruda (UNT)",
        "ph": "pH de agua cruda",
        "alcalinidad_cruda": "Alcalinidad de agua cruda (mg/L)",
        "alcalinidad_encalada": "Alcalinidad de agua encalada (mg/L)",
        "pac_ml_min": "Caudal PAC (mL/min)",
        "distancia": "Distancia"
    }

    similares_filtrados = similares_filtrados.rename(columns=nombres_mostrar)

    return {
        "ok": True,
        "pac_min": pac_min,
        "pac_max": pac_max,
        "pac_promedio": pac_promedio,
        "n": n,
        "tabla_jarras": tabla_jarras.to_dict(orient="records"),
        "similares_filtrados": similares_filtrados.to_dict(orient="records"),
        "tolerancia_usada": tolerancia_usada
    }


@app.post("/recomendar")
def recomendar(datos: DatosPAC):
    try:
        config_key = resolver_config_key(datos.planta, datos.modulo)

        if CONFIGS[config_key]["usa_alcalinidad_encalada"] and datos.alcalinidad_encalada is None:
            raise HTTPException(
                status_code=400,
                detail="Debes enviar alcalinidad_encalada para Diviso."
            )

        df = DF_CACHE[config_key].copy()

        resultado = calcular_rango_pac(
            df=df,
            config_key=config_key,
            caudal=datos.caudal,
            turbiedad=datos.turbiedad,
            ph=datos.ph,
            alcalinidad_cruda=datos.alcalinidad_cruda,
            densidad_pac=datos.densidad_pac,
            vecinos_deseados=datos.vecinos_deseados,
            alcalinidad_encalada=datos.alcalinidad_encalada
        )

        if not resultado["ok"]:
            raise HTTPException(status_code=400, detail=resultado["mensaje"])

        return resultado

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))