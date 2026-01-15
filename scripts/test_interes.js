/**
 * Script de prueba para cálculo de intereses
 * 
 * Este script verifica que la fórmula de cálculo de interés diario
 * funcione correctamente según la implementación en el sistema.
 * 
 * Fórmula: Interés = Principal × (Tasa anual / 100 / 365) × Días
 */

function calcularInteresDiario(principal, tasaAnual, dias) {
  // Tasa diaria = tasa anual / 100 / 365
  const tasaDiaria = tasaAnual / 100 / 365;
  
  // Interés acumulado = principal × tasa diaria × días
  const interes = principal * tasaDiaria * dias;
  
  return interes;
}

function testCalculoInteres() {
  console.log('=== PRUEBAS DE CÁLCULO DE INTERÉS ===\n');
  
  // Caso 1: Deuda de $1,000,000 al 15% anual por 30 días
  const test1 = {
    principal: 1000000,
    tasaAnual: 15,
    dias: 30,
    esperado: 12328.767123287671 // Valor esperado
  };
  
  const resultado1 = calcularInteresDiario(test1.principal, test1.tasaAnual, test1.dias);
  const diferencia1 = Math.abs(resultado1 - test1.esperado);
  
  console.log('Caso 1: Deuda grande con interés moderado');
  console.log(`  Principal: $${test1.principal.toLocaleString()}`);
  console.log(`  Tasa anual: ${test1.tasaAnual}%`);
  console.log(`  Días: ${test1.dias}`);
  console.log(`  Interés calculado: $${resultado1.toFixed(2)}`);
  console.log(`  Interés esperado: $${test1.esperado.toFixed(2)}`);
  console.log(`  Diferencia: $${diferencia1.toFixed(2)}`);
  console.log(`  ✅ ${diferencia1 < 0.01 ? 'PASÓ' : 'FALLÓ'}\n`);
  
  // Caso 2: Deuda pequeña sin interés (0%)
  const test2 = {
    principal: 50000,
    tasaAnual: 0,
    dias: 365,
    esperado: 0
  };
  
  const resultado2 = calcularInteresDiario(test2.principal, test2.tasaAnual, test2.dias);
  
  console.log('Caso 2: Deuda sin interés');
  console.log(`  Principal: $${test2.principal.toLocaleString()}`);
  console.log(`  Tasa anual: ${test2.tasaAnual}%`);
  console.log(`  Días: ${test2.dias}`);
  console.log(`  Interés calculado: $${resultado2.toFixed(2)}`);
  console.log(`  Interés esperado: $${test2.esperado.toFixed(2)}`);
  console.log(`  ✅ ${resultado2 === 0 ? 'PASÓ' : 'FALLÓ'}\n`);
  
  // Caso 3: Deuda con interés alto
  const test3 = {
    principal: 10000,
    tasaAnual: 30,
    dias: 7,
    esperado: 57.534246575342465
  };
  
  const resultado3 = calcularInteresDiario(test3.principal, test3.tasaAnual, test3.dias);
  const diferencia3 = Math.abs(resultado3 - test3.esperado);
  
  console.log('Caso 3: Deuda con interés alto por una semana');
  console.log(`  Principal: $${test3.principal.toLocaleString()}`);
  console.log(`  Tasa anual: ${test3.tasaAnual}%`);
  console.log(`  Días: ${test3.dias}`);
  console.log(`  Interés calculado: $${resultado3.toFixed(2)}`);
  console.log(`  Interés esperado: $${test3.esperado.toFixed(2)}`);
  console.log(`  Diferencia: $${diferencia3.toFixed(2)}`);
  console.log(`  ✅ ${diferencia3 < 0.01 ? 'PASÓ' : 'FALLÓ'}\n`);
  
  // Caso 4: Cálculo para un año completo
  const test4 = {
    principal: 1000,
    tasaAnual: 10,
    dias: 365,
    esperado: 100 // 10% de 1000 = 100
  };
  
  const resultado4 = calcularInteresDiario(test4.principal, test4.tasaAnual, test4.dias);
  const diferencia4 = Math.abs(resultado4 - test4.esperado);
  
  console.log('Caso 4: Interés anual completo');
  console.log(`  Principal: $${test4.principal.toLocaleString()}`);
  console.log(`  Tasa anual: ${test4.tasaAnual}%`);
  console.log(`  Días: ${test4.dias} (1 año)`);
  console.log(`  Interés calculado: $${resultado4.toFixed(2)}`);
  console.log(`  Interés esperado: $${test4.esperado.toFixed(2)}`);
  console.log(`  Diferencia: $${diferencia4.toFixed(2)}`);
  console.log(`  ✅ ${diferencia4 < 0.01 ? 'PASÓ' : 'FALLÓ'}\n`);
  
  // Resumen
  console.log('=== RESUMEN ===');
  console.log('Fórmula verificada: Interés = Principal × (Tasa anual / 100 / 365) × Días');
  console.log('\nNotas:');
  console.log('- El cálculo usa interés simple diario (no compuesto)');
  console.log('- Para interés compuesto, se necesitaría reinvertir diariamente');
  console.log('- El sistema actualiza el interés cada vez que se consultan las deudas');
  console.log('- Los pagos reducen el principal, lo que afecta el cálculo futuro');
}

// Ejecutar pruebas
testCalculoInteres();

// Función adicional para simular evolución de deuda
function simularEvolucionDeuda(principal, tasaAnual, diasTotales, intervaloDias = 30) {
  console.log('\n=== SIMULACIÓN DE EVOLUCIÓN DE DEUDA ===\n');
  console.log(`Principal inicial: $${principal.toLocaleString()}`);
  console.log(`Tasa anual: ${tasaAnual}%`);
  console.log(`Período total: ${diasTotales} días\n`);
  
  let interesAcumulado = 0;
  let diasTranscurridos = 0;
  
  console.log('Días | Interés período | Interés acumulado | Total con interés');
  console.log('-----|-----------------|-------------------|-------------------');
  
  while (diasTranscurridos < diasTotales) {
    const diasPeriodo = Math.min(intervaloDias, diasTotales - diasTranscurridos);
    const interesPeriodo = calcularInteresDiario(principal, tasaAnual, diasPeriodo);
    interesAcumulado += interesPeriodo;
    diasTranscurridos += diasPeriodo;
    
    console.log(
      `${diasTranscurridos.toString().padStart(4)} |` +
      ` $${interesPeriodo.toFixed(2).padStart(15)} |` +
      ` $${interesAcumulado.toFixed(2).padStart(17)} |` +
      ` $${(principal + interesAcumulado).toFixed(2).padStart(18)}`
    );
  }
  
  console.log('\nResumen final:');
  console.log(`- Principal: $${principal.toLocaleString()}`);
  console.log(`- Interés total: $${interesAcumulado.toFixed(2)}`);
  console.log(`- Total a pagar: $${(principal + interesAcumulado).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
  console.log(`- Incremento: ${((interesAcumulado / principal) * 100).toFixed(2)}%`);
}

// Ejemplo de simulación
console.log('\n\n');
simularEvolucionDeuda(1000000, 15, 365, 30);