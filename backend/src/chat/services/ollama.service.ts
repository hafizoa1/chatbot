// src/chat/services/ollama.service.ts
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosInstance, AxiosError } from 'axios';
import { OllamaRequestOptions, OllamaResponse } from '../interfaces/ollama.interface';
import { Chat } from '../entities/chat.entity';

@Injectable()
export class OllamaService {
  private readonly logger = new Logger(OllamaService.name);
  private readonly axiosInstance: AxiosInstance;
  private readonly MODEL_NAME = 'tinyllama';

  constructor() {
    const baseURL = 'http://localhost:11434';
    this.logger.log(`Initializing Ollama service with baseURL: ${baseURL}`);

    this.axiosInstance = axios.create({
      baseURL,
      timeout: 30000,
    });
  }

  /**
   * Generates a response using the Ollama API
   */
  async generateResponse(
    message: string,
    recentChats: Chat[] = [],
    context?: number[],
  ): Promise<OllamaResponse> {
    try {
      // First check if model exists
      await this.ensureModelExists();

      const prompt = this.formatPrompt(message, recentChats);
      
      this.logger.log(`Sending request to Ollama with model: ${this.MODEL_NAME}`);
      
      const requestOptions: OllamaRequestOptions = {
        model: this.MODEL_NAME,
        prompt,
        stream: false,
        context,
        temperature: 0.7,
        top_p: 0.9,
        repeat_penalty: 1.1
      };

      const response = await this.axiosInstance.post<OllamaResponse>(
        '/api/generate',
        requestOptions
      );

      this.logger.log('Successfully generated response from Ollama');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.logger.error('Axios error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });

        if (error.response?.status === 500) {
          throw new HttpException(
            'Model processing error. Please ensure the model is properly loaded.',
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }

        throw new HttpException(
          'Failed to communicate with Ollama service',
          HttpStatus.SERVICE_UNAVAILABLE
        );
      }
      
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Ensure the required model exists and is loaded
   */
  private async ensureModelExists(): Promise<void> {
    try {
      await this.axiosInstance.post('/api/show', {
        name: this.MODEL_NAME
      });
    } catch (error) {
      this.logger.error(`Model ${this.MODEL_NAME} not found. Attempting to pull...`);
      throw new HttpException(
        `Model ${this.MODEL_NAME} is not available. Please ensure it's installed using 'ollama pull ${this.MODEL_NAME}'`,
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }

  /**
   * Format the conversation history into a prompt
   */
  private formatPrompt(message: string, recentChats: Chat[]): string {
    let prompt = 'You are a helpful assistant. Give a single direct response.\n\n';
    
    // Take only the last 2 messages for context
    const context = recentChats.slice(0, 2);
    
    if (context.length > 0) {
        prompt += 'Recent conversation:\n';
        context.forEach(chat => {
            prompt += `Context - Message: ${chat.message}\n`;
            prompt += `Context - Response: ${chat.response}\n`;
        });
        prompt += '\n';
    }
    
    prompt += `Current message: ${message}\nYour response:`;
    
    this.logger.debug('Generated prompt:', prompt);  // For debugging
    return prompt;
}
  /**
   * Checks if Ollama service is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      this.logger.log('Attempting Ollama health check...');
      const response = await this.axiosInstance.get('/api/version');
      this.logger.log('Ollama health check response:', response.data);
      
      // Also check if model exists
      await this.ensureModelExists();
      
      return true;
    } catch (error) {
      this.logger.error('Ollama service health check failed:', error);
      return false;
    }
  }
}