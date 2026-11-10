# LuxeKiosko Pro — prototipo web

Prototipo de gestión para kiosco/retail con panel, productos, punto de venta, historial y terminales. Incluye un build web verificable mediante GitHub Actions.

## Estado y límites
- Los datos se guardan solo en `localStorage` del navegador usado. No hay backend ni sincronización entre equipos/usuarios: no usar como registro único de caja/stock sin copias de seguridad.
- Esta rama valida stock antes de cerrar una venta y corrige el build automatizado.
- No es todavía un ERP completo: faltan compras/proveedores, contabilidad, facturación fiscal argentina, usuarios/permisos, auditoría y almacenamiento central.
- El consultor IA está desactivado en el cliente para evitar exponer credenciales. Para reactivarlo se necesita un backend seguro.
- La impresión de tickets es visual; no constituye factura fiscal ni comprobante autorizado por ARCA.

## Desarrollo
Requiere Node.js 20 o superior.

```sh
npm install
npm run build
```

GitHub Actions corre el mismo build al enviar cambios a `main` o `zapia/erp-fix` y publica `dist/` como artefacto.
