import { Template, TemplateListResponse } from '@/types/designer';
import AuthService from './AuthService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class TemplateService {
  private static instance: TemplateService;
  private authService: AuthService;

  private constructor() {
    this.authService = AuthService.getInstance();
  }

  public static getInstance(): TemplateService {
    if (!TemplateService.instance) {
      TemplateService.instance = new TemplateService();
    }
    return TemplateService.instance;
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.authService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async listTemplates(page = 1, limit = 20): Promise<TemplateListResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/templates?page=${page}&limit=${limit}`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }

      return await response.json();
    } catch (error) {
      console.error('List templates error:', error);
      throw error;
    }
  }

  async getTemplate(id: string): Promise<Template> {
    try {
      const response = await fetch(`${API_BASE_URL}/templates/${id}`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch template');
      }

      return await response.json();
    } catch (error) {
      console.error('Get template error:', error);
      throw error;
    }
  }

  async createTemplate(template: Omit<Template, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<Template> {
    try {
      const response = await fetch(`${API_BASE_URL}/templates`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(template),
      });

      if (!response.ok) {
        throw new Error('Failed to create template');
      }

      return await response.json();
    } catch (error) {
      console.error('Create template error:', error);
      throw error;
    }
  }

  async updateTemplate(id: string, template: Partial<Template>): Promise<Template> {
    try {
      const response = await fetch(`${API_BASE_URL}/templates/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(template),
      });

      if (!response.ok) {
        throw new Error('Failed to update template');
      }

      return await response.json();
    } catch (error) {
      console.error('Update template error:', error);
      throw error;
    }
  }

  async deleteTemplate(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/templates/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete template');
      }
    } catch (error) {
      console.error('Delete template error:', error);
      throw error;
    }
  }

  // Local storage fallback for development/offline mode
  async saveTemplateLocally(template: Template): Promise<void> {
    if (typeof window !== 'undefined') {
      const templates = this.getLocalTemplates();
      const existingIndex = templates.findIndex(t => t.id === template.id);
      
      if (existingIndex >= 0) {
        templates[existingIndex] = template;
      } else {
        templates.push(template);
      }
      
      localStorage.setItem('templates', JSON.stringify(templates));
    }
  }

  getLocalTemplates(): Template[] {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('templates');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  }

  deleteLocalTemplate(id: string): void {
    if (typeof window !== 'undefined') {
      const templates = this.getLocalTemplates().filter(t => t.id !== id);
      localStorage.setItem('templates', JSON.stringify(templates));
    }
  }
}

export default TemplateService;
