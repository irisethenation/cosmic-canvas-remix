const Footer = () => {
  return (
    <footer className="bg-text-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/lovable-uploads/5b04634a-8b34-4b3f-b5d4-9ca573b411f1.png" 
                alt="iRise Academy Logo" 
                className="w-16 h-12 object-contain"
              />
            </div>
            <p className="text-gray-300 max-w-md leading-relaxed">
              Empowering individuals with the tools and knowledge to maintain epistemic sovereignty 
              in an age of information manipulation.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Programs</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Agnotology Studies</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Epistemic Sovereignty</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Critical Analysis</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Research Methods</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Admissions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Newsletter</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300 mb-4 italic">
            Designed and developed under the sovereign vision of:<br />
            <span className="font-semibold">Exsurgite Omnes Qui Vocati Sentiunt</span>
          </p>
          <p className="text-gray-400">
            © 2024 iRise Academy. All rights reserved. | Agnotology & Epistemic Sovereignty Programme™
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;