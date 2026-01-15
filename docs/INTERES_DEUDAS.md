# Sistema de Cálculo de Interés y Amortización en Deudas

## Descripción General
Este sistema implementa dos funcionalidades clave para las deudas:

1. **Cálculo de interés compuesto diario**: El interés se calcula automáticamente cada vez que se consultan las deudas, asegurando que los montos estén siempre actualizados.

2. **Sistema de amortización francesa (cuota fija)**: Calcula automáticamente la cuota mensual que incluye capital + intereses, mostrando el desglose de cada pago y la evolución del saldo pendiente.

## Campos Agregados

### En la Base de Datos (tabla `debts`)
1. **`interest`** (INT) - Tasa de interés anual en porcentaje (ej: 15 para 15%)
2. **`accumulated_interest`** (NUMERIC(15,2)) - Interés acumulado hasta la fecha
3. **`last_interest_calculation`** (DATE) - Última fecha en que se calculó el interés
4. **`total_with_interest`** (campo calculado) - Total de la deuda incluyendo interés acumulado
5. **`monthly_payment`** (NUMERIC(15,2)) - Cuota mensual calculada con amortización
6. **`total_payment`** (NUMERIC(15,2)) - Total a pagar incluyendo intereses
7. **`total_interest`** (NUMERIC(15,2)) - Interés total del préstamo

### En el Modelo TypeScript (`Debt`)
```typescript
interface Debt {
  interest: number;                    // Tasa de interés anual (%)
  accumulated_interest: number;        // Interés acumulado hasta hoy
  total_with_interest: number;         // Total con interés acumulado
  monthly_payment: number;             // Cuota mensual con amortización
  total_payment: number;               // Total a pagar (capital + interés total)
  total_interest: number;              // Interés total del préstamo
  amortization_table: AmortizationRow[]; // Tabla de amortización completa
  last_interest_calculation: string;   // Fecha último cálculo
}

interface AmortizationRow {
  month: number;                      // Número de mes
  payment: number;                    // Cuota del mes
  interest: number;                   // Parte de intereses
  principal: number;                  // Parte de capital
  remainingBalance: number;           // Saldo pendiente
}
```

## Fórmulas de Cálculo

### 1. Interés Diario Acumulado
```
Interés diario = (Tasa anual / 100 / 365) × Principal × Días transcurridos
```

Donde:
- **Tasa anual**: Porcentaje ingresado por el usuario (ej: 15%)
- **Principal**: Monto total original de la deuda (`total_amount`)
- **Días transcurridos**: Días desde el último cálculo de interés

### 2. Amortización Francesa (Cuota Fija)
```
Cuota mensual = P × [i(1+i)^n] / [(1+i)^n - 1]
```

Donde:
- **P** = Principal (monto del préstamo)
- **i** = Tasa de interés mensual (tasa anual / 100 / 12)
- **n** = Número de cuotas (meses)

### 3. Desglose de Cada Cuota
```
Interés del mes = Saldo pendiente × Tasa mensual
Capital del mes = Cuota mensual - Interés del mes
Nuevo saldo = Saldo pendiente - Capital del mes
```

### Ejemplo Práctico 1: Interés Diario
```
Deuda: $1,000,000
Tasa de interés: 15% anual
Días transcurridos: 30 días

Cálculo interés diario:
Interés diario = (15 / 100 / 365) = 0.00041096
Interés 30 días = 0.00041096 × 1,000,000 × 30 = $12,328.77
```

### Ejemplo Práctico 2: Amortización
```
Deuda: $1,000,000
Tasa de interés: 15% anual
Plazo: 12 meses

Cálculo cuota mensual:
Tasa mensual = 15% / 100 / 12 = 0.0125
Cuota = 1,000,000 × [0.0125(1+0.0125)^12] / [(1+0.0125)^12 - 1]
Cuota = $90,258.31 mensuales

Desglose primera cuota:
- Interés: $1,000,000 × 0.0125 = $12,500.00
- Capital: $90,258.31 - $12,500.00 = $77,758.31
- Nuevo saldo: $1,000,000 - $77,758.31 = $922,241.69
```

## Flujo del Sistema

### 1. Creación de Nueva Deuda
- El usuario ingresa la tasa de interés anual en el modal
- El sistema calcula automáticamente:
  - Cuota mensual con amortización francesa
  - Interés total del préstamo
  - Tabla de amortización completa
- El sistema guarda la deuda con:
  - `accumulated_interest = 0`
  - `last_interest_calculation = fecha de inicio`
  - `monthly_payment`, `total_payment`, `total_interest` calculados

### 2. Consulta de Deudas
Cuando se consultan las deudas (`GET /api/debts`):
1. Se obtienen todas las deudas del usuario
2. Para cada deuda, se ejecuta `CALCULATE_ACCUMULATED_INTEREST()`:
   - Calcula días desde el último cálculo
   - Aplica la fórmula de interés diario
   - Actualiza `accumulated_interest` y `last_interest_calculation`
   - Calcula `total_with_interest`
3. Se calcula información de amortización con `CALCULATE_MONTHLY_PAYMENT()` y `GENERATE_AMORTIZATION_TABLE()`
4. Se devuelven las deudas con:
   - Intereses actualizados
   - Cuota mensual calculada
   - Tabla de amortización completa
   - Totales de interés y pagos

### 3. Visualización en la Interfaz
La tarjeta de deuda muestra:

