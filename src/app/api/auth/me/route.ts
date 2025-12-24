import {NextResponse} from 'next/server';

import {getSupabaseUser} from '@/server/auth';
import {getCredits} from '@/server/credits';
import {getUserId} from '@/server/user';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const user = await getSupabaseUser();
  if (!user) {
    return NextResponse.json({user: null});
  }

  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({user: null});
  }

  const credits = await getCredits(userId);

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.user_metadata?.name || 'Guest',
      avatarUrl: user.user_metadata?.avatar_url || null
    },
    credits
  });
}
