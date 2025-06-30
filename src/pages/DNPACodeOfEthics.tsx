import Footer from "@/components/footer";
const DNPACodeOfEthics = () => (
  <div className="min-h-screen flex flex-col justify-between">
    <main className="flex-1 container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-4">DNPA Code of Ethics</h1>
      <p className="mb-4"><b>Aaj ki Story</b> adheres to the <b>Digital News Publishers Association (DNPA) Code of Ethics</b>. We are committed to upholding the highest standards of journalistic integrity, fairness, and transparency.</p>
      <ul className="mb-4 list-disc pl-6">
        <li>We ensure accuracy, impartiality, and responsible reporting in all our stories.</li>
        <li>We respect privacy, avoid sensationalism, and provide balanced coverage.</li>
        <li>We are open to feedback and corrections from our readers.</li>
      </ul>
      <p>For more information, visit the official DNPA website or contact us for our detailed editorial guidelines.</p>
    </main>
    <Footer />
  </div>
);
export default DNPACodeOfEthics; 