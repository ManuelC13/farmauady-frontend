import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';

const C = {
  blue900:     '#007BFF', 
  blue600:     '#0066CC', 
  blue400:     '#A0C4FF', 
  blue600_60:  'rgba(0,123,255,0.50)', 
  neutral800:  '#262626',
  neutral700:  '#404040',
  neutral600:  '#525252',
  neutral400:  '#a3a3a3',
  neutral300:  '#d4d4d4',
  neutral200:  '#e5e5e5',
  neutral100:  '#f5f5f5',
  white:       '#ffffff',
  page:        '#F8FAFC',
};

const MetaBlock = ({ label, value, color }) => (
  <View style={{ flex: 1 }}>
    <Text style={{
      fontSize: 7.5, fontWeight: 'bold', color: C.neutral400,
      textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6,
    }}>
      {label}
    </Text>
    <Text style={{ fontSize: 9, fontWeight: 'bold', color: color || C.neutral700 }}>
      {value}
    </Text>
  </View>
);

const TotalRow = ({ label, value, isTotal = false }) => (
  <View style={{
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline',
    paddingTop: isTotal ? 12 : 0,
    borderTopWidth: isTotal ? 1 : 0,
    borderTopColor: C.neutral100,
    marginTop: isTotal ? 8 : 0,
    marginBottom: isTotal ? 0 : 5,
  }}>
    <Text style={{
      fontSize: isTotal ? 9 : 8,
      fontWeight: 'bold',
      color: isTotal ? C.blue900 : C.neutral400,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
    }}>
      {label}
    </Text>
    {isTotal ? (
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: C.blue900 }}>{value}</Text>
        <Text style={{ fontSize: 6.5, fontWeight: 'bold', color: C.blue400, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Moneda: Pesos Mexicanos
        </Text>
      </View>
    ) : (
      <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.neutral400 }}>{value}</Text>
    )}
  </View>
);

