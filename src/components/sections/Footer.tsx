import image from "../../assets/image2.jpg";
import { PiInstagramLogoThin } from "react-icons/pi";
import { FaXTwitter } from "react-icons/fa6";
import { SlSocialFacebook } from "react-icons/sl";
const Footer = () => {
  return (
    <section className="relative h-96 w-screen mt-auto text-white">
      <img
        src={image}
        alt="Footer background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Connected</h2>
        <p className="mb-4 max-w-xl">
          Follow us on social media and subscribe to our newsletter for updates.
        </p>
        <div className="flex space-x-6">
          <a href="#" className="hover:underline text-white">
            <span>
              <SlSocialFacebook className="text-red-500 text-4xl inline" />
            </span>
            Facebook
          </a>
          <a href="#" className="hover:underline text-white inline">
            <span>
              <FaXTwitter className="text-red-500 text-4xl inline" />
            </span>{" "}
            Twitter
          </a>
          <a href="#" className="hover:underline text-white inline">
            <span>
              <PiInstagramLogoThin className="text-red-500 text-4xl inline" />
            </span>{" "}
            Instagram
          </a>
        </div>
      </div>
    </section>
  );
};

export default Footer;
