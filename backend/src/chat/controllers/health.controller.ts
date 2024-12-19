// src/chat/controllers/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OllamaService } from '../services/ollama.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly ollamaService: OllamaService) {}

  @Get('ollama')
  @ApiOperation({ summary: 'Check Ollama service health' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns true if Ollama service is available'
  })
  async checkOllamaHealth(): Promise<{ status: string }> {
    const isHealthy = await this.ollamaService.healthCheck();
    return { 
      status: isHealthy ? 'healthy' : 'unhealthy'
    };
  }
}