# 🚀 Quick Start Guide - Scholarship System

## ⚡ Start the Application

### Option 1: Separate Terminals

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
✅ Server running on http://localhost:5001

**Terminal 2 - Frontend:**
```bash
cd my-app
npm run dev
```
✅ Frontend running on http://localhost:5173

### Option 2: Windows Batch File

Create `start-app.bat` in project root:
```batch
@echo off
start cmd /k "cd backend && npm start"
timeout /t 2
start cmd /k "cd my-app && npm run dev"
```

Double-click to start both servers!

---

## 🧪 Quick Test

1. **Open Browser**: http://localhost:5173
2. **Login** (if required)
3. **Navigate to**: `/scholarships`
4. **You should see**:
   - 42+ scholarships
   - Summary stats (Total, TN, All India, Sources)
   - Search bar
   - Filter dropdowns (State, Category, Source)
   - Grid of scholarship cards

---

## 🔍 Feature Quick Tests

### Test 1: Filter by Tamil Nadu
```
1. Click State dropdown
2. Select "Tamil Nadu"
3. Result: 10 scholarships
```

### Test 2: Search
```
1. Type "engineering" in search box
2. Wait 500ms (debounce)
3. Result: Filtered scholarships
```

### Test 3: Filter by Source
```
1. Click Source dropdown
2. Select "Buddy4Study"
3. Result: 10 scholarships from Buddy4Study
```

### Test 4: Combined Filters
```
1. State: Tamil Nadu
2. Category: Merit-based
3. Result: Only TN merit scholarships
```

### Test 5: Clear Filters
```
1. Click "Clear Filters" button
2. Result: All filters reset, shows all scholarships
```

---

## 📁 Key Files

### Backend
```
backend/
├── models/Scholarship.js          # Schema
├── controllers/scholarshipController.js  # API logic
├── routes/scholarships.js         # Routes
├── scripts/
│   ├── allScrapers.js            # Run all scrapers
│   ├── testScholarships.js       # Quick load
│   └── scrapers/                 # Individual scrapers
└── server.js                      # Main server
```

### Frontend
```
my-app/
├── src/
│   ├── pages/Scholarships.jsx    # Main page
│   └── services/api.js           # API service
```

---

## 🛠️ Common Commands

### Backend Commands
```bash
# Start server
npm start

# Run scrapers
node scripts/allScrapers.js

# Quick load data
node scripts/testScholarships.js

# Check MongoDB
mongosh
> use careerGuidanceDB
> db.scholarships.countDocuments()
```

### Frontend Commands
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🔌 API Endpoints

### Get All
```
GET http://localhost:5001/api/scholarships
```

### Filter by State
```
GET http://localhost:5001/api/scholarships?state=Tamil Nadu
```

### Filter by Source
```
GET http://localhost:5001/api/scholarships?source=Buddy4Study
```

### Search
```
GET http://localhost:5001/api/scholarships?search=engineering
```

### Combined
```
GET http://localhost:5001/api/scholarships?state=Tamil Nadu&category=Girls&search=anna
```

---

## 📊 Current Stats

- **Total Scholarships**: 42+
- **Tamil Nadu**: 10
- **All India**: 30+
- **Sources**: 3 (Buddy4Study, Vidyasaarathi, NSP)
- **Categories**: 10+ (Merit-based, Girls, SC/ST, etc.)

---

## 🐛 Quick Fixes

### Backend not starting?
```bash
# Check MongoDB is running
Get-Service -Name MongoDB

# Check port 5001 is free
netstat -ano | findstr :5001
```

### Frontend not loading?
```bash
# Clear cache and reinstall
cd my-app
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Scholarships not showing?
```bash
# Reload scholarship data
cd backend
node scripts/testScholarships.js
```

### CORS errors?
Check `backend/server.js` line 37:
```javascript
origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"]
```

---

## 📚 Documentation

1. **Backend System**: `backend/SCHOLARSHIP_SYSTEM_README.md`
2. **API Examples**: `backend/API_EXAMPLES.md`
3. **Frontend Integration**: `FRONTEND_INTEGRATION_GUIDE.md`
4. **Implementation Summary**: `IMPLEMENTATION_SUMMARY.md`
5. **Test Results**: `backend/FINAL_TEST_RESULTS.md`

---

## ✅ Verification Checklist

- [ ] MongoDB running
- [ ] Backend running on port 5001
- [ ] Frontend running on port 5173
- [ ] Can access http://localhost:5173/scholarships
- [ ] 42+ scholarships visible
- [ ] Filters working
- [ ] Search working
- [ ] Summary stats showing
- [ ] Cards displaying correctly
- [ ] Apply buttons working

---

## 🎯 Next Steps

1. ✅ **Test all features** (filters, search, etc.)
2. ✅ **Check mobile responsiveness**
3. 📱 **Test on different browsers**
4. 🎨 **Customize colors/layout** (optional)
5. 🚀 **Deploy to production** (when ready)
6. 📊 **Set up analytics** (optional)
7. 🔔 **Add notifications** (future enhancement)

---

## 🤝 Support

For issues:
1. Check documentation above
2. Review browser console for errors
3. Check backend logs in terminal
4. Verify MongoDB connection
5. Test API endpoints directly

---

**Status**: ✅ READY TO USE  
**Version**: 1.0.0  
**Last Updated**: October 26, 2024
