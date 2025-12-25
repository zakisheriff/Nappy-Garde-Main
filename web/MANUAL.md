# Nappy Garde - Shop Management Manual

## Overview
Your website now runs on **Next.js** and uses a **Google Sheet** to manage products and orders. You do not need to log in to an admin panel anymore.

## 1. Setup (One Time)
1. **Google Sheet**: Create a new Google Sheet.
2. **Tabs**: Rename the first tab to `Products` and create a second tab named `Orders`.
3. **Columns**:
    - **Products Tab Row 1**: `ProductID`, `ProductName`, `Price`, `Stock`, `Description`, `ImageURL`, `category`.
    - **Orders Tab Row 1**: `OrderID`, `CustomerName`, `Phone`, `Address`, `ProductsOrdered`, `Total`, `Date`, `Status`.
4. **Share**: Share this Google Sheet with the **Service Account Email** provided by your developer (Edit access).
5. **ID**: Copy the Sheet ID from the URL (between `/d/` and `/edit`) and give it to your developer to put in the `.env` file.

## 2. Managing Products
To add or update products, simply edit the **Products** tab in your Google Sheet.

- **Add Product**: Add a new row.
    - `ProductID`: Unique ID (e.g., `diaper-pampers-s`).
    - `ProductName`: Name displayed on site.
    - `Price`: Number (e.g., `2500`).
    - `Stock`: Number. If `0`, it shows "Out of Stock" on the site.
    - `ImageURL`: Direct link to an image (e.g., from Unsplash or your image host).
    - `Description`: Product details.
    - `category`: Category for filtering (e.g., `Diapers`, `Wipes`, `Toys`).
- **Remove Product**: Delete the row.
- **Update Stock**: Change the number in the `Stock` column. 

**Note**: Changes appear on the website instantly or on the next refresh!

## 3. Viewing Orders
When a customer places an order:
1. A new row appears in the **Orders** tab automatically.
2. You will receive a **WhatsApp message** from the customer with the order details (if they click send).
3. Use the `Status` column in the sheet to track progress (e.g., change `Pending` to `Delivered`). This is for your internal use.

## 4. WhatsApp Notification
The website generates a pre-filled WhatsApp link for the customer.
- **Ensure your phone number is correct**: Ask your developer to update the phone number in `web/src/app/checkout/page.tsx` if it changes.
