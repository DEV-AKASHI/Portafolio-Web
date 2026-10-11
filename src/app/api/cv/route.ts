import { NextRequest, NextResponse } from 'next/server';
import { insforge } from '@/lib/insforge';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') === 'en' ? 'en' : 'es';
    const isDownload = searchParams.get('download') === '1';

    // Obtener URLs del perfil
    const { data } = await insforge.database
      .from('profile_settings')
      .select('cv_url_es, cv_url_en')
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .single();

    let targetUrl = lang === 'en'
      ? (data?.cv_url_en || data?.cv_url_es)
      : (data?.cv_url_es || data?.cv_url_en);

    // Fallback URL directa a InsForge si no hay en profile_settings
    if (!targetUrl) {
      targetUrl = `https://g4daaqsu.us-west.insforge.app/api/storage/buckets/portfolio-assets/objects/cv/CV_Jhonatan_Jimenez_${lang}.pdf`;
    }

    // Limpiar posibles query params duplicados mal formados
    if (targetUrl.includes('?v=')) {
      const parts = targetUrl.split('?v=');
      targetUrl = parts[0] + (parts[1] ? `?v=${parts[1].split('?')[0]}` : '');
    }

    const res = await fetch(targetUrl, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/pdf,application/octet-stream,*/*',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'CV no encontrado' }, { status: 404 });
    }

    const pdfBuffer = await res.arrayBuffer();
    const filename = `CV_Jhonatan_Jimenez_${lang.toUpperCase()}.pdf`;
    const disposition = isDownload ? `attachment; filename="${filename}"` : `inline; filename="${filename}"`;

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': disposition,
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'Accept-Ranges': 'bytes',
        'Content-Length': pdfBuffer.byteLength.toString(),
      },
    });
  } catch (error: any) {
    console.error('Error serving CV:', error);
    return NextResponse.json({ error: 'Error interno al cargar el CV' }, { status: 500 });
  }
}
