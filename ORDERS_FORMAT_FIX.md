# 🛠️ Corrección del Formato de Órdenes/Pedidos

## ❌ Problema Identificado

El frontend estaba enviando un formato incorrecto al orders-service, causando **error 422 (Unprocessable Entity)**.

### Formato Anterior (Incorrecto)
```json
{
  "customer_id": "cliente-123",
  "shippingAddress": "Dirección...",
  "items": [
    {
      "sku": "PROD001",
      "name": "Producto",
      "unitPrice": 100.00,
      "qty": 2
    }
  ],
  "totals": {
    "subtotal": 200.00,
    "shipping": 10.00,
    "total": 210.00
  }
}
```

### Formato Nuevo (Correcto según orders-service)
```json
{
  "customer_id": "cliente-123",
  "created_by_role": "vendedor", // o "cliente"
  "source": "mobile-ventas",     // o "mobile-clientes"
  "items": [
    {
      "sku": "PROD001",
      "qty": 2
    }
  ]
}
```

## ✅ Cambios Realizados

### 1. **App de Ventas** (`/ventas/`)

**Archivo:** `hooks/useCreateOrder.ts`
- ✅ Actualizado `CreateOrderPayload` type
- ✅ Removidos campos innecesarios: `name`, `unitPrice`, `shippingAddress`, `totals`
- ✅ Agregados campos requeridos: `created_by_role: "vendedor"`, `source: "mobile-ventas"`
- ✅ Simplificados items: solo `sku` y `qty`

**Archivo:** `app/pedido/carrito.tsx`
- ✅ Payload ajustado al nuevo formato
- ✅ Campos requeridos incluidos correctamente

### 2. **App de Clientes** (`/clientes/`)

**Archivo:** `hooks/useCreateOrder.ts`
- ✅ Actualizado `CreateOrderPayload` type
- ✅ Removidos campos innecesarios: `name`, `unitPrice`, `shippingAddress`, `totals`
- ✅ Agregados campos requeridos: `created_by_role: "cliente"`, `source: "mobile-clientes"`
- ✅ Simplificados items: solo `sku` y `qty`

**Archivo:** `app/carrito.tsx`
- ✅ Payload ajustado al nuevo formato
- ✅ Campos requeridos incluidos correctamente

## 📋 Esquema Final del Orders-Service

Según el análisis del código backend, el orders-service espera:

```python
# schemas.py
class CreateOrderRequest:
    customer_id: str              # ✅ ID del cliente
    created_by_role: str         # ✅ "vendedor" | "cliente" 
    source: str                  # ✅ "mobile-ventas" | "mobile-clientes"
    items: List[OrderItem]       # ✅ Lista de items

class OrderItem:
    sku: str                     # ✅ Código del producto
    qty: int                     # ✅ Cantidad
```

## 🔧 Campos Específicos por App

### App de Ventas
```typescript
{
  customer_id: string,
  created_by_role: "vendedor",
  source: "mobile-ventas",
  items: [{ sku: string, qty: number }]
}
```

### App de Clientes  
```typescript
{
  customer_id: string,
  created_by_role: "cliente", 
  source: "mobile-clientes",
  items: [{ sku: string, qty: number }]
}
```

## 🎯 Resultado Esperado

- ✅ **Error 422 resuelto**: El formato ahora coincide con el esquema del orders-service
- ✅ **Validación exitosa**: Pydantic aceptará los campos requeridos
- ✅ **Consistencia**: Ambas apps usan el formato correcto
- ✅ **Simplicidad**: Removidos campos innecesarios que causaban confusión

## 🧪 Pruebas Recomendadas

1. **Crear pedido desde app de ventas**: Verificar que no aparezca error 422
2. **Crear pedido desde app de clientes**: Verificar que no aparezca error 422  
3. **Revisar logs del orders-service**: Confirmar que recibe el formato correcto
4. **Verificar respuesta**: El orders-service debe retornar el ID de la orden creada

---

**Estado:** ✅ **CORREGIDO** - Ambas aplicaciones ahora envían el formato correcto al orders-service