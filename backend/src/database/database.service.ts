// src/database/database.service.ts
import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async onApplicationBootstrap() {
    try {
      if (this.dataSource.isInitialized) {
        this.logger.log('Database connection initialized successfully');
        
        // Log some database info
        const { database, port, host } = this.dataSource.options as any;
        this.logger.log(`Connected to database: ${database} on ${host}:${port}`);
        
        // Test the connection
        await this.dataSource.query('SELECT NOW()');
        this.logger.log('Database query test successful');
      }
    } catch (error) {
      this.logger.error('Database connection failed:', error);
      throw error;
    }
  }
}