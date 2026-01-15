/**
 * Script de prueba para caso específico del usuario
 * 
 * Caso: Deuda registrada el 14/01/2026 con fecha de inicio 20/12/2025
 * Día de pago: 20 de cada mes
 * Fecha actual: 14/01/2026
 * 
 * Debería mostrar:
 * 1. 1 cuota vencida (20/12/2025)
 * 2. Interés acumulado desde 20/12/2025 hasta 14/01/2026
 * 3. Próximo pago: 20/01/2026 (ya pasó) → 20/02/2026
 */

function calcularCuotasVencidas(fechaInicio, diaPago, fechaActual, totalCuotas) {
  const startDate = new Date(fechaInicio);
  const currentDate = new Date(fechaActual);
  const payDay = parseInt(diaPago) || 1;
  
  let dueInstallments = 0;
  let nextPaymentDate = new Date(startDate);
  
  console.log(`\n📅 Cálculo de cuotas vencidas:`);
  console.log(`  Fecha inicio: ${startDate.toISOString().split('T')[0]}`);
  console.log(`  Día de pago: ${payDay}`);
  console.log(`  Fecha actual: ${currentDate.toISOString().split('T')[0]}`);
  console.log(`  Total cuotas: ${totalCuotas}`);
  
  // Si la fecha de inicio es hoy o futura, no hay cuotas vencidas
  if (startDate > currentDate) {
    console.log(`  ⚠️ La fecha de inicio es futura`);
    return { dueInstallments: 0, nextPaymentDate: startDate };
  }
  
  // Ajustar primer día de pago - el primer pago es en la fecha de inicio si coincide con payDay
  const startDay = startDate.getDate();
  console.log(`  Día del mes en fecha inicio: ${startDay}`);
  
  if (startDay !== payDay) {
    nextPaymentDate.setDate(payDay);
    console.log(`  Primer pago ajustado a: ${nextPaymentDate.toISOString().split('T')[0]}`);
    
    // Si el día de pago ajustado es antes o igual a la fecha de inicio, ir al próximo mes
    if (nextPaymentDate <= startDate) {
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      nextPaymentDate.setDate(payDay);
      console.log(`  Primer pago movido al próximo mes: ${nextPaymentDate.toISOString().split('T')[0]}`);
    }
  } else {
    console.log(`  Primer pago coincide con fecha inicio: ${nextPaymentDate.toISOString().split('T')[0]}`);
  }
  
  // Contar cuántas fechas de pago han pasado hasta la fecha actual
  console.log(`\n  Fechas de pago calculadas:`);
  let paymentCount = 0;
  const paymentDates = [];
  
  while (nextPaymentDate <= currentDate && dueInstallments < totalCuotas) {
    paymentCount++;
    dueInstallments++;
    paymentDates.push(new Date(nextPaymentDate));
    
    console.log(`    Pago ${paymentCount}: ${nextPaymentDate.toISOString().split('T')[0]}`);
    
    // Calcular próximo día de pago
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    
    // Ajustar día de pago si el mes no tiene ese día (ej: 31 en febrero)
    const daysInMonth = new Date(nextPaymentDate.getFullYear(), nextPaymentDate.getMonth() + 1, 0).getDate();
    if (payDay > daysInMonth) {
      nextPaymentDate.setDate(daysInMonth);
      console.log(`    Ajustado a último día del mes: ${nextPaymentDate.getDate()}`);
    } else {
      nextPaymentDate.setDate(payDay);
    }
  }
  
  console.log(`\n  ✅ Cuotas vencidas: ${dueInstallments}`);
  console.log(`  Próximo pago calculado: ${nextPaymentDate.toISOString().split('T')[0]}`);
  
  return { 
    dueInstallments, 
    nextPaymentDate,
    paymentDates,
    startDate,
    currentDate,
    payDay
  };
}

