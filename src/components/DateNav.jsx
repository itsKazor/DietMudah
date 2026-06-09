import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDateDisplay, isToday } from '../utils/dateUtils';

export default function DateNav({ selectedDate, onDateChange }) {
  const handlePrev = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    onDateChange(prev);
  };

  const handleNext = () => {
    if (isToday(selectedDate)) return; // Cannot go to future
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    onDateChange(next);
  };

  const isTodayDate = isToday(selectedDate);

  return (
    <div className="flex items-center justify-between bg-white py-3 px-4 rounded-2xl shadow-sm border border-gray-100">
      <button 
        onClick={handlePrev}
        className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 text-primary-dark transition-colors"
      >
        <ChevronLeft size={24} />
      </button>
      
      <span className="font-semibold text-text-primary">
        {formatDateDisplay(selectedDate)}
      </span>
      
      <button 
        onClick={handleNext}
        disabled={isTodayDate}
        className={`p-2 rounded-full transition-colors ${
          isTodayDate 
            ? 'text-gray-300 cursor-not-allowed' 
            : 'hover:bg-gray-100 active:bg-gray-200 text-primary-dark'
        }`}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
