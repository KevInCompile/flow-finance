# Generación Automática de Pagos para Deudas con Fecha de Inicio en el Pasado

## Descripción

Esta funcionalidad permite que al crear una nueva deuda con una fecha de inicio en el pasado, el sistema genere automáticamente los registros de pagos correspondientes a las cuotas que ya deberían haberse pagado. Además, se ha mejorado el sistema de pagos para incluir un desglose detallado entre capital e intereses.

## Cambios Realizados

### 1. Modificación de la Tabla `payments`

Se agregaron dos nuevas columnas a la tabla `payments`:

- `capital_paid` (NUMERIC(15, 2)): Monto del pago aplicado al capital/principal
- `interest_paid` (NUMERIC(15, 2)): Monto del pago aplicado a intereses

**Restricción**: La suma de `capital_paid + interest_paid` debe ser igual a `pay_value`.

### 2. Migración SQL

Se creó la migración `002_add_payment_details.sql` que:
- Agrega las nuevas columnas a la tabla existente
- Establece valores por defecto (0)
- Agrega una restricción CHECK para validar la integridad de los datos

### 3. Servicio de Deudas (`debts.service.ts`)

#### Nueva Función: `GENERATE_AUTOMATIC_PAYMENTS`
Genera pagos automáticos para cuotas vencidas cuando se crea una deuda con fecha de inicio en el pasado.

**Parámetros:**
- `debtId`: ID de la deuda
- `principal`: Monto principal del préstamo
- `annualInterestRate`: Tasa de interés anual (%)
- `installments`: Número total de cuotas
- `startDate`: Fecha de inicio del préstamo
- `payDay`: Día del mes para pagos (1-31)
- `dueInstallments`: Número de cuotas vencidas

**Lógica:**
1. Calcula la tabla de amortización completa
2. Genera las fechas de pago para cada cuota
3. Para cada cuota vencida:
   - Calcula interés y capital correspondientes
   - Inserta un registro en `payments` con tipo "automatic"
   - Registra el desglose entre capital e intereses

#### Modificación de `INSERT_DEBTS`
Ahora es una función asíncrona que:
1. Inserta la deuda en la base de datos
2. Verifica si la fecha de inicio es en el pasado
3. Calcula cuántas cuotas están vencidas
4. Si hay cuotas vencidas, llama a `GENERATE_AUTOMATIC_PAYMENTS`

#### Mejoras en `CALCULATE_ACCUMULATED_INTEREST`
- Ahora considera el desglose de pagos (capital vs intereses)
- Calcula el interés acumulado restando el interés ya pagado
- Mejor manejo de cuotas vencidas

#### Mejoras en `GET_DEBTS_WITH_UPDATED_INTEREST`
- Incluye información detallada de pagos
- Proporciona resumen de pagos (capital pagado, intereses pagados, saldos pendientes)

### 4. Servicio de Pagos (`payments.service.ts`)

#### Modificación de `INSERT_PAYMENTS`
Ahora acepta parámetros opcionales:
- `capitalPaid`: Monto aplicado a capital
- `interestPaid`: Monto aplicado a intereses

Si no se proporcionan estos valores, el sistema los calcula automáticamente.

### 5. Ruta de Pagos (`payments/route.ts`)

#### Nueva Función: `calculatePaymentBreakdown`
Calcula la distribución óptima entre capital e intereses para un pago manual.

**Lógica:**
1. Obtiene información de la deuda y pagos anteriores
2. Calcula el saldo pendiente de capital
3. Calcula interés acumulado desde el último pago
4. Distribuye el pago: primero intereses acumulados, luego capital

## Flujo de Trabajo

### Creación de Deuda con Fecha Pasada

1. **Usuario crea una deuda** con fecha de inicio en el pasado
   - Ejemplo: Hoy es enero 2026, fecha de inicio es noviembre 2025

2. **Sistema detecta fecha pasada**
   - Calcula días desde la fecha de inicio
   - Determina cuántas cuotas están vencidas

3. **Generación de pagos automáticos**
   - Para cada cuota vencida:
     - Calcula fecha de pago correspondiente
     - Calcula distribución capital/intereses según tabla de amortización
     - Crea registro en `payments` con tipo "automatic"

4. **Resultado final**
   - La deuda se crea con estado actualizado
   - Los pagos vencidos aparecen como realizados
   - El saldo pendiente refleja solo las cuotas futuras

### Ejemplo Práctico

**Parámetros de entrada:**
- Monto: $1,200
- Interés: 12% anual
- Cuotas: 12
- Fecha inicio: 15 octubre 2025
- Día pago: 15 de cada mes
- Fecha actual: 15 enero 2026

**Resultado:**
- Cuotas vencidas: 3 (nov, dic, ene)
- Se generan 3 pagos automáticos
- Cada pago incluye desglose capital/intereses
- Saldo pendiente: 9 cuotas futuras

## Beneficios

1. **Precisión histórica**: Las deudas registradas tardíamente reflejan correctamente el estado real de pagos.

2. **Transparencia financiera**: Desglose detallado entre capital e intereses en cada pago.

3. **Automatización**: Reduce errores manuales al calcular pagos vencidos.

4. **Consistencia**: Todos los cálculos siguen la tabla de amortización francesa.

5. **Auditoría**: Registro completo de todos los pagos, automáticos y manuales.

## Consideraciones Técnicas

### Migración de Datos Existentes
Para pagos existentes sin desglose:
- `capital_paid` se establece en `pay_value`
- `interest_paid` se establece en 0
- Se recomienda una migración manual para datos históricos precisos

### Validaciones
- La suma de `capital_paid + interest_paid` debe igualar `pay_value`
- No se permiten valores negativos
- Los pagos automáticos tienen tipo "automatic"

### Rendimiento
- Los cálculos de amortización son eficientes (O(n))
- Las consultas incluyen índices apropiados
- El sistema maneja correctamente fechas límite (ej: día 31 en febrero)

## Pruebas

Se incluye un archivo de prueba (`test-debt-past-date.js`) que valida:
- Cálculo correcto de cuotas vencidas
- Distribución precisa entre capital e intereses
- Generación de fechas de pago
- Casos límite (sin interés, fecha futura, etc.)

## Ejecución de Migraciones

Para aplicar los cambios a la base de datos:

```bash
# Ejecutar el script de migraciones
node src/app/api/libs/migrations/run-migrations.ts
```

O integrar en el proceso de despliegue existente.

## Soporte y Mantenimiento

### Monitoreo
- Verificar que los pagos automáticos se generen correctamente
- Revisar la consistencia de datos (sumas capital + interés = valor pago)
- Monitorear el cálculo de intereses acumulados

### Solución de Problemas
1. **Pagos no generados**: Verificar fecha de inicio vs fecha actual
2. **Cálculos incorrectos**: Validar parámetros de entrada (interés, cuotas)
3. **Errores de constraint**: Asegurar que capital_paid + interest_paid = pay_value

## Futuras Mejoras

1. **Interfaz de usuario**: Mostrar desglose capital/intereses en la UI
2. **Reportes**: Generar reportes detallados de amortización
3. **Ajustes manuales**: Permitir corrección manual de pagos automáticos
4. **Notificaciones**: Alertar sobre deudas con fechas de inicio en el pasado
5. **Historial de cambios**: Auditoría de modificaciones a pagos automáticos