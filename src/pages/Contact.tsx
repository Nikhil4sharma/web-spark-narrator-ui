import Footer from "@/components/footer";
const Contact = () => (
  <div className="min-h-screen flex flex-col justify-between">
    <main className="flex-1 container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="mb-4">We love to hear from our readers! For feedback, suggestions, or business inquiries, please reach out to us:</p>
      <ul className="mb-4">
        <li><b>Email:</b> <a href="mailto:contact@aajkistory.com" className="text-blue-600 underline">contact@aajkistory.com</a></li>
        <li><b>Business Hours:</b> Monday - Saturday, 10:00 AM to 6:00 PM</li>
      </ul>
      <p>We aim to respond to all queries within 24-48 hours. Thank you for connecting with <b>Aaj ki Story</b>!</p>
    </main>
    <Footer />
  </div>
);
export default Contact; 