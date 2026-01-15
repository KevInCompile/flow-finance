/**
 * Script de prueba corregido para manejo de fechas locales
 * 
 * Caso: Deuda registrada el 14/01/2026 con fecha de inicio 20/12/2025
 * Día de pago: 20 de cada mes
 * Fecha actual: 14/01/2026
 * 
 * Problemas identificados:
 * 1. JavaScript Date interpreta 'YYYY-MM-DD' como UTC
 * 2. Necesitamos manejar fechas locales
 * 3. Si fecha inicio es día 20 y día pago es 20, primer pago debe ser 20/12
 */

// Función para crear fecha local (evita problemas UTC)
function crearFechaLocal(anio, mes, dia) {
  // Mes en JavaScript es 0-indexed (0 = Enero, 11 = Diciembre)
  return new Date(anio, mes - 1, dia, 12, 0, 0); // Mediodía para evitar problemas de zona horaria
}

// Función para parsear fecha en formato YYYY-MM-DD a local
function parsearFechaLocal(fechaStr) {
  const partes = fechaStr.split('-');
  const anio = parseInt(partes[0]);
  const mes = parseInt(partes[1]);
  const dia = parseInt(partes[2]);
  return crearFechaLocal(anio, mes, dia);
}

// Función para calcular cuotas vencidas CORREGIDA
function calcularCuotasVencidasCorregido(fechaInicioStr, diaPago, fechaActualStr, totalCuotas) {
  const startDate = parsearFechaLocal(fechaInicioStr);
  const currentDate = parsearFechaLocal(fechaActualStr);
  const payDay = parseInt(diaPago) || 1;
  
  console.log(`\n📅 Cálculo de cuotas vencidas (CORREGIDO):`);
  console.log(`  Fecha inicio: ${fechaInicioStr} (local: ${startDate.getDate()}/${startDate.getMonth() + 1}/${startDate.getFullYear()})`);
  console.log(`  Día de pago: ${payDay}`);
  console.log(`  Fecha actual: ${fechaActualStr} (local: ${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()})`);
  console.log(`  Total cuotas: ${totalCuotas}`);
  
  let dueInstallments = 0;
  const paymentDates = [];
  
  // Si la fecha de inicio es futura, no hay cuotas vencidas
  if (startDate > currentDate) {
    console.log(`  ⚠️ La fecha de inicio es futura`);
    return { dueInstallments: 0, paymentDates, startDate, currentDate };
  }
  
  // Calcular fecha del primer pago
  let nextPaymentDate = new Date(startDate);
  
  // Si el día de la fecha de inicio NO es el día de pago, ajustar
  if (startDate.getDate() !== payDay) {
    // Intentar establecer el día de pago en el mismo mes
    nextPaymentDate.setDate(payDay);
    
    // Si después de ajustar la fecha es anterior a la fecha de inicio, ir al próximo mes
    if (nextPaymentDate < startDate) {
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      nextPaymentDate.setDate(payDay);
    }
  }
  
  console.log(`  Primer pago calculado: ${nextPaymentDate.getDate()}/${nextPaymentDate.getMonth() + 1}/${nextPaymentDate.getFullYear()}`);
  
  // Contar cuántas fechas de pago han pasado hasta la fecha actual
  while (nextPaymentDate <= currentDate && dueInstallments < totalCuotas) {
    dueInstallments++;
    paymentDates.push(new Date(nextPaymentDate));
    
    console.log(`    Pago ${dueInstallments}: ${nextPaymentDate.getDate()}/${nextPaymentDate.getMonth() + 1}/${nextPaymentDate.getFullYear()}`);
    
    // Calcular próximo día de pago (siguiente mes)
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    
    // Ajustar día de pago si el mes no tiene ese día
    const daysInMonth = new Date(nextPaymentDate.getFullYear(), nextPaymentDate.getMonth() + 1, 0).getDate();
    if (payDay > daysInMonth) {
      nextPaymentDate.setDate(daysInMonth);
    } else {
      nextPaymentDate.setDate(payDay);
    }
  }
  
  console.log(`\n  ✅ Cuotas vencidas: ${dueInstallments}`);
  if (dueInstallments < totalCuotas) {
    console.log(`  Próximo pago: ${nextPaymentDate.getDate()}/${nextPaymentDate.getMonth() + 1}/${nextPaymentDate.getFullYear()}`);
  } else {
    console.log(`  ✅ Todas las cuotas están vencidas`);
  }
  
  return { 
    dueInstallments, 
    nextPaymentDate,
    paymentDates,
    startDate,
    currentDate,
    payDay
  };
}

