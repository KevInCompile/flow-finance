/**
 * Script de prueba para cálculo de cuotas vencidas
 * 
 * Este script verifica la lógica de cálculo de cuotas vencidas
 * basada en fecha de inicio, día de pago y fecha actual.
 * 
 * Caso de prueba: Deuda iniciada el 20/11/2025, día de pago 20,
 * fecha actual 14/01/2026
 */

function calcularCuotasVencidas(fechaInicio, diaPago, fechaActual, totalCuotas) {
  const startDate = new Date(fechaInicio);
  const currentDate = new Date(fechaActual);
  const payDay = parseInt(diaPago) || 1;
  
  // Calcular cuotas vencidas basado en fechas exactas
  let dueInstallments = 0;
  let nextPaymentDate = new Date(startDate);
  
  // Ajustar primer día de pago
  const startDay = startDate.getDate();
  if (startDay !== payDay) {
    // Si la fecha de inicio no es el día de pago, ajustar al próximo día de pago
    nextPaymentDate.setDate(payDay);
    if (nextPaymentDate <= startDate) {
      // Si ya pasó el día de pago este mes, ir al próximo mes
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      nextPaymentDate.setDate(payDay);
    }
  }
  
  // Contar cuántas fechas de pago han pasado hasta la fecha actual
  while (nextPaymentDate <= currentDate && dueInstallments < totalCuotas) {
    dueInstallments++;
    
    // Calcular próximo día de pago
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    
    // Ajustar día de pago si el mes no tiene ese día (ej: 31 en febrero)
    const daysInMonth = new Date(nextPaymentDate.getFullYear(), nextPaymentDate.getMonth() + 1, 0).getDate();
    if (payDay > daysInMonth) {
      nextPaymentDate.setDate(daysInMonth);
    } else {
      nextPaymentDate.setDate(payDay);
    }
  }
  
  // Calcular meses transcurridos para referencia
  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const monthsPassed = (currentYear - startYear) * 12 + (currentMonth - startMonth);
  
  return {
    monthsPassed,
    dueInstallments,
    startDate: startDate.toISOString().split('T')[0],
    currentDate: currentDate.toISOString().split('T')[0],
    payDay,
    totalCuotas
  };
}

function calcularProximaFechaPago(fechaInicio, diaPago, cuotasVencidas, totalCuotas) {
  if (cuotasVencidas >= totalCuotas) {
    return "Deuda completada";
  }
  
  const startDate = new Date(fechaInicio);
  const payDay = parseInt(diaPago) || 1;
  
  // Calcular fecha del próximo pago
  let nextPaymentDate = new Date(startDate);
  
  // Ajustar primer día de pago
  const startDay = startDate.getDate();
  if (startDay !== payDay) {
    nextPaymentDate.setDate(payDay);
    if (nextPaymentDate <= startDate) {
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      nextPaymentDate.setDate(payDay);
    }
  }
  
  // Avanzar hasta la cuota correspondiente
  for (let i = 0; i < cuotasVencidas; i++) {
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    
    // Ajustar día de pago si el mes no tiene ese día
    const daysInMonth = new Date(nextPaymentDate.getFullYear(), nextPaymentDate.getMonth() + 1, 0).getDate();
    if (payDay > daysInMonth) {
      nextPaymentDate.setDate(daysInMonth);
    } else {
      nextPaymentDate.setDate(payDay);
    }
  }
  
  // Esta es la fecha del último pago vencido, el próximo es un mes después
  nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
  
  // Ajustar día de pago si el mes no tiene ese día
  const daysInMonth = new Date(nextPaymentDate.getFullYear(), nextPaymentDate.getMonth() + 1, 0).getDate();
  if (payDay > daysInMonth) {
    nextPaymentDate.setDate(daysInMonth);
  } else {
    nextPaymentDate.setDate(payDay);
  }
  
  return nextPaymentDate.toISOString().split('T')[0];
}

