import Joyride, { Step } from "react-joyride";

const steps: Step[] = [
    {
      target: ".saldo-total",
      content: "Aquí puedes ver el saldo total de tus cuentas. Selecciona una cuenta para ver su saldo específico.",
      disableBeacon: true,
    },
    {
      target: ".deudas",
      content: "Esta sección muestra tus deudas actuales. Puedes ver el total de cada deuda y la fecha del próximo pago.",
    },
    {
      target: ".grafico",
      content: "Este gráfico muestra tus gastos diarios del mes actual. Puedes navegar entre los meses usando los botones 'Anterior' y 'Siguiente'."
    },
    {
      target: ".registrar-movimiento",
      content: "Usa este botón para registrar nuevos ingresos o gastos en tus cuentas.",
    },
    {
      target: ".movimientos",
      content: "Aquí puedes ver un resumen de tus gastos e ingresos del mes actual. Haz clic en un gasto para ver más detalles.",
    },
  ]

export default function Tour ({runTour}: {runTour: boolean}) {

  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous={true}
      showSkipButton={true}
      showProgress={true}
      styles={{
        options: {
          primaryColor: "#A854F7",
        },
      }}
    />
  )
}
