import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

/**
 * PATCH function to update a store's name.
 *
 * @param {Request} req - The request object.
 * @param {Object} params - The parameters object.
 * @param {string} params.storeId - The ID of the store.
 * @return {Promise<NextResponse>} A Promise that resolves to the updated store.
 */
export async function PATCH(
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
    const body = await req.json();

    const { name } = body;
    const { storeId } = params;
    if (!storeId) {
      return new NextResponse('store id required', { status: 400 });
    }
    if (!name) {
      return new NextResponse('name required', { status: 400 });
    }
    const updatedStore = await prismadb.store.updateMany({
      where: {
        id: storeId,
        userId,
      },
      data: {
        name,
      },
    });
    console.log(updatedStore);
    return NextResponse.json(updatedStore);
  } catch (error) {
    console.log('store-api-patch', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

/**
 * Deletes a store based on the given storeId and userId.
 *
 * @param {Request} req - the HTTP request object
 * @param {{ params: { storeId: string } }} - an object containing the storeId parameter
 * @return {Promise<NextResponse>} - a Promise that resolves to a NextResponse object
 */
export async function DELETE(
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

    const deletedStore = await prismadb.store.deleteMany({
      where: {
        id: storeId,
        userId,
      },
    })
    console.log(deletedStore);
    return NextResponse.json(deletedStore);
  } catch (error) {
    console.log('store-api-delete', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
