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

const MOVEMENT_LABELS = {
  SALIDA:     "Salida",
  ENTRADA:    "Entrada",
  AJUSTE:     "Ajuste",
  CADUCIDAD:  "Caducidad",
  DEVOLUCION: "Devolución",
};

export async function ManualMovementsReportPDF(movements) {
  if (!movements || movements.length === 0) return null;

  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const PW = doc.internal.pageSize.getWidth();
  const PH = doc.internal.pageSize.getHeight();
  const ML = 20;
  const MR = 20;
  const CW = PW - ML - MR;

  const addPageBackground = () => {
    doc.setFillColor(...C.pageBg);
    doc.rect(0, 0, PW, PH, 'F');
  };

  addPageBackground();

  const now = new Date();
  let y = 22;

  // Logo
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...C.blue);
  doc.text('FARMAUADY', ML, y);

  doc.setFontSize(6.5);
  doc.setTextColor(...C.blueLight);
  doc.text('SISTEMA DE GESTIÓN FARMACÉUTICA', ML, y + 5.5);

  // Título reporte
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...C.lightGray);
  doc.text('TIPO DE REPORTE', PW - MR, y - 1, { align: 'right' });

  doc.setFontSize(10);
  doc.setTextColor(...C.dark);
  doc.text('SALIDAS DE INVENTARIO', PW - MR, y + 5, { align: 'right' });

  y += 16;

  // Separador
  doc.setDrawColor(...C.light);
  doc.setLineWidth(0.3);
  doc.line(ML, y, PW - MR, y);

  y += 7;

  // Metadatos
  const blockW = CW / 3;
  const blocks = [
    { label: 'GENERADO EL', value: now.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }) },
    { label: 'HORA',        value: now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true }) },
    { label: 'TOTAL MOVIMIENTOS', value: String(movements.length), color: C.blue },
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
      { content: 'PRODUCTO',   styles: { halign: 'left' } },
      { content: 'TIPO',       styles: { halign: 'left' } },
      { content: 'CANTIDAD',   styles: { halign: 'center' } },
      { content: 'MOTIVO',     styles: { halign: 'left' } },
      { content: 'USUARIO',    styles: { halign: 'left' } },
      { content: 'FECHA',      styles: { halign: 'left' } },
    ]],
    body: movements.map(m => [
      m.product_name,
      MOVEMENT_LABELS[m.movement_type] || m.movement_type,
      m.quantity,
      m.reason || '—',
      m.user_name,
      new Date(m.movement_date).toLocaleDateString('es-MX', {
        day: '2-digit', month: '2-digit', year: 'numeric',
      }),
    ]),
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 24 },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 35 },
      4: { cellWidth: 35 },
      5: { cellWidth: 24 },
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
      if (data.section === 'body' && data.column.index === 0) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.textColor = C.dark;
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
  doc.text('FarmaUady — Reporte de Salidas de Inventario', PW / 2, fy, { align: 'center' });

  fy += 5;
  doc.setFontSize(6.5);
  doc.setTextColor(...C.lightGray);
  doc.text('Tizimín, Yucatán  •  farmauady.xubat.dev', PW / 2, fy, { align: 'center' });

  // Número de página
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(6);
    doc.setTextColor(...C.border);
    doc.text(
      `Página ${i} de ${totalPages}  ·  Generado el ${now.toLocaleDateString('es-MX')}`,
      PW / 2, PH - 10,
      { align: 'center' },
    );
  }

  return doc.output('blob');
}