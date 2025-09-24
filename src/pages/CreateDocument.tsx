
import { FaFileAlt,
    //  FaPlus, FaLayerGroup 
    } from 'react-icons/fa';
import { NavLink } from "react-router-dom";
const CreateDocument = () => {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 m-8 mt-16">
        <h2 className="col-span-full text-3xl font-bold mb-6 text-center">
          Explore Our Document Creation Features
        </h2>
      {[
        {
          title: 'CV Builder',
          icon: <FaFileAlt className="text-3xl text-red-500 mb-2" />,
          path: '/create/cv',
        },
        // {
        //   title: 'Cover Letters',
        //   icon: <FaPlus className="text-3xl text-red-500 mb-2" />,
        //   path: '/create/cover-letter',
        // },
        // {
        //   title: 'Portfolios',
        //   icon: <FaLayerGroup className="text-3xl text-red-500 mb-2" />,
        //   path: '/create/portfolio',
        // },
        // {
        //   title: 'Certificates',
        //   icon: <FaFileAlt className="text-3xl text-red-500 mb-2" />,
        //   path: '/create/certificate',
        // },
      ].map((feature) => (
        <NavLink
          to={feature.path}
          key={feature.title}
          className="border rounded-lg p-6 text-center hover:shadow-md transition"
        >
          {feature.icon}
          <h3 className="font-semibold text-lg">{feature.title}</h3>
          <p className="text-sm text-gray-600 mt-1">
            Create, edit, and export your {feature.title.toLowerCase()}.
          </p>
        </NavLink>
      ))}
    </section>
    );
}
export default CreateDocument;