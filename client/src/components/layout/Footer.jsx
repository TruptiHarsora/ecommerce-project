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

// // import React from 'react'

// // const Footer = () => {
// //   return (
// //     <div>Footer</div>
// //   )
// // }

// // export default Footer

// import React from "react";
// import { Link } from "react-router-dom";
// // import {
// //   Facebook,
// //   Instagram,
// //   Twitter,
// //   Youtube,
// //   Mail,
// //   Phone,
// //   MapPin,
// // } from "lucide-react";
// import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
// import { Mail, MapPin, Phone } from "lucide-react";

// const Footer = () => {
//   return (
//     <footer className="bg-slate-900 text-slate-300 ">
//       {/* Main Footer */}
//       <div className="max-w-7xl mx-auto px-2 py-5">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
//           {/* Brand */}
//           <div className="lg:col-span-1">
//             <Link to="/" className="text-2xl font-bold text-white">
//               E-commerce<span className="text-yellow-400">Site</span>
//             </Link>

//             <p className="mt-4 text-sm leading-6 text-slate-400">
//               Your trusted online marketplace for quality products at affordable
//               prices.
//             </p>

//             {/* Social Media */}
//             <div className="flex items-center justify-center gap-3 mt-6">
//               <a
//                 href="#"
//                 className="p-2 rounded-full bg-slate-800 hover:bg-blue-600 transition"
//               >
//                 <FaFacebook size={18} />
//               </a>

//               <a
//                 href="#"
//                 className="p-2 rounded-full bg-slate-800 hover:bg-pink-600 transition"
//               >
//                 <FaInstagram size={18} />
//               </a>

//               <a
//                 href="#"
//                 className="p-2 rounded-full bg-slate-800 hover:bg-sky-500 transition"
//               >
//                 <FaTwitter size={18} />
//               </a>

//               <a
//                 href="#"
//                 className="p-2 rounded-full bg-slate-800 hover:bg-red-600 transition"
//               >
//                 <FaYoutube size={18} />
//               </a>
//             </div>
//           </div>

//           {/* Customer Service */}
//           <div>
//             <h3 className="text-white font-semibold text-lg mb-4">
//               Customer Service
//             </h3>

//             <ul className="space-y-3 text-sm">
//               <li>
//                 <Link to="/orders" className="hover:text-white transition">
//                   Track Your Order
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Seller */}
//           <div>
//             <h3 className="text-white font-semibold text-lg mb-4">
//               Sell With Us
//             </h3>

//             <ul className="space-y-3 text-sm">
//               <li>
//                 <Link
//                   to="/seller/become"
//                   className="hover:text-white transition"
//                 >
//                   Become a Seller
//                 </Link>
//               </li>

//               <li>
//                 <Link
//                   to="/seller/profile"
//                   className="hover:text-white transition"
//                 >
//                   Seller Profile
//                 </Link>
//               </li>

//               <li>
//                 <Link
//                   to="/seller/dashboard"
//                   className="hover:text-white transition"
//                 >
//                   Seller Dashboard
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Contact */}
//           <div>
//             <h3 className="text-white font-semibold text-lg mb-4">
//               Contact Us
//             </h3>

//             <ul className="space-y-4 text-sm">
//               <li className="flex items-start gap-3">
//                 <MapPin size={18} className="mt-0.5 text-yellow-400 shrink-0" />

//                 <span>Surat, Gujarat, India</span>
//               </li>

//               <li className="flex items-center gap-3">
//                 <Phone size={18} className="text-yellow-400 shrink-0" />

//                 <a
//                   href="tel:+919999999999"
//                   className="hover:text-white transition"
//                 >
//                   +91 99999 99999
//                 </a>
//               </li>

//               <li className="flex items-center gap-3">
//                 <Mail size={18} className="text-yellow-400 shrink-0" />

//                 <a
//                   href="mailto:support@shopkart.com"
//                   className="hover:text-white transition"
//                 >
//                   e_commerece@shopkart.com
//                 </a>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* Divider */}
//       <div className="border-t border-slate-700" />

//       {/* Bottom */}
//       <div className="max-w-7xl mx-auto px-2 py-2">
//         <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//           <p className="text-sm text-slate-400 text-center md:text-left">
//             © {new Date().getFullYear()} E-commerece site. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
