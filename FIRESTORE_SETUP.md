# Firestore Setup Guide

## 🔥 Quick Fix: Create Indexes

You're getting index errors because Firestore needs composite indexes for queries that filter by `userId` and sort by `date`.

### Option 1: Click the Error Links (Easiest)

When you see an error like:
```
The query requires an index. You can create it here: https://console.firebase.google.com/...
```

1. **Click the link** in the error message
2. Click **"Create Index"** button
3. Wait 2-5 minutes for it to build
4. Refresh your app

You'll need to do this for each collection (incomes, expenses, budgetRules).

### Option 2: Manual Index Creation

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **budget-tracker-2cd8c**
3. Click **Firestore Database** → **Indexes** tab
4. Click **"Create Index"** button

Create these 3 indexes:

#### Index 1: Incomes
- Collection ID: `incomes`
- Fields:
  - `userId` - Ascending
  - `date` - Descending
- Query scope: Collection

#### Index 2: Expenses
- Collection ID: `expenses`
- Fields:
  - `userId` - Ascending
  - `date` - Descending
- Query scope: Collection

#### Index 3: Budget Rules
- Collection ID: `budgetRules`
- Fields:
  - `userId` - Ascending
  - `createdAt` - Descending
- Query scope: Collection

### Option 3: Deploy Using Firebase CLI (Advanced)

If you have Firebase CLI installed:

```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firestore in your project
firebase init firestore

# When prompted:
# - Select "Use an existing project"
# - Choose "budget-tracker-2cd8c"
# - Accept default file names (firestore.rules and firestore.indexes.json)

# Deploy indexes and rules
firebase deploy --only firestore
```

The `firestore.indexes.json` and `firestore.rules` files are already created in your project root!

## ⏱️ Index Building Time

- Indexes typically take **2-5 minutes** to build
- You'll see status: "Building..." → "Enabled"
- Your app will work once all indexes show "Enabled"

## ✅ How to Verify Indexes are Ready

1. Go to Firebase Console → Firestore Database → Indexes tab
2. You should see 3 indexes with status "Enabled":
   - `incomes` (userId ASC, date DESC)
   - `expenses` (userId ASC, date DESC)
   - `budgetRules` (userId ASC, createdAt DESC)

## 🎯 After Indexes are Created

1. Hard refresh your browser (`Ctrl + Shift + R`)
2. Sign in to your app
3. Add income/expense
4. Refresh the page
5. **Data should persist!** ✅

## 🔐 Security Rules

The `firestore.rules` file contains secure rules that:
- ✅ Only allow authenticated users to access data
- ✅ Users can only see their own data (filtered by userId)
- ✅ Prevent users from accessing other users' data

To deploy rules via Firebase Console:
1. Go to Firestore Database → Rules tab
2. Copy content from `firestore.rules` file
3. Paste into the editor
4. Click **"Publish"**

## 🆘 Troubleshooting

**Index creation fails?**
- Check your Firebase billing plan (free Spark plan should work)
- Make sure you're signed in to the correct Google account
- Try creating indexes one at a time

**Still getting index errors?**
- Wait 5 minutes and refresh
- Check Indexes tab to see if they're still building
- Clear browser cache and try again

**Data not persisting?**
- Verify indexes are "Enabled" (not "Building")
- Check security rules are published
- Check browser console for errors
- Verify you're signed in

## 📚 Learn More

- [Firestore Indexes Documentation](https://firebase.google.com/docs/firestore/query-data/indexing)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