function calcularInteresAcumulado(principal, tasaAnual, fechaInicio, fechaActual, diaPago, cuotasVencidas) {
  const startDate = new Date(fechaInicio);
  const currentDate = new Date(fechaActual);
  const payDay = parseInt(diaPago) || 1;
  const tasaDiaria = tasaAnual / 100 / 365;
  
  console.log(`\n💰 Cálculo de interés acumulado:`);
  console.log(`  Principal: $${principal.toLocaleString()}`);
  console.log(`  Tasa anual: ${tasaAnual}%`);
  console.log(`  Tasa diaria: ${(tasaDiaria * 100).toFixed(6)}%`);
  console.log(`  Días desde inicio: ${Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))}`);
  
  // Calcular cuota mensual para simular reducción de saldo
  const tasaMensual = tasaAnual / 100 / 12;
  const cuotaMensual = principal * (tasaMensual * Math.pow(1 + tasaMensual, 12)) / 
                       (Math.pow(1 + tasaMensual, 12) - 1);
  
  console.log(`  Cuota mensual estimada: $${cuotaMensual.toFixed(2)}`);
  
  // Simular pagos de cuotas vencidas
  let saldoPendiente = principal;
  let interesTotal = 0;
  let interesAcumulado = 0;
  
  console.log(`\n  📊 Simulación de pagos vencidos (${cuotasVencidas} cuotas):`);
  
  for (let mes = 1; mes <= cuotasVencidas; mes++) {
    const interesMes = saldoPendiente * tasaMensual;
    const capitalMes = cuotaMensual - interesMes;
    saldoPendiente -= capitalMes;
    interesTotal += interesMes;
    
    console.log(`    Mes ${mes}: Interés: $${interesMes.toFixed(2)} | Capital: $${capitalMes.toFixed(2)} | Saldo: $${saldoPendiente.toFixed(2)}`);
  }
  
  // Calcular días desde último pago hasta hoy
  let diasDesdeUltimoPago = 0;
  
  if (cuotasVencidas > 0) {
    // Calcular fecha del último pago
    const ultimoPagoDate = new Date(startDate);
    ultimoPagoDate.setMonth(startDate.getMonth() + cuotasVencidas);
    ultimoPagoDate.setDate(payDay);
    
    // Ajustar si el mes no tiene ese día
    const daysInMonth = new Date(ultimoPagoDate.getFullYear(), ultimoPagoDate.getMonth() + 1, 0).getDate();
    if (payDay > daysInMonth) {
      ultimoPagoDate.setDate(daysInMonth);
    }
    
    diasDesdeUltimoPago = Math.floor((currentDate.getTime() - ultimoPagoDate.getTime()) / (1000 * 3600 * 24));
    interesAcumulado = saldoPendiente * tasaDiaria * diasDesdeUltimoPago;
    
    console.log(`\n  📅 Último pago: ${ultimoPagoDate.toISOString().split('T')[0]}`);
    console.log(`  Días desde último pago: ${diasDesdeUltimoPago}`);
  } else {
    // Si no hay cuotas vencidas, calcular desde fecha de inicio
    diasDesdeUltimoPago = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    interesAcumulado = saldoPendiente * tasaDiaria * diasDesdeUltimoPago;
    
    console.log(`\n  📅 Sin pagos vencidos, cálculo desde fecha inicio`);
    console.log(`  Días desde inicio: ${diasDesdeUltimoPago}`);
  }
  
  console.log(`\n  💰 Interés total de cuotas vencidas: $${interesTotal.toFixed(2)}`);
  console.log(`  💰 Interés acumulado desde último cálculo: $${interesAcumulado.toFixed(2)}`);
  console.log(`  💰 Saldo pendiente actual: $${saldoPendiente.toFixed(2)}`);
  console.log(`  💰 Interés total acumulado: $${(interesTotal + interesAcumulado).toFixed(2)}`);
  
  return {
    saldoPendiente,
    interesTotal,
    interesAcumulado,
    interesTotalAcumulado: interesTotal + interesAcumulado,
    diasDesdeUltimoPago,
    cuotaMensual
  };
}