function testCasoEjemplo() {
  console.log('=== PRUEBA: CASO EJEMPLO ===\n');
  
  // Caso del usuario: Deuda iniciada 20/11/2025, día de pago 20, hoy 14/01/2026
  const testCase = {
    fechaInicio: '2025-11-20',
    diaPago: 20,
    fechaActual: '2026-01-14',
    totalCuotas: 12
  };
  
  const resultado = calcularCuotasVencidas(
    testCase.fechaInicio,
    testCase.diaPago,
    testCase.fechaActual,
    testCase.totalCuotas
  );
  
  console.log('📅 Datos de entrada:');
  console.log(`  Fecha de inicio: ${testCase.fechaInicio}`);
  console.log(`  Día de pago: ${testCase.diaPago}`);
  console.log(`  Fecha actual: ${testCase.fechaActual}`);
  console.log(`  Total de cuotas: ${testCase.totalCuotas}`);
  
  console.log('\n📊 Resultados:');
  console.log(`  Meses transcurridos: ${resultado.monthsPassed}`);
  console.log(`  Cuotas vencidas: ${resultado.dueInstallments}`);
  
  const proximaFecha = calcularProximaFechaPago(
    testCase.fechaInicio,
    testCase.diaPago,
    resultado.dueInstallments,
    testCase.totalCuotas
  );
  
  console.log(`  Próxima fecha de pago: ${proximaFecha}`);
  
  // Verificación
  const expectedDueInstallments = 2; // 20/11 y 20/12 deberían estar vencidas
  const isCorrect = resultado.dueInstallments === expectedDueInstallments;
  
  console.log('\n✅ Verificación:');
  console.log(`  Cuotas vencidas esperadas: ${expectedDueInstallments}`);
  console.log(`  Cuotas vencidas calculadas: ${resultado.dueInstallments}`);
  console.log(`  ${isCorrect ? '✓ CORRECTO' : '✗ INCORRECTO'}`);
  
  if (!isCorrect) {
    console.log('\n🔍 Debug:');
    console.log(`  Fecha inicio: ${startDate.toISOString().split('T')[0]}`);
    console.log(`  Día inicio: ${startDate.getDate()}`);
    console.log(`  Día pago: ${payDay}`);
    console.log(`  Fecha actual: ${currentDate.toISOString().split('T')[0]}`);
    
    // Mostrar fechas de pago calculadas
    let debugDate = new Date(startDate);
    if (debugDate.getDate() !== payDay) {
      debugDate.setDate(payDay);
      if (debugDate <= startDate) {
        debugDate.setMonth(debugDate.getMonth() + 1);
        debugDate.setDate(payDay);
      }
    }
    
    console.log('  Fechas de pago calculadas:');
    for (let i = 1; i <= 3; i++) {
      console.log(`    Pago ${i}: ${debugDate.toISOString().split('T')[0]}`);
      debugDate.setMonth(debugDate.getMonth() + 1);
      const daysInMonth = new Date(debugDate.getFullYear(), debugDate.getMonth() + 1, 0).getDate();
      if (payDay > daysInMonth) {
        debugDate.setDate(daysInMonth);
      } else {
        debugDate.setDate(payDay);
      }
    }
  }
  
  return isCorrect;
}

