// src/chat/dto/create-chat.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty({
    description: 'The ID of the user sending the message',
    example: 'user123',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'The message content',
    example: 'Hello, how are you?',
  })
  @IsNotEmpty()
  @IsString()
  message: string;
}