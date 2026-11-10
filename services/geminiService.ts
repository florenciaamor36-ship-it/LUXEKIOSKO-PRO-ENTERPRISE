import { Product, Sale } from "../types";

// No exponer una clave de proveedor de IA en el bundle del navegador.
export async function getKioskInsights(_products: Product[], _sales: Sale[]) {
  return "El consultor IA está desactivado en esta versión: requiere un backend seguro para proteger la clave del proveedor.";
}
