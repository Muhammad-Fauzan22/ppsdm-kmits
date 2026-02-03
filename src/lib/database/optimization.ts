/**
 * Database Optimization Utilities
 * 
 * Utilities untuk optimasi database queries dan performance
 * Mendukung query optimization, connection pooling, dan indexing
 * 
 * @see https://supabase.com/docs/guides/database/performance
 */

import { createClient } from '@/lib/supabase/server';

/**
 * Query Builder dengan optimasi
 * 
 * Membantu mengoptimasi query Supabase
 */
export class QueryOptimizer {
  private supabase = createClient();

  /**
   * Select dengan kolom spesifik (mengurangi data transfer)
   */
  async select<T>(
    table: string,
    columns: string,
    filters?: Record<string, any>
  ): Promise<T[]> {
    let query = this.supabase.from(table).select(columns);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Query error: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Select dengan pagination (mengurangi load)
   */
  async selectPaginated<T>(
    table: string,
    columns: string,
    page: number = 1,
    pageSize: number = 20,
    filters?: Record<string, any>
  ): Promise<{ data: T[]; total: number; page: number; pageSize: number }> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Get data with pagination
    let dataQuery = this.supabase
      .from(table)
      .select(columns)
      .range(from, to);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        dataQuery = dataQuery.eq(key, value);
      });
    }

    const { data, error: dataError } = await dataQuery;

    if (dataError) {
      throw new Error(`Query error: ${dataError.message}`);
    }

    // Get total count
    let countQuery = this.supabase.from(table).select('*', { count: 'exact', head: true });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        countQuery = countQuery.eq(key, value);
      });
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      throw new Error(`Count error: ${countError.message}`);
    }

    return {
      data: data || [],
      total: count || 0,
      page,
      pageSize,
    };
  }

  /**
   * Batch select (mengurangi N+1 problem)
   */
  async batchSelect<T>(
    table: string,
    columns: string,
    ids: string[],
    idColumn: string = 'id'
  ): Promise<T[]> {
    const { data, error } = await this.supabase
      .from(table)
      .select(columns)
      .in(idColumn, ids);

    if (error) {
      throw new Error(`Batch query error: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Select dengan join (mengurangi N+1 problem)
   */
  async selectWithJoin<T>(
    table: string,
    columns: string,
    joins: string[],
    filters?: Record<string, any>
  ): Promise<T[]> {
    const selectColumns = [...columns.split(', '), ...joins].join(', ');

    let query = this.supabase.from(table).select(selectColumns);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Join query error: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Select dengan caching (mengurangi database hits)
   */
  async selectCached<T>(
    table: string,
    columns: string,
    cacheKey: string,
    ttl: number = 60000 // 1 minute default
  ): Promise<T[]> {
    // Check cache
    const cached = this.getCache<T[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // Query database
    const { data, error } = await this.supabase
      .from(table)
      .select(columns);

    if (error) {
      throw new Error(`Cached query error: ${error.message}`);
    }

    // Set cache
    this.setCache(cacheKey, data || [], ttl);

    return data || [];
  }

  /**
   * Get from cache
   */
  private getCache<T>(key: string): T | null {
    if (typeof window === 'undefined') {
      // Server-side: use in-memory cache
      const cache = (global as any).__queryCache || {};
      const item = cache[key];
      if (item && item.expiry > Date.now()) {
        return item.data;
      }
      return null;
    } else {
      // Client-side: use localStorage
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          if (parsed.expiry > Date.now()) {
            return parsed.data;
          }
        }
      } catch (e) {
        // Ignore localStorage errors
      }
      return null;
    }
  }

  /**
   * Set cache
   */
  private setCache<T>(key: string, data: T, ttl: number): void {
    const expiry = Date.now() + ttl;
    const item = { data, expiry };

    if (typeof window === 'undefined') {
      // Server-side: use in-memory cache
      const cache = (global as any).__queryCache || {};
      cache[key] = item;
      (global as any).__queryCache = cache;
    } else {
      // Client-side: use localStorage
      try {
        localStorage.setItem(key, JSON.stringify(item));
      } catch (e) {
        // Ignore localStorage errors
      }
    }
  }

  /**
   * Clear cache
   */
  clearCache(key?: string): void {
    if (typeof window === 'undefined') {
      // Server-side: clear in-memory cache
      if (key) {
        const cache = (global as any).__queryCache || {};
        delete cache[key];
        (global as any).__queryCache = cache;
      } else {
        (global as any).__queryCache = {};
      }
    } else {
      // Client-side: clear localStorage
      try {
        if (key) {
          localStorage.removeItem(key);
        } else {
          localStorage.clear();
        }
      } catch (e) {
        // Ignore localStorage errors
      }
    }
  }
}

/**
 * Connection Pool Manager
 * 
 * Mengelola koneksi database dengan pooling
 */
export class ConnectionPoolManager {
  private static instance: ConnectionPoolManager;
  private connections: Map<string, any> = new Map();
  private maxConnections: number = 10;
  private connectionTimeout: number = 30000; // 30 seconds

  private constructor() {}

  static getInstance(): ConnectionPoolManager {
    if (!ConnectionPoolManager.instance) {
      ConnectionPoolManager.instance = new ConnectionPoolManager();
    }
    return ConnectionPoolManager.instance;
  }

  /**
   * Get connection from pool
   */
  getConnection(key: string): any {
    let connection = this.connections.get(key);

    if (!connection) {
      // Create new connection
      connection = createClient();
      this.connections.set(key, connection);
    }

    return connection;
  }

  /**
   * Release connection back to pool
   */
  releaseConnection(key: string): void {
    // Keep connection in pool for reuse
    // Connection will be cleaned up when pool is full
  }

  /**
   * Clean up idle connections
   */
  cleanup(): void {
    if (this.connections.size > this.maxConnections) {
      // Remove oldest connections
      const keys = Array.from(this.connections.keys());
      const toRemove = keys.slice(0, keys.length - this.maxConnections);
      toRemove.forEach(key => this.connections.delete(key));
    }
  }
}

/**
 * Index Manager
 * 
 * Mengelola database indexes untuk optimasi query
 */
export class IndexManager {
  private supabase = createClient();

  /**
   * Create index on table
   */
  async createIndex(
    table: string,
    columns: string[],
    indexName?: string
  ): Promise<void> {
    const name = indexName || `idx_${table}_${columns.join('_')}`;

    // Execute SQL to create index
    const { error } = await this.supabase.rpc('create_index', {
      table_name: table,
      column_names: columns,
      index_name: name,
    });

    if (error) {
      throw new Error(`Index creation error: ${error.message}`);
    }
  }

  /**
   * Drop index
   */
  async dropIndex(indexName: string): Promise<void> {
    const { error } = await this.supabase.rpc('drop_index', {
      index_name: indexName,
    });

    if (error) {
      throw new Error(`Index drop error: ${error.message}`);
    }
  }

  /**
   * List indexes on table
   */
  async listIndexes(table: string): Promise<any[]> {
    const { data, error } = await this.supabase.rpc('list_indexes', {
      table_name: table,
    });

    if (error) {
      throw new Error(`Index list error: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Analyze query performance
   */
  async analyzeQuery(query: string): Promise<any> {
    const { data, error } = await this.supabase.rpc('analyze_query', {
      query_text: query,
    });

    if (error) {
      throw new Error(`Query analysis error: ${error.message}`);
    }

    return data;
  }
}

/**
 * Query Cache Manager
 * 
 * Mengelola cache untuk query yang sering digunakan
 */
export class QueryCacheManager {
  private cache: Map<string, { data: any; expiry: number }> = new Map();
  private defaultTTL: number = 60000; // 1 minute

  /**
   * Get from cache
   */
  get(key: string): any | null {
    const item = this.cache.get(key);
    if (item && item.expiry > Date.now()) {
      return item.data;
    }
    return null;
  }

  /**
   * Set cache
   */
  set(key: string, data: any, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { data, expiry });
  }

  /**
   * Clear cache
   */
  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Clean expired cache entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (item.expiry < now) {
        this.cache.delete(key);
      }
    }
  }
}

// Export singleton instances
export const queryOptimizer = new QueryOptimizer();
export const connectionPool = ConnectionPoolManager.getInstance();
export const indexManager = new IndexManager();
export const queryCache = new QueryCacheManager();

// Cleanup expired cache entries every minute
if (typeof window === 'undefined') {
  setInterval(() => {
    queryCache.cleanup();
    connectionPool.cleanup();
  }, 60000);
}