//Componente principal
const TicketPDF = ({ sale }) => {
  if (!sale) return null;

  const dateObj = new Date(sale.sale_date);
  const fecha = dateObj.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
  const hora  = dateObj.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true });

  const metodoPago = sale.payment_method
    ? sale.payment_method.charAt(0).toUpperCase() + sale.payment_method.slice(1)
    : 'Efectivo';

  const subtotal = sale.details.reduce((s, d) => s + parseFloat(d.subtotal), 0);
  const total    = parseFloat(sale.total);

  return (
    <Document
      title={`Ticket ${sale.folio} — FARMAUADY`}
      author="FARMAUADY"
      subject="Comprobante de Venta"
    >
      <Page
        size="A4"
        style={{ backgroundColor: C.page, paddingVertical: 56, paddingHorizontal: 60, fontFamily: 'Helvetica' }}
      >
        {/*Encabezado*/}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48 }}>
          <View>
            <Text style={{ fontSize: 26, fontWeight: 'bold', color: C.blue900, letterSpacing: -0.5, lineHeight: 1 }}>
              FARMAUADY
            </Text>
            <Text style={{ fontSize: 7.5, color: C.blue600_60, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2.5, marginTop: 5 }}>
              Sistema de Gestión Farmacéutica
            </Text>
          </View>

          {/*Folio de la venta*/}
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 7.5, color: C.neutral400, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>
              Folio de Venta
            </Text>
            <Text style={{ fontSize: 11, fontFamily: 'Courier', fontWeight: 'bold', color: C.neutral800 }}>
              {sale.folio}
            </Text>
          </View>
        </View>

        {/*Metadatos del documento*/}
        <View style={{
          flexDirection: 'row', paddingBottom: 24,
          borderBottomWidth: 1, borderBottomColor: C.neutral100,
          marginBottom: 36,
        }}>
          <MetaBlock label="Fecha"    value={fecha} />
          <MetaBlock label="Hora"     value={hora} />
          <MetaBlock label="Vendedor" value={sale.seller_name} />
          <MetaBlock label="Pago"     value={metodoPago.toUpperCase()} color={C.blue600} />
        </View>

        {/*Tabla de productos*/}
        <View style={{ marginBottom: 48 }}>
          {/* Encabezado de tabla */}
          <View style={{
            flexDirection: 'row', paddingBottom: 10,
            borderBottomWidth: 1, borderBottomColor: C.neutral800,
          }}>
            <Text style={{ flex: 1,   fontSize: 8, fontWeight: 'bold', color: C.neutral800, textTransform: 'uppercase', letterSpacing: 1.5 }}>
              Concepto
            </Text>
            <Text style={{ width: 36, fontSize: 8, fontWeight: 'bold', color: C.neutral800, textTransform: 'uppercase', letterSpacing: 1.5, textAlign: 'center' }}>
              Cant.
            </Text>
            <Text style={{ width: 56, fontSize: 8, fontWeight: 'bold', color: C.neutral800, textTransform: 'uppercase', letterSpacing: 1.5, textAlign: 'right' }}>
              Precio
            </Text>
            <Text style={{ width: 64, fontSize: 8, fontWeight: 'bold', color: C.neutral800, textTransform: 'uppercase', letterSpacing: 1.5, textAlign: 'right' }}>
              Subtotal
            </Text>
          </View>

          {/*Filas de productos*/}
          {sale.details.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row', alignItems: 'center',
                paddingVertical: 14,
                borderBottomWidth: 1, borderBottomColor: C.neutral100,
              }}
            >
              {/* Nombre */}
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 9.5, fontWeight: 'bold', color: C.neutral800, marginBottom: 2 }}>
                  {item.product_name}
                </Text>
                <Text style={{ fontSize: 7.5, color: C.neutral400 }}>
                  ID: {item.id_product}
                </Text>
              </View>

              {/* Cantidad */}
              <Text style={{ width: 36, fontSize: 9.5, color: C.neutral600, textAlign: 'center' }}>
                {item.quantity}
              </Text>

              {/* Precio unitario */}
              <Text style={{ width: 56, fontSize: 9.5, color: C.neutral600, textAlign: 'right' }}>
                ${parseFloat(item.unit_price).toFixed(2)}
              </Text>

              {/* Subtotal */}
              <Text style={{ width: 64, fontSize: 9.5, fontWeight: 'bold', color: C.neutral800, textAlign: 'right' }}>
                ${parseFloat(item.subtotal).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/*Totales*/}
        <View style={{
          borderTopWidth: 1, borderTopColor: C.neutral800,
          paddingTop: 20,
          alignItems: 'flex-end',
        }}>
          <View style={{ width: 220 }}>
            <TotalRow label="Subtotal"   value={`$${subtotal.toFixed(2)}`} />
            <TotalRow label="Impuestos"  value="$0.00" />
            <TotalRow label="Total"      value={`$${total.toFixed(2)}`} isTotal />
          </View>
        </View>

        {/*Footer*/}
        <View style={{
          marginTop: 56, paddingTop: 24,
          borderTopWidth: 1, borderTopColor: C.neutral100,
          alignItems: 'center',
        }}>
          <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.neutral800, marginBottom: 6 }}>
            ¡Gracias por su compra!
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 7.5, color: C.neutral400, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 }}>
              Tizimín, Yucatán
            </Text>
            <Text style={{ fontSize: 7.5, color: C.neutral400 }}>•</Text>
            <Text style={{ fontSize: 7.5, color: C.neutral400, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 }}>
              farmauady.xubat.dev            </Text>
          </View>
          <Text style={{
            fontSize: 7, color: C.neutral300, textAlign: 'center',
            maxWidth: 280, lineHeight: 1.6,
          }}>
            ESTE ES UN COMPROBANTE DE PAGO DIGITAL. PARA RECLAMACIONES O DEVOLUCIONES ES NECESARIO PRESENTAR ESTE DOCUMENTO DENTRO DE LOS PRIMEROS 30 DÍAS.
          </Text>
        </View>

        {/*Pie de página con número de página*/}
        <Text
          style={{
            position: 'absolute', bottom: 20, left: 60, right: 60,
            textAlign: 'center', fontSize: 7, color: C.neutral300,
          }}
          render={({ pageNumber, totalPages }) =>
            `Página ${pageNumber} de ${totalPages}  ·  Generado el ${new Date().toLocaleDateString('es-MX')}`
          }
          fixed
        />

      </Page>
    </Document>
  );
};

export default TicketPDF;
