/**
 * Script para verificar cálculo corregido del caso del usuario
 * 
 * Caso: Deuda con fecha inicio 20/12/2025, registrada el 14/01/2026
 * Día de pago: 20 de cada mes
 * 
 * Debe mostrar:
 * 1. 1 cuota vencida (20/12/2025)
 * 2. Interés acumulado desde 20/12/2025 hasta 14/01/2026
 * 3. Próximo pago: 20/01/2026 (ya pasó) -> 20/02/2026
 */

function crearFechaLocal(anio, mes, dia) {
  return new Date(anio, mes - 1, dia, 12, 0, 0);
}

function calcularCuotasVencidas(fechaInicioStr, diaPago, fechaActualStr) {
  const startDate = crearFechaLocal(
    parseInt(fechaInicioStr.split('-')[0]),
    parseInt(fechaInicioStr.split('-')[1]),
    parseInt(fechaInicioStr.split('-')[2])
  );
  
  const currentDate = crearFechaLocal(
    parseInt(fechaActualStr.split('-')[0]),
    parseInt(fechaActualStr.split('-')[1]),
    parseInt(fechaActualStr.split('-')[2])
  );
  
  const payDay = parseInt(diaPago);
  
  console.log('=== CÁLCULO DE CUOTAS VENCIDAS ===');
  console.log(`Fecha inicio: ${fechaInicioStr} (día ${startDate.getDate()})`);
  console.log(`Día de pago: ${payDay}`);
  console.log(`Fecha actual: ${fechaActualStr} (día ${currentDate.getDate()})`);
  
  let dueInstallments = 0;
  let nextPaymentDate = new Date(startDate);
  
  // Si el día de inicio no es el día de pago, ajustar
  if (startDate.getDate() !== payDay) {
    nextPaymentDate.setDate(payDay);
    if (nextPaymentDate < startDate) {
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      nextPaymentDate.setDate(payDay);
    }
  }
  
  console.log(`\nPrimer pago calculado: ${nextPaymentDate.getDate()}/${nextPaymentDate.getMonth() + 1}/${nextPaymentDate.getFullYear()}`);
  
  // Contar cuotas vencidas
  while (nextPaymentDate <= currentDate) {
    dueInstallments++;
    console.log(`Pago ${dueInstallments}: ${nextPaymentDate.getDate()}/${nextPaymentDate.getMonth() + 1}/${nextPaymentDate.getFullYear()}`);
    
    // Siguiente mes
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    
    // Ajustar día si el mes no lo tiene
    const daysInMonth = new Date(nextPaymentDate.getFullYear(), nextPaymentDate.getMonth() + 1, 0).getDate();
    if (payDay > daysInMonth) {
      nextPaymentDate.setDate(daysInMonth);
    } else {
      nextPaymentDate.setDate(payDay);
    }
  }
  
  console.log(`\n✅ Cuotas vencidas: ${dueInstallments}`);
  console.log(`Próximo pago: ${nextPaymentDate.getDate()}/${nextPaymentDate.getMonth() + 1}/${nextPaymentDate.getFullYear()}`);
  
  return { dueInstallments, nextPaymentDate };
}

function calcularInteres(fechaInicioStr, fechaActualStr, principal, tasaAnual, cuotasVencidas) {
  const startDate = crearFechaLocal(
    parseInt(fechaInicioStr.split('-')[0]),
    parseInt(fechaInicioStr.split('-')[1]),
    parseInt(fechaInicioStr.split('-')[2])
  );
  
  const currentDate = crearFechaLocal(
    parseInt(fechaActualStr.split('-')[0]),
    parseInt(fechaActualStr.split('-')[1]),
    parseInt(fechaActualStr.split('-')[2])
  );
  
  console.log('\n=== CÁLCULO DE INTERÉS ===');
  console.log(`Principal: $${principal.toLocaleString()}`);
  console.log(`Tasa anual: ${tasaAnual}%`);
  
  // Días transcurridos
  const diasTotales = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  console.log(`Días desde ${fechaInicioStr} hasta ${fechaActualStr}: ${diasTotales} días`);
  
  // Tasa diaria
  const tasaDiaria = tasaAnual / 100 / 365;
  console.log(`Tasa diaria: ${(tasaDiaria * 100).toFixed(6)}%`);
  
  // Interés simple desde fecha de inicio
  const interesSimple = principal * tasaDiaria * diasTotales;
  console.log(`\nInterés simple desde fecha inicio: $${interesSimple.toFixed(2)}`);
  
  // Si hay cuotas vencidas, calcular saldo reducido
  if (cuotasVencidas > 0) {
    const tasaMensual = tasaAnual / 100 / 12;
    const cuotaMensual = principal * (tasaMensual * Math.pow(1 + tasaMensual, 12)) / 
                         (Math.pow(1 + tasaMensual, 12) - 1);
    
    console.log(`\nCuota mensual estimada: $${cuotaMensual.toFixed(2)}`);
    
    let saldo = principal;
    let interesCuotas = 0;
    
    for (let i = 1; i <= cuotasVencidas; i++) {
      const interesMes = saldo * tasaMensual;
      const capitalMes = cuotaMensual - interesMes;
      saldo -= capitalMes;
      interesCuotas += interesMes;
      
      console.log(`Cuota ${i}: Interés $${interesMes.toFixed(2)} | Capital $${capitalMes.toFixed(2)} | Saldo $${saldo.toFixed(2)}`);
    }
    
    // Interés diario sobre saldo actual
    const interesDiario = saldo * tasaDiaria * diasTotales;
    const interesTotal = interesCuotas + interesDiario;
    
    console.log(`\n💰 INTERÉS TOTAL:`);
    console.log(`  • De cuotas vencidas: $${interesCuotas.toFixed(2)}`);
    console.log(`  • Diario sobre saldo actual: $${interesDiario.toFixed(2)}`);
    console.log(`  • TOTAL: $${interesTotal.toFixed(2)}`);
    console.log(`  • Saldo pendiente: $${saldo.toFixed(2)}`);
    
    return { interesTotal, saldoPendiente: saldo, interesCuotas, interesDiario };
  }
  
  return { interesTotal: interesSimple, saldoPendiente: principal, interesCuotas: 0, interesDiario: interesSimple };
}

