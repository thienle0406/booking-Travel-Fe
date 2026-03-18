import { Link } from 'react-router-dom';
import type { Tour } from '../types/tour';
import { MapPinIcon, ClockIcon, StarIcon } from '@heroicons/react/24/solid';
import { HeartIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '../utils/format';
import { useState } from 'react';

interface TourCardProps {
    tour: Tour;
}

const TourCard: React.FC<TourCardProps> = ({ tour }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const hasDiscount = tour.discountPercent > 0;

    return (
        <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            {/* Image Container */}
            <Link to={`/tour/${tour.id}`} className="block relative h-64 overflow-hidden">
                {/* Image with zoom effect */}
                <img
                    src={tour.imageUrl}
                    alt={tour.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Discount Badge */}
                {hasDiscount && (
                    <div className="absolute top-4 left-4 z-10">
                        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                            -{tour.discountPercent}%
                        </div>
                    </div>
                )}

                {/* Favorite Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setIsFavorite(!isFavorite);
                    }}
                    className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-110"
                >
                    <HeartIcon
                        className={`h-6 w-6 transition-colors duration-300 ${
                            isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                        }`}
                    />
                </button>

                {/* Rating Badge - Appears on hover */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm font-bold text-gray-900">{tour.rating || 4.8}</span>
                </div>
            </Link>

            {/* Content */}
            <div className="p-6 relative">
                {/* Destination */}
                <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPinIcon className="h-4 w-4 mr-1 text-primary" />
                    <span className="font-medium">{tour.destination}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 min-h-[56px] group-hover:text-primary transition-colors duration-300">
                    <Link to={`/tour/${tour.id}`}>
                        {tour.name}
                    </Link>
                </h3>

                {/* Duration */}
                <div className="flex items-center text-sm text-gray-600 mb-4">
                    <ClockIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                    {tour.duration}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 pt-4 mt-4">
                    <div className="flex items-center justify-between">
                        {/* Price */}
                        <div className="flex flex-col">
                            {hasDiscount && (
                                <span className="text-sm line-through text-gray-400">
                                    {formatCurrency(tour.originalPrice)}
                                </span>
                            )}
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                                    {formatCurrency(tour.price)}
                                </span>
                                <span className="text-xs text-gray-500">/ khách</span>
                            </div>
                        </div>

                        {/* View Button */}
                        <Link
                            to={`/tour/${tour.id}`}
                            className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                        >
                            Xem Chi Tiết
                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Shine effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
            </div>
        </div>
    );
};

export default TourCard;