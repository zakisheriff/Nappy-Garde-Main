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
    Price: row.get('DiscountPrice') || row.get('Price'), // Use DiscountPrice as selling price if available
    Stock: row.get('Stock'),
    Description: row.get('Description'),
    ImageURL: row.get('ImageURL'),
    category: row.get('category'),
    brand: row.get('Brand'),
    Benefits: row.get('Benefits'),
    OriginalPrice: row.get('Price'), // The 'Price' column represents the original/MSRP
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

    await sheet.loadHeaderRow(); // Ensure headers are loaded so it knows where to append
    await sheet.addRow({
      OrderID: order.OrderID,
      CustomerName: order.CustomerName,
      Phone: order.Phone,
      Address: order.Address,
      District: order.District,
      ProductsOrdered: order.ProductsOrdered,
      Total: order.Total,
      DeliveryCharge: order.DeliveryCharge,
      Date: order.Date,
      Status: 'Pending', // Default status
    });
    return true;
  } catch (error) {
    console.error('Error adding order:', error);
    return false;
  }
}

export async function checkPromoUsage(phone: string, address: string, code: string) {
  try {
    const doc = getGoogleDoc();
    await doc.loadInfo();
    let sheet = doc.sheetsByTitle['PromoUsage'];

    // Auto-create sheet if missing (User Requirement)
    if (!sheet) {
      sheet = await doc.addSheet({ headerValues: ['Phone', 'Address', 'PromoCode', 'Date'] });
      await sheet.updateProperties({ title: 'PromoUsage' });
    } else {
      // Ensure headers exist
      try {
        await sheet.loadHeaderRow();
      } catch (e) {
        await sheet.setHeaderRow(['Phone', 'Address', 'PromoCode', 'Date']);
      }
    }

    const rows = await sheet.getRows();

    // Normalize inputs for comparison
    const searchPhone = phone.toString().trim().replace(/\s+/g, ''); // Remove spaces
    const searchAddress = address.trim().toLowerCase();
    const searchCode = code.trim().toLowerCase();

    // Check if combo exists
    const exists = rows.some(row => {
      const rowPhone = row.get('Phone')?.toString().trim().replace(/\s+/g, '') || '';
      const rowAddress = row.get('Address')?.toString().trim().toLowerCase() || '';
      const rowCode = row.get('PromoCode')?.toString().trim().toLowerCase() || '';

      return rowPhone === searchPhone &&
        rowAddress === searchAddress &&
        rowCode === searchCode;
    });

    return exists;
  } catch (error) {
    console.error('Error checking promo usage:', error);
    return false; // Fail safe
  }
}

export async function recordPromoUsage(phone: string, address: string, code: string) {
  try {
    const doc = getGoogleDoc();
    await doc.loadInfo();
    let sheet = doc.sheetsByTitle['PromoUsage'];

    if (!sheet) {
      sheet = await doc.addSheet({ headerValues: ['Phone', 'Address', 'PromoCode', 'Date'] });
      await sheet.updateProperties({ title: 'PromoUsage' });
    } else {
      // Ensure headers exist
      try {
        await sheet.loadHeaderRow();
      } catch (e) {
        await sheet.setHeaderRow(['Phone', 'Address', 'PromoCode', 'Date']);
      }
    }

    await sheet.addRow({
      Phone: phone,
      Address: address,
      PromoCode: code,
      Date: new Date().toLocaleString()
    });
    return true;
  } catch (error) {
    console.error('Error recording promo usage:', error);
    return false;
  }
}
