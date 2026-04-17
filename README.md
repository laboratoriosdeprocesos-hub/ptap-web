# PTAP - Sistema de Recomendación de PAC

Aplicación web para calcular y recomendar dosis de PAC (Policloruro de Aluminio) en plantas de tratamiento de agua, basada en datos históricos.

## 🚀 Tecnologías usadas

- Frontend: React + Vite
- Backend: FastAPI (Python)
- Despliegue:
  - Frontend: Vercel
  - Backend: Render

## 📊 Funcionalidades

- Selección de planta
- Ingreso de datos del agua:
  - Caudal
  - Turbiedad
  - pH
  - Alcalinidad
- Búsqueda de casos históricos similares
- Cálculo de:
  - PAC promedio
  - PAC mínimo y máximo
- Generación de dosis sugeridas

## 🔗 Demo

Frontend:  
https://ptap-web.vercel.app  

Backend:  
https://ptap-backend.onrender.com  

## ⚙️ Para correr local

### Frontend
```bash
npm install
npm run dev

### Backend
```bash
cd backend
python -m uvicorn main:app --reload