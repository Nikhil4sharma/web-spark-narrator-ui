import Footer from "@/components/footer";
const Disclaimer = () => (
  <div className="min-h-screen flex flex-col justify-between">
    <main className="flex-1 container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-4">Disclaimer</h1>
      <p className="mb-4">All content published on <b>Aaj ki Story</b> is for informational purposes only. While we strive for accuracy and reliability, we do not guarantee the completeness or timeliness of any information. Readers are advised to verify facts independently before making decisions based on our content.</p>
      <p className="mb-4">Aaj ki Story and its team are not liable for any losses, damages, or actions taken based on the information provided on this website.</p>
      <p>If you find any content that requires correction or clarification, please contact us immediately.</p>
    </main>
    <Footer />
  </div>
);
export default Disclaimer; 