// Función para calcular interés acumulado CORREGIDA
function calcularInteresAcumuladoCorregido(principal, tasaAnual, fechaInicioStr, fechaActualStr, diaPago, cuotasVencidas) {
  const startDate = parsearFechaLocal(fechaInicioStr);
  const currentDate = parsearFechaLocal(fechaActualStr);
  const payDay = parseInt(diaPago) || 1;
  const tasaDiaria = tasaAnual / 100 / 365;
  
  console.log(`\n💰 Cálculo de interés acumulado (CORREGIDO):`);
  console.log(`  Principal: $${principal.toLocaleString()}`);
  console.log(`  Tasa anual: ${tasaAnual}%`);
  console.log(`  Tasa diaria: ${(tasaDiaria * 100).toFixed(6)}%`);
  
  // Calcular días totales desde inicio
  const diasTotales = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  console.log(`  Días desde inicio: ${diasTotales}`);
  
  // Calcular cuota mensual para simular reducción de saldo
  const tasaMensual = tasaAnual / 100 / 12;
  const cuotaMensual = principal * (tasaMensual * Math.pow(1 + tasaMensual, 12)) / 
                       (Math.pow(1 + tasaMensual, 12) - 1);
  
  console.log(`  Cuota mensual estimada: $${cuotaMensual.toFixed(2)}`);
  
  // Simular pagos de cuotas vencidas
  let saldoPendiente = principal;
  let interesTotalCuotas = 0;
  
  if (cuotasVencidas > 0) {
    console.log(`\n  📊 Simulación de ${cuotasVencidas} cuota(s) vencida(s):`);
    
    for (let mes = 1; mes <= cuotasVencidas; mes++) {
      const interesMes = saldoPendiente * tasaMensual;
      const capitalMes = cuotaMensual - interesMes;
      saldoPendiente -= capitalMes;
      interesTotalCuotas += interesMes;
      
      console.log(`    Mes ${mes}: Interés: $${interesMes.toFixed(2)} | Capital: $${capitalMes.toFixed(2)} | Saldo: $${saldoPendiente.toFixed(2)}`);
    }
  }
  
  // Calcular interés diario acumulado desde el último evento (inicio o último pago)
  let interesDiarioAcumulado = 0;
  let diasParaCalculoDiario = 0;
  
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
    
    diasParaCalculoDiario = Math.floor((currentDate.getTime() - ultimoPagoDate.getTime()) / (1000 * 3600 * 24));
    interesDiarioAcumulado = saldoPendiente * tasaDiaria * diasParaCalculoDiario;
    
    console.log(`\n  📅 Último pago: ${ultimoPagoDate.getDate()}/${ultimoPagoDate.getMonth() + 1}/${ultimoPagoDate.getFullYear()}`);
    console.log(`  Días desde último pago: ${diasParaCalculoDiario}`);
  } else {
    // Si no hay cuotas vencidas, calcular desde fecha de inicio
    diasParaCalculoDiario = diasTotales;
    interesDiarioAcumulado = saldoPendiente * tasaDiaria * diasParaCalculoDiario;
    
    console.log(`\n  📅 Sin pagos vencidos, cálculo desde fecha inicio`);
    console.log(`  Días desde inicio: ${diasParaCalculoDiario}`);
  }
  
  const interesTotalAcumulado = interesTotalCuotas + interesDiarioAcumulado;
  
  console.log(`\n  💰 RESUMEN DE INTERESES:`);
  console.log(`    • Interés de cuotas vencidas: $${interesTotalCuotas.toFixed(2)}`);
  console.log(`    • Interés diario acumulado: $${interesDiarioAcumulado.toFixed(2)} (${diasParaCalculoDiario} días)`);
  console.log(`    • Interés TOTAL acumulado: $${interesTotalAcumulado.toFixed(2)}`);
  console.log(`    • Saldo pendiente actual: $${saldoPendiente.toFixed(2)}`);
  
  return {
    saldoPendiente,
    interesTotalCuotas,
    interesDiarioAcumulado,
    interesTotalAcumulado,
    diasParaCalculoDiario,
    cuotaMensual,
    diasTotales
  };
}

