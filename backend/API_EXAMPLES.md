# Scholarship API Examples

## Quick Reference

Base URL: `http://localhost:5001/api/scholarships`

## PowerShell Examples

### 1. Get All Scholarships
```powershell
Invoke-RestMethod -Uri "http://localhost:5001/api/scholarships" -Method Get
```

### 2. Get Tamil Nadu Scholarships Only
```powershell
Invoke-RestMethod -Uri "http://localhost:5001/api/scholarships?state=Tamil Nadu" -Method Get
```

### 3. Get All India Scholarships Only
```powershell
Invoke-RestMethod -Uri "http://localhost:5001/api/scholarships?state=All India" -Method Get
```

### 4. Get Scholarships by Category
```powershell
# Girls scholarships
Invoke-RestMethod -Uri "http://localhost:5001/api/scholarships?category=Girls" -Method Get

# Merit-based scholarships
Invoke-RestMethod -Uri "http://localhost:5001/api/scholarships?category=Merit-based" -Method Get

# SC/ST scholarships
Invoke-RestMethod -Uri "http://localhost:5001/api/scholarships?category=SC/ST" -Method Get
```

### 5. Get Scholarships by Source
```powershell
# From Buddy4Study
Invoke-RestMethod -Uri "http://localhost:5001/api/scholarships?source=Buddy4Study" -Method Get

# From Vidyasaarathi
Invoke-RestMethod -Uri "http://localhost:5001/api/scholarships?source=Vidyasaarathi" -Method Get

# From NSP
Invoke-RestMethod -Uri "http://localhost:5001/api/scholarships?source=NSP" -Method Get
```

### 6. Search Scholarships
```powershell
# Search for engineering scholarships
Invoke-RestMethod -Uri "http://localhost:5001/api/scholarships?search=engineering" -Method Get

# Search for girl scholarships
Invoke-RestMethod -Uri "http://localhost:5001/api/scholarships?search=girl" -Method Get
```

### 7. Combined Filters
```powershell
# Tamil Nadu girls scholarships
Invoke-RestMethod -Uri "http://localhost:5001/api/scholarships?state=Tamil Nadu&category=Girls" -Method Get

# NSP merit scholarships
Invoke-RestMethod -Uri "http://localhost:5001/api/scholarships?source=NSP&search=merit" -Method Get
```

### 8. Get Summary Statistics
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:5001/api/scholarships"
Write-Host "Total: $($response.count)"
Write-Host "Summary: $($response.summary | ConvertTo-Json -Depth 3)"
```

### 9. Display Formatted Results
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:5001/api/scholarships?state=Tamil Nadu"
$response.data | Select-Object name, provider, amount, deadline | Format-Table -AutoSize
```

### 10. Export to CSV
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:5001/api/scholarships"
$response.data | Select-Object name, provider, state, amount, deadline, link | Export-Csv -Path "scholarships.csv" -NoTypeInformation
Write-Host "Exported to scholarships.csv"
```

## curl Examples (Git Bash / Linux / Mac)

### 1. Get All Scholarships
```bash
curl http://localhost:5001/api/scholarships
```

### 2. Get Tamil Nadu Scholarships (URL encoded)
```bash
curl "http://localhost:5001/api/scholarships?state=Tamil%20Nadu"
```

### 3. Get All India Scholarships (URL encoded)
```bash
curl "http://localhost:5001/api/scholarships?state=All%20India"
```

### 4. Pretty Print with jq
```bash
# Get summary
curl -s http://localhost:5001/api/scholarships | jq '.summary'

# Get count
curl -s http://localhost:5001/api/scholarships | jq '.count'

# Get first scholarship
curl -s http://localhost:5001/api/scholarships | jq '.data[0]'

# Get all scholarship names
curl -s http://localhost:5001/api/scholarships | jq '.data[].name'
```

### 5. Filter and Format
```bash
# Tamil Nadu scholarships with names and amounts
curl -s "http://localhost:5001/api/scholarships?state=Tamil%20Nadu" | jq '.data[] | {name, amount}'
```

## JavaScript/Fetch Examples (Frontend)

### 1. Basic Fetch
```javascript
fetch('http://localhost:5001/api/scholarships')
  .then(response => response.json())
  .then(data => {
    console.log(`Total scholarships: ${data.count}`);
    console.log(data.data);
  });
