import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string; billboardId: string };
  }
) {
  try {
    const { userId } = auth();
    const { storeId, billboardId } = params;
    const body = await req.json();
    const { label, imageUrl } = body;
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!storeId) {
      return new NextResponse('store id required', { status: 400 });
    }
    if (!billboardId) {
      return new NextResponse('billboard id required', { status: 400 });
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
      return new NextResponse('billboard not found, or user not authorized', {
        status: 404,
      });
    }
    const updateBillboard = await prismadb.billboard.updateMany({
      where: {
        id: billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });
    console.log(updateBillboard);
    return NextResponse.json(updateBillboard);
  } catch (error: any) {
    console.log('billboard-api-update', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string; billboardId: string };
  }
) {
  try {
    const { userId } = auth();
    const { storeId, billboardId } = params;
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!storeId) {
      return new NextResponse('store id required', { status: 400 });
    }
    if (!billboardId) {
      return new NextResponse('billboard id required', { status: 400 });
    }
    const StoreByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });
    if (!StoreByUserId) {
      return new NextResponse('billboard not found, or user not authorized', {
        status: 404,
      });
    }
    const deleteBillboard = await prismadb.billboard.deleteMany({
      where: {
        id: billboardId,
      },
    });
    console.log(deleteBillboard);
    return NextResponse.json(deleteBillboard);
  } catch (error: any) {
    console.log('billboard-api-delete', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
