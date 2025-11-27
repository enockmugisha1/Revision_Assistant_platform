import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface EducationalResource {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  type: 'video' | 'article' | 'exercise' | 'pdf';
  source: string;
  channel?: string;
  priority: number;
}

export interface SearchResults {
  khanAcademy: EducationalResource[];
  youtube: EducationalResource[];
  educationalNotes: EducationalResource[];
  all: EducationalResource[];
}

export interface SearchResponse {
  success: boolean;
  query: string;
  language: string;
  totalResults: number;
  results: SearchResults;
}

export const educationalResourcesService = {
  // Search for educational resources
  searchResources: async (query: string, language: string = 'en'): Promise<SearchResponse> => {
    try {
      const response = await axios.get(`${API_URL}/educational-resources/search`, {
        params: { query, language }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching educational resources:', error);
      throw error;
    }
  },

  // Test API configuration
  testConfiguration: async () => {
    try {
      const response = await axios.get(`${API_URL}/educational-resources/test-config`);
      return response.data;
    } catch (error) {
      console.error('Error testing configuration:', error);
      throw error;
    }
  }
};
