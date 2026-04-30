# 🔔 Notifications System Documentation

## Overview

Your Smart Finance app now has a complete, real-time notification system integrated with the bell icon in the navbar!

## ✨ Features

### 1. **Smart Financial Alerts**
- 🚨 **Budget Exceeded**: Alerts when you exceed category budgets
- ⚠️ **Budget Warning**: Warns at 80% of budget limit
- ⚠️ **Spending Alert**: Notifies when spending increases >50% week-over-week
- 💰 **Low Savings Rate**: Alerts when monthly savings rate drops below 10%
- ✅ **Income Added**: Confirms when new income is recorded
- 📊 **Monthly Report**: Summary of income, expenses, and savings

### 2. **Real-Time Updates**
- Notifications appear instantly without page refresh
- Bell icon updates automatically with unread count
- Uses Firestore `onSnapshot` for live data

### 3. **Interactive UI**
- Click bell icon to open notification dropdown
- Red badge shows unread count (e.g., "3" or "9+")
- Hover over notifications to see delete button
- Click notification to mark as read
- "Mark all as read" button for bulk actions

### 4. **Smart Triggers**
- Automatically checks financial data for issues
- Prevents duplicate notifications (24-hour cooldown)
- Non-blocking background checks
- Triggers on data changes

## 📁 Files Created

### Services
- **`src/services/notificationService.js`** - Core notification CRUD operations
- **`src/services/notificationTriggers.js`** - Smart alert logic

### Components
- **`src/components/NotificationDropdown.jsx`** - Dropdown UI component

### Hooks
- **`src/hooks/useNotifications.js`** - React hook for notification state

### Configuration
- **`firestore.indexes.json`** - Updated with notification indexes
- **`firestore.rules`** - Updated with notification security rules

### Modified Files
- **`src/components/layout/Navbar.jsx`** - Added bell icon functionality
- **`src/hooks/useFinanceData.js`** - Integrated notification triggers

## 🔥 Firestore Setup

### Collections

#### `notifications` Collection
```javascript
{
  id: "auto-generated",
  userId: "user-uid",
  title: "🚨 Budget Exceeded",
  message: "You exceeded your Food budget by 50.00",
  type: "error", // 'warning', 'info', 'success', 'error'
  read: false,
  metadata: {
    category: "Food",
    limit: 200,
    spending: 250,
    excess: 50
  },
  createdAt: Timestamp
}
```

### Required Indexes

You need to create these indexes in Firebase Console:

1. **Notifications by User and Date**
   - Collection: `notifications`
   - Fields: `userId` (Ascending), `createdAt` (Descending)

2. **Unread Notifications**
   - Collection: `notifications`
   - Fields: `userId` (Ascending), `read` (Ascending)

### Security Rules

```javascript
match /notifications/{notificationId} {
  allow read: if isOwner(resource.data.userId);
  allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
  allow update, delete: if isOwner(resource.data.userId);
}
```

## 🚀 How It Works

### 1. Notification Triggers

When financial data changes, the system automatically checks for:

```javascript
// In useFinanceData hook
React.useEffect(() => {
  if (!userId || loading) return
  
  Promise.all([
    checkBudgetNotifications(userId, expenses, budgetRules),
    checkSpendingPatterns(userId, expenses),
    checkSavingsRate(userId, incomes, expenses),
  ])
}, [userId, incomes, expenses, budgetRules, loading])
```

### 2. Real-Time Subscription

```javascript
// In useNotifications hook
subscribeToNotifications(
  userId,
  (notifications) => setNotifications(notifications),
  (error) => setError(error),
  20 // Max 20 notifications
)
```

### 3. UI Updates

```javascript
// In Navbar component
const { notifications, unreadCount } = useNotifications()

// Bell icon shows badge if unreadCount > 0
{unreadCount > 0 && (
  <span className="badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
)}
```

## 📊 Notification Types

### Error (🚨)
- Budget exceeded
- Critical financial issues
- Red background

### Warning (⚠️)
- Budget at 80%
- Spending increased significantly
- Low savings rate
- Amber background

### Success (✅)
- Income added
- Goals achieved
- Green background

### Info (📊)
- Monthly reports
- General updates
- Blue background

## 🎨 UI Components

### Bell Icon
- Location: Navbar (top right)
- Shows red badge with unread count
- Click to toggle dropdown
- Highlights when dropdown is open

### Notification Dropdown
- Width: 384px (responsive on mobile)
- Max height: 384px (scrollable)
- Shows last 20 notifications
- Empty state with friendly message
- Hover to reveal delete button

