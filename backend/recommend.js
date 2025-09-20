import natural from "natural";
import cosineSimilarity from "cosine-similarity";


// ---------- SAMPLE DATA ----------
const colleges = [
  { name: "Anna University - CEG Campus, Chennai", branch: "BIO MEDICAL ENGINEERING (SS)", cutoffs: { BC: null } },
  { name: "Anna University - CEG Campus, Chennai", branch: "CIVIL ENGINEERING", cutoffs: { BC: null, MBC: 184.0 } },
  { name: "Anna University - CEG Campus, Chennai", branch: "COMPUTER SCIENCE AND ENGINEERING (SS)", cutoffs: { BC: 198.0 } },
  { name: "PSG College of Technology, Coimbatore", branch: "ELECTRICAL AND ELECTRONICS ENGINEERING", cutoffs: { BC: 192.0 } },
  { name: "SSN College of Engineering, Chennai", branch: "COMPUTER SCIENCE AND ENGINEERING", cutoffs: { BC: 194.0 } },
  { name: "Thiagarajar College of Engineering, Madurai", branch: "MECHANICAL ENGINEERING", cutoffs: { BC: 190.0 } },
  { name: "Coimbatore Institute of Technology, Coimbatore", branch: "INFORMATION TECHNOLOGY", cutoffs: { BC: 191.0 } },
  { name: "Government College of Technology, Coimbatore", branch: "CIVIL ENGINEERING", cutoffs: { BC: 187.0 } },
  { name: "Sri Venkateswara College of Engineering, Sriperumbudur", branch: "COMPUTER SCIENCE AND ENGINEERING", cutoffs: { BC: 189.0 } },
  { name: "Velammal Engineering College, Chennai", branch: "ELECTRONICS AND COMMUNICATION ENGINEERING", cutoffs: { BC: 188.0 } },
];

// ---------- TF-IDF SETUP ----------
const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();

// Convert college info into plain text
const collegeTexts = colleges.map(c => `${c.name} - ${c.branch} - Cutoffs: ${JSON.stringify(c.cutoffs)}`);

// Add to TF-IDF
collegeTexts.forEach((text, i) => tfidf.addDocument(text, i));

// ---------- USER QUERY ----------
const query = "Computer Science colleges in Chennai with cutoff near 190 for BC";

// Create query vector
const allTerms = tfidf.terms.reduce((acc, term) => {
  acc.push(term.term);
  return acc;
}, []);

function vectorize(text) {
  return allTerms.map(term => tfidf.tfidf(term, text));
}

const queryVec = vectorize(query);

// Compute cosine similarity
const scores = collegeTexts.map((text, i) => {
  const docVec = vectorize(i); // vector for college i
  return { college: colleges[i], score: cosineSimilarity(queryVec, docVec) };
});

// Sort and take top 4
scores.sort((a, b) => b.score - a.score);
const top4 = scores.slice(0, 4);

// ---------- RESULT ----------
console.log("Top 4 Recommended Colleges:");
top4.forEach(s => {
  console.log(`${s.college.name} - ${s.college.branch} | Score: ${s.score.toFixed(3)}`);
});
