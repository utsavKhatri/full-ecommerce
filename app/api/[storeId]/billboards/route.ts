import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

/**
 * POST function description.
 *
 * @param {Request} req - HTTP request object.
 * @param {Object} params - Object containing parameters.
 * @param {string} params.storeId - The store ID.
 * @return {Promise} The response promise.
 */
export async function POST(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string };
  }
): Promise<any> {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const body = await req.json();

    const { label, imageUrl } = body;
    const { storeId } = params;
    if (!storeId) {
      return new NextResponse('store id required', { status: 400 });
    }
    if (!label || !imageUrl) {
      return new NextResponse('label and imageUrl required', { status: 400 });
    }

    const StoreByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });
    if (!StoreByUserId) {
      return new NextResponse('store not found, or user not authorized', {
        status: 404,
      });
    }

    const createBillboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId,
      },
    });
    console.log(createBillboard);

    return NextResponse.json(createBillboard);
  } catch (error) {
    console.log('\x1b[36m', 'billboard-api-POST', error, '\x1b[0m');
    return new NextResponse('Internal error', { status: 500 });
  }
}

/**
 * Retrieves billboards for a specific store.
 *
 * @param {Request} req - the incoming request object
 * @param {Object} params - an object containing the store ID
 * @param {string} params.storeId - the ID of the store
 * @return {Promise<NextResponse>} a promise that resolves to a NextResponse object
 */
export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string };
  }
): Promise<NextResponse> {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const { storeId } = params;
    if (!storeId) {
      return new NextResponse('store id required', { status: 400 });
    }

    const Billboards = await prismadb.billboard.findMany({
      where: {
        storeId
      },
    });
    console.log(Billboards);

    return NextResponse.json(Billboards);
  } catch (error) {
    console.log('billboard-api-get', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
