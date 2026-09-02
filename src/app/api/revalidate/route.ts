import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const slug = body.slug as string | undefined;
    const categories = Array.isArray(body.categories)
      ? (body.categories as string[]).filter(
          (value): value is string => typeof value === "string" && value.length > 0
        )
      : [];

    // Expire WordPress fetch cache immediately (not SWR "max") so new posts show on next request.
    revalidateTag("wordpress", { expire: 0 });

    revalidatePath("/", "layout");
    revalidatePath("/blog");
    revalidatePath("/sitemap-index.xml");
    revalidatePath("/sitemap.xml");
    revalidatePath("/image-sitemap.xml");

    if (slug) {
      revalidatePath(`/${slug}`);
    }

    for (const categorySlug of categories) {
      revalidatePath(`/category/${categorySlug}`);
    }

    // Always refresh known guide category archives.
    revalidatePath("/category/teen-patti-games");
    revalidatePath("/category/new-earning-games");

    return NextResponse.json({
      revalidated: true,
      slug: slug ?? "all",
      categories,
    });
  } catch {
    return NextResponse.json({ message: "Revalidation failed" }, { status: 500 });
  }
}
