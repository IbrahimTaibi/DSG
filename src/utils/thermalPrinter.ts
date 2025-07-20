import DSG_INFO from '@/config/dsgInfo';

interface InvoiceProduct {
  product: string;
  name: string;
  quantity: number;
  price: number;
  tax?: {
    id: string | null;
    name: string;
    rate: number;
  };
  taxAmount?: number;
  total: number;
}

interface InvoiceCustomer {
  id: string;
  name: string;
  email?: string;
  address?: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface InvoiceData {
  _id: string;
  order: string | { _id: string; id?: string };
  products: InvoiceProduct[];
  subtotal: number;
  totalTax: number;
  total: number;
  customer: InvoiceCustomer;
  invoiceNumber: string;
  issuedAt: string;
  status: string;
}

// ESC/POS Commands
const ESC = '\x1B';
const GS = '\x1D';
const INIT = `${ESC}@`;
const ALIGN_CENTER = `${ESC}a1`;
const ALIGN_LEFT = `${ESC}a0`;
const BOLD_ON = `${ESC}E1`;
const BOLD_OFF = `${ESC}E0`;
const DOUBLE_HEIGHT = `${ESC}!16`;
const NORMAL_SIZE = `${ESC}!0`;
const CUT_PAPER = `${GS}V1`;
const NEW_LINE = '\n';
const DOUBLE_LINE = '\n\n';

export class ThermalPrinter {
  private port: any = null;
  public isConnected: boolean = false;

  async connect() {
    try {
      // Try to connect to thermal printer via Web Serial API
      if ('serial' in navigator) {
        try {
          this.port = await (navigator as any).serial.requestPort();
          await this.port.open({ baudRate: 9600 });
          this.isConnected = true;
          console.log('Connected to thermal printer');
        } catch {
          // User cancelled port selection or no port available
          console.log('No thermal printer port selected or available');
          this.isConnected = false;
        }
      } else {
        throw new Error('Web Serial API not supported');
      }
    } catch (error) {
      console.error('Failed to connect to printer:', error);
      this.isConnected = false;
    }
  }

  async disconnect() {
    if (this.port && this.isConnected) {
      await this.port.close();
      this.isConnected = false;
    }
  }

