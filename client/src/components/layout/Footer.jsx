import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 w-full">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-5 py-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
          {/* Brand */}
          <div>
            <Link to="/" className="text-2xl font-bold text-white">
              E-commerce
              <span className="text-yellow-400">Site</span>
            </Link>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              Your trusted online marketplace for quality products at affordable
              prices.
            </p>

            {/* Social Media */}
            <div className="flex justify-center items-center gap-3 mt-6">
              <a
                href="#"
                className="p-2 rounded-full bg-slate-800 hover:bg-blue-600 transition"
              >
                <FaFacebook size={18} />
              </a>

              <a
                href="#"
                className="p-2 rounded-full bg-slate-800 hover:bg-pink-600 transition"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="#"
                className="p-2 rounded-full bg-slate-800 hover:bg-sky-500 transition"
              >
                <FaTwitter size={18} />
              </a>

              <a
                href="#"
                className="p-2 rounded-full bg-slate-800 hover:bg-red-600 transition"
              >
                <FaYoutube size={18} />
              </a>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-white font-semibold mb-5">Contact Us</h3>

            <ul className="space-y-4 text-sm">
              <li className="flex items-center justify-center gap-3">
                <MapPin className="text-yellow-400 shrink-0" size={18} />
                <span>Surat, Gujarat, India</span>
              </li>

              <li className="flex items-center justify-center gap-3">
                <Phone className="text-yellow-400 shrink-0" size={18} />
                <span>+91 99999 99999</span>
              </li>

              <li className="flex items-center justify-center gap-3">
                <Mail className="text-yellow-400 shrink-0" size={18} />
                <span>e_commerece@shopkart.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-700" />

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-6 py-2">
        <p className="text-sm text-slate-400 text-center">
          © {new Date().getFullYear()} E-commerce Site. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
