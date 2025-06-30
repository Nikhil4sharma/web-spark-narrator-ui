import Footer from "@/components/footer";
const CorrectionPolicy = () => (
  <div className="min-h-screen flex flex-col justify-between">
    <main className="flex-1 container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-4">Correction Policy</h1>
      <p className="mb-4">At <b>Aaj ki Story</b>, we are committed to accuracy and transparency. If an error is identified in our content, we promptly review and correct it.</p>
      <ul className="mb-4 list-disc pl-6">
        <li>Corrections are clearly marked and updated in the original story.</li>
        <li>Major corrections are communicated to our readers via updates or notifications.</li>
        <li>To report an error, please email <a href="mailto:corrections@aajkistory.com" className="text-blue-600 underline">corrections@aajkistory.com</a></li>
      </ul>
      <p>We value your feedback and strive to maintain the highest standards of journalism.</p>
    </main>
    <Footer />
  </div>
);
export default CorrectionPolicy; 