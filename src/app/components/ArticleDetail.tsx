import { useParams, useNavigate } from 'react-router';
import { Calendar, ArrowRight, ChevronRight, Share2, Menu } from 'lucide-react';
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
          <button onClick={() => navigate('/')} className="bg-[#00008F] text-white px-6 py-2 rounded-full font-semibold">Volver al Blog</button>
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
            <nav className="hidden md:flex items-center justify-center gap-7 flex-1">
              {['INICIO', 'Salud y Bienestar', 'Estilo de vida', 'Empresas', 'Actualidad'].map(item => (
                <a key={item} href="#" className="text-sm font-bold text-[#00008F] hover:text-[#4976BA] whitespace-nowrap transition-colors">{item}</a>
              ))}
            </nav>
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              <button className="bg-[#00008F] hover:bg-[#0000F7] text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors whitespace-nowrap">Cotiza tu seguro aquí</button>
              <button className="border border-[#00008F] text-[#00008F] hover:bg-[#00008F] hover:text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors whitespace-nowrap">Contáctanos</button>
            </div>
            <div className="flex md:hidden items-center ml-auto">
              <button className="w-11 h-11 flex items-center justify-center text-[#00008F]" aria-label="Menú"><Menu size={24} /></button>
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
      <section className="relative h-[310px] sm:h-[380px] md:h-[480px] overflow-hidden">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
      </section>

      <div className="relative -mt-10 sm:-mt-24 px-3 sm:px-4 z-40 mb-4">
        <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 md:p-12 relative">
          <button onClick={handleShare} className="absolute top-0 right-0 p-3 bg-[#4976BA] hover:bg-[#3a5a8a] transition-colors shadow-lg" title="Compartir artículo">
            <Share2 size={20} className="text-white" />
          </button>
          <h1 className="text-[#00008F] leading-tight mb-4 pr-12 text-center" style={{ fontFamily: "'Publico Headline Web', serif", fontWeight: 700, fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>{article.title}</h1>
          <div className="flex items-center justify-center gap-3 text-xs text-gray-600 mb-8 pb-8 border-b border-gray-200">
            <span className="font-semibold text-[#00008F]">{article.category}</span>
            <span>|</span><span>Artículo</span><span>|</span><span>{article.date}</span><span>|</span><span>{article.readTime}</span>
          </div>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.</p>
            <h3 className="font-bold text-gray-900 mt-8 mb-4" style={{ fontFamily: "'Publico Headline Web', serif", fontSize: '1.5rem' }}>H3 Lorem ipsum</h3>
            <p className="text-gray-700 leading-relaxed mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>
            <h4 className="font-bold text-gray-900 mt-6 mb-3" style={{ fontFamily: "'Publico Headline Web', serif", fontSize: '1.25rem' }}>H4 Lorem ipsum</h4>
            <p className="text-gray-700 leading-relaxed mb-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>
            {/* Video 16:9 responsive */}
            <div className="my-6 rounded-xl overflow-hidden" style={{ position: 'relative', paddingTop: '56.25%' }}>
              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                src="https://www.youtube.com/embed/fzSyiC2DWgc?rel=0"
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

        </div>
      </div>

      <section className="py-8 bg-white">
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
        <button onClick={() => navigate('/')} className="bg-[#00008F] hover:bg-[#0000F7] text-white font-bold py-3 px-8 rounded-full transition-colors">Todos los artículos</button>
      </div>

      <section className="bg-white py-8">
        <div className="max-w-6xl mx-auto px-3 sm:px-6">
          <img src="https://res.cloudinary.com/ddqbnr9vo/image/upload/v1782843370/banner-autorizaciones-medicas_jfvfxn.jpg" alt="Autorizaciones médicas" className="w-full h-auto rounded-2xl shadow-md" />
        </div>
      </section>

      <footer className="bg-[#4976BA] py-10 px-6 text-center">
        <p className="text-white/80 text-sm">© {new Date().getFullYear()} AXA Colpatria. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