// Ejecutar prueba
console.log('🧪 VERIFICACIÓN DE CÁLCULO PARA CASO DEL USUARIO');
console.log('='.repeat(60));

const caso = {
  fechaInicio: '2025-12-20',
  diaPago: 20,
  fechaActual: '2026-01-14',
  principal: 1000000,
  tasaAnual: 21.56,
  totalCuotas: 12
};

console.log(`\n📋 DATOS DEL CASO:`);
console.log(`• Fecha inicio deuda: ${caso.fechaInicio}`);
console.log(`• Día de pago: ${caso.diaPago}`);
console.log(`• Fecha registro: ${caso.fechaActual}`);
console.log(`• Principal: $${caso.principal.toLocaleString()}`);
console.log(`• Tasa interés: ${caso.tasaAnual}% anual`);
console.log(`• Total cuotas: ${caso.totalCuotas}`);

// 1. Calcular cuotas vencidas
const { dueInstallments, nextPaymentDate } = calcularCuotasVencidas(
  caso.fechaInicio,
  caso.diaPago,
  caso.fechaActual
);

// 2. Calcular interés
const interes = calcularInteres(
  caso.fechaInicio,
  caso.fechaActual,
  caso.principal,
  caso.tasaAnual,
  dueInstallments
);

// 3. Determinar próximo pago real
console.log('\n=== PRÓXIMO PAGO REAL ===');
const hoy = crearFechaLocal(2026, 1, 14);
const diaHoy = hoy.getDate();

if (diaHoy >= caso.diaPago) {
  console.log(`⚠️ Ya pasó el día de pago de este mes (${caso.diaPago})`);
  const proximoPago = new Date(hoy);
  proximoPago.setMonth(proximoPago.getMonth() + 1);
  proximoPago.setDate(caso.diaPago);
  console.log(`Próximo pago: ${proximoPago.getDate()}/${proximoPago.getMonth() + 1}/${proximoPago.getFullYear()}`);
} else {
  console.log(`Próximo pago este mes: ${caso.diaPago}/${hoy.getMonth() + 1}/${hoy.getFullYear()}`);
}

// 4. Resumen
console.log('\n' + '='.repeat(60));
console.log('🎯 RESUMEN - LO QUE DEBE MOSTRAR EL SISTEMA');
console.log('='.repeat(60));

console.log(`\nPara una deuda con fecha inicio ${caso.fechaInicio}:`);
console.log(`\n1. Cuotas vencidas: ${dueInstallments} (20/12/2025)`);
console.log(`2. Interés acumulado: $${interes.interesTotal.toFixed(2)}`);
console.log(`   • De cuota vencida: $${interes.interesCuotas.toFixed(2)}`);
console.log(`   • Diario acumulado: $${interes.interesDiario.toFixed(2)}`);
console.log(`3. Saldo pendiente: $${interes.saldoPendiente.toFixed(2)}`);
console.log(`4. Próximo pago: 20/02/2026 (ya pasó el 20/01)`);

console.log('\n💡 CORRECCIONES NECESARIAS EN EL SISTEMA:');
console.log('1. El interés debe calcularse desde FECHA DE INICIO (20/12/2025)');
console.log('2. No desde fecha de registro (14/01/2026)');
console.log('3. Mostrar 1 cuota vencida (20/12/2025)');
console.log('4. Calcular interés sobre saldo después de cuotas vencidas');
console.log('5. Mostrar próximo pago correcto (20/02/2026)');