```

### 2. Async/Await
```javascript
async function getScholarships() {
  const response = await fetch('http://localhost:5001/api/scholarships');
  const data = await response.json();
  return data;
}
```

### 3. With Filters
```javascript
async function getTamilNaduScholarships() {
  const response = await fetch('http://localhost:5001/api/scholarships?state=Tamil Nadu');
  const data = await response.json();
  return data.data;
}
```

### 4. React Hook Example
```javascript
import { useState, useEffect } from 'react';

function useScholarships(filters = {}) {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(filters);
    fetch(`http://localhost:5001/api/scholarships?${params}`)
      .then(res => res.json())
      .then(data => {
        setScholarships(data.data);
        setLoading(false);
      });
  }, [filters]);

  return { scholarships, loading };
}

// Usage
function MyComponent() {
  const { scholarships, loading } = useScholarships({ state: 'Tamil Nadu' });
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {scholarships.map(s => (
        <div key={s._id}>{s.name}</div>
      ))}
    </div>
  );
}
```

## Axios Examples

### 1. Basic Request
```javascript
import axios from 'axios';

axios.get('http://localhost:5001/api/scholarships')
  .then(response => {
    console.log(response.data);
  });
```

### 2. With Parameters
```javascript
axios.get('http://localhost:5001/api/scholarships', {
  params: {
    state: 'Tamil Nadu',
    category: 'Girls'
  }
})
.then(response => {
  console.log(response.data.data);
});
```

## Python Examples

### 1. Using requests
```python
import requests

response = requests.get('http://localhost:5001/api/scholarships')
data = response.json()
print(f"Total scholarships: {data['count']}")
```

### 2. With Filters
```python
params = {'state': 'Tamil Nadu'}
response = requests.get('http://localhost:5001/api/scholarships', params=params)
scholarships = response.json()['data']

for scholarship in scholarships:
    print(f"{scholarship['name']} - {scholarship['amount']}")
```

## Common Response Format

All endpoints return the same structure:

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
      "NSP": 20,
      "": 2
    },
    "byCategory": {
      "Merit-based": 15,
      "Girls": 5,
      "SC/ST": 8,
      "Government": 10,
      "General": 4
    }
  },
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Scholarship Name",
      "provider": "Provider Name",
      "deadline": "2024-12-31",
      "amount": "INR 50,000",
      "link": "https://...",
      "state": "Tamil Nadu",
      "category": "Merit-based",
      "source": "Buddy4Study",
      "description": "Detailed description",
      "eligibility": "Eligibility criteria",
      "updatedAt": "2024-10-26T10:00:00.000Z",
      "createdAt": "2024-10-26T10:00:00.000Z",
      "__v": 0
    }
  ]
}
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": "Server Error",
  "message": "Detailed error message"
}
```

### Example with Error Handling
```javascript
fetch('http://localhost:5001/api/scholarships')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    if (data.success) {
      console.log(data.data);
    } else {
      console.error('API Error:', data.error);
    }
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
```

## Rate Limiting & Best Practices

1. **Cache responses**: Don't fetch data on every render
2. **Use appropriate filters**: Fetch only what you need
3. **Handle loading states**: Show loading indicators
4. **Error handling**: Always handle potential errors
5. **Debounce search**: Wait for user to finish typing before searching

## Testing the API

### Quick Health Check
```powershell
Invoke-RestMethod -Uri "http://localhost:5001/api/health"
```

### Count by State
```powershell
$tn = (Invoke-RestMethod -Uri "http://localhost:5001/api/scholarships?state=Tamil Nadu").count
$ai = (Invoke-RestMethod -Uri "http://localhost:5001/api/scholarships?state=All India").count
Write-Host "Tamil Nadu: $tn, All India: $ai"
```
