import { useParams, useNavigate } from 'react-router';
import { Calendar, ArrowRight, ChevronRight } from 'lucide-react';
import { getArticleById } from '../data';

const relatedArticles = [
  { id: 5, title: 'SOAT: Todo lo que Necesitas Saber', excerpt: 'Cómo el SOAT protege tu vehículo y a los ocupantes en caso de accidente.', image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', category: 'Seguros', date: '22 Abril 2026', readTime: '6 min' },
  { id: 9, title: 'Prevención en el Hogar', excerpt: 'Optimiza la seguridad de tu hogar con estos consejos prácticos y efectivos.', image: 'https://images.unsplash.com/39/lIZrwvbeRuuzqOoWJUEn_Photoaday_CSD%20%281%20of%201%29-5.jpg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', category: 'Prevención', date: '10 Abril 2026', readTime: '7 min' },
  { id: 6, title: 'ARL: Protección Laboral Integral', excerpt: 'Mejores prácticas para garantizar la cobertura de riesgos laborales en tu empresa.', image: 'https://images.unsplash.com/photo-1573164713712-03790a178651?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', category: 'ARL', date: '18 Abril 2026', readTime: '8 min' },
];

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const article = getArticleById(Number(id));

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Artículo no encontrado.</p>
          <button onClick={() => navigate('/')} className="bg-[#00008F] text-white px-6 py-2 rounded font-semibold">Volver al Blog</button>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    try {
      if (navigator.share) await navigator.share({ title: article.title, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); alert('Enlace copiado al portapapeles'); }
    } catch (_) {}
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex items-center h-[52px] gap-8">
            <img src="https://image.marketing.axacolpatria.co/lib/fe2911747364047e721277/m/1/414c8f47-08cb-4aca-80c0-c4ef42d1e91d.jpg" alt="AXA Colpatria" className="h-8 flex-shrink-0 cursor-pointer" onClick={() => navigate('/')} />
            <nav className="flex items-center justify-center gap-7 flex-1">
              {['INICIO', 'Salud y Bienestar', 'Estilo de vida', 'Empresas', 'Actualidad'].map(item => (
                <a key={item} href="#" className="text-sm font-bold text-[#00008F] hover:text-[#4976BA] whitespace-nowrap transition-colors">{item}</a>
              ))}
            </nav>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button className="bg-[#00008F] hover:bg-[#0000b3] text-white text-sm font-semibold px-4 py-2 transition-colors whitespace-nowrap">Cotiza tu seguro aquí</button>
              <button className="border border-[#00008F] text-[#00008F] hover:bg-[#00008F] hover:text-white text-sm font-semibold px-4 py-2 transition-colors whitespace-nowrap">Contáctanos</button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-4 py-2">
          <nav className="flex items-center gap-1.5" style={{ fontFamily: "'Source Sans Pro', sans-serif", fontSize: '13px', fontWeight: 600 }}>
            <button onClick={() => navigate('/')} className="text-[#00008F] hover:underline">Inicio</button>
            <ChevronRight size={13} className="text-gray-400 flex-shrink-0" />
            <button onClick={() => navigate(`/categoria/${encodeURIComponent(article.category)}`)} className="text-[#00008F] hover:underline">{article.category}</button>
            <ChevronRight size={13} className="text-gray-400 flex-shrink-0" />
            <span className="text-gray-500 truncate max-w-xs md:max-w-sm">{article.title}</span>
          </nav>
        </div>
      </div>

      {/* Imagen hero — menos alta en mobile */}
      <section className="relative h-[220px] sm:h-[380px] md:h-[480px] overflow-hidden">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
      </section>

      <div className="relative px-3 sm:px-4 z-40 mb-12 -mt-0 sm:-mt-24">
        <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 sm:p-10 md:p-12 shadow-lg">
          <h1 className="text-[#00008F] leading-tight mb-4 text-center" style={{ fontFamily: "'Publico Headline Web', serif", fontWeight: 700, fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)' }}>{article.title}</h1>
          <div className="flex items-center justify-center gap-3 text-xs text-gray-600 mb-8 pb-8 border-b border-gray-200">
            <span className="font-semibold text-[#00008F]">{article.category}</span>
            <span>|</span><span>Artículo</span><span>|</span><span>{article.date}</span><span>|</span><span>{article.readTime}</span>
          </div>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4" style={{ fontFamily: "'Publico Headline Web', serif" }}>H2 Lorem ipsum</h2>
            <p className="text-gray-700 leading-relaxed mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4" style={{ fontFamily: "'Publico Headline Web', serif" }}>H3 Lorem ipsum</h3>
            <p className="text-gray-700 leading-relaxed mb-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>
            <div className="my-10 rounded-xl overflow-hidden">
              <iframe width="100%" height="500" src="https://www.youtube.com/embed/fzSyiC2DWgc?rel=0" title="YouTube video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full rounded-xl" />
            </div>
          </div>

          {/* Compartir en redes */}
          <div className="mt-10 pt-8 border-t border-gray-100">
            <p className="text-sm font-bold text-gray-700 mb-4 text-center uppercase tracking-wide" style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>Comparte este contenido en tus redes</p>
            <div className="flex items-center justify-center gap-3">
              {/* WhatsApp */}
              <a href={`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + window.location.href)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-80" style={{ backgroundColor: '#25D366' }} aria-label="Compartir en WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.526 5.854L0 24l6.335-1.525C8.07 23.445 10.01 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.637-.51-5.147-1.395l-.367-.218-3.762.906.953-3.655-.239-.38A9.933 9.933 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
              </a>
              {/* Facebook */}
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-80" style={{ backgroundColor: '#1877F2' }} aria-label="Compartir en Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.03 4.388 11.03 10.125 11.927v-8.43H7.078v-3.497h3.047V9.43c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.247h3.328l-.532 3.497H13.875v8.43C19.612 23.103 24 18.103 24 12.073z"/></svg>
              </a>
              {/* LinkedIn */}
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-80" style={{ backgroundColor: '#0A66C2' }} aria-label="Compartir en LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              {/* X (Twitter) */}
              <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-80 bg-black" aria-label="Compartir en X">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.845L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
              </a>
              {/* Copiar enlace */}
              <button onClick={handleShare} className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-gray-300 text-gray-500 hover:border-[#00008F] hover:text-[#00008F] transition-colors" aria-label="Copiar enlace">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="py-14 bg-white">
        <div className="max-w-full px-3 sm:px-6">
          <h2 className="text-2xl font-bold text-[#00008F] mb-8 max-w-6xl mx-auto" style={{ fontFamily: "'Publico Headline Web', serif" }}>También te puede interesar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {relatedArticles.map(post => (
              <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group" onClick={() => navigate(`/articulo/${post.id}`)}>
                <div className="relative h-52 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <p className="text-xs text-gray-400 mb-2 flex items-center gap-1"><Calendar size={12} /> {post.date}</p>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#00008F] transition-colors leading-snug" style={{ fontFamily: "'Publico Headline Web', serif" }}>{post.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{post.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-[#00008F] text-sm font-semibold group-hover:gap-2 transition-all">Leer más <ArrowRight size={15} /></span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="flex justify-center py-12 bg-white">
        <button onClick={() => navigate('/')} className="bg-[#00008F] hover:bg-[#0000b3] text-white font-bold py-3 px-8 rounded transition-colors">Todos los artículos</button>
      </div>

      <section className="relative overflow-hidden bg-white py-8">
        <div className="w-full px-3 sm:px-6">
          <img src="https://res.cloudinary.com/ddqbnr9vo/image/upload/v1782843370/banner-autorizaciones-medicas_jfvfxn.jpg" alt="Autorizaciones médicas" className="w-full h-auto object-contain rounded-lg" />
        </div>
      </section>

      <footer>
        <img src="https://res.cloudinary.com/ddqbnr9vo/image/upload/v1782842464/footer_AXA_f1azqa.jpg" alt="Footer AXA Colpatria" className="w-full h-auto" />
      </footer>
    </div>
  );
}
