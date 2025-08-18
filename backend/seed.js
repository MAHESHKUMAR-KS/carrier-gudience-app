require('dotenv').config();
const mongoose = require('mongoose');
const Career = require('./models/Career');

const seedCareers = [
  {
    title: 'Software Engineer',
    description: 'Develops and maintains software applications.',
    degreeRequired: 'Bachelor\'s in Computer Science',
    careerPath: 'Junior Developer > Developer > Senior Developer > Lead Engineer',
    skillsRequired: ['JavaScript', 'Problem Solving', 'Teamwork'],
  },
  {
    title: 'Data Scientist',
    description: 'Analyzes and interprets complex data to help companies make decisions.',
    degreeRequired: 'Bachelor\'s in Data Science or related',
    careerPath: 'Data Analyst > Data Scientist > Senior Data Scientist > Data Science Manager',
    skillsRequired: ['Python', 'Statistics', 'Machine Learning'],
  },
];

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  await Career.deleteMany({});
  await Career.insertMany(seedCareers);
  console.log('Database seeded!');
  mongoose.disconnect();
})
.catch((err) => {
  console.error('Seeding error:', err);
  mongoose.disconnect();
});
