import React from 'react';
import { Spinner } from './Spinner';

export const AppLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-extrabold text-xl">Ti</span>
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center animate-ping opacity-75">
            <div className="w-4 h-4 rounded-full bg-rose-400"></div>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">Titanium</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">Preparing your shopping experience</p>
        </div>
        
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Loading assets</span>
            <span>...</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 rounded-full animate-pulse"
              style={{ width: '60%' }}
            ></div>
          </div>
        </div>
        
        <Spinner size="lg" />
      </div>
    </div>
  );
};