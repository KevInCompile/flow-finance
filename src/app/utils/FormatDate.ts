export const FormatDate = (date: string) => {
  const fecha = new Date(date);

  // Obtener el día, el año y el nombre del mes en español
  const dia = fecha.getDate();
  const año = fecha.getFullYear();
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const mesNombre = meses[fecha.getMonth()];

  // Obtener la hora, los minutos y los segundos
  let hora = fecha.getHours();
  const minutos = fecha.getMinutes();

  // Determinar si es AM o PM
  const periodo = hora >= 12 ? "PM" : "AM";

  // Convertir la hora al formato de 12 horas
  hora = hora > 12 ? hora - 12 : hora;
  hora = hora === 0 ? 12 : hora;

  const time = Math.floor(minutos).toString().padStart(2, "0");

  // Formatear la hora con AM/PM
  const horaFormateada = hora + ":" + time + " " + periodo;

  // Formatear la fecha y hora como "16 de Febrero de 2024, 11:27:00"
  const fechaFormateada = dia + " de " + mesNombre;
    // dia + " de " + mesNombre + " de " + año + ", " + horaFormateada;

  // Imprimir la fecha y hora formateada

  return fechaFormateada;
};
