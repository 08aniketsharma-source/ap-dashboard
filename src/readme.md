# Vendor Aging Dashboard - Shop LC GmbH

Interactive dashboard for analyzing vendor open transactions and aging balances.

## Features

- **Real-time Firebase Sync**: All team members see the same data instantly
- **Cross-filtering**: Click any chart, bucket, or category to filter the entire dashboard
- **Dual File Upload**: Upload Open Transactions (required) + Vendor Master (optional)
- **Age Bucket Analysis**: Not Due, 0-30, 31-60, 61-90, 91-180, 180+ days
- **Vendor Categories**: Interco, Domestic, Overseas, GIT
- **Drill-down**: Click any vendor to see all their transactions
- **Responsive**: Works on desktop, tablet, and mobile

---

## Quick Start

### Option 1: Offline Mode (No Setup Required)
1. Open `index.html` in your browser
2. Click "Use Offline" when prompted
3. Upload your Excel files and start analyzing

### Option 2: Firebase Mode (Team Sync)
Follow the Firebase Setup below, then:
1. Open `index.html` in your browser
2. Enter your Firebase credentials
3. Upload files - data syncs to all team members automatically

---

## Firebase Setup (5 minutes)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter project name: `vendor-aging-dashboard` (or your choice)
4. Disable Google Analytics (optional, not needed)
5. Click **Create project**

### Step 2: Create Realtime Database

1. In Firebase Console, click **"Build"** → **"Realtime Database"**
2. Click **"Create Database"**
3. Choose location closest to you (e.g., `europe-west1`)
4. Select **"Start in test mode"** (we'll secure it later)
5. Click **Enable**

### Step 3: Get Your Credentials

1. Click the **gear icon** → **"Project settings"**
2. Scroll down to **"Your apps"**
3. Click the **Web icon** (`</>`)
4. Register app name: `vendor-dashboard`
5. Copy these values:
   - **apiKey**: `AIzaSy...`
   - **projectId**: `vendor-aging-dashboard`
   - **databaseURL**: `https://vendor-aging-dashboard-default-rtdb.firebaseio.com`

### Step 4: Enter Credentials in Dashboard

1. Open the dashboard
2. Click **"⚙️ Settings"** (or it will prompt automatically)
3. Enter:
   - **API Key**: Your apiKey
   - **Project ID**: Your projectId
   - **Database URL**: Your databaseURL
4. Click **"Connect"**

### Step 5: Secure Your Database (Important!)

Go to **Realtime Database** → **Rules** tab and replace with:

```json
{
  "rules": {
    "vendorAging": {
      ".read": true,
      ".write": true
    }
  }
}
```

For production, add authentication. See [Firebase Security Rules](https://firebase.google.com/docs/database/security).

---

## Netlify Deployment

### Method 1: Drag & Drop (Easiest)

1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag the entire `vendor-aging-dashboard` folder
3. Wait for deployment
4. Your dashboard is live! Share the URL with your team.

### Method 2: GitHub + Auto-Deploy

1. Push this folder to a GitHub repository
2. In Netlify: **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repo
4. Deploy settings:
   - Build command: (leave empty)
   - Publish directory: `.`
5. Click **Deploy**
6. Every push to GitHub auto-updates the dashboard!

---

## How to Use

### Daily Workflow

1. **Open Dashboard** (Netlify URL or local file)
2. **Upload Open Transactions Report** (required daily)
3. **Upload Vendor Master** (only when vendor data changes)
4. **Click "Process & Sync"**
5. **Analyze!**

### File Requirements

#### Open Transactions Report (Required)
- Export from D365/SAP
- Must contain: Vendor Code, Transaction Date, Due Date, Amounts
- Expected columns at positions: 1=Date, 5=Voucher, 7=Invoice, 10=Due Date, 18=Currency, 27=Debit, 29=Credit

#### Vendor Master (Optional but Recommended)
- Contains: Vendor Code, Name, Hold Status, Category, Currency
- Enhances dashboard with category breakdown and hold status alerts

### Filtering Data

| Action | Result |
|--------|--------|
| Click KPI card | Filter to that status (Overdue, Critical, etc.) |
| Click age bucket | Show only vendors with balance in that bucket |
| Click category in chart | Filter by Interco/Domestic/Overseas/GIT |
| Click category button | Same as above |
| Type in search | Filter by vendor name or code |
| Click table header | Sort by that column |
| Click vendor row | Expand to see all transactions |

### Clear Filters
- Click the **"Clear All"** button in the yellow filter bar
- Or click the **×** next to individual filter tags

---

## Troubleshooting

### "Connection Error" with Firebase
- Check your Database URL includes `https://` and ends with `.firebaseio.com`
- Verify API Key is correct (starts with `AIzaSy`)
- Check Firebase Console → Realtime Database is enabled

### Data not syncing
- Ensure you clicked "Process & Sync" after uploading
- Check browser console for errors (F12 → Console)
- Verify Firebase rules allow read/write

### Excel file not processing
- Ensure file is `.xlsx` format (not `.xls` or `.csv`)
- Check the file structure matches expected format
- Try re-exporting from source system

---

## Support

For issues or feature requests, contact your IT team or the dashboard developer.

---

*Dashboard built for Shop LC GmbH Accounts Payable Team*
