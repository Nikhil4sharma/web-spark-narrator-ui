import Footer from "@/components/footer";
const About = () => (
  <div className="min-h-screen flex flex-col justify-between">
    <main className="flex-1 container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      <p className="mb-4">Welcome to <b>Aaj ki Story</b> – your trusted destination for the latest, most reliable, and inspiring news stories. We are dedicated to delivering updates across automobiles, business, technology, finance, entertainment, education, and sports, all in a modern, visual, and engaging format.</p>
      <h2 className="text-2xl font-semibold mt-6 mb-2">Our Mission</h2>
      <p className="mb-4">To empower readers with credible, timely, and visually immersive stories that inform, inspire, and spark curiosity every day.</p>
      <h2 className="text-2xl font-semibold mt-6 mb-2">Why Aaj ki Story?</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Fast, reliable, and unbiased news updates</li>
        <li>Beautiful AMP web stories for mobile and desktop</li>
        <li>Focus on user experience, accessibility, and trust</li>
        <li>Original content, fact-checked and curated by experts</li>
      </ul>
      <p>Thank you for making us your daily news companion!</p>
    </main>
    <Footer />
  </div>
);
export default About; 