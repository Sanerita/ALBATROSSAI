import React from 'react';

const Footer: React.FC = () => {
 return (
 <footer className="bg-navy-900 text-white py-4 text-center">
 <div className="container mx-auto">
 <p>&copy; {new Date().getFullYear()} Albatross CRM. All rights reserved.</p>
 </div>
 </footer>
 );
};

export default Footer;