function testCasoUsuario() {
  console.log('='.repeat(70));
  console.log('🧪 PRUEBA: CASO ESPECÍFICO DEL USUARIO');
  console.log('='.repeat(70));
  
  // Datos del caso del usuario
  const casoUsuario = {
    fechaInicio: '2025-12-20',
    diaPago: 20,
    fechaActual: '2026-01-14',
    totalCuotas: 12,
    principal: 1000000,
    tasaAnual: 21.56
  };
  
  console.log(`\n📋 Datos del caso:`);
  console.log(`  • Fecha de inicio de la deuda: ${casoUsuario.fechaInicio}`);
  console.log(`  • Día de pago mensual: ${casoUsuario.diaPago}`);
  console.log(`  • Fecha actual (registro): ${casoUsuario.fechaActual}`);
  console.log(`  • Total de cuotas: ${casoUsuario.totalCuotas}`);
  console.log(`  • Monto principal: $${casoUsuario.principal.toLocaleString()}`);
  console.log(`  • Tasa de interés anual: ${casoUsuario.tasaAnual}%`);
  
  console.log(`\n📊 Días transcurridos:`);
  const startDate = new Date(casoUsuario.fechaInicio);
  const currentDate = new Date(casoUsuario.fechaActual);
  const diasTotales = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  console.log(`  Desde ${casoUsuario.fechaInicio} hasta ${casoUsuario.fechaActual}: ${diasTotales} días`);
  
  // 1. Calcular cuotas vencidas
  const { dueInstallments, nextPaymentDate, paymentDates } = calcularCuotasVencidas(
    casoUsuario.fechaInicio,
    casoUsuario.diaPago,
    casoUsuario.fechaActual,
    casoUsuario.totalCuotas
  );
  
  // 2. Calcular interés acumulado
  const interes = calcularInteresAcumulado(
    casoUsuario.principal,
    casoUsuario.tasaAnual,
    casoUsuario.fechaInicio,
    casoUsuario.fechaActual,
    casoUsuario.diaPago,
    dueInstallments
  );
  
  // 3. Calcular próxima fecha de pago real
  console.log(`\n📅 Próxima fecha de pago:`);
  const hoy = new Date(casoUsuario.fechaActual);
  const diaHoy = hoy.getDate();
  
  if (dueInstallments >= casoUsuario.totalCuotas) {
    console.log(`  ✅ Deuda completada`);
  } else {
    // Verificar si ya pasó el día de pago de este mes
    if (diaHoy >= casoUsuario.diaPago) {
      // Ya pasó el día de pago este mes, próximo pago es el próximo mes
      const proximoPago = new Date(hoy);
      proximoPago.setMonth(proximoPago.getMonth() + 1);
      proximoPago.setDate(casoUsuario.diaPago);
      
      // Ajustar si el mes no tiene ese día
      const daysInMonth = new Date(proximoPago.getFullYear(), proximoPago.getMonth() + 1, 0).getDate();
      if (casoUsuario.diaPago > daysInMonth) {
        proximoPago.setDate(daysInMonth);
      }
      
      console.log(`  ⚠️ Ya pasó el día de pago de este mes (${casoUsuario.diaPago})`);
      console.log(`  Próximo pago: ${proximoPago.toISOString().split('T')[0]}`);
    } else {
      // Aún no pasa el día de pago este mes
      const proximoPago = new Date(hoy);
      proximoPago.setDate(casoUsuario.diaPago);
      console.log(`  Próximo pago este mes: ${proximoPago.toISOString().split('T')[0]}`);
    }
  }
  
  // 4. Resumen y verificación
  console.log(`\n` + '='.repeat(70));
  console.log('🎯 RESUMEN DEL CASO');
  console.log('='.repeat(70));
  
  console.log(`\n✅ Lo que DEBERÍA mostrar el sistema:`);
  console.log(`  1. Cuotas vencidas: ${dueInstallments} (${paymentDates.map(d => d.toISOString().split('T')[0]).join(', ')})`);
  console.log(`  2. Interés acumulado: $${interes.interesTotalAcumulado.toFixed(2)}`);
  console.log(`     - De cuotas vencidas: $${interes.interesTotal.toFixed(2)}`);
  console.log(`     - Acumulado diario: $${interes.interesAcumulado.toFixed(2)} (${interes.diasDesdeUltimoPago} días)`);
  console.log(`  3. Saldo pendiente: $${interes.saldoPendiente.toFixed(2)}`);
  console.log(`  4. Próximo pago: ${nextPaymentDate.toISOString().split('T')[0]}`);
  
  console.log(`\n⚠️ Posibles problemas detectados:`);
  
  if (dueInstallments === 0) {
    console.log(`  ❌ ERROR: No se detectan cuotas vencidas cuando debería haber al menos 1`);
    console.log(`     - Fecha inicio: ${casoUsuario.fechaInicio}`);
    console.log(`     - Hoy: ${casoUsuario.fechaActual}`);
    console.log(`     - Días transcurridos: ${diasTotales}`);
  }
  
  if (interes.interesTotalAcumulado === 0) {
    console.log(`  ❌ ERROR: Interés acumulado es 0 cuando debería ser positivo`);
    console.log(`     - Tasa: ${casoUsuario.tasaAnual}% anual`);
    console.log(`     - Días: ${diasTotales} días desde inicio`);
  }
  
  console.log(`\n💡 Recomendaciones:`);
  console.log(`  1. Verificar que la fecha de inicio se guarde correctamente en la base de datos`);
  console.log(`  2. Asegurar que el cálculo de interés comience desde la fecha de inicio, no de registro`);
  console.log(`  3. Mostrar claramente cuántas cuotas están vencidas y cuáles son las fechas`);
  console.log(`  4. Calcular interés diario sobre el saldo pendiente actual`);
  
  return {
    casoUsuario,
    dueInstallments,
    interes,
    nextPaymentDate: nextPaymentDate.toISOString().split('T')[0],
    diasTotales
  };
}

