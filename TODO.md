# College Recommendation System - TODO

## Backend Implementation
- [x] Create mocked data files: `backend/data/colleges.json` and `backend/data/exams.json`
- [x] Create `backend/controllers/engineeringExamsController.js` for `/api/v1/engineering-exams/eligible` endpoint
- [x] Create `backend/routes/engineeringExamsRoutes.js` and register in server.js
- [x] Update `backend/controllers/collegeCutoffController.js` to handle 12th marks (0-100) and optional location
- [x] Update `backend/routes/collegeCutoffRoutes.js` to match new endpoint `/api/v1/college-cutoffs/search`
- [x] Update `backend/server.js` to include new route

## Frontend Implementation
- [x] Update `my-app/src/pages/CollegeRecommendation.jsx` to include form for 12th marks (0-100), optional location, display colleges and eligible exams using axios
- [x] Add error handling, loading state, and validation (marks 0-100)

## Testing and Integration
- [ ] Start backend server (`npm start` in backend/)
- [ ] Start frontend server (`npm run dev` in my-app/)
- [ ] Test the form submission and API calls
- [ ] Verify colleges and exams are displayed correctly
- [ ] Test error handling and validation
- [ ] Test with different marks and locations

## Future Enhancements
- [ ] Add more colleges and exams to JSON files
- [ ] Implement sorting and filtering options
- [ ] Add college details page
- [ ] Integrate with real database instead of JSON
- [ ] Add user authentication and save preferences
