import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { parseUtcDate } from '../../utils/dateUtils';

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

export async function SalesReportPDF(sales, filters = {}) {
  if (!sales || sales.length === 0) return null;

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
  const totalVentas = sales.reduce((sum, s) => sum + parseFloat(s.total), 0);

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

  doc.setFontSize(10);
  doc.setTextColor(...C.dark);
  doc.text('VENTAS POR PERIODO', PW - MR, y + 5, { align: 'right' });

  y += 16;

  // Separador
  doc.setDrawColor(...C.light);
  doc.setLineWidth(0.3);
  doc.line(ML, y, PW - MR, y);

  y += 7;

  // Metadatos
  const blockW = CW / 4;
  const blocks = [
    { label: 'PERIODO',          value: `${filters.start_date || '-'} / ${filters.end_date || '-'}` },
    { label: 'GENERADO EL',      value: now.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }) },
    { label: 'TOTAL DE VENTAS',  value: String(sales.length) },
    { label: 'INGRESOS TOTALES', value: '$' + totalVentas.toFixed(2), color: C.blue },
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

  y += 2;

  // Una sección por cada venta
  sales.forEach((sale, index) => {
    // Nueva página si no hay espacio suficiente
    if (y > PH - 60) {
      doc.addPage();
      addPageBackground();
      y = 20;
    }

    const saleDate  = parseUtcDate(sale.sale_date);
    const fechaVenta = saleDate.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const horaVenta  = saleDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true });

    y += 6;

    // Folio
    doc.setFont('courier', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...C.blue);
    doc.text(sale.folio, ML, y);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...C.dark);
    doc.text('$' + parseFloat(sale.total).toFixed(2), PW - MR, y, { align: 'right' });

    y += 5; // 👈 baja a la siguiente línea

    // Metadatos debajo del folio
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...C.lightGray);
    doc.text(
      `${fechaVenta}  ${horaVenta}  ·  ${sale.seller_name}  ·  ${sale.payment_method || 'Efectivo'}`,
      ML, y
    );

    y += 3;

    // Tabla de detalles
    autoTable(doc, {
      startY: y,
      margin: { left: ML + 4, right: MR },
      body: sale.details.map(d => [
        d.product_name,
        d.quantity,
        '$' + parseFloat(d.unit_price).toFixed(2),
        '$' + parseFloat(d.subtotal).toFixed(2),
      ]),
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 16, halign: 'center' },
        2: { cellWidth: 26, halign: 'right' },
        3: { cellWidth: 26, halign: 'right' },
      },
      bodyStyles: {
        font: 'helvetica',
        fontStyle: 'normal',
        fontSize: 8,
        textColor: C.mid,
        fillColor: false,
        lineColor: C.light,
        lineWidth: { bottom: 0.2, top: 0, left: 0, right: 0 },
        cellPadding: { top: 3, bottom: 3, left: 0, right: 0 },
      },
      alternateRowStyles: { fillColor: false },
      didParseCell(data) {
        if (data.column.index === 0) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.textColor = C.dark;
        }
        if (data.column.index === 3) {
          data.cell.styles.fontStyle = 'bold';
        }
      },
    });

    y = doc.lastAutoTable.finalY + 4;

    // Separador entre ventas (excepto la última)
    if (index < sales.length - 1) {
      doc.setDrawColor(...C.light);
      doc.setLineWidth(0.2);
      doc.line(ML, y, PW - MR, y);
    }
  });

  // Footer en última página
  y += 10;
  if (y > PH - 30) {
    doc.addPage();
    addPageBackground();
    y = 20;
  }

  doc.setDrawColor(...C.light);
  doc.setLineWidth(0.2);
  doc.line(ML, y, PW - MR, y);

  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...C.dark);
  doc.text('FarmaUady — Reporte de Ventas por Periodo', PW / 2, y, { align: 'center' });

  y += 5;
  doc.setFontSize(6.5);
  doc.setTextColor(...C.lightGray);
  doc.text('Tizimín, Yucatán  •  farmauady.xubat.dev', PW / 2, y, { align: 'center' });

  // Número de página en todas las páginas
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