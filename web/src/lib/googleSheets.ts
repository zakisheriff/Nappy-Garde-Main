import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Helper function to initialize Google Sheets doc
function getGoogleDoc() {
  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Handle newline characters
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID as string, serviceAccountAuth);
}

export async function getProducts() {
  const doc = getGoogleDoc();
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle['Products'];
  if (!sheet) {
    throw new Error("Products sheet not found. Please create a tab named 'Products'.");
  }
  const rows = await sheet.getRows();
  return rows.map((row) => ({
    ProductID: row.get('ProductID'),
    ProductName: row.get('ProductName'),
    Price: row.get('Price'),
    Stock: row.get('Stock'),
    Description: row.get('Description'),
    ImageURL: row.get('ImageURL'),
    category: row.get('category'),
    brand: row.get('Brand'),
    Benefits: row.get('Benefits'),
  }));
}

export async function addOrder(order: any) {
  try {
    const doc = getGoogleDoc();
    await doc.loadInfo();
    let sheet = doc.sheetsByTitle['Orders'];
    if (!sheet) {
      // Create sheet if it doesn't exist? Or throw error. Smart to create or throw.
      // For now, assume it exists as per instructions.
      throw new Error("Orders sheet not found. Please create a tab named 'Orders'.");
    }

    await sheet.addRow({
      OrderID: order.OrderID,
      CustomerName: order.CustomerName,
      Phone: order.Phone,
      Address: order.Address,
      ProductsOrdered: order.ProductsOrdered,
      Total: order.Total,
      Date: order.Date,
      Status: 'Pending', // Default status
    });
    return true;
  } catch (error) {
    console.error('Error adding order:', error);
    return false;
  }
}