// Test del caso del usuario
function testCasoUsuarioCorregido() {
  console.log('='.repeat(70));
  console.log('🧪 PRUEBA: CASO DEL USUARIO (VERSIÓN CORREGIDA)');
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
  
  console.log(`\n📋 DATOS DEL CASO:`);
  console.log(`  • Fecha de inicio: ${casoUsuario.fechaInicio}`);
  console.log(`  • Día de pago: ${casoUsuario.diaPago}`);
  console.log(`  • Fecha actual: ${casoUsuario.fechaActual}`);
  console.log(`  • Principal: $${casoUsuario.principal.toLocaleString()}`);
  console.log(`  • Tasa anual: ${casoUsuario.tasaAnual}%`);
  console.log(`  • Total cuotas: ${casoUsuario.totalCuotas}`);
  
  // 1. Calcular cuotas vencidas
  const cuotas = calcularCuotasVencidasCorregido(
    casoUsuario.fechaInicio,
    casoUsuario.diaPago,
    casoUsuario.fechaActual,
    casoUsuario.totalCuotas
  );
  
  // 2. Calcular interés acumulado
  const interes = calcularInteresAcumuladoCorregido(
    casoUsuario.principal,
    casoUsuario.tasaAnual,
    casoUsuario.fechaInicio,
    casoUsuario.fechaActual,
    casoUsuario.diaPago,
    cuotas.dueInstallments
  );
  
  // 3. Determinar próxima fecha de pago
  console.log(`\n📅 PRÓXIMA FECHA DE PAGO:`);
  const hoy = parsearFechaLocal(casoUsuario.fechaActual);
  const diaHoy = hoy.getDate();
  
  if (cuotas.dueInstallments >= casoUsuario.totalCuotas) {
    console.log(`  ✅ Todas las cuotas están vencidas/completadas`);
  } else {
    // Verificar si hoy ya pasó el día de pago de este mes
    if (diaHoy >= casoUsuario.diaPago) {
      // Ya pasó el día de pago este mes
      const proximoPago = new Date(hoy);
      proximoPago.setMonth(proximoPago.getMonth() + 1);
      proximoPago.setDate(casoUsuario.diaPago);
      
      // Ajustar si el mes no tiene ese día
      const daysInMonth = new Date(proximoPago.getFullYear(), proximoPago.getMonth() + 1, 0).getDate();
      if (casoUsuario.diaPago > daysInMonth) {
        proximoPago.setDate(daysInMonth);
      }
      
      console.log(`  ⚠️ Ya pasó el día de pago de este mes (${casoUsuario.diaPago})`);
      console.log(`  Próximo pago: ${proximoPago.getDate()}/${proximoPago.getMonth() + 1}/${proximoPago.getFullYear()}`);
    } else {
      // Aún no pasa el día de pago este mes
      const proximoPago = new Date(hoy);
      proximoPago.setDate(casoUsuario.diaPago);
      console.log(`  Próximo pago este mes: ${proximoPago.getDate()}/${proximoPago.getMonth() + 1}/${proximoPago.getFullYear()}`);
    }
  }
  
  // 4. Resumen final
  console.log(`\n` + '='.repeat(70));
  console.log('🎯 RESUMEN FINAL - LO QUE DEBE MOSTRAR EL SISTEMA');
  console.log('='.repeat(70));
  
  console.log(`\n✅ Para una deuda con fecha inicio ${casoUsuario.fechaInicio}, registrada el ${casoUsuario.fechaActual}:`);
  console.log(`\n   1. CUOTAS VENCIDAS: ${cuotas.dueInstallments}`);
  if (cuotas.paymentDates.length > 0) {
    console.log(`      Fechas: ${cuotas.paymentDates.map(d => `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`).join(', ')}`);
  }
  
  console.log(`\n   2. INTERÉS ACUMULADO: $${interes.interesTotalAcumulado.toFixed(2)}`);
  console.log(`      • De cuotas vencidas: $${interes.interesTotalCuotas.toFixed(2)}`);
  console.log(`      • Interés diario: $${interes.interesDiarioAcumulado.toFixed(2)} (${interes.diasParaCalculoDiario} días)`);
  
  console.log(`\n   3. SALDO PENDIENTE: $${interes.saldoPendiente.toFixed(2)}`);
  console.log(`      (Inicial: $${casoUsuario.principal.toLocaleString()})`);
  
  console.log(`\n   4. CUOTA MENSUAL: $${interes.cuotaMensual.toFixed(2)}`);
  
  console.log(`\n   5. DÍAS TRANSCURRIDOS: ${interes.diasTotales} días desde ${casoUsuario.fechaInicio}`);
  
  console.log(`\n💡 RECOMENDACIONES PARA EL SISTEMA:`);
  console.log(`   • El interés debe calcularse desde la FECHA DE INICIO (${casoUsuario.fechaInicio})`);
  console.log(`   • No desde la fecha de registro (${casoUsuario.fechaActual})`);
  console.log(`   • Mostrar claramente cuántas cuotas están vencidas`);
  console.log(`   • Calcular interés diario sobre saldo pendiente actual`);
  console.log(`   • Considerar pagos realizados para reducir saldo`);
  
  return {
    casoUsuario,
    cuotasVencidas: cuotas.dueInstallments,
    interes,
    diasTotales: interes.diasTotales
  };
}

// Test adicionales
function testCasosAdicionalesCorregidos() {
  console.log(`\n` + '='.repeat(70));
  console.log('🧪 PRUEBAS ADICIONALES (CORREGIDAS)');
  console.log('='.repeat(70));
  
  const casos = [
    {
      nombre: 'Caso A: Fecha inicio = Día pago',
      fechaInicio: '2025-12-20',
      diaPago: 20,
      fechaActual: '2025-12-25',
      esperado: { cuotas: 1, desc: 'Primer pago el mismo día de inicio' }
    },
    {
      nombre: 'Caso B: Fecha inicio un día después del día pago',
      fechaInicio: '2025-12-21',
      diaPago: 20,
      fechaActual: '2026-01-14',
      esperado: { cuotas: 1, desc: 'Primer pago el 20/01/2026' }
    },
    {
      nombre: 'Caso C: Fecha inicio un día antes del día pago',
      fechaInicio: '2025-12-19',
      diaPago: 20,
      fechaActual: '2025-12-25',
      esperado: { cuotas: 1, desc: 'Primer pago el 20/12/2025' }
    },
    {
      nombre: 'Caso D: Día 31 en febrero',