import {useNavigate} from "react-router-dom";

const HeroSection = () => {
    const navigate = useNavigate();
    return (
        <div className="container mx-auto flex flex-col items-center justify-center text-center py-20 lg:py-40">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4 leading-tight">
                Transform Your Photos into <br /> Ghibli Art with Ghibli AI
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mb-8">
                Experience the magic of Studio Ghibli's artistic style with our AI-powered Ghibli image generator tool.
            </p>
            <button onClick={() => navigate('/create')} className="bg-orange-900 text-white font-bold py-3 px-8 rounded-lg hover:bg-orange-800 transition-transform transform hover:scale-105">
                Try Ghibli AI
            </button>
        </div>
    );
};

export default HeroSection;