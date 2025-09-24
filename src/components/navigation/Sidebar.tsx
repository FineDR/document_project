import { navLinks } from './NavigationData';
import { Link } from 'react-router-dom';
import { FaHome, FaFileAlt, FaPlus, FaPalette, FaMoneyBill, FaQuestion, FaUser } from 'react-icons/fa';

const icons = {
  Home: <FaHome />,
  Documents: <FaFileAlt />,
  Create: <FaPlus />,
  Templates: <FaPalette />,
  Pricing: <FaMoneyBill />,
  Help: <FaQuestion />,
  Profile: <FaUser />,
};

export const Sidebar = () => {
  return (
    <aside className="w-60 h-full bg-white border-r shadow-sm p-4 space-y-4">
      <h1 className="text-2xl font-bold text-primary mb-6">DocuGen</h1>
      {navLinks.map(link => (
        <div key={link.name}>
          <Link
            to={link.path || '#'}
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100"
          >
            {icons[link.name as keyof typeof icons]}
            {link.name}
          </Link>
        </div>
      ))}
      <div>
        <Link
          to="/profile"
          className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100"
        >
          <FaUser />
          Profile
        </Link>
      </div>
    </aside>
  );
};