function testCasosVariantes() {
  console.log(`\n` + '='.repeat(70));
  console.log('🧪 PRUEBAS DE VARIANTES');
  console.log('='.repeat(70));
  
  const casos = [
    {
      nombre: 'Caso A: Registro mismo día que fecha inicio',
      fechaInicio: '2026-01-14',
      diaPago: 20,
      fechaActual: '2026-01-14',
      esperado: { cuotas: 0, interes: 0 }
    },
    {
      nombre: 'Caso B: Registro después de primer pago vencido',
      fechaInicio: '2025-12-20',
      diaPago: 20,
      fechaActual: '2026-01-15',
      esperado: { cuotas: 1, interes: '>0' }
    },
    {
      nombre: 'Caso C: Registro después de segundo pago vencido',
      fechaInicio: '2025-11-20',
      diaPago: 20,
      fechaActual: '2026-01-14',
      esperado: { cuotas: 2, interes: '>0' }
    },
    {
      nombre: 'Caso D: Día de pago 31 en febrero',
      fechaInicio: '2025-01-31',
      diaPago: 31,
      fechaActual: '2025-02-28',
      esperado: { cuotas: 1, interes: '>0' }
    }
  ];
  
  casos.forEach((caso, index) => {
    console.log(`\n${caso.nombre}:`);
    const resultado = calcularCuotasVencidas(
      caso.fechaInicio,
      caso.diaPago,
      caso.fechaActual,
      12
    );
    
    console.log(`  Cuotas vencidas: ${resultado.dueInstallments} (esperado: ${caso.esperado.cuotas})`);
    console.log(`  ${resultado.dueInstallments === caso.esperado.cuotas ? '✅ CORRECTO' : '❌ INCORRECTO'}`);
  });
}

// Ejecutar pruebas
const resultado = testCasoUsuario();
testCasosVariantes();

console.log(`\n` + '='.repeat(70));
console.log('🎯 CONCLUSIÓN FINAL');
console.log('='.repeat(70));
  
console.log(`\nPara el caso del usuario:`);
console.log(`✅ Si registra hoy (14/01/2026) una deuda con fecha de inicio 20/12/2025:`);
console.log(`   • Debe mostrar 1 cuota vencida (20/12/2025)`);
console.log(`   • Debe calcular interés desde 20/12/2025 hasta hoy`);
console.log(`   • El interés debe calcularse sobre el saldo pendiente`);
console.log(`   • Debe mostrar próximo pago: 20/01/2026 (ya pasó) → 20/02/2026`);
  
console.log(`\n🔧 Correcciones necesarias en el sistema:`);
console.log(`   1. El cálculo de interés debe comenzar desde fecha de inicio, no de registro`);
console.log(`   2. Las cuotas vencidas deben contarse desde fecha de inicio`);
console.log(`   3. El interés diario debe calcularse sobre saldo actual, no principal inicial`);
console.log(`   4. Mostrar claramente cuotas vencidas vs pagadas`);
  
console.log(`\n📊 Resultados del caso:`);
console.log(`   • Cuotas vencidas: ${resultado.dueInstallments}`);
console.log(`   • Interés total acumulado: $${resultado.interes.interesTotalAcumulado.toFixed(2)}`);
console.log(`   • Días transcurridos: ${resultado.diasTotales}`);
console.log(`   • Próximo pago: ${resultado.nextPaymentDate}`);