### Notification Item
- Icon based on type (🚨, ⚠️, ✅, 📊)
- Title and message
- Time ago (e.g., "2h ago", "Just now")
- Blue dot for unread
- Click to mark as read
- Hover to delete

## 🔧 API Reference

### notificationService.js

```javascript
// Add notification
await addNotification({
  userId: 'user-123',
  title: '🚨 Alert',
  message: 'Something happened',
  type: 'warning',
  metadata: { key: 'value' }
})

// Subscribe to notifications
const unsubscribe = subscribeToNotifications(
  userId,
  (notifications) => console.log(notifications),
  (error) => console.error(error),
  20 // limit
)

// Mark as read
await markAsRead(notificationId)

// Mark all as read
await markAllAsRead(userId)

// Delete notification
await deleteNotification(notificationId)

// Check if notification exists (prevent duplicates)
const exists = await notificationExists(userId, message, 60) // within 60 minutes
```

### notificationTriggers.js

```javascript
// Check budget violations
await checkBudgetNotifications(userId, expenses, budgetRules)

// Check spending patterns
await checkSpendingPatterns(userId, expenses)

// Check savings rate
await checkSavingsRate(userId, incomes, expenses)

// Send welcome notification
await sendWelcomeNotification(userId)

// Notify income added
await notifyIncomeAdded(userId, amount, source)

// Send monthly report
await sendMonthlyReport(userId, totalIncome, totalExpenses, balance)
```

## 🎯 Usage Examples

### Manual Notification

```javascript
import { addNotification } from './services/notificationService.js'

// In your component
async function handleAction() {
  await addNotification({
    userId: user.uid,
    title: '✅ Success',
    message: 'Action completed successfully',
    type: 'success'
  })
}
```

### Custom Trigger

```javascript
// In useFinanceData or any component
React.useEffect(() => {
  if (balance < 0) {
    addNotification({
      userId: user.uid,
      title: '⚠️ Negative Balance',
      message: 'Your balance is negative. Consider adding income.',
      type: 'warning'
    })
  }
}, [balance, user.uid])
```

## 🔐 Security

- ✅ Users can only see their own notifications
- ✅ Users can only create notifications for themselves
- ✅ Users can only update/delete their own notifications
- ✅ All operations require authentication
- ✅ Firestore security rules enforce access control

## 🚀 Next Steps

### 1. Create Firestore Indexes

When you first use the notification system, you'll get index errors. Click the links in the errors to create:

1. Notifications by user and date
2. Unread notifications filter

### 2. Deploy Security Rules

Go to Firebase Console → Firestore Database → Rules tab:
- Copy content from `firestore.rules`
- Paste and publish

### 3. Test the System

1. Hard refresh browser (`Ctrl + Shift + R`)
2. Add an expense that exceeds a budget
3. Check the bell icon - you should see a notification!
4. Click the bell to open the dropdown
5. Click a notification to mark it as read
6. Hover and click X to delete

## 💡 Tips

- **Prevent Spam**: The system checks for duplicate notifications within 24 hours
- **Performance**: Notifications are limited to 20 most recent
- **Real-Time**: No page refresh needed - updates are instant
- **Mobile Friendly**: Dropdown is responsive and works on all screen sizes
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🎨 Customization

### Change Notification Limit

```javascript
// In useNotifications.js
subscribeToNotifications(userId, onChange, onError, 50) // Show 50 instead of 20
```

### Change Duplicate Check Window

```javascript
// In notificationTriggers.js
const exists = await notificationExists(userId, message, 120) // 2 hours instead of 24
```

### Add New Notification Type

```javascript
// In NotificationDropdown.jsx
function getNotificationIcon(type) {
  switch (type) {
    case 'custom':
      return '🎉'
    // ... other cases
  }
}
```

## 🐛 Troubleshooting

**Bell icon not showing?**
- Check that Navbar component is imported correctly
- Verify useNotifications hook is working
- Check browser console for errors

**Notifications not appearing?**
- Verify Firestore indexes are created and enabled
- Check security rules are published
- Ensure user is authenticated
- Check browser console for Firestore errors

**Duplicate notifications?**
- The system prevents duplicates within 24 hours
- If you need to test, delete old notifications or change the time window

**Dropdown not closing?**
- Click outside the dropdown
- Click the bell icon again
- Click the "Close" button at the bottom

## ✅ Success Checklist

- [x] Notification service created
- [x] Notification triggers implemented
- [x] Bell icon integrated in navbar
- [x] Dropdown UI component created
- [x] Real-time updates working
- [x] Smart financial alerts configured
- [x] Firestore indexes defined
- [x] Security rules updated
- [x] Documentation complete

Your notification system is ready to use! 🎉
