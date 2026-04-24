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
  green:     [22, 163, 74],
  yellow:    [161, 98, 7],
};

export async function InventoryReportPDF(products) {
  if (!products || products.length === 0) return null;

  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const PW = doc.internal.pageSize.getWidth();
  const PH = doc.internal.pageSize.getHeight();
  const ML = 20;
  const MR = 20;
  const CW = PW - ML - MR;

  // Fondo de página
  doc.setFillColor(...C.pageBg);
  doc.rect(0, 0, PW, PH, 'F');

  let y = 22;

  // Logo
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...C.blue);
  doc.text('FARMAUADY', ML, y);

  doc.setFontSize(6.5);
  doc.setTextColor(...C.blueLight);
  doc.text('SISTEMA DE GESTIÓN FARMACÉUTICA', ML, y + 5.5);

  // Título reporte (derecha)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...C.lightGray);
  doc.text('TIPO DE REPORTE', PW - MR, y - 1, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...C.dark);
  doc.text('ESTADO DE INVENTARIO', PW - MR, y + 5, { align: 'right' });

  y += 16;

  // Separador
  doc.setDrawColor(...C.light);
  doc.setLineWidth(0.3);
  doc.line(ML, y, PW - MR, y);

  y += 7;

  // Metadatos
  const now = new Date();
  const fecha = now.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
  const hora  = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true });
  const totalProductos  = products.length;
  const stockCritico    = products.filter(p => p.stock <= p.minimum_stock).length;

  const blockW = CW / 4;
  const blocks = [
    { label: 'FECHA DE GENERACIÓN', value: fecha },
    { label: 'HORA',                value: hora },
    { label: 'TOTAL PRODUCTOS',     value: String(totalProductos) },
    { label: 'STOCK CRÍTICO',       value: String(stockCritico), color: stockCritico > 0 ? C.yellow : C.green },
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

  // Separador
  doc.setDrawColor(...C.dark);
  doc.setLineWidth(0.4);
  doc.line(ML, y, PW - MR, y);

  // Tabla
  autoTable(doc, {
    startY: y,
    margin: { left: ML, right: MR },
    head: [[
      { content: 'MEDICAMENTO', styles: { halign: 'left' } },
      { content: 'CATEGORÍA',   styles: { halign: 'left' } },
      { content: 'SKU',         styles: { halign: 'left' } },
      { content: 'PRECIO',      styles: { halign: 'right' } },
      { content: 'EXISTENCIA',  styles: { halign: 'center' } },
      { content: 'ESTADO',      styles: { halign: 'center' } },
    ]],
    body: products.map(p => [
      p.name,
      p.category?.name || '-',
      p.sku,
      '$' + parseFloat(p.sale_price).toFixed(2),
      p.stock,
      p.stock <= p.minimum_stock ? 'Stock crítico' : 'Disponible',
    ]),
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 30 },
      2: { cellWidth: 28 },
      3: { cellWidth: 22, halign: 'right' },
      4: { cellWidth: 22, halign: 'center' },
      5: { cellWidth: 24, halign: 'center' },
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
      fontSize: 8.5,
      textColor: C.mid,
      fillColor: false,
      lineColor: C.light,
      lineWidth: { bottom: 0.2, top: 0, left: 0, right: 0 },
      cellPadding: { top: 4, bottom: 4, left: 0, right: 0 },
    },
    alternateRowStyles: { fillColor: false },
    didParseCell(data) {
      if (data.section === 'body') {
        // Nombre del producto en negrita
        if (data.column.index === 0) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.textColor = C.dark;
        }
        // Color del estado
        if (data.column.index === 5) {
          const isCritical = data.cell.raw === 'Stock crítico';
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.textColor = isCritical ? C.yellow : C.green;
        }
      }
    },
  });

  // Footer
  let fy = doc.lastAutoTable.finalY + 10;
  doc.setDrawColor(...C.light);
  doc.setLineWidth(0.2);
  doc.line(ML, fy, PW - MR, fy);

  fy += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...C.dark);
  doc.text('FarmaUady — Reporte de Estado de Inventario', PW / 2, fy, { align: 'center' });

  fy += 5;
  doc.setFontSize(6.5);
  doc.setTextColor(...C.lightGray);
  doc.text('Tizimín, Yucatán  •  farmauady.xubat.dev', PW / 2, fy, { align: 'center' });

  // Número de página
  doc.setFontSize(6);
  doc.setTextColor(...C.border);
  doc.text(
    `Página 1 de 1  ·  Generado el ${now.toLocaleDateString('es-MX')}`,
    PW / 2, PH - 10,
    { align: 'center' },
  );

  return doc.output('blob');
}