**Información básica:**
- **Tasa de interés**: Porcentaje anual configurado
- **Interés acumulado**: Monto de interés generado hasta la fecha
- **Total con interés**: Suma del principal + interés acumulado
- **Restante con interés**: Saldo pendiente incluyendo intereses

**Información de amortización:**
- **Cuota mensual**: Pago mensual calculado con amortización
- **Interés total préstamo**: Interés que se pagará durante toda la deuda
- **Total a pagar**: Suma de capital + interés total
- **Comparación**: Diferencia entre cuota simple vs cuota con amortización

## Consideraciones Técnicas

### Manejo de Casos Especiales
1. **Tasa de interés 0%**: 
   - No se calculan intereses acumulados
   - Cuota mensual = principal / número de cuotas
   - Tabla de amortización sin componentes de interés

2. **Deudas sin fecha de inicio**: Usa fecha actual como referencia

3. **Valores nulos**: Se convierten a 0 para evitar errores

4. **Días negativos**: No se calcula interés (fecha futura)

5. **Amortización con tasa 0%**: 
   - Cuota constante igual al principal dividido por meses
   - 100% de cada cuota va a capital
   - Interés total = 0

### Optimizaciones
- **Cálculo bajo demanda**: Solo se calcula cuando se consultan las deudas
- **Actualización única**: No se recalcula interés si ya se hizo hoy
- **Caché de amortización**: La tabla de amortización se calcula una vez y se almacena
- **Precisión decimal**: Usa `NUMERIC(15,2)` para valores monetarios
- **Cálculos optimizados**: Uso de fórmulas matemáticas eficientes

## Migración de Datos Existentes
Para deudas existentes antes de implementar este sistema:
1. Se agregan las nuevas columnas con valores por defecto
2. `last_interest_calculation` se establece en `start_date` o fecha actual
3. `accumulated_interest` comienza en 0
4. Para deudas con interés > 0, se calculan automáticamente:
   - `monthly_payment` usando amortización francesa
   - `total_payment` y `total_interest`
   - Tabla de amortización completa

## API Modificada

### Endpoints Actualizados
- **`POST /api/debts`**: Ahora acepta campo `interest` y calcula amortización
- **`GET /api/debts`**: Devuelve deudas con:
  - Interés acumulado calculado
  - Cuota mensual con amortización
  - Tabla de amortización completa
  - Totales de interés y pagos

### Nuevas Funciones en Servicio
```typescript
// Calcula interés acumulado para una deuda específica
CALCULATE_ACCUMULATED_INTEREST(debtId: number)

// Calcula cuota mensual con amortización francesa
CALCULATE_MONTHLY_PAYMENT(principal: number, annualInterestRate: number, months: number)

// Genera tabla de amortización completa
GENERATE_AMORTIZATION_TABLE(principal: number, annualInterestRate: number, months: number)

// Obtiene deudas con interés actualizado y amortización
GET_DEBTS_WITH_UPDATED_INTEREST(username: string)
```

## Beneficios del Sistema de Amortización

### Para el Usuario
1. **Transparencia total**: Ve exactamente cómo se distribuye cada pago
2. **Planificación financiera**: Sabe cuánto pagará en total desde el inicio
3. **Comparación fácil**: Puede comparar diferentes tasas y plazos
4. **Control del endeudamiento**: Entiende el costo real del crédito

### Ventajas sobre Cuota Simple
- **Menor interés total**: La amortización paga capital más rápido
- **Cuota constante**: Facilita la planificación mensual
- **Desglose claro**: Separa capital vs intereses en cada pago
- **Saldo decreciente**: Muestra evolución real de la deuda

## Pruebas Recomendadas

### Escenarios de Prueba - Interés Diario
1. **Deuda sin interés** (0%): Verificar que no se acumule interés
2. **Deuda con interés bajo** (5%): Verificar cálculo correcto
3. **Deuda con interés alto** (30%): Verificar cálculo correcto
4. **Múltiples consultas en mismo día**: Verificar que no se recalcule
5. **Consulta después de varios días**: Verificar interés acumulado

### Escenarios de Prueba - Amortización
6. **Amortización sin interés**: Verificar cuota constante = principal/meses

### Validación de Cálculos
```javascript
// Fórmula de verificación
function verificarInteres(principal, tasaAnual, dias) {
  const interesDiario = (tasaAnual / 100 / 365);
  return principal * interesDiario * dias;
}
```

## Notas de Implementación

### Dependencias
- No requiere nuevas dependencias externas
- Compatible con la estructura existente de PostgreSQL

### Consideraciones de Rendimiento
- El cálculo es O(n) donde n = número de deudas
- Para usuarios con muchas deudas, considerar caché o cálculo por lotes
- Los cálculos son livianos (operaciones aritméticas básicas)

### Seguridad
- Validación de entrada: Solo números positivos para tasas de interés
- Prevención de inyección SQL: Uso de parámetros preparados
- Control de acceso: Solo el propietario puede ver/calcular sus deudas

## Soporte y Mantenimiento

### Monitoreo
- Registrar cálculos fallidos
- Monitorear tiempo de respuesta con/sin cálculo de intereses
- Alertar sobre tasas de interés anómalas (>100%)

### Posibles Mejoras Futuras
1. **Interés compuesto**: Reinvertir interés diariamente
2. **Diferentes frecuencias**: Mensual, trimestral, etc.
3. **Historial de intereses**: Guardar evolución diaria
4. **Simulaciones**: Proyección de interés futuro
5. **Exportación**: Reportes con detalle de intereses

---

*Última actualización: Sistema implementado para cálculo de interés diario basado en tasa anual*