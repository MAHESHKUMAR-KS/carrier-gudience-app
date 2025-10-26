# Scholarship Aggregation System

## 📋 Overview

This is a comprehensive scholarship aggregation and filtering feature for the Career Guidance application. The system automatically scrapes scholarships from three major sources, stores them in MongoDB, and provides a RESTful API for filtering and accessing the data.

## 🎯 Features

- **Multi-Source Scraping**: Aggregates scholarships from:
  - Buddy4Study (https://www.buddy4study.com/scholarships)
  - Vidyasaarathi (https://www.vidyasaarathi.co.in)
  - National Scholarship Portal (NSP) (https://scholarships.gov.in)

- **Smart State Detection**: Automatically tags scholarships as "Tamil Nadu" or "All India" based on keyword matching

- **Duplicate Prevention**: Uses compound unique index to prevent duplicate entries

- **Scheduled Updates**: Daily automated scraping at 10:00 AM using node-cron

- **Comprehensive API**: RESTful endpoints with multiple filter options

## 🗄️ Database Schema

**Database**: `careerGuidanceDB`  
**Collection**: `scholarships`

### Scholarship Document Structure

```javascript
{
  name: String (required),          // Scholarship name
  provider: String (required),      // Organization/Institution providing scholarship
  deadline: String,                 // Application deadline
  amount: String,                   // Scholarship amount
  link: String (required),          // Application link
  state: String,                    // "Tamil Nadu" or "All India"
  category: String,                 // Merit-based, Girls, SC/ST, etc.
  source: String (required),        // Buddy4Study, Vidyasaarathi, or NSP
  description: String,              // Detailed description
  eligibility: String,              // Eligibility criteria
  updatedAt: Date,                  // Last update timestamp
  createdAt: Date                   // Creation timestamp
}
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running on localhost:27017 or configured via MONGO_URI)

### Install Dependencies

```bash
cd backend
npm install
```

Required packages (already included in package.json):
- `axios` - HTTP client for web scraping
- `cheerio` - HTML parsing for web scraping
- `mongoose` - MongoDB ODM
- `node-cron` - Task scheduler
- `express` - Web framework
- `dotenv` - Environment variables

## 📁 File Structure

```
backend/
├── models/
│   └── Scholarship.js              # Mongoose schema
├── controllers/
│   └── scholarshipController.js    # API controller
├── routes/
│   └── scholarships.js             # API routes
├── scripts/
│   ├── utils/
│   │   └── stateDetector.js        # Tamil Nadu keyword detection
│   ├── scrapers/
│   │   ├── buddy4StudyScraper.js   # Buddy4Study scraper
│   │   ├── vidyasaarathiScraper.js # Vidyasaarathi scraper
│   │   └── nspScraper.js           # NSP scraper
│   ├── allScrapers.js              # Unified scraper runner
│   └── testScholarships.js         # Test/quick load script
└── server.js                        # Express server with cron job
```

## 🔧 Usage

### Manual Scraping

Run all scrapers manually:

```bash
cd backend
node scripts/allScrapers.js
```

Quick test with fallback data:

```bash
node scripts/testScholarships.js
```

### Automated Scraping

The system automatically runs daily at 10:00 AM when the server is running.

To change the schedule, edit `server.js`:

```javascript
// Current: Daily at 10:00 AM
cron.schedule('0 10 * * *', () => { ... });

// Examples:
// Every hour: '0 * * * *'
// Every day at midnight: '0 0 * * *'
// Every Sunday at 10 AM: '0 10 * * 0'
```

## 🌐 API Endpoints

### Base URL
```
http://localhost:5001/api/scholarships
```

### Get All Scholarships

**GET** `/api/scholarships`

Response:
```json
{
  "success": true,
  "count": 42,
  "summary": {
    "total": 42,
    "byState": {
      "Tamil Nadu": 10,
      "All India": 32
    },
    "bySource": {
      "Buddy4Study": 10,
      "Vidyasaarathi": 10,
      "NSP": 20
    },
    "byCategory": {
      "Merit-based": 8,
      "Girls": 5,
      ...
    }
  },
  "data": [...]
}
```

### Filter by State

**GET** `/api/scholarships?state=Tamil Nadu`

**GET** `/api/scholarships?state=All India`

Example Response:
```json
{
  "success": true,
  "count": 10,
  "summary": {...},
  "data": [
    {
      "_id": "...",
      "name": "Dr. APJ Abdul Kalam Scholarship Tamil Nadu 2024",
      "provider": "TN Government",
      "deadline": "2024-10-31",
      "amount": "INR 50,000 per year",
      "link": "https://...",
      "state": "Tamil Nadu",
      "category": "Merit-based",
      "source": "Buddy4Study",
      "description": "Scholarship for Tamil Nadu students pursuing higher education",
      "eligibility": "Tamil Nadu domicile students"
    }
  ]
}
```

### Filter by Category

**GET** `/api/scholarships?category=Girls`

**GET** `/api/scholarships?category=Merit-based`

### Filter by Source

**GET** `/api/scholarships?source=Buddy4Study`

**GET** `/api/scholarships?source=Vidyasaarathi`

**GET** `/api/scholarships?source=NSP`

### Search Scholarships

**GET** `/api/scholarships?search=engineering`

Searches in name, provider, and description fields.

### Combined Filters

**GET** `/api/scholarships?state=Tamil Nadu&category=Girls`

**GET** `/api/scholarships?source=NSP&search=merit`

## 🔍 State Detection

The system uses keyword matching to automatically categorize scholarships:

### Tamil Nadu Keywords:
- tamil nadu, tamilnadu
- tn govt, tn government
- anna university, annamalai
- vel tech, srm, tnea
- Chennai, Madras, Coimbatore, Madurai, etc.

Any scholarship containing these keywords is tagged as "Tamil Nadu", otherwise "All India".

## 📊 Current Statistics

After initial setup, you should have:
- **80+ scholarships** in the database
- **10+ Tamil Nadu** specific scholarships
- **30+ All India** scholarships
- Data from **all 3 sources**

## 🧪 Testing

### Test API with PowerShell:

```powershell
# Get all scholarships
Invoke-RestMethod -Uri "http://localhost:5001/api/scholarships"

# Get Tamil Nadu scholarships
Invoke-RestMethod -Uri "http://localhost:5001/api/scholarships?state=Tamil Nadu"

# Get count only
$response = Invoke-RestMethod -Uri "http://localhost:5001/api/scholarships"
$response.count
```

### Test API with curl (Git Bash/Linux/Mac):

```bash
# Get all scholarships
curl http://localhost:5001/api/scholarships

# Get Tamil Nadu scholarships
curl "http://localhost:5001/api/scholarships?state=Tamil%20Nadu"

# Pretty print with jq
curl -s http://localhost:5001/api/scholarships | jq '.summary'
```

## 🔧 Troubleshooting

### MongoDB Connection Issues

1. Ensure MongoDB is running:
```powershell
Get-Service -Name MongoDB
```

2. Check connection string in `.env`:
```
MONGO_URI=mongodb://localhost:27017/careerGuidanceDB
```

### Scraping Issues

If scrapers fail to fetch data:
- The system automatically falls back to curated scholarship data
- Check internet connectivity
- Website structure may have changed (update selectors in scraper files)

### No Scholarships in Database

Run the test script to load fallback data:
```bash
node scripts/testScholarships.js
```

## 📝 Environment Variables

Required in `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017/careerGuidanceDB
PORT=5001
NODE_ENV=development
```

## 🎨 Customization

### Adding More Sources

1. Create a new scraper in `scripts/scrapers/`
2. Export a scraping function
3. Import and call in `scripts/allScrapers.js`

### Adding More Keywords

Edit `scripts/utils/stateDetector.js`:

```javascript
const TAMIL_NADU_KEYWORDS = [
  'tamil nadu',
  // Add more keywords here
];
```

### Changing Schedule

Edit `server.js` cron schedule:

```javascript
cron.schedule('0 10 * * *', () => {
  // Your schedule
});
```

## 📈 Future Enhancements

- [ ] Add more scholarship sources
- [ ] Implement real-time scraping (avoid rate limits)
- [ ] Add email notifications for new scholarships
- [ ] Implement scholarship expiry tracking
- [ ] Add admin dashboard for manual curation
- [ ] Implement caching layer (Redis)
- [ ] Add scholarship recommendation engine

## 🤝 Contributing

When adding new scholarships or sources:
1. Follow the existing schema structure
2. Ensure state detection keywords are accurate
3. Test with the API endpoints
4. Update this documentation

## 📄 License

This is part of the Career Guidance Application project.

## 📞 Support

For issues or questions, please refer to the main project documentation.

---

**Last Updated**: October 2024  
**Version**: 1.0.0  
**Database**: careerGuidanceDB  
**Current Scholarship Count**: 42+ (and growing)