  async write(data: string) {
    if (this.port && this.isConnected) {
      const encoder = new TextEncoder();
      const writer = this.port.writable.getWriter();
      await writer.write(encoder.encode(data));
      writer.releaseLock();
    } else {
      // Fallback: log the commands for debugging
      console.log('Thermal Printer Commands:', data);
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2,
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getOrderId(order: string | { _id: string; id?: string }): string {
    if (typeof order === 'string') {
      return order;
    }
    return order._id || order.id || 'N/A';
  }

  async printInvoice(invoiceData: InvoiceData) {
    const commands: string[] = [];

    // Initialize printer
    commands.push(INIT);

    // Header
    commands.push(ALIGN_CENTER);
    commands.push(BOLD_ON);
    commands.push(DOUBLE_HEIGHT);
    commands.push(DSG_INFO.name + NEW_LINE);
    commands.push(DSG_INFO.tagline + NEW_LINE);
    commands.push(DSG_INFO.phone + NEW_LINE);
    commands.push(DSG_INFO.email + NEW_LINE);
    commands.push(DSG_INFO.address + NEW_LINE);
    commands.push(DOUBLE_LINE);
    commands.push(BOLD_OFF);
    commands.push(NORMAL_SIZE);

    // Invoice Info
    commands.push(ALIGN_LEFT);
    commands.push(BOLD_ON);
    commands.push('Facture N°: ' + invoiceData.invoiceNumber + NEW_LINE);
    commands.push('Date: ' + this.formatDate(invoiceData.issuedAt) + NEW_LINE);
    commands.push('Commande N°: ' + this.getOrderId(invoiceData.order) + NEW_LINE);
    commands.push(BOLD_OFF);
    commands.push(NEW_LINE);

    // Customer Info
    commands.push(BOLD_ON);
    commands.push('CLIENT:' + NEW_LINE);
    commands.push(BOLD_OFF);
    commands.push(invoiceData.customer.name + NEW_LINE);
    
    if (invoiceData.customer.email) {
      commands.push(invoiceData.customer.email + NEW_LINE);
    }
    
    if (invoiceData.customer.address) {
      commands.push(invoiceData.customer.address.address + NEW_LINE);
      commands.push(invoiceData.customer.address.city + ', ' + invoiceData.customer.address.state + NEW_LINE);
      commands.push(invoiceData.customer.address.zipCode + NEW_LINE);
    }
    commands.push(NEW_LINE);

    // Products
    commands.push(BOLD_ON);
    commands.push('ARTICLES:' + NEW_LINE);
    commands.push(BOLD_OFF);
    
    invoiceData.products.forEach(product => {
      commands.push(BOLD_ON);
      commands.push(product.name + NEW_LINE);
      commands.push(BOLD_OFF);
      commands.push(product.quantity + ' x ' + this.formatCurrency(product.price) + NEW_LINE);
      commands.push('Total: ' + this.formatCurrency(product.total) + NEW_LINE);
      
      if (product.tax && product.tax.rate > 0) {
        commands.push('TVA ' + product.tax.name + ': ' + product.tax.rate + '%' + NEW_LINE);
      }
      commands.push(NEW_LINE);
    });

    // Totals
    commands.push('Sous-total: ' + this.formatCurrency(invoiceData.subtotal) + NEW_LINE);
    
    if (invoiceData.totalTax > 0) {
      commands.push('TVA: ' + this.formatCurrency(invoiceData.totalTax) + NEW_LINE);
    }
    
    commands.push(BOLD_ON);
    commands.push('TOTAL: ' + this.formatCurrency(invoiceData.total) + NEW_LINE);
    commands.push(BOLD_OFF);
    commands.push(NEW_LINE);

    // Footer
    commands.push(ALIGN_CENTER);
    commands.push('Merci pour votre confiance!' + NEW_LINE);
    commands.push('DSG - Votre partenaire de livraison' + NEW_LINE);
    commands.push(this.formatDate(invoiceData.issuedAt) + NEW_LINE);
    commands.push(DOUBLE_LINE);

    // Cut paper
    commands.push(CUT_PAPER);

    // Send all commands
    const fullCommand = commands.join('');
    await this.write(fullCommand);

    // Show success message
    if (!this.isConnected) {
      alert('Impression simulée - Commandes ESC/POS générées dans la console');
    } else {
      alert('Facture imprimée avec succès!');
    }
  }
}

// Alternative: Print to browser (for testing)
export async function printToBrowser(invoiceData: InvoiceData, printerType: 'thermal' | 'standard' = 'thermal') {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getOrderId = (order: string | { _id: string; id?: string }) => {
    if (typeof order === 'string') {
      return order;
    }
    return order._id || order.id || 'N/A';
  };

  // Printer-specific styles
  const getPrinterStyles = (type: 'thermal' | 'standard') => {
    if (type === 'thermal') {
      return `
        body {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          width: 280px;
          margin: 0 auto;
          padding: 10px;
          line-height: 1.2;
        }
        .header { text-align: center; margin-bottom: 20px; }
        .bold { font-weight: bold; }
        .center { text-align: center; }
        .total { border-top: 1px solid #000; padding-top: 5px; margin-top: 5px; }
        .product { margin-bottom: 10px; }
        @media print {
          body { 
            width: 100%; 
            max-width: 280px;
            margin: 0 auto;
          }
          @page {
            size: 80mm auto;
            margin: 5mm;
          }
        }
      `;
    } else {
      return `
        body {
          font-family: Arial, sans-serif;
          font-size: 14px;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          line-height: 1.4;
        }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .bold { font-weight: bold; }
        .center { text-align: center; }
        .total { border-top: 2px solid #333; padding-top: 10px; margin-top: 20px; }
        .product { margin-bottom: 15px; padding: 10px; border: 1px solid #eee; border-radius: 5px; }
        .product-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 10px; margin-bottom: 10px; }
        .product-header { font-weight: bold; background: #f5f5f5; padding: 8px; }
        @media print {
          body { 
            width: 100%; 
            max-width: none;
          }
          @page {
            size: A4;
            margin: 15mm;
          }
        }
      `;
    }
  };

  // Create a hidden iframe for printing
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Facture ${invoiceData.invoiceNumber}</title>
      <style>
        ${getPrinterStyles(printerType)}
      </style>
    </head>
    <body>
      <div class="header">
        <div class="bold">${DSG_INFO.name}</div>
        <div>${DSG_INFO.tagline}</div>
        <div>${DSG_INFO.phone}</div>
        <div>${DSG_INFO.email}</div>
        <div>${DSG_INFO.address}</div>
      </div>

      <div>
        <div class="bold">Facture N°: ${invoiceData.invoiceNumber}</div>
        <div>Date: ${formatDate(invoiceData.issuedAt)}</div>
        <div>Commande N°: ${getOrderId(invoiceData.order)}</div>
      </div>

      <div style="margin: 15px 0;">
        <div class="bold">CLIENT:</div>
        <div>${invoiceData.customer.name}</div>
        ${invoiceData.customer.email ? `<div>${invoiceData.customer.email}</div>` : ''}
        ${invoiceData.customer.address ? `
          <div>${invoiceData.customer.address.address}</div>
          <div>${invoiceData.customer.address.city}, ${invoiceData.customer.address.state}</div>
          <div>${invoiceData.customer.address.zipCode}</div>
        ` : ''}
      </div>

      <div>
        <div class="bold">ARTICLES:</div>
        ${printerType === 'thermal' ? 
          // Thermal printer layout (simple)
          invoiceData.products.map(product => `
            <div class="product">
              <div class="bold">${product.name}</div>
              <div>${product.quantity} x ${formatCurrency(product.price)}</div>
              <div>Total: ${formatCurrency(product.total)}</div>
              ${product.tax && product.tax.rate > 0 ? `<div>TVA ${product.tax.name}: ${product.tax.rate}%</div>` : ''}
            </div>
          `).join('') :
          // Standard printer layout (grid)
          `
            <div class="product-grid product-header">
              <div>Produit</div>
              <div>Quantité</div>
              <div>Prix</div>
              <div>Total</div>
            </div>
            ${invoiceData.products.map(product => `
              <div class="product-grid">
                <div class="bold">${product.name}</div>
                <div>${product.quantity}</div>
                <div>${formatCurrency(product.price)}</div>
                <div>${formatCurrency(product.total)}</div>
              </div>
              ${product.tax && product.tax.rate > 0 ? `
                <div style="grid-column: 1 / -1; font-size: 12px; color: #666; margin-left: 20px;">
                  TVA ${product.tax.name}: ${product.tax.rate}%
                </div>
              ` : ''}
            `).join('')}
          `
        }
      </div>

      <div class="total">
        <div>Sous-total: ${formatCurrency(invoiceData.subtotal)}</div>
        ${invoiceData.totalTax > 0 ? `<div>TVA: ${formatCurrency(invoiceData.totalTax)}</div>` : ''}
        <div class="bold">TOTAL: ${formatCurrency(invoiceData.total)}</div>
      </div>

      <div class="center" style="margin-top: 20px;">
        <div>Merci pour votre confiance!</div>
        <div>DSG - Votre partenaire de livraison</div>
        <div>${formatDate(invoiceData.issuedAt)}</div>
      </div>
    </body>
    </html>
  `;

  try {
    iframe.contentDocument?.write(html);
    iframe.contentDocument?.close();
    
    // Wait a bit for content to load, then print
    setTimeout(() => {
      iframe.contentWindow?.print();
      
      // Remove iframe after printing
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 100);
    
  } catch (error) {
    console.error('Erreur lors de l\'impression:', error);
    document.body.removeChild(iframe);
    throw new Error('Impossible d\'imprimer via le navigateur');
  }
} 