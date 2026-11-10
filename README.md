# LuxeKiosko Pro — prototipo local

Incluye panel, inventario, POS, historial, compras recibidas, lista de proveedores, ajustes de stock, arqueo básico por caja, reportes aproximados y exportación/restauración de respaldo JSON.

## Límites importantes
- Todos los datos quedan en `localStorage` del navegador y equipo actual. No hay sincronización, usuarios, control de acceso ni almacenamiento confiable. Exportá respaldos regularmente.
- No usar todavía como única fuente para caja/inventario de un comercio real. No se ha hecho prueba funcional completa en navegador/dispositivo ni prueba física de impresora.
- Tickets son internos; no son facturas ni comprobantes autorizados por ARCA. No hay integración fiscal.
- Compras se registran como recibidas y aumentan stock; aún no hay pagos a proveedores, cuentas corrientes ni recepción parcial.
- Anular una venta conserva el historial y repone stock, pero la devolución de dinero debe registrarse en caja manualmente.
- Reporte de margen es una estimación con el costo actual, sin impuestos ni gastos.
- Consultor IA permanece desactivado en el cliente hasta crear un backend seguro.

## Desarrollo
Node.js 20+: `npm install` y `npm run build`. GitHub Actions verifica el build para `main` y `zapia/erp-fix`.
