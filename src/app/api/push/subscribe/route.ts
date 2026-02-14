
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const subscription = await req.json();

        if (!subscription || !subscription.endpoint) {
            return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
        }

        const supabase = await createClient(); // Await strictly needed? Check later but usually okay.
        // Actually createClient in server is usually synchronous in some versions or async in others.
        // But let's check lib first. Assuming standard createClient.

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Extract keys
        const { keys } = subscription;
        const p256dh = keys?.p256dh;
        const auth = keys?.auth;

        if (!p256dh || !auth) {
            return NextResponse.json({ error: 'Missing keys' }, { status: 400 });
        }

        const { error } = await supabase
            .from('push_subscriptions')
            .upsert({
                user_id: user.id,
                endpoint: subscription.endpoint,
                p256dh,
                auth,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id, endpoint' });

        if (error) {
            console.error('Error saving subscription:', error);
            return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in subscribe route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
