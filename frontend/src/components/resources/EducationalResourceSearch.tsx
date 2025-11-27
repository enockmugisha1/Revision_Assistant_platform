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

const EducationalResourceSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const data = await educationalResourcesService.searchResources(query, language);
      setResults(data.results);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to search resources');
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <VideoCameraIcon className="w-4 h-4" />;
      case 'pdf':
        return <DocumentTextIcon className="w-4 h-4" />;
      default:
        return <BookOpenIcon className="w-4 h-4" />;
    }
  };

  const getActionText = (type: string) => {
    switch (type) {
      case 'video':
        return 'Watch';
      case 'pdf':
        return 'Download';
      case 'exercise':
        return 'Practice';
      default:
        return 'Read';
    }
  };

  const getSourceBadgeColor = (source: string) => {
    if (source === 'Khan Academy') return 'bg-green-100 text-green-800';
    if (source === 'YouTube') return 'bg-red-100 text-red-800';
    return 'bg-blue-100 text-blue-800';
  };

  const ResourceCard: React.FC<{ resource: EducationalResource }> = ({ resource }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Thumbnail */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={resource.thumbnail}
          alt={resource.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Educational+Resource';
          }}
        />
        <div className="absolute top-2 right-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSourceBadgeColor(resource.source)}`}>
            {resource.source}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
          {resource.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {resource.description}
        </p>

        {resource.channel && (
          <p className="text-xs text-gray-500 mb-3">
            Channel: {resource.channel}
          </p>
        )}

        {/* Action Button */}
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          {getActionIcon(resource.type)}
          <span>{getActionText(resource.type)}</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Free Educational Resources
        </h1>
        <p className="text-lg text-gray-600">
          Search for Khan Academy videos, YouTube lessons, and educational notes
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. 'photosynthesis class 7' or 'quadratic equations grade 10'"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="hi">Hindi</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <MagnifyingGlassIcon className="w-5 h-5" />
                  Search
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>
      </form>

      {/* Results */}
      {results && (
        <div className="space-y-10">
          {/* Khan Academy Section */}
          {results.khanAcademy?.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-green-100 p-2 rounded-lg">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Khan Academy</h2>
                  <p className="text-sm text-gray-600">Official videos, articles, and exercises</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.khanAcademy.map((resource: EducationalResource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </section>
          )}

          {/* YouTube Section */}
          {results.youtube?.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Video className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">YouTube Videos</h2>
                  <p className="text-sm text-gray-600">Educational videos from trusted channels</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.youtube.map((resource: EducationalResource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </section>
          )}

          {/* Educational Notes Section */}
          {results.educationalNotes?.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Notes & Resources</h2>
                  <p className="text-sm text-gray-600">PDFs, worksheets, and study materials</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.educationalNotes.map((resource: EducationalResource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </section>
          )}

          {/* No Results */}
          {results.khanAcademy?.length === 0 && 
           results.youtube?.length === 0 && 
           results.educationalNotes?.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <MagnifyingGlassIcon className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">Try different keywords or check your spelling</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EducationalResourceSearch;
