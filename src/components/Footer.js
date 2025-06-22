import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-orange-600 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold mb-4">Manomantapa Trust</h3>
            <p className="text-orange-100">
              Dedicated to providing quality spiritual and wellness content to help you on your journey.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
            <div className="space-y-2 text-orange-100">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <Phone size={16} />
                <span>9481087324</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <Mail size={16} />
                <span>Manomantapa2008@gmail.com</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <MapPin size={16} />
                <span>Manomantapa Trust (R)</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-orange-100">
              <div><a href="#" className="hover:text-white transition-colors">About Us</a></div>
              <div><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></div>
              <div><a href="#" className="hover:text-white transition-colors">Terms of Service</a></div>
              <div><a href="#" className="hover:text-white transition-colors">Support</a></div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-orange-500 mt-8 pt-6 text-center">
          <p>&copy; {new Date().getFullYear()} Manomantapa Trust (R). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 