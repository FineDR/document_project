
import image from "../assets/image2.jpg";
const MyCv = () => {
  return (
    <section className="mx-auto relative w-full py-12">
        <img src={image} className="absolute h-96 w-full object-cover inset-0"/>
        <div className="absolute inset-0 bg-black/5 ">
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">
            My CV
          </h1>
          <p className="text-neutralText max-w-xl mx-auto text-lg">
            This is where you can view and manage your CV. You can edit, download, or
            share your CV with potential employers.
          </p>
          <div className="mt-6 flex justify-center gap-4 flex-wrap">
            <button className="px-5 py-3 bg-red-500 text-white rounded-lg shadow transition hover:bg-red-600">
              Edit CV
            </button>
            <button className="px-5 py-3 bg-gray-200 text-gray-800 rounded-lg shadow transition hover:bg-gray-300">
              Download CV
            </button>
            <button className="px-5 py-3 bg-blue-500 text-white rounded-lg shadow transition hover:bg-blue-600">
              Share CV
            </button>   

        </div>
        </div>
        
        </div>
    </section>
  );
}
export default MyCv;