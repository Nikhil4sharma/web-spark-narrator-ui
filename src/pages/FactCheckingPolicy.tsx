import Footer from "@/components/footer";
const FactCheckingPolicy = () => (
  <div className="min-h-screen flex flex-col justify-between">
    <main className="flex-1 container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-4">Fact Checking Policy</h1>
      <p className="mb-4">At <b>Aaj ki Story</b>, we take fact-checking seriously. Every story is reviewed for accuracy and credibility before publication.</p>
      <ul className="mb-4 list-disc pl-6">
        <li>We cross-verify information from multiple reputable sources.</li>
        <li>Our editorial team uses the latest tools and databases for verification.</li>
        <li>Readers can report suspected misinformation by emailing <a href="mailto:factcheck@aajkistory.com" className="text-blue-600 underline">factcheck@aajkistory.com</a></li>
      </ul>
      <p>We are committed to providing you with trustworthy and factual news every day.</p>
    </main>
    <Footer />
  </div>
);
export default FactCheckingPolicy; 