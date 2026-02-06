import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';

// Types
type Node = {
    id: string;
    type: string;
    data: any;
};

type Edge = {
    id: string;
    source: string;
    target: string;
};

type Workflow = {
    id: string;
    nodes: Node[];
    edges: Edge[];
};

type ExecutionContext = {
    workflowId: string;
    executionId: string;
    variables: Record<string, any>;
    logs: string[];
};

export class WorkflowEngine {
    private supabase;
    private groq;

    constructor() {
        this.supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
        this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }

    async executeWorkflow(workflowId: string, initialPayload: any) {
        // 1. Fetch Workflow Definition
        const { data: workflow, error } = await this.supabase
            .from('workflows')
            .select('*')
            .eq('id', workflowId)
            .single();

        if (error || !workflow) throw new Error(`Workflow not found: ${error?.message}`);

        // 2. Create Execution Record
        const { data: execution } = await this.supabase
            .from('workflow_executions')
            .insert({
                workflow_id: workflowId,
                status: 'running',
                input_payload: initialPayload,
                logs: []
            })
            .select()
            .single();

        const context: ExecutionContext = {
            workflowId,
            executionId: execution.id,
            variables: { ...initialPayload },
            logs: []
        };

        try {
            // 3. Execution Graph Traversal (Simple Sequential for MVP)
            // Find start node (trigger)
            const nodes: Node[] = workflow.nodes;
            const edges: Edge[] = workflow.edges;

            let currentNode = nodes.find(n => n.type === 'trigger' || n.data.label.includes('Trigger')); // Heuristic fallback
            if (!currentNode) currentNode = nodes[0]; // Fallback to first

            while (currentNode) {
                this.log(context, `Executing Node: ${currentNode.data.label} (${currentNode.type})`);

                // Execute Node Logic
                await this.executeNode(currentNode, context);

                // Find next node
                const edge = edges.find(e => e.source === currentNode?.id);
                if (edge) {
                    currentNode = nodes.find(n => n.id === edge.target);
                } else {
                    currentNode = undefined; // End of flow
                }
            }

            // 4. Update Execution Status: Success
            await this.updateExecutionStatus(context.executionId, 'completed', context.variables);

        } catch (err: any) {
            console.error('Workflow Execution Failed:', err);
            this.log(context, `ERROR: ${err.message}`);
            await this.updateExecutionStatus(context.executionId, 'failed', undefined, context.logs);
        }
    }

    private async executeNode(node: Node, context: ExecutionContext) {
        switch (node.type) {
            case 'ai-action':
            case 'ai_processor': // Handle variations
                await this.runAINode(node, context);
                break;
            case 'code':
                await this.runCodeNode(node, context);
                break;
            case 'trigger':
                // Pass-through
                break;
            default:
                // If label suggests AI (from our visual editor stub)
                if (node.data.label?.includes('AI')) {
                    await this.runAINode(node, context);
                } else {
                    this.log(context, `Skipping unknown node type: ${node.type}`);
                }
        }
    }

    private async runAINode(node: Node, context: ExecutionContext) {
        const prompt = `
            Analyze this content: ${JSON.stringify(context.variables)}
            
            Task: Summarize and extract key concepts.
            Return JSON.
        `;

        const completion = await this.groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama3-8b-8192',
            response_format: { type: 'json_object' }
        });

        const result = JSON.parse(completion.choices[0].message.content || '{}');
        context.variables['ai_output'] = result;
        this.log(context, 'AI Processing Complete');
    }

    private async runCodeNode(node: Node, context: ExecutionContext) {
        // SANDBOX WARNING: This is a basic implementation. 
        // In production, use vm2 or separate isolate for security.
        const code = node.data.code || 'return input;';
        try {
            const func = new Function('input', 'context', code);
            const result = func(context.variables, context);
            context.variables['code_output'] = result;
            this.log(context, 'Code Execution Complete');
        } catch (e: any) {
            this.log(context, `Code Error: ${e.message}`);
            throw e;
        }
    }

    private log(context: ExecutionContext, message: string) {
        const timestamped = `[${new Date().toISOString()}] ${message}`;
        console.log(timestamped);
        context.logs.push(timestamped);
    }

    private async updateExecutionStatus(id: string, status: 'completed' | 'failed', output?: any, logs?: string[]) {
        await this.supabase
            .from('workflow_executions')
            .update({
                status,
                completed_at: new Date().toISOString(),
                output_result: output,
                logs: logs // On failure save logs immediately
            })
            .eq('id', id);
    }
}
