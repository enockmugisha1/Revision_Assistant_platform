import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  BookOpenIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  LinkIcon,
  AcademicCapIcon,
  StarIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  SparklesIcon,
  GlobeAltIcon,
  FolderIcon
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import ResourceService, { ResourceListItem, CreateResourceDto } from '../../services/resourceService';
import aiService from '../../services/aiService';
import { educationalResourcesService, EducationalResource } from '../../services/educationalResourcesService';
import toast from 'react-hot-toast';

const resourceTypes = [
  { value: '', label: 'All Types' },
  { value: 'book', label: 'Books' },
  { value: 'video', label: 'Videos' },
  { value: 'article', label: 'Articles' },
  { value: 'document', label: 'Documents' },
  { value: 'link', label: 'Links' },
  { value: 'course', label: 'Courses' },
  { value: 'tutorial', label: 'Tutorials' }
];

const levels = ['beginner', 'intermediate', 'advanced', 'all'];

type TabType = 'my-resources' | 'search-free';

export const ResourcesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('search-free');
  const [resources, setResources] = useState<ResourceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    level: '',
    subject: '',
    sort: '-createdAt'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAIGuideModal, setShowAIGuideModal] = useState(false);
  const [aiGuideLoading, setAiGuideLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  // Educational Resources Search State
  const [eduSearchQuery, setEduSearchQuery] = useState('');
  const [eduLanguage, setEduLanguage] = useState('en');
  const [eduLoading, setEduLoading] = useState(false);
  const [eduResults, setEduResults] = useState<any>(null);
  const [eduError, setEduError] = useState('');

  useEffect(() => {
    if (activeTab === 'my-resources') {
      loadResources();
    }
  }, [searchTerm, filters, page, activeTab]);

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await ResourceService.list({
        search: searchTerm,
        ...filters,
        page,
        limit: 12
      });
      setResources(data.docs);
      setTotalPages(data.pages);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  // Educational Resources Search
  const handleEduSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eduSearchQuery.trim()) {
      setEduError('Please enter a search query');
      return;
    }

    setEduLoading(true);
    setEduError('');
    
    try {
      const data = await educationalResourcesService.searchResources(eduSearchQuery, eduLanguage);
      setEduResults(data.results);
      if (data.totalResults === 0) {
        toast.info('No results found. Try different keywords.');
      } else {
        toast.success(`Found ${data.totalResults} educational resources!`);
      }
    } catch (err: any) {
      setEduError(err.response?.data?.message || 'Failed to search resources');
      toast.error('Search failed. Please try again.');
    } finally {
      setEduLoading(false);
    }
  };

  const generateAIStudyGuide = async (formData: { subject: string; topic: string; level: string }) => {
    setAiGuideLoading(true);
    try {
      const guide = await aiService.generateStudyGuide({
        subject: formData.subject,
        topic: formData.topic,
        level: formData.level
      });
      toast.success('🎉 AI Study Guide Generated!');
      // You could save this as a resource or display it
      console.log('Generated guide:', guide);
      setShowAIGuideModal(false);
      // Optionally reload resources
      loadResources();
    } catch (error) {
      console.error('AI guide generation error:', error);
      toast.error('Failed to generate study guide. Please try again.');
    } finally {
      setAiGuideLoading(false);
    }
  };

  const ResourceCard: React.FC<{ resource: ResourceListItem }> = ({ resource }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
    >
      {resource.thumbnailUrl ? (
        <div className="h-48 overflow-hidden bg-gray-100">
          <img src={resource.thumbnailUrl} alt={resource.title} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
          <BookOpenIcon className="h-16 w-16 text-gray-400" />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">{resource.title}</h3>
          <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
            {resource.type}
          </span>
        </div>
        
        {resource.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{resource.description}</p>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span className="font-medium">{resource.subject}</span>
          <span className="capitalize">{resource.level}</span>
        </div>
        
        {resource.author && <p className="text-sm text-gray-500 mb-3">By {resource.author}</p>}
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <div className="flex items-center">
              <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
              <span>{resource.averageRating.toFixed(1)}</span>
            </div>
            <div className="flex items-center">
              <EyeIcon className="h-4 w-4 mr-1" />
              <span>{resource.views}</span>
            </div>
            <div className="flex items-center">
              <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
              <span>{resource.downloads}</span>
            </div>
          </div>
          <Button size="sm">View</Button>
        </div>
      </div>
    </motion.div>
  );

  const EducationalResourceCard: React.FC<{ resource: EducationalResource }> = ({ resource }) => {
    const getActionIcon = () => {
      switch (resource.type) {
        case 'video':
          return <VideoCameraIcon className="h-4 w-4" />;
        case 'pdf':
          return <DocumentTextIcon className="h-4 w-4" />;
        default:
          return <BookOpenIcon className="h-4 w-4" />;
      }
    };

    const getActionText = () => {
      switch (resource.type) {
        case 'video':
          return 'Watch Video';
        case 'pdf':
          return 'Download PDF';
        case 'exercise':
          return 'Practice Now';
        default:
          return 'Read More';
      }
    };

    const getSourceBadgeColor = () => {
      if (resource.source === 'Khan Academy') return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300';
      if (resource.source === 'YouTube') return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300';
      return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300';
    };

    const getCardGradient = () => {
      if (resource.source === 'Khan Academy') return 'hover:shadow-green-200';
      if (resource.source === 'YouTube') return 'hover:shadow-red-200';
      return 'hover:shadow-blue-200';
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        className={`bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-2xl transition-all ${getCardGradient()}`}
      >
        {/* Thumbnail */}
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden group">
          <img
            src={resource.thumbnail}
            alt={resource.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Educational+Resource';
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity"></div>
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${getSourceBadgeColor()}`}>
              {resource.source}
            </span>
          </div>
          {resource.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white bg-opacity-90 rounded-full p-4 shadow-xl">
                <VideoCameraIcon className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 hover:text-indigo-600 transition-colors">
            {resource.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
            {resource.description}
          </p>

          {resource.channel && (
            <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                <AcademicCapIcon className="h-3 w-3 text-indigo-600" />
              </div>
              <span className="font-medium">{resource.channel}</span>
            </div>
          )}

          {/* Action Button */}
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
          >
            {getActionIcon()}
            <span>{getActionText()}</span>
            <LinkIcon className="h-4 w-4" />
          </a>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-2xl shadow-xl text-white">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <BookOpenIcon className="h-10 w-10" />
            Educational Resources
          </h1>
          <p className="text-indigo-100 text-lg">
            Discover free learning materials from the world's best educational sources
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            leftIcon={<SparklesIcon className="h-5 w-5" />} 
            onClick={() => setShowAIGuideModal(true)}
            className="bg-white text-indigo-600 hover:bg-indigo-50 border-2 border-white font-semibold shadow-lg"
          >
            AI Study Guide
          </Button>
          {activeTab === 'my-resources' && (
            <Button 
              leftIcon={<PlusIcon className="h-5 w-5" />} 
              onClick={() => setShowCreateModal(true)}
              className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold shadow-lg"
            >
              Add Resource
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
        <div className="flex border-b-2 border-gray-100">
          <button
            onClick={() => setActiveTab('search-free')}
            className={`flex-1 px-8 py-5 text-base font-bold transition-all flex items-center justify-center gap-3 ${
              activeTab === 'search-free'
                ? 'text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <GlobeAltIcon className="h-6 w-6" />
            <span>Search Free Resources</span>
            {activeTab === 'search-free' && (
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-white text-indigo-600 shadow-md animate-pulse">
                100% FREE
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('my-resources')}
            className={`flex-1 px-8 py-5 text-base font-bold transition-all flex items-center justify-center gap-3 ${
              activeTab === 'my-resources'
                ? 'text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <FolderIcon className="h-6 w-6" />
            <span>My Resources</span>
          </button>
        </div>

        {/* Search Free Resources Tab */}
        {activeTab === 'search-free' && (
          <div className="p-8">
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-indigo-100">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <SparklesIcon className="h-7 w-7 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Search Across Multiple Educational Platforms
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Find curated educational content from <span className="font-semibold text-green-600">Khan Academy</span>, 
                    <span className="font-semibold text-red-600"> YouTube Educational Channels</span>, and 
                    <span className="font-semibold text-blue-600"> Educational Websites</span>. 
                    All resources are 100% free and support multiple languages.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleEduSearch} className="mb-8">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl shadow-md border border-indigo-100">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={eduSearchQuery}
                      onChange={(e) => setEduSearchQuery(e.target.value)}
                      placeholder="Search for any topic... e.g., 'photosynthesis', 'algebra', 'world history'"
                      className="w-full pl-12 pr-4 py-4 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500 shadow-sm"
                    />
                  </div>
                  
                  <select
                    value={eduLanguage}
                    onChange={(e) => setEduLanguage(e.target.value)}
                    className="px-4 py-4 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white font-medium text-gray-700 shadow-sm"
                  >
                    <option value="en">🇬🇧 English</option>
                    <option value="fr">🇫🇷 French</option>
                    <option value="hi">🇮🇳 Hindi</option>
                  </select>

                  <Button 
                    type="submit" 
                    loading={eduLoading} 
                    className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                    leftIcon={<SparklesIcon className="h-5 w-5" />}
                  >
                    {eduLoading ? 'Searching...' : 'Search Resources'}
                  </Button>
                </div>

                {eduError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm font-medium flex items-center gap-2"
                  >
                    <XMarkIcon className="h-5 w-5" />
                    {eduError}
                  </motion.div>
                )}
              </div>
            </form>

            {/* Educational Resources Results */}
            {eduResults && (
              <div className="space-y-10">
                {/* Khan Academy Section */}
                {eduResults.khanAcademy?.length > 0 && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-green-200">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 rounded-xl shadow-md">
                          <BookOpenIcon className="w-7 h-7 text-green-700" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            Khan Academy
                            <span className="text-sm font-normal text-green-600 bg-green-50 px-3 py-1 rounded-full">
                              {eduResults.khanAcademy.length} resources
                            </span>
                          </h2>
                          <p className="text-sm text-gray-600 mt-1">Official videos, articles, and exercises • 100% Free</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {eduResults.khanAcademy.map((resource: EducationalResource, index: number) => (
                        <motion.div
                          key={resource.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <EducationalResourceCard resource={resource} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {/* YouTube Section */}
                {eduResults.youtube?.length > 0 && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-red-200">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-red-100 to-red-200 p-3 rounded-xl shadow-md">
                          <VideoCameraIcon className="w-7 h-7 text-red-700" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            YouTube Educational Videos
                            <span className="text-sm font-normal text-red-600 bg-red-50 px-3 py-1 rounded-full">
                              {eduResults.youtube.length} videos
                            </span>
                          </h2>
                          <p className="text-sm text-gray-600 mt-1">Hand-picked from trusted educational channels</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {eduResults.youtube.map((resource: EducationalResource, index: number) => (
                        <motion.div
                          key={resource.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <EducationalResourceCard resource={resource} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {/* Educational Notes Section */}
                {eduResults.educationalNotes?.length > 0 && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-blue-200">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-xl shadow-md">
                          <DocumentTextIcon className="w-7 h-7 text-blue-700" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            Notes & Study Materials
                            <span className="text-sm font-normal text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                              {eduResults.educationalNotes.length} documents
                            </span>
                          </h2>
                          <p className="text-sm text-gray-600 mt-1">PDFs, worksheets, and comprehensive study materials</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {eduResults.educationalNotes.map((resource: EducationalResource, index: number) => (
                        <motion.div
                          key={resource.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <EducationalResourceCard resource={resource} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {/* No Results */}
                {eduResults.khanAcademy?.length === 0 && 
                 eduResults.youtube?.length === 0 && 
                 eduResults.educationalNotes?.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200"
                  >
                    <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <MagnifyingGlassIcon className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No resources found</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      We couldn't find educational resources for "<span className="font-semibold">{eduSearchQuery}</span>".
                      Try different keywords or check your spelling.
                    </p>
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-sm font-medium text-gray-700">💡 Suggestions:</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {['photosynthesis', 'algebra', 'chemistry', 'history', 'programming'].map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={async () => {
                              setEduSearchQuery(suggestion);
                              setEduLoading(true);
                              setEduError('');
                              
                              try {
                                const data = await educationalResourcesService.searchResources(suggestion, eduLanguage);
                                setEduResults(data.results);
                                if (data.totalResults === 0) {
                                  toast.info('No results found. Try different keywords.');
                                } else {
                                  toast.success(`Found ${data.totalResults} educational resources!`);
                                }
                              } catch (err: any) {
                                setEduError(err.response?.data?.message || 'Failed to search resources');
                                toast.error('Search failed. Please try again.');
                              } finally {
                                setEduLoading(false);
                              }
                            }}
                            className="px-4 py-2 bg-white border-2 border-indigo-200 text-indigo-600 rounded-full hover:bg-indigo-50 hover:border-indigo-400 transition-all font-medium text-sm"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Initial State - No search yet */}
            {!eduResults && !eduLoading && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border-2 border-indigo-100 shadow-lg"
              >
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-xl mb-4">
                    <GlobeAltIcon className="h-12 w-12 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  🎓 Discover Free Educational Resources
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto mb-6 text-lg leading-relaxed">
                  Access thousands of free educational videos, articles, and study materials from 
                  <span className="font-semibold text-green-600"> Khan Academy</span>, 
                  <span className="font-semibold text-red-600"> YouTube</span>, and other 
                  <span className="font-semibold text-blue-600"> trusted educational sources</span>.
                </p>
                
                <div className="flex flex-wrap items-center justify-center gap-6 mt-8 mb-8">
                  <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-md">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-medium text-gray-700">Khan Academy</span>
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">FREE</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-md">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="font-medium text-gray-700">YouTube Videos</span>
                    <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">FREE</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-md">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="font-medium text-gray-700">Study Materials</span>
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">FREE</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-8">
                  <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
                    <BookOpenIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900 mb-1">Mathematics</h4>
                    <p className="text-xs text-gray-600">Algebra, Calculus, Geometry</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
                    <AcademicCapIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900 mb-1">Sciences</h4>
                    <p className="text-xs text-gray-600">Physics, Chemistry, Biology</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
                    <VideoCameraIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900 mb-1">Video Tutorials</h4>
                    <p className="text-xs text-gray-600">Step-by-step explanations</p>
                  </div>
                </div>

                <div className="mt-8 text-sm text-gray-500">
                  💡 <span className="font-medium">Tip:</span> Try searching for specific topics like "photosynthesis", "quadratic equations", or "world war 2"
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* My Resources Tab */}
        {activeTab === 'my-resources' && (
          <div className="p-6">
            <form onSubmit={handleSearch} className="flex gap-3 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <Button type="submit">Search</Button>
              <Button type="button" variant="outline" leftIcon={<FunnelIcon className="h-4 w-4" />} onClick={() => setShowFilters(!showFilters)}>
                Filters
              </Button>
            </form>

            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mb-4 pb-4 border-b border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    {resourceTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <select value={filters.level} onChange={(e) => handleFilterChange('level', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option value="">All Levels</option>
                    {levels.map(level => <option key={level} value={level} className="capitalize">{level}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input type="text" value={filters.subject} onChange={(e) => handleFilterChange('subject', e.target.value)} placeholder="e.g., Mathematics" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select value={filters.sort} onChange={(e) => handleFilterChange('sort', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option value="-createdAt">Newest First</option>
                    <option value="createdAt">Oldest First</option>
                    <option value="-averageRating">Highest Rated</option>
                    <option value="-views">Most Viewed</option>
                    <option value="-downloads">Most Downloaded</option>
                  </select>
                </div>
              </motion.div>
            )}

            {error && <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">{error}</div>}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => <div key={i} className="bg-gray-100 rounded-lg h-96 animate-pulse" />)}
              </div>
            ) : resources.length === 0 ? (
              <div className="text-center py-12">
                <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {resources.map((resource) => <ResourceCard key={resource._id} resource={resource} />)}
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-6">
                    <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</Button>
                    <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
                    <Button variant="outline" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <AIStudyGuideModal 
        show={showAIGuideModal}
        loading={aiGuideLoading}
        onClose={() => setShowAIGuideModal(false)}
        onGenerate={generateAIStudyGuide}
      />
    </div>
  );
};

const AIStudyGuideModal: React.FC<{
  show: boolean;
  loading: boolean;
  onClose: () => void;
  onGenerate: (data: { subject: string; topic: string; level: string }) => void;
}> = ({ show, loading, onClose, onGenerate }) => {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('intermediate');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !topic.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    onGenerate({ subject, topic, level });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Generate AI Study Guide</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Mathematics, Biology, History"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Algebra, Cell Biology, World War II"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex-1"
            >
              {loading ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ResourcesPage;
