import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../entities/chat.entity';
import { CreateChatDto } from '../dto/create-chat.dto';
import { OllamaService } from './ollama.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class ChatService {
    private readonly logger = new Logger(ChatService.name);

  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    private ollamaService: OllamaService,
  ) {
    this.testDatabaseConnection();
  }

  async createChat(createChatDto: CreateChatDto): Promise<Chat> {
    const { userId, message } = createChatDto;
    
    this.logger.log(`Creating chat for user ${userId} with message: ${message}`);
    
    try {
      // Get recent chat history for context
      const recentChats = await this.getRecentChats(userId);
      this.logger.log(`Found ${recentChats.length} recent chats for context`);
      
      // Get response from Ollama
      this.logger.log('Requesting response from Ollama service...');
      const ollamaResponse = await this.ollamaService.generateResponse(message, recentChats);
      this.logger.log('Received response from Ollama service');
      
      // Create new chat entry
      const chat = this.chatRepository.create({
        userId,
        message,
        response: ollamaResponse.response.trim()
      });

      // Save to database
      const savedChat = await this.chatRepository.save(chat);
      this.logger.log(`Successfully saved chat with ID: ${savedChat.id}`);
      
      return savedChat;
    } catch (error) {
      this.logger.error('Error in createChat:', error);
      throw error;
    }
  }

  async getRecentChats(userId: string, limit: number = 5): Promise<Chat[]> {
    return this.chatRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getChatHistory(userId: string): Promise<Chat[]> {
    return this.chatRepository.find({
      where: { userId },
      order: { createdAt: 'ASC' },
    });
  }

  private async testDatabaseConnection() {
    try {
      await this.chatRepository.count();
      this.logger.log('Database connection successful');
    } catch (error) {
      this.logger.error('Database connection failed:', error);
    }
  }
}