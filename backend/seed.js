import 'dotenv/config';
import mongoose from 'mongoose';
import Career from './models/Career.js';
import CollegeCutoff from './models/CollegeCutoff.js';

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

const seedCollegeCutoffs = [
  {
    placeId: 'college1',
    collegeName: 'Anna University',
    location: 'Chennai, Tamil Nadu',
    cutoffs: {
      btech: {
        general: 180,
        oc: 185,
        bc: 170,
        mbc: 165,
        sc: 150,
        st: 145,
        ews: 175
      },
      barch: {
        general: 160,
        oc: 165,
        bc: 150,
        mbc: 145,
        sc: 130,
        st: 125,
        ews: 155
      }
    }
  },
  {
    placeId: 'college2',
    collegeName: 'PSG College of Technology',
    location: 'Coimbatore, Tamil Nadu',
    cutoffs: {
      btech: {
        general: 170,
        oc: 175,
        bc: 160,
        mbc: 155,
        sc: 140,
        st: 135,
        ews: 165
      },
      mtech: {
        general: 150,
        oc: 155,
        bc: 140,
        mbc: 135,
        sc: 120,
        st: 115,
        ews: 145
      }
    }
  },
  {
    placeId: 'college3',
    collegeName: 'Thiagarajar College of Engineering',
    location: 'Madurai, Tamil Nadu',
    cutoffs: {
      btech: {
        general: 175,
        oc: 180,
        bc: 165,
        mbc: 160,
        sc: 145,
        st: 140,
        ews: 170
      },
      mba: {
        general: 140,
        oc: 145,
        bc: 130,
        mbc: 125,
        sc: 110,
        st: 105,
        ews: 135
      }
    }
  },
  {
    placeId: 'college4',
    collegeName: 'Sri Sivasubramaniya Nadar College of Engineering',
    location: 'Chennai, Tamil Nadu',
    cutoffs: {
      btech: {
        general: 165,
        oc: 170,
        bc: 155,
        mbc: 150,
        sc: 135,
        st: 130,
        ews: 160
      },
      barch: {
        general: 155,
        oc: 160,
        bc: 145,
        mbc: 140,
        sc: 125,
        st: 120,
        ews: 150
      }
    }
  }
];

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  await Career.deleteMany({});
  await Career.insertMany(seedCareers);
  
  await CollegeCutoff.deleteMany({});
  await CollegeCutoff.insertMany(seedCollegeCutoffs);
  
  console.log('Database seeded with careers and college cutoffs!');
  mongoose.disconnect();
})
.catch((err) => {
  console.error('Seeding error:', err);
  mongoose.disconnect();
});
