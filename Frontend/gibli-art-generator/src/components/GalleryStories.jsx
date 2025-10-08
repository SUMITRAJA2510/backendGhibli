import {assets} from "../assets/assets.js";

const GalleryStories = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 mb-10">
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Mountain Lake Ghibli Transformation</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="rounded-lg overflow-hidden shadow-md">
                        <img
                            src={assets.grid_1}
                            className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover"
                        />
                    </div>
                    <div className="rounded-lg overflow-hidden shadow-md">
                        <img
                            src={assets.grid_2}
                            className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover"
                        />
                    </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    See how our Ghibli AI generator transforms ordinary landscapes into breathtaking Studio Ghibli worlds with authentic Ghibli art style and magical details in every Ghibli image.
                </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Urban Scene Ghibli AI Transformation</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="rounded-lg overflow-hidden shadow-md">
                        <img
                            src={assets.grid_1}
                            className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover"
                        />
                    </div>
                    <div className="rounded-lg overflow-hidden shadow-md">
                        <img
                            src={assets.grid_2}
                            className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover"
                        />
                    </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    Watch city streets transform into charming Studio Ghibli towns with magical details using our Ghibli generator. Every building and element captures the iconic Ghibli art aesthetic in these Ghibli images.
                </p>
            </div>
        </div>
    );
};

export default GalleryStories;