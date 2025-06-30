import Footer from "@/components/footer";
const PrivacyPolicy = () => (
  <div className="min-h-screen flex flex-col justify-between">
    <main className="flex-1 container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">At <b>Aaj ki Story</b>, we respect your privacy. We collect only essential information to improve your experience and do not share your personal data with third parties without consent.</p>
      <ul className="mb-4 list-disc pl-6">
        <li>We may use cookies to enhance site functionality and analyze traffic.</li>
        <li>Personal information (like email) is collected only when you contact us or subscribe.</li>
        <li>You have the right to request access, correction, or deletion of your data at any time.</li>
      </ul>
      <p>For any privacy-related concerns, please email us at <a href="mailto:privacy@aajkistory.com" className="text-blue-600 underline">privacy@aajkistory.com</a>.</p>
    </main>
    <Footer />
  </div>
);
export default PrivacyPolicy; 