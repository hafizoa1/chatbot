// src/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './controllers/chat.controller';
import { HealthController } from './controllers/health.controller'; // Make sure this is imported
import { ChatService } from './services/chat.service';
import { OllamaService } from './services/ollama.service';
import { Chat } from './entities/chat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat])
  ],
  controllers: [ChatController, HealthController],  // Make sure HealthController is included here
  providers: [ChatService, OllamaService]
})
export class ChatModule {}