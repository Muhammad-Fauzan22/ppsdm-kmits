/**
 * Natural Language Command API Route
 * POST /api/automation/command
 * Processes natural language commands and executes actions
 */

import { NextRequest, NextResponse } from 'next/server';
import { naturalLanguageProcessor, Command, CommandResult } from '@/lib/automation/natural-language-processor';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface CommandRequest {
  command: string;
  context?: {
    spreadsheetId?: string;
    sheetName?: string;
    userId?: string;
  };
}

interface CommandResponse {
  success: boolean;
  parsedCommand?: Command;
  result?: CommandResult;
  error?: string;
  executionTime: number;
}

export async function POST(request: NextRequest): Promise<NextResponse<CommandResponse>> {
  const startTime = Date.now();

  try {
    const body: CommandRequest = await request.json();

    if (!body.command) {
      return NextResponse.json({
        success: false,
        error: 'command is required',
        executionTime: Date.now() - startTime,
      }, { status: 400 });
    }

    // Parse the natural language command
    const parsedCommand = await naturalLanguageProcessor.parseCommand(body.command);

    // Execute the command
    const result = await naturalLanguageProcessor.executeCommand(parsedCommand, body.context);

    return NextResponse.json({
      success: true,
      parsedCommand,
      result,
      executionTime: Date.now() - startTime,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      executionTime: Date.now() - startTime,
    }, { status: 500 });
  }
}

/**
 * GET /api/automation/command
 * Get available commands and examples
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');

    if (action === 'examples') {
      return NextResponse.json({
        success: true,
        data: {
          examples: naturalLanguageProcessor.getCommandExamples(),
        },
        executionTime: Date.now() - startTime,
      });
    }

    if (action === 'available') {
      return NextResponse.json({
        success: true,
        data: {
          availableCommands: naturalLanguageProcessor.getAvailableCommands(),
        },
        executionTime: Date.now() - startTime,
      });
    }

    // Return all information
    return NextResponse.json({
      success: true,
      data: {
        availableCommands: naturalLanguageProcessor.getAvailableCommands(),
        examples: naturalLanguageProcessor.getCommandExamples(),
        usage: 'Send a POST request with a natural language command starting with @ai',
      },
      executionTime: Date.now() - startTime,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      executionTime: Date.now() - startTime,
    }, { status: 500 });
  }
}
