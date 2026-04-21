import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const C = {
  blue:      [0, 123, 255],
  blueDark:  [0, 102, 204],
  blueLight: [160, 196, 255],
  dark:      [38, 38, 38],
  mid:       [64, 64, 64],
  lightGray: [115, 115, 115],
  border:    [160, 160, 160],
  light:     [245, 245, 245],
  pageBg:    [248, 250, 252],
};

export async function generateTicketPDF(sale) {
  if (!sale) return null;

  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const PW = doc.internal.pageSize.getWidth();
  const PH = doc.internal.pageSize.getHeight();
  const ML = 20;
  const MR = 20;
  const CW = PW - ML - MR;

  // Fondo de página
  doc.setFillColor(...C.pageBg);
  doc.rect(0, 0, PW, PH, 'F');

  //Datos de la venta
  const dateObj   = new Date(sale.sale_date);
  const fecha     = dateObj.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
  const hora      = dateObj.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true });
  const metodoPago = sale.payment_method
    ? sale.payment_method.charAt(0).toUpperCase() + sale.payment_method.slice(1)
    : 'Efectivo';
  const subtotal = sale.details.reduce((s, d) => s + parseFloat(d.subtotal), 0);
  const total    = parseFloat(sale.total);

  let y = 22;

  // Logo "FARMAUADY"
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...C.blue);
  doc.text('FARMAUADY', ML, y);

  // Subtítulo
  doc.setFontSize(6.5);
  doc.setTextColor(...C.blueLight);
  doc.text('SISTEMA DE GESTIÓN FARMACÉUTICA', ML, y + 5.5);

  // Folio (derecha)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...C.lightGray);
  doc.text('FOLIO DE VENTA', PW - MR, y - 1, { align: 'right' });

  doc.setFont('courier', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...C.dark);
  doc.text(sale.folio, PW - MR, y + 5, { align: 'right' });

  y += 16;

  // Separador
  doc.setDrawColor(...C.light);
  doc.setLineWidth(0.3);
  doc.line(ML, y, PW - MR, y);

  y += 7;

  //Metadatos d la venta
  const blockW = CW / 4;
  const blocks = [
    { label: 'FECHA',    value: fecha },
    { label: 'HORA',     value: hora },
    { label: 'VENDEDOR', value: sale.seller_name || '-' },
    { label: 'PAGO',     value: metodoPago.toUpperCase(), color: C.blueDark },
  ];

  blocks.forEach((b, i) => {
    const bx = ML + i * blockW;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...C.lightGray);
    doc.text(b.label, bx, y);

    doc.setFontSize(8.5);
    doc.setTextColor(...(b.color || C.mid));
    doc.text(b.value, bx, y + 5.5);
  });

  y += 14;

  //productos
  doc.setDrawColor(...C.dark);
  doc.setLineWidth(0.4);
  doc.line(ML, y, PW - MR, y);

  autoTable(doc, {
    startY: y,
    margin: { left: ML, right: MR },
    head: [[
      { content: 'CONCEPTO',  styles: { halign: 'left' } },
      { content: 'CANT.',     styles: { halign: 'center' } },
      { content: 'PRECIO',    styles: { halign: 'right' } },
      { content: 'SUBTOTAL',  styles: { halign: 'right' } },
    ]],
    body: sale.details.map(item => [
      item.product_name,
      item.quantity,
      '$' + parseFloat(item.unit_price).toFixed(2),
      '$' + parseFloat(item.subtotal).toFixed(2),
    ]),
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 18, halign: 'center' },
      2: { cellWidth: 28, halign: 'right' },
      3: { cellWidth: 28, halign: 'right' },
    },
    headStyles: {
      font: 'helvetica',
      fontStyle: 'bold',
      fontSize: 7.5,
      textColor: C.dark,
      fillColor: C.pageBg,
      lineColor: C.dark,
      lineWidth: { bottom: 0.4, top: 0, left: 0, right: 0 },
      cellPadding: { top: 4, bottom: 4, left: 0, right: 0 },
    },
    bodyStyles: {
      font: 'helvetica',
      fontStyle: 'normal',
      fontSize: 9,
      textColor: C.mid,
      fillColor: false,
      lineColor: C.light,
      lineWidth: { bottom: 0.2, top: 0, left: 0, right: 0 },
      cellPadding: { top: 5, bottom: 5, left: 0, right: 0 },
    },
    alternateRowStyles: { fillColor: false },

    //Nombre del producto
    didParseCell(data) {
      if (data.section === 'body' && data.column.index === 0) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.textColor = C.dark;
      }
      if (data.section === 'body' && data.column.index === 3) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.textColor = C.dark;
      }
    },
  });

  let fy = doc.lastAutoTable.finalY + 6;

  //totales
  doc.setDrawColor(...C.dark);
  doc.setLineWidth(0.4);
  doc.line(ML, fy, PW - MR, fy);

  fy += 7;
  const tX = PW - MR - 72; // inicio bloque de totales

  //Subtotal
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.lightGray);
  doc.text('SUBTOTAL', tX, fy);
  doc.text('$' + subtotal.toFixed(2), PW - MR, fy, { align: 'right' });

  fy += 5;

  // Impuestos
  doc.text('IMPUESTOS', tX, fy);
  doc.text('$0.00', PW - MR, fy, { align: 'right' });

  fy += 4;

  //separador total
  doc.setDrawColor(...C.light);
  doc.setLineWidth(0.2);
  doc.line(tX, fy, PW - MR, fy);

  fy += 7;

  // Total
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...C.blue);
  doc.text('TOTAL', tX, fy);

  doc.setFontSize(20);
  doc.text('$' + total.toFixed(2), PW - MR, fy + 2, { align: 'right' });

  doc.setFontSize(6);
  doc.setTextColor(...C.blueLight);
  doc.text('MONEDA: PESOS MEXICANOS', PW - MR, fy + 8, { align: 'right' });

  fy += 18;

  //footer
  doc.setDrawColor(...C.light);
  doc.setLineWidth(0.2);
  doc.line(ML, fy, PW - MR, fy);

  fy += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...C.dark);
  doc.text('¡Gracias por su compra!', PW / 2, fy, { align: 'center' });

  fy += 5;
  doc.setFontSize(6.5);
  doc.setTextColor(...C.lightGray);
  doc.text('Tizimín, Yucatán  •  farmauady.xubat.dev', PW / 2, fy, { align: 'center' });

  fy += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(...C.border);
  doc.text(
    'ESTE ES UN COMPROBANTE DE PAGO DIGITAL. PARA RECLAMACIONES O DEVOLUCIONES\nES NECESARIO PRESENTAR ESTE DOCUMENTO DENTRO DE LOS PRIMEROS 30 DÍAS.',
    PW / 2, fy,
    { align: 'center', lineHeightFactor: 1.6 },
  );

  //Número de página
  doc.setFontSize(6);
  doc.setTextColor(...C.border);
  doc.text(
    `Página 1 de 1  ·  Generado el ${new Date().toLocaleDateString('es-MX')}`,
    PW / 2, PH - 10,
    { align: 'center' },
  );

  //para descarga o preview
  return doc.output('blob');
}
