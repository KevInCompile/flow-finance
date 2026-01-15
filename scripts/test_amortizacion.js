/**
 * Script de prueba para cálculo de amortización francesa (cuota fija)
 * 
 * Este script verifica que la fórmula de amortización funcione correctamente
 * según la implementación en el sistema.
 * 
 * Fórmula de amortización francesa:
 * Cuota mensual = P * [i(1+i)^n] / [(1+i)^n - 1]
 * 
 * Donde:
 * P = principal (monto del préstamo)
 * i = tasa de interés mensual (tasa anual / 100 / 12)
 * n = número de cuotas (meses)
 */

function calcularCuotaMensual(principal, tasaAnual, meses) {
  if (tasaAnual <= 0) {
    // Sin interés, cuota simple
    return principal / meses;
  }
  
  // Convertir tasa anual a tasa mensual
  const tasaMensual = tasaAnual / 100 / 12;
  
  // Fórmula de amortización francesa
  const numerador = tasaMensual * Math.pow(1 + tasaMensual, meses);
  const denominador = Math.pow(1 + tasaMensual, meses) - 1;
  
  if (denominador === 0) {
    return principal / meses;
  }
  
  const cuotaMensual = principal * (numerador / denominador);
  
  return cuotaMensual;
}

function generarTablaAmortizacion(principal, tasaAnual, meses) {
  const cuotaMensual = calcularCuotaMensual(principal, tasaAnual, meses);
  const tasaMensual = tasaAnual / 100 / 12;
  
  let saldoPendiente = principal;
  const tablaAmortizacion = [];
  let interesTotal = 0;
  let capitalTotal = 0;
  
  console.log('\n=== TABLA DE AMORTIZACIÓN ===\n');
  console.log(`Principal: $${principal.toLocaleString()}`);
  console.log(`Tasa anual: ${tasaAnual}%`);
  console.log(`Meses: ${meses}`);
  console.log(`Cuota mensual: $${cuotaMensual.toFixed(2)}\n`);
  
  console.log('Mes | Cuota | Interés | Capital | Saldo Pendiente');
  console.log('----|-------|---------|---------|----------------');
  
  for (let mes = 1; mes <= meses; mes++) {
    const interesMensual = saldoPendiente * tasaMensual;
    const capitalMensual = cuotaMensual - interesMensual;
    saldoPendiente -= capitalMensual;
    
    interesTotal += interesMensual;
    capitalTotal += capitalMensual;
    
    tablaAmortizacion.push({
      mes,
      cuota: cuotaMensual,
      interes: interesMensual,
      capital: capitalMensual,
      saldoPendiente: saldoPendiente > 0 ? saldoPendiente : 0
    });
    
    console.log(
      `${mes.toString().padStart(3)} |` +
      ` $${cuotaMensual.toFixed(2).padStart(6)} |` +
      ` $${interesMensual.toFixed(2).padStart(8)} |` +
      ` $${capitalMensual.toFixed(2).padStart(8)} |` +
      ` $${saldoPendiente.toFixed(2).padStart(15)}`
    );
  }
  
  console.log('\n=== RESUMEN FINAL ===');
  console.log(`Total pagado: $${(cuotaMensual * meses).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
  console.log(`- Capital: $${capitalTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
  console.log(`- Interés: $${interesTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
  console.log(`Interés como % del total: ${((interesTotal / (cuotaMensual * meses)) * 100).toFixed(2)}%`);
  
  return {
    cuotaMensual,
    totalPagado: cuotaMensual * meses,
    interesTotal,
    capitalTotal,
    tablaAmortizacion
  };
}

function testAmortizacion() {
  console.log('=== PRUEBAS DE AMORTIZACIÓN FRANCESA ===\n');
  
  // Caso 1: Préstamo de $1,000,000 al 15% anual a 12 meses
  console.log('Caso 1: Préstamo de $1,000,000 al 15% anual a 12 meses');
  const resultado1 = generarTablaAmortizacion(1000000, 15, 12);
  
  // Verificación matemática
  const cuotaEsperada1 = 90258.07; // Valor conocido para este caso
  const diferencia1 = Math.abs(resultado1.cuotaMensual - cuotaEsperada1);
  console.log(`\nVerificación: Cuota calculada = $${resultado1.cuotaMensual.toFixed(2)}`);
  console.log(`Cuota esperada = $${cuotaEsperada1.toFixed(2)}`);
  console.log(`Diferencia = $${diferencia1.toFixed(2)}`);
  console.log(`✅ ${diferencia1 < 0.1 ? 'PASÓ' : 'FALLÓ'}\n`);
  
  // Caso 2: Préstamo sin interés
  console.log('\nCaso 2: Préstamo de $50,000 sin interés a 10 meses');
  const resultado2 = generarTablaAmortizacion(50000, 0, 10);
  const cuotaEsperada2 = 5000; // 50000 / 10
  const diferencia2 = Math.abs(resultado2.cuotaMensual - cuotaEsperada2);
  console.log(`\nVerificación: Cuota calculada = $${resultado2.cuotaMensual.toFixed(2)}`);
  console.log(`Cuota esperada = $${cuotaEsperada2.toFixed(2)}`);
  console.log(`Diferencia = $${diferencia2.toFixed(2)}`);
  console.log(`✅ ${diferencia2 < 0.01 ? 'PASÓ' : 'FALLÓ'}\n`);
  
  // Caso 3: Préstamo con tasa alta
  console.log('\nCaso 3: Préstamo de $10,000 al 30% anual a 6 meses');
  const resultado3 = generarTablaAmortizacion(10000, 30, 6);
  
  // Verificar que el interés del primer mes sea correcto
  const interesPrimerMesEsperado = 10000 * (30/100/12); // 250
  const interesPrimerMesCalculado = resultado3.tablaAmortizacion[0].interes;
  const diferencia3 = Math.abs(interesPrimerMesCalculado - interesPrimerMesEsperado);
  console.log(`\nVerificación: Interés primer mes calculado = $${interesPrimerMesCalculado.toFixed(2)}`);
  console.log(`Interés primer mes esperado = $${interesPrimerMesEsperado.toFixed(2)}`);
  console.log(`Diferencia = $${diferencia3.toFixed(2)}`);
  console.log(`✅ ${diferencia3 < 0.01 ? 'PASÓ' : 'FALLÓ'}\n`);
  
  // Caso 4: Préstamo a largo plazo
  console.log('\nCaso 4: Préstamo de $500,000 al 12% anual a 60 meses (5 años)');
  const resultado4 = generarTablaAmortizacion(500000, 12, 60);
  
  // Verificar propiedades de la amortización
  console.log('\nVerificación de propiedades:');
  console.log(`1. Último saldo debe ser cercano a 0: $${resultado4.tablaAmortizacion[59].saldoPendiente.toFixed(2)}`);
  console.log(`   ✅ ${Math.abs(resultado4.tablaAmortizacion[59].saldoPendiente) < 0.1 ? 'PASÓ' : 'FALLÓ'}`);
  
  console.log(`2. Suma de capital debe ser igual al principal: $${resultado4.capitalTotal.toFixed(2)} vs $500,000.00`);
  console.log(`   ✅ ${Math.abs(resultado4.capitalTotal - 500000) < 0.1 ? 'PASÓ' : 'FALLÓ'}`);
  
  console.log(`3. Cuota debe ser constante: $${resultado4.cuotaMensual.toFixed(2)} en todos los meses`);
  console.log(`   ✅ ${resultado4.tablaAmortizacion.every(item => Math.abs(item.cuota - resultado4.cuotaMensual) < 0.1) ? 'PASÓ' : 'FALLÓ'}`);
}

function compararConCuotaSimple() {
  console.log('\n\n=== COMPARACIÓN: AMORTIZACIÓN VS CUOTA SIMPLE ===\n');
  
  const principal = 1000000;
  const tasaAnual = 15;
  const meses = 12;
  
  // Amortización francesa
  const cuotaAmortizacion = calcularCuotaMensual(principal, tasaAnual, meses);
  const totalAmortizacion = cuotaAmortizacion * meses;
  const interesAmortizacion = totalAmortizacion - principal;
  
  // Cuota simple (sin amortización)
  const interesSimple = principal * (tasaAnual / 100) * (meses / 12); // Interés simple anual
  const cuotaSimple = (principal + interesSimple) / meses;
  const totalSimple = cuotaSimple * meses;
  
  console.log(`Préstamo: $${principal.toLocaleString()} al ${tasaAnual}% anual por ${meses} meses\n`);
  
  console.log('MÉTODO              | CUOTA MENSUAL | TOTAL A PAGAR | INTERÉS TOTAL');
  console.log('--------------------|---------------|---------------|--------------');
  console.log(
    `Amortización Francesa | $${cuotaAmortizacion.toFixed(2).padStart(12)} |` +
    ` $${totalAmortizacion.toFixed(2).padStart(12)} |` +
    ` $${interesAmortizacion.toFixed(2).padStart(12)}`
  );
  console.log(
    `Cuota Simple          | $${cuotaSimple.toFixed(2).padStart(12)} |` +
    ` $${totalSimple.toFixed(2).padStart(12)} |` +
    ` $${interesSimple.toFixed(2).padStart(12)}`
  );
  
  console.log(`\nDiferencia en cuota mensual: $${(cuotaAmortizacion - cuotaSimple).toFixed(2)}`);
  console.log(`Diferencia en interés total: $${(interesAmortizacion - interesSimple).toFixed(2)}`);
  console.log(`\nLa amortización francesa genera menos interés porque paga capital más rápido.`);
}

// Ejecutar pruebas
testAmortizacion();
compararConCuotaSimple();

// Ejemplo práctico para mostrar al usuario
console.log('\n\n=== EJEMPLO PRÁCTICO PARA EL USUARIO ===\n');
console.log('Cuando creas una deuda con interés, el sistema calcula automáticamente:');
console.log('1. La cuota mensual que incluye capital + intereses');
console.log('2. Cuánto de cada cuota corresponde a intereses vs capital');
console.log('3. El interés total que pagarás durante toda la deuda');
console.log('4. El saldo pendiente después de cada pago');
console.log('\nEsto te permite ver exactamente cómo se distribuyen tus pagos.');

// Mostrar ejemplo detallado
console.log('\n--- Ejemplo: Préstamo de $5,000,000 al 18% anual a 24 meses ---');
const ejemplo = generarTablaAmortizacion(5000000, 18, 24);
console.log('\n📊 Con este préstamo:');
console.log(`• Pagarás $${ejemplo.cuotaMensual.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} mensuales`);
console.log(`• Al final pagarás $${ejemplo.totalPagado.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} en total`);
console.log(`• De los cuales $${ejemplo.interesTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} son intereses`);
console.log(`• El interés representa el ${((ejemplo.interesTotal / ejemplo.totalPagado) * 100).toFixed(1)}% del total pagado`);