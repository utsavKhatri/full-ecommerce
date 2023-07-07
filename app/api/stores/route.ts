import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

/**
 * Handle POST request.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} Promise that resolves to void.
 */
export async function POST(req: Request, res: Response) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const body = await req.json();

    const { name } = body;

    const createStore = await prismadb.store.create({
      data: {
        userId,
        name,
      },
    });
    console.log(createStore);

    return NextResponse.json(createStore);
  } catch (error) {
    console.log('store-api', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
