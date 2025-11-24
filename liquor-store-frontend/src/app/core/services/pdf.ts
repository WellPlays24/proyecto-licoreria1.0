import jsPDF from 'jspdf';
import { Injectable } from '@angular/core';
import { Invoice } from '../../shared/models/invoice';

@Injectable({
    providedIn: 'root'
})
export class PdfService {

    constructor() { }

    generateInvoicePDF(invoice: Invoice): void {
        const doc = new jsPDF();

        // Configuración de colores
        const primaryColor: [number, number, number] = [63, 81, 181]; // Indigo
        const textColor: [number, number, number] = [33, 33, 33];
        const lightGray: [number, number, number] = [245, 245, 245];

        let yPos = 20;

        // ===== ENCABEZADO =====
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('FACTURA', 105, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Licorería', 105, 30, { align: 'center' });

        yPos = 50;

        // ===== INFORMACIÓN DE LA FACTURA =====
        doc.setTextColor(...textColor);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Número de Factura:', 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(invoice.invoice_number, 70, yPos);

        yPos += 7;
        doc.setFont('helvetica', 'bold');
        doc.text('Pedido:', 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(`#${invoice.order_id}`, 70, yPos);

        yPos += 7;
        doc.setFont('helvetica', 'bold');
        doc.text('Fecha de Emisión:', 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(new Date(invoice.issued_at).toLocaleDateString('es-ES'), 70, yPos);

        yPos += 15;

        // ===== INFORMACIÓN DEL CLIENTE (si está disponible) =====
        if (invoice.customer_name) {
            doc.setFillColor(...lightGray);
            doc.rect(15, yPos - 5, 180, 20, 'F');

            doc.setFont('helvetica', 'bold');
            doc.text('Cliente:', 20, yPos);
            doc.setFont('helvetica', 'normal');
            doc.text(invoice.customer_name, 70, yPos);

            if (invoice.customer_email) {
                yPos += 7;
                doc.setFont('helvetica', 'bold');
                doc.text('Email:', 20, yPos);
                doc.setFont('helvetica', 'normal');
                doc.text(invoice.customer_email, 70, yPos);
            }

            yPos += 15;
        }

        // ===== TABLA DE PRODUCTOS =====
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Detalle de Productos', 20, yPos);
        yPos += 10;

        // Encabezados de tabla
        doc.setFillColor(...primaryColor);
        doc.rect(15, yPos - 5, 180, 10, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text('Producto', 20, yPos);
        doc.text('Cantidad', 120, yPos, { align: 'center' });
        doc.text('Precio Unit.', 150, yPos, { align: 'right' });
        doc.text('Subtotal', 185, yPos, { align: 'right' });

        yPos += 10;

        // Items de la factura
        doc.setTextColor(...textColor);
        doc.setFont('helvetica', 'normal');

        if (invoice.details && invoice.details.length > 0) {
            invoice.details.forEach((item, index) => {
                // Alternar color de fondo
                if (index % 2 === 0) {
                    doc.setFillColor(...lightGray);
                    doc.rect(15, yPos - 5, 180, 8, 'F');
                }

                doc.text(item.product_name || 'Producto', 20, yPos);
                doc.text(item.quantity.toString(), 120, yPos, { align: 'center' });
                doc.text(`$${Number(item.unit_price).toFixed(2)}`, 150, yPos, { align: 'right' });
                doc.text(`$${Number(item.subtotal).toFixed(2)}`, 185, yPos, { align: 'right' });

                yPos += 8;

                // Nueva página si es necesario
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
            });
        }

        yPos += 10;

        // ===== TOTAL =====
        doc.setFillColor(...primaryColor);
        doc.rect(130, yPos - 5, 65, 12, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('TOTAL:', 140, yPos + 3);
        doc.text(`$${Number(invoice.total).toFixed(2)}`, 185, yPos + 3, { align: 'right' });

        // ===== PIE DE PÁGINA =====
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setTextColor(150, 150, 150);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text(
                `Página ${i} de ${pageCount}`,
                105,
                290,
                { align: 'center' }
            );
            doc.text(
                'Gracias por su compra',
                105,
                285,
                { align: 'center' }
            );
        }

        // Descargar el PDF
        doc.save(`Factura_${invoice.invoice_number}.pdf`);
    }
}
