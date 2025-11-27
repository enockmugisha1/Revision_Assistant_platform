import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, DocumentTextIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import aiService from '../../services/aiService';
import rubricService, { Rubric } from '../../services/rubricService';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

export const PrewritingPage: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [outline, setOutline] = useState<any>(null);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [selectedRubricId, setSelectedRubricId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateOutline = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const data = await aiService.outline(topic);
      setOutline(data);
      toast.success('✨ AI generated your outline!');
    } catch (error) {
      console.error('Outline generation error:', error);
      toast.error('Failed to generate outline. Please try again.');
    } finally { 
      setLoading(false); 
    }
  };

  const loadPrompts = async (genre: string) => {
    try {
      const data = await aiService.prompts(genre);
      setPrompts(data.prompts || []);
      toast.success(`Loaded ${genre} prompts`);
      const rubricData = await rubricService.list(genre);
      setRubrics(rubricData);
    } catch (error) {
      console.error('Error loading prompts:', error);
      toast.error('Failed to load prompts');
    }
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <SparklesIcon className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-semibold">AI Prewriting Tools</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
            <input 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
              value={topic} 
              onChange={(e) => setTopic(e.target.value)} 
              placeholder="Enter your essay topic..."
            />
          </div>
          <div className="flex items-end">
            <Button 
              onClick={generateOutline} 
              loading={loading}
              leftIcon={<SparklesIcon className="h-4 w-4" />}
              className="w-full"
            >
              Generate Outline
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <LightBulbIcon className="h-6 w-6 text-yellow-600" />
            <h3 className="font-semibold">Genre-Specific Prompts</h3>
          </div>
          <div className="flex gap-2 mb-4">
            <Button variant="outline" size="sm" onClick={() => loadPrompts('argumentative')}>
              Argumentative
            </Button>
            <Button variant="outline" size="sm" onClick={() => loadPrompts('narrative')}>
              Narrative
            </Button>
            <Button variant="outline" size="sm" onClick={() => loadPrompts('informative')}>
              Informative
            </Button>
          </div>
          {prompts.length > 0 ? (
            <ul className="space-y-2">
              {prompts.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-blue-600 font-bold mt-0.5">{i + 1}.</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Select a genre to see writing prompts</p>
          )}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Rubric</label>
            <select 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
              value={selectedRubricId} 
              onChange={(e) => setSelectedRubricId(e.target.value)}
            >
              <option value="">None</option>
              {rubrics.map((r) => (<option key={r._id} value={r._id}>{r.title}</option>))}
            </select>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <DocumentTextIcon className="h-6 w-6 text-green-600" />
            <h3 className="font-semibold">AI Generated Outline</h3>
          </div>
          {!outline ? (
            <div className="flex items-center justify-center h-64 text-center">
              <div>
                <SparklesIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-600">No outline yet.</p>
                <p className="text-xs text-gray-500 mt-1">Enter a topic and click Generate</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm font-medium text-purple-900 mb-1">Thesis Statement:</p>
                <p className="text-sm text-purple-800">{outline.thesis}</p>
              </div>
              <div className="space-y-3">
                {(outline.sections || []).map((s: any, i: number) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-semibold text-gray-900 mb-2">{s.heading}</div>
                    <ul className="space-y-1">
                      {(s.bullets || []).map((b: string, bi: number) => (
                        <li key={bi} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-blue-600">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PrewritingPage;

