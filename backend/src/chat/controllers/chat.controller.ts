// src/chat/controllers/chat.controller.ts
import { Controller, Post, Body, Get, Param, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatService } from '../services/chat.service';
import { CreateChatDto } from '../dto/create-chat.dto';
import { Chat } from '../entities/chat.entity';

@ApiTags('chat')
@Controller('chat')
@UseInterceptors(ClassSerializerInterceptor)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new chat message' })
  @ApiResponse({ status: 201, description: 'Message sent successfully.', type: Chat })
  async createChat(@Body() createChatDto: CreateChatDto): Promise<Chat> {
    return this.chatService.createChat(createChatDto);
  }

  @Get('history/:userId')
  @ApiOperation({ summary: 'Get chat history for a user' })
  @ApiResponse({ status: 200, description: 'Returns chat history.', type: [Chat] })
  async getChatHistory(@Param('userId') userId: string): Promise<Chat[]> {
    return this.chatService.getChatHistory(userId);
  }
}