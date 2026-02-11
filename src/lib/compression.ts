import { NextRequest, NextResponse } from 'next/server';
import zlib from 'zlib';

// Compression configuration
const COMPRESSION_CONFIG = {
  // Minimum response size to compress (in bytes)
  minSize: 1024,

  // Compression level (1-9, higher = better compression but slower)
  level: 6,

  // Supported compression algorithms
  algorithms: {
    gzip: 'gzip',
    deflate: 'deflate',
    br: 'br', // Brotli
  },

  // MIME types to compress
  compressibleTypes: [
    'text/plain',
    'text/html',
    'text/css',
    'text/javascript',
    'application/javascript',
    'application/json',
    'application/xml',
    'application/rss+xml',
    'application/atom+xml',
    'image/svg+xml',
    'font/woff',
    'font/woff2',
  ],
};

// Check if response should be compressed
function shouldCompress(response: Response, contentType: string): boolean {
  // Don't compress if already compressed
  if (response.headers.get('content-encoding')) {
    return false;
  }

  // Check content type
  const isCompressible = COMPRESSION_CONFIG.compressibleTypes.some(type =>
    contentType.includes(type)
  );

  if (!isCompressible) {
    return false;
  }

  // Check content length
  const contentLength = response.headers.get('content-length');
  if (contentLength && parseInt(contentLength) < COMPRESSION_CONFIG.minSize) {
    return false;
  }

  return true;
}

// Get client's accepted encodings
function getAcceptedEncodings(request: NextRequest): string[] {
  const acceptEncoding = request.headers.get('accept-encoding') || '';
  return acceptEncoding.split(',').map(enc => enc.trim().toLowerCase());
}

// Choose best compression algorithm
function chooseCompressionAlgorithm(acceptedEncodings: string[]): string | null {
  // Prefer Brotli if supported
  if (acceptedEncodings.includes('br')) {
    return COMPRESSION_CONFIG.algorithms.br;
  }

  // Then gzip
  if (acceptedEncodings.includes('gzip')) {
    return COMPRESSION_CONFIG.algorithms.gzip;
  }

  // Then deflate
  if (acceptedEncodings.includes('deflate')) {
    return COMPRESSION_CONFIG.algorithms.deflate;
  }

  return null;
}

// Compress response data
async function compressData(data: string | Buffer, algorithm: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    let compressor;

    switch (algorithm) {
      case 'gzip':
        compressor = zlib.createGzip({ level: COMPRESSION_CONFIG.level });
        break;
      case 'deflate':
        compressor = zlib.createDeflate({ level: COMPRESSION_CONFIG.level });
        break;
      case 'br':
        compressor = zlib.createBrotliCompress({
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: COMPRESSION_CONFIG.level,
          },
        });
        break;
      default:
        reject(new Error(`Unsupported compression algorithm: ${algorithm}`));
        return;
    }

    const chunks: Buffer[] = [];

    compressor.on('data', (chunk) => chunks.push(chunk));
    compressor.on('end', () => resolve(Buffer.concat(chunks)));
    compressor.on('error', reject);

    compressor.write(data);
    compressor.end();
  });
}

// Compression middleware for API routes
export async function withCompression(
  handler: Function,
  request: NextRequest
) {
  const response = await handler(request);

  // Only compress successful responses
  if (response.status !== 200) {
    return response;
  }

  const contentType = response.headers.get('content-type') || '';

  if (!shouldCompress(response, contentType)) {
    return response;
  }

  const acceptedEncodings = getAcceptedEncodings(request);
  const algorithm = chooseCompressionAlgorithm(acceptedEncodings);

  if (!algorithm) {
    return response;
  }

  try {
    // Get response data
    const data = await response.text();

    // Skip compression for small responses
    if (data.length < COMPRESSION_CONFIG.minSize) {
      return response;
    }

    // Compress the data
    const compressedData = await compressData(data, algorithm);

    // Create new response with compressed data
    const compressedResponse = new NextResponse(compressedData.buffer as ArrayBuffer, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        'content-encoding': algorithm,
        'content-length': compressedData.length.toString(),
        'vary': 'accept-encoding',
      },
    });

    return compressedResponse;

  } catch (error) {
    // Return original response if compression fails
    return response;
  }
}

// Utility function to create compressed JSON response
export function createCompressedJsonResponse(
  data: any,
  options: { status?: number; headers?: Record<string, string> } = {}
): NextResponse {
  const jsonString = JSON.stringify(data);

  const response = NextResponse.json(data, {
    status: options.status || 200,
    headers: options.headers,
  });

  // Add compression headers (actual compression will be handled by Next.js or CDN)
  response.headers.set('content-encoding', 'gzip');
  response.headers.set('vary', 'accept-encoding');

  return response;
}

// Compression statistics and monitoring
export const compressionStats = {
  requestsCompressed: 0,
  bytesSaved: 0,
  compressionRatio: 0,

  recordCompression(originalSize: number, compressedSize: number) {
    this.requestsCompressed++;
    this.bytesSaved += (originalSize - compressedSize);
    this.compressionRatio = this.bytesSaved / (this.bytesSaved + compressedSize);
  },

  getStats() {
    return {
      requestsCompressed: this.requestsCompressed,
      bytesSaved: this.bytesSaved,
      compressionRatio: Math.round(this.compressionRatio * 100) / 100,
    };
  },

  reset() {
    this.requestsCompressed = 0;
    this.bytesSaved = 0;
    this.compressionRatio = 0;
  },
};

// Performance monitoring for compression
export function logCompressionPerformance(
  originalSize: number,
  compressedSize: number,
  algorithm: string,
  duration: number
) {
  const ratio = ((originalSize - compressedSize) / originalSize) * 100;

  console.log(`Compression: ${algorithm} | Ratio: ${ratio.toFixed(2)}% | Time: ${duration}ms`);

  compressionStats.recordCompression(originalSize, compressedSize);
}

// Next.js configuration for compression
export const nextCompressionConfig = {
  compress: true,
  poweredByHeader: false,

  // Custom webpack configuration for additional compression
  webpack: (config: any, { dev }: any) => {
    if (!dev) {
      // Add compression plugins for static assets
      const CompressionPlugin = require('compression-webpack-plugin');

      config.plugins.push(
        new CompressionPlugin({
          algorithm: 'gzip',
          test: /\.(js|css|html|svg)$/,
          threshold: 1024,
          minRatio: 0.8,
        })
      );

      // Add Brotli compression if available
      try {
        const BrotliPlugin = require('brotli-webpack-plugin');
        config.plugins.push(
          new BrotliPlugin({
            asset: '[path].br[query]',
            test: /\.(js|css|html|svg)$/,
            threshold: 1024,
            minRatio: 0.8,
          })
        );
      } catch (error) {
        // Brotli plugin not available, skip
      }
    }

    return config;
  },
};

// CDN compression headers for static assets
export const cdnCompressionHeaders = {
  // Enable gzip and brotli compression on CDN
  'Accept-Encoding': 'gzip, deflate, br',

  // Cache compressed versions separately
  'Vary': 'Accept-Encoding',

  // Compression hints for CDN
  'Content-Encoding': 'gzip', // Will be overridden by CDN if brotli is used
};

// Utility to check if client supports compression
export function clientSupportsCompression(request: NextRequest): boolean {
  const acceptEncoding = request.headers.get('accept-encoding') || '';
  return acceptEncoding.includes('gzip') || acceptEncoding.includes('deflate') || acceptEncoding.includes('br');
}

// Pre-compress static assets (for build time)
export async function precompressAssets(assetPaths: string[]): Promise<void> {
  const fs = require('fs').promises;
  const path = require('path');

  for (const assetPath of assetPaths) {
    try {
      const content = await fs.readFile(assetPath);

      // Gzip compression
      const gzipCompressed = await compressData(content, 'gzip');
      await fs.writeFile(`${assetPath}.gz`, gzipCompressed);

      // Brotli compression (if available)
      try {
        const brotliCompressed = await compressData(content, 'br');
        await fs.writeFile(`${assetPath}.br`, brotliCompressed);
      } catch (error) {
        // Brotli not available, skip
      }

      console.log(`Pre-compressed: ${assetPath}`);
    } catch (error) {
      console.error(`Failed to compress: ${assetPath}`, error);
    }
  }
}
