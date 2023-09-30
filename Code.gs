function doGet() {
  return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setTitle('Educadores en IFI');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

//A. Funciones para Acceder y Manipular Datos

function obtenerEducadores() {
  const hojaResumen = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RESUMEN');
  const lastRow = hojaResumen.getLastRow();
  if (lastRow < 2) return []; // Devuelve un array vacío si no hay datos
  return hojaResumen.getRange(2, 1, lastRow - 1, 5).getValues(); // Cambiado a 5 para obtener solo las primeras cinco columnas
}


function obtenerObservaciones(idEducador) {
    console.log(`ID Educador Tipo: ${typeof idEducador}`); // log del tipo de idEducador

    const hojaObservaciones = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Observaciones');
    const data = hojaObservaciones.getRange(2, 1, hojaObservaciones.getLastRow(), 4).getValues(); // También he corregido el rango aquí

    const observaciones = data.filter(row => String(row[0]) === String(idEducador))
.map(row => {
  // Convertir la fecha a string en un formato amigable
  let fecha = new Date(row[2]);
  let fechaFormateada = Utilities.formatDate(fecha, "GMT", "dd'/'MM'/'yyyy"); 
  return {
    idEducador: row[0],
    nombreEditor: row[1],
    fecha: fechaFormateada, // Usar el string formateado
    descripcion: row[3]
  };
});


if(!observaciones) return [];
console.log(`Total Observations found: ${observaciones.length}`);
console.log(observaciones);
    return observaciones;
}


function obtenerEducadoresFiltrados(colegio) {
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RESUMEN');
  const filas = hoja.getDataRange().getValues();
  
  const educadoresFiltrados = filas
    .filter(fila => fila[3] === colegio) // Asumiendo que el colegio está en la cuarta columna (columna D)
    .map(fila => {
      return {
        id: fila[0],
        nombre: fila[1],
        nivel: fila[2],
        colegio: fila[3],
        telefono: fila[4],
        email: fila[5],
        tutorAsignado: fila[6],
        emailTutor: fila[7]
      };
    });

  return educadoresFiltrados;
}



function obtenerInfoEducador(id) {
  const hojaResumen = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RESUMEN');
  const datos = hojaResumen.getRange(2, 1, hojaResumen.getLastRow(), 10).getValues();
  
  for (const fila of datos) {
    if (fila[0] === id) {
      return fila; // Retornamos la información encontrada
    }
  }
  
  return null; // Retornamos null si no encontramos información
}
