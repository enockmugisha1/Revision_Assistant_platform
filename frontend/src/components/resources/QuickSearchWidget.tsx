import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  BookOpenIcon, 
  VideoCameraIcon, 
  DocumentTextIcon, 
  ArrowTopRightOnSquareIcon, 
  ArrowPathIcon, 
  ChevronRightIcon 
} from '@heroicons/react/24/outline';
import { educationalResourcesService, EducationalResource } from '../../services/educationalResourcesService';

interface QuickSearchWidgetProps {
  onViewAll?: () => void;
}

const QuickSearchWidget: React.FC<QuickSearchWidgetProps> = ({ onViewAll }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<EducationalResource[]>([]);

  const handleQuickSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;

    setLoading(true);
    
    try {
      const data = await educationalResourcesService.searchResources(query);
      // Get top 6 results across all sources
      setResults(data.results.all.slice(0, 6));
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Quick Resource Search</h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1"
          >
            View All
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Input */}
      <form onSubmit={handleQuickSearch} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any topic..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? (
              <ArrowPathIcon className="w-5 h-5 animate-spin" />
            ) : (
              <MagnifyingGlassIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((resource) => (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
            >
              {/* Thumbnail */}
              <img
                src={resource.thumbnail}
                alt={resource.title}
                className="w-20 h-16 object-cover rounded flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/80x60/4F46E5/FFFFFF?text=Resource';
                }}
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-indigo-700">
                    {resource.title}
                  </h4>
                  <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    resource.source === 'Khan Academy' ? 'bg-green-100 text-green-700' :
                    resource.source === 'YouTube' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {resource.source}
                  </span>
                  {resource.type === 'video' && <VideoCameraIcon className="w-3 h-3 text-gray-500" />}
                  {resource.type === 'pdf' && <DocumentTextIcon className="w-3 h-3 text-gray-500" />}
                  {resource.type === 'article' && <BookOpenIcon className="w-3 h-3 text-gray-500" />}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && results.length === 0 && (
        <div className="text-center py-8">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
            <MagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 text-sm">
            Search for any topic to find free educational resources
          </p>
        </div>
      )}
    </div>
  );
};

export default QuickSearchWidget;