function testCasosAdicionales() {
  console.log('\n\n=== PRUEBAS ADICIONALES ===\n');
  
  const testCases = [
    {
      name: 'Caso 1: Pago justo el día',
      fechaInicio: '2025-11-20',
      diaPago: 20,
      fechaActual: '2025-12-20', // Justo el día de pago
      totalCuotas: 12,
      expected: 2 // 20/11 y 20/12 (el pago del 20/12 está vencido el mismo día)
    },
    {
      name: 'Caso 2: Un día después del pago',
      fechaInicio: '2025-11-20',
      diaPago: 20,
      fechaActual: '2025-12-21', // Un día después
      totalCuotas: 12,
      expected: 2 // 20/11 y 20/12 vencidos
    },
    {
      name: 'Caso 3: Un día antes del pago',
      fechaInicio: '2025-11-20',
      diaPago: 20,
      fechaActual: '2025-12-19', // Un día antes
      totalCuotas: 12,
      expected: 1 // Solo 20/11 vencido
    },
    {
      name: 'Caso 4: Deuda recién iniciada',
      fechaInicio: '2026-01-01',
      diaPago: 15,
      fechaActual: '2026-01-10', // Antes del primer pago
      totalCuotas: 6,
      expected: 0 // Ninguna cuota vencida
    },
    {
      name: 'Caso 5: Deuda completada',
      fechaInicio: '2024-01-01',
      diaPago: 1,
      fechaActual: '2025-01-01', // 12 meses después
      totalCuotas: 12,
      expected: 12 // Todas vencidas
    },
    {
      name: 'Caso 6: Día 31 en mes de 30 días',
      fechaInicio: '2025-01-31',
      diaPago: 31,
      fechaActual: '2025-02-28', // Febrero no tiene día 31
      totalCuotas: 24,
      expected: 1 // Solo enero vencido (el pago de febrero sería el 28/02)
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  testCases.forEach((testCase, index) => {
    console.log(`\n${testCase.name}:`);
    
    const resultado = calcularCuotasVencidas(
      testCase.fechaInicio,
      testCase.diaPago,
      testCase.fechaActual,
      testCase.totalCuotas
    );
    
    const proximaFecha = calcularProximaFechaPago(
      testCase.fechaInicio,
      testCase.diaPago,
      resultado.dueInstallments,
      testCase.totalCuotas
    );
    
    console.log(`  Fecha inicio: ${testCase.fechaInicio}`);
    console.log(`  Día pago: ${testCase.diaPago}`);
    console.log(`  Fecha actual: ${testCase.fechaActual}`);
    console.log(`  Cuotas vencidas: ${resultado.dueInstallments} (esperado: ${testCase.expected})`);
    console.log(`  Próximo pago: ${proximaFecha}`);
    
    const isCorrect = resultado.dueInstallments === testCase.expected;
    
    if (isCorrect) {
      console.log(`  ✓ PASÓ`);
      passed++;
    } else {
      console.log(`  ✗ FALLÓ`);
      failed++;
    }
  });
  
  console.log('\n📈 Resumen:');
  console.log(`  Total pruebas: ${testCases.length}`);
  console.log(`  Aprobadas: ${passed}`);
  console.log(`  Falladas: ${failed}`);
  console.log(`  Porcentaje: ${((passed / testCases.length) * 100).toFixed(1)}%`);
}

function testCalculoInteresConCuotasVencidas() {
  console.log('\n\n=== CÁLCULO DE INTERÉS CON CUOTAS VENCIDAS ===\n');
  
  // Simular deuda de $1,000,000 al 21.56% anual, 12 cuotas
  const principal = 1000000;
  const tasaAnual = 21.56;
  const totalCuotas = 12;
  const fechaInicio = '2025-11-20';
  const diaPago = 20;
  const fechaActual = '2026-01-14';
  
  // Calcular cuotas vencidas
  const resultado = calcularCuotasVencidas(
    fechaInicio,
    diaPago,
    fechaActual,
    totalCuotas
  );
  const dueInstallments = resultado.dueInstallments;
  
  console.log('📊 Escenario:');
  console.log(`  Principal: $${principal.toLocaleString()}`);
  console.log(`  Tasa anual: ${tasaAnual}%`);
  console.log(`  Fecha inicio: ${fechaInicio}`);
  console.log(`  Día pago: ${diaPago}`);
  console.log(`  Fecha actual: ${fechaActual}`);
  console.log(`  Cuotas vencidas: ${dueInstallments} de ${totalCuotas}`);
  console.log(`  Meses transcurridos: ${resultado.monthsPassed}`);
  
  // Calcular cuota mensual con amortización
  const tasaMensual = tasaAnual / 100 / 12;
  const cuotaMensual = principal * (tasaMensual * Math.pow(1 + tasaMensual, totalCuotas)) / 
                       (Math.pow(1 + tasaMensual, totalCuotas) - 1);
  
  console.log(`\n💰 Cuota mensual: $${cuotaMensual.toFixed(2)}`);
  
  // Simular pagos de cuotas vencidas
  let saldoPendiente = principal;
  let interesTotalPagado = 0;
  
  console.log('\n📅 Simulación de pagos vencidos:');
  console.log('Mes | Interés mes | Capital mes | Saldo pendiente');
  console.log('----|-------------|-------------|----------------');
  
  for (let mes = 1; mes <= dueInstallments; mes++) {
    const interesMes = saldoPendiente * tasaMensual;
    const capitalMes = cuotaMensual - interesMes;
    saldoPendiente -= capitalMes;
    interesTotalPagado += interesMes;
    
    console.log(
      `${mes.toString().padStart(3)} |` +
      ` $${interesMes.toFixed(2).padStart(11)} |` +
      ` $${capitalMes.toFixed(2).padStart(11)} |` +
      ` $${saldoPendiente.toFixed(2).padStart(14)}`
    );
  }
  
  // Calcular interés acumulado desde último pago hasta hoy
  const diasDesdeUltimoPago = 25; // Desde 20/12 hasta 14/01
  const tasaDiaria = tasaAnual / 100 / 365;
  const interesAcumulado = saldoPendiente * tasaDiaria * diasDesdeUltimoPago;
  
  console.log('\n📈 Interés acumulado desde último pago:');
  console.log(`  Saldo pendiente: $${saldoPendiente.toFixed(2)}`);
  console.log(`  Días desde último pago: ${diasDesdeUltimoPago}`);
  console.log(`  Tasa diaria: ${(tasaDiaria * 100).toFixed(6)}%`);
  console.log(`  Interés acumulado: $${interesAcumulado.toFixed(2)}`);
  
  console.log('\n💡 Conclusión:');
  console.log(`  El interés debe calcularse sobre el saldo pendiente actual ($${saldoPendiente.toFixed(2)})`);
  console.log(`  No sobre el principal inicial ($${principal.toLocaleString()})`);
  console.log(`  Ya se pagaron ${dueInstallments} cuotas con $${interesTotalPagado.toFixed(2)} en intereses`);
}

// Ejecutar pruebas
console.log('🧪 PRUEBAS DE CÁLCULO DE CUOTAS VENCIDAS\n');
console.log('='.repeat(60));

const casoEjemploCorrecto = testCasoEjemplo();
testCasosAdicionales();
testCalculoInteresConCuotasVencidas();

console.log('\n' + '='.repeat(60));
console.log('🎯 RESUMEN FINAL:');
console.log('La lógica implementada en el sistema debe:');
console.log('1. Calcular correctamente cuántas cuotas ya vencieron');
console.log('2. Considerar si ya pasó el día de pago del mes actual');
console.log('3. Calcular interés solo sobre el saldo pendiente actual');
console.log('4. Mostrar próxima fecha de pago basada en cuotas vencidas');
console.log('5. Ajustar día de pago para meses con menos días (ej: 31 en febrero)');

if (casoEjemploCorrecto) {
  console.log('\n✅ El caso ejemplo del usuario está correctamente calculado:');
  console.log('   Deuda 20/11/2025, día 20, hoy 14/01/2026 → 2 cuotas vencidas');
} else {
  console.log('\n❌ El caso ejemplo del usuario necesita corrección');
}