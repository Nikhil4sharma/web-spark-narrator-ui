import Footer from "@/components/footer";
const ApplyForJob = () => (
  <div className="min-h-screen flex flex-col justify-between">
    <main className="flex-1 container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-4">Apply For Job</h1>
      <p className="mb-4">Join the <b>Aaj ki Story</b> team! We are always looking for passionate writers, editors, and digital creators.</p>
      <ul className="mb-4 list-disc pl-6">
        <li>Send your resume and a brief cover letter to <a href="mailto:jobs@aajkistory.com" className="text-blue-600 underline">jobs@aajkistory.com</a></li>
        <li>Mention your area of interest (writing, editing, social media, etc.)</li>
        <li>Shortlisted candidates will be contacted for an interview</li>
      </ul>
      <p>We look forward to working with talented individuals who share our passion for storytelling!</p>
    </main>
    <Footer />
  </div>
);
export default ApplyForJob; 