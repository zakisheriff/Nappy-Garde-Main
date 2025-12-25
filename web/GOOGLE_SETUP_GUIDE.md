# Google Sheets API Setup Guide

This guide will walk you through obtaining the credentials needed for your `.env.local` file.

## Part 1: Create a Google Cloud Project & Enable API

### Step 1: Go to Google Cloud Console
1. Visit [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Sign in with your Google account

### Step 2: Create a New Project
1. Click on the project dropdown at the top of the page
2. Click **"New Project"**
3. Enter a project name (e.g., "Nappy-Garde-Shop")
4. Click **"Create"**
5. Wait for the project to be created, then select it

### Step 3: Enable Google Sheets API
1. In the left sidebar, go to **"APIs & Services" > "Library"**
2. Search for **"Google Sheets API"**
3. Click on it and press **"Enable"**

## Part 2: Create a Service Account

### Step 4: Create Service Account
1. Go to **"APIs & Services" > "Credentials"**
2. Click **"Create Credentials"** at the top
3. Select **"Service Account"**
4. Fill in the details:
   - **Service account name**: `nappy-garde-sheets` (or any name)
   - **Service account ID**: (auto-filled)
   - **Description**: "Service account for Nappy Garde website"
5. Click **"Create and Continue"**
6. For **"Grant this service account access to project"**: 
   - Select role **"Editor"** or **"Owner"** (just for simplicity, you can use a more restrictive role if needed)
7. Click **"Continue"**, then **"Done"**

### Step 5: Generate Private Key (JSON)
1. In the **Credentials** page, find your newly created service account under **"Service Accounts"**
2. Click on the service account email
3. Go to the **"Keys"** tab
4. Click **"Add Key" > "Create new key"**
5. Choose **"JSON"** format
6. Click **"Create"**
7. A JSON file will download to your computer - **KEEP THIS SAFE!**

## Part 3: Extract Credentials from JSON

### Step 6: Open the Downloaded JSON File
The JSON file looks like this:
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n",
  "client_email": "nappy-garde-sheets@your-project.iam.gserviceaccount.com",
  "client_id": "1234567890",
  ...
}
```

### Step 7: Extract the Values
From this JSON file, you need:

1. **GOOGLE_SERVICE_ACCOUNT_EMAIL**: 
   - Copy the `client_email` value
   - Example: `nappy-garde-sheets@your-project.iam.gserviceaccount.com`

2. **GOOGLE_PRIVATE_KEY**: 
   - Copy the ENTIRE `private_key` value including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` parts
   - **IMPORTANT**: Keep the `\n` characters as they are in the JSON

## Part 4: Create & Share Your Google Sheet

### Step 8: Create Google Sheet
1. Go to [https://sheets.google.com](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Rename it to something like "Nappy Garde Database"

### Step 9: Set Up Tabs
1. Rename the first sheet to `Products`
2. Add these column headers in Row 1:
   ```
   ProductID | ProductName | Price | Stock | Description | ImageURL | category
   ```
3. Create a second sheet/tab named `Orders`
4. Add these column headers in Row 1:
   ```
   OrderID | CustomerName | Phone | Address | ProductsOrdered | Total | Date | Status
   ```

### Step 10: Get Sheet ID
1. Look at the URL of your Google Sheet
2. It looks like: `https://docs.google.com/spreadsheets/d/XXXXXXXXXXXXXXXXXXXXX/edit`
3. The **SHEET ID** is the long string between `/d/` and `/edit`
4. Copy this ID - this is your **GOOGLE_SHEET_ID**

### Step 11: Share with Service Account
1. Click the **"Share"** button in the top right of the Google Sheet
2. Paste your **Service Account Email** (from Step 7.1)
3. Set permission to **"Editor"**
4. **UNCHECK** "Notify people" (it's a robot account, doesn't need email)
5. Click **"Share"** or **"Done"**

## Part 5: Create .env.local File

### Step 12: Create Environment File
1. In your project's `web` folder, create a file named `.env.local`
2. Add the following content:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your_sheet_id_here
```

3. Replace the values with:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Service account email from Step 7.1
   - `GOOGLE_PRIVATE_KEY`: Private key from Step 7.2 (keep it in quotes!)
   - `GOOGLE_SHEET_ID`: Sheet ID from Step 10

### Example `.env.local`:
```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=nappy-garde-sheets@nappy-garde-shop.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV2wX3yZ4
```

## Testing

1. Restart your dev server: `npm run dev`
2. Go to `http://localhost:3000/api/products`
3. You should see an empty array `[]` or any products you've added to the sheet
4. If you see an error, check that:
   - Sheet tabs are named exactly `Products` and `Orders`
   - Column headers match exactly
   - Service account has Editor access to the sheet
   - Private key is correctly formatted with quotes and `\n` characters

## Security Note
- **NEVER** commit `.env.local` to git
- Keep your JSON credentials file safe
- Don't share your private key with anyone
