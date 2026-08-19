import { ChevronRight, ChevronLeft, Calendar, Clock, Menu } from 'lucide-react';
import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { allArticles } from '../data';

const videoItems = [
  { id: 1, title: 'Prevención de Riesgos Laborales', thumbnail: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', category: 'ARL' },
  { id: 2, title: 'Beneficios del Seguro de Salud', thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', category: 'Seguros' },
  { id: 3, title: 'Ejercicios de Bienestar en el Trabajo', thumbnail: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', category: 'Bienestar' },
];

const moreCategories = [
  { id: 1, title: 'Movilidad segura', image: 'https://images.unsplash.com/photo-1549227082-0ea18ce30397?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700', cat: 'Movilidad' },
  { id: 2, title: 'Prevención', image: 'https://images.unsplash.com/photo-1573164574572-cb89e39749b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700', cat: 'Prevención' },
  { id: 3, title: 'Salud y Bienestar', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700', cat: 'Salud' },
  { id: 4, title: 'Seguros de vida', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700', cat: 'Seguros' },
  { id: 5, title: 'ARL Empresas', image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700', cat: 'ARL' },
  { id: 6, title: 'Bienestar laboral', image: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700', cat: 'Bienestar' },
];

export default function CategoryPage() {
  const { nombre } = useParams<{ nombre: string }>();
  const navigate = useNavigate();
  const category = decodeURIComponent(nombre ?? '');
  const [displayedCount, setDisplayedCount] = useState(6);
  const [sliderIndex, setSliderIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const mobileSliderRef = useRef<HTMLDivElement>(null);
  const [dotCat, setDotCat] = useState(0);
  const onScrollCat = () => {
    const el = mobileSliderRef.current; if (!el) return;
    setDotCat(Math.min(moreCategories.length - 1, Math.round(el.scrollLeft / (el.scrollWidth / moreCategories.length))));
  };
  const VISIBLE = 3;
  const maxIndex = moreCategories.length - VISIBLE;

  const slide = (dir: 1 | -1) => {
    setSliderIndex(prev => Math.max(0, Math.min(maxIndex, prev + dir)));
  };
  const filtered = allArticles.filter(a => a.category === category);
  const visible = filtered.slice(0, displayedCount);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>
      {/* Header */}
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
            <span className="text-gray-500">{category}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative h-[480px] overflow-hidden flex items-end justify-center pb-16" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1606857521015-7f9fcf423740?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200)', backgroundSize: 'cover', backgroundPosition: 'center center' }}>
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative z-10 text-center max-w-3xl px-4">
          <h1 className="text-white mb-6 text-[2.2rem] md:text-[4rem] leading-tight" style={{ fontFamily: "'Publico Headline Web', serif", fontWeight: 700 }}>{category}</h1>
        </div>
      </section>

      {/* Subtítulo */}
      <section className="bg-white py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-gray-900 text-2xl md:text-3xl mb-4" style={{ fontFamily: "'Publico Headline Web', serif", fontWeight: 500 }}>Todo lo que necesitas saber sobre {category.toLowerCase()}</h2>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">Descubre contenido especializado y consejos prácticos para ti</p>
        </div>
      </section>

      {/* Artículos */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="mb-12 text-[1.75rem] md:text-[2.5rem] leading-tight font-bold text-[#00008F]" style={{ fontFamily: "'Publico Headline Web', serif" }}>Contenido para acompañarte</h2>
          {filtered.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No hay artículos disponibles para esta categoría aún.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {visible.map(article => (
                  <article key={article.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer group" onClick={() => navigate(`/articulo/${article.id}`)}>
                    <div className="relative w-full h-44 overflow-hidden">
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 right-3">
                        <span className="inline-block text-white text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: '#7698CB' }}>{article.category}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-[17px] leading-snug mb-2 line-clamp-2 text-gray-900" style={{ fontFamily: "'Publico Headline Web', serif", fontWeight: 700 }}>{article.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{article.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                        <span className="flex items-center gap-1"><Calendar size={12} />{article.date}</span>
                        <span className="flex items-center gap-1"><Clock size={12} />{article.readTime}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#00008F] hover:gap-2 transition-all">Leer más <ChevronRight size={14} /></span>
                    </div>
                  </article>
                ))}
              </div>
              {displayedCount < filtered.length && (
                <div className="flex justify-center">
                  <button onClick={() => setDisplayedCount(p => p + 6)} className="bg-[#00008F] hover:bg-[#0000F7] text-white font-bold py-3 px-8 rounded-full transition-colors">Cargar más artículos</button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Videos */}
      <section style={{ backgroundColor: '#E8F0F8' }} className="py-14">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-gray-900 text-center mb-10" style={{ fontFamily: "'Publico Headline Web', serif", fontWeight: 700, fontSize: 'clamp(2rem, 3.5vw, 2.8rem)' }}>Descubre más consejos...</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videoItems.map(video => (
              <div key={video.id} className="bg-white rounded-xl overflow-hidden shadow-lg group cursor-pointer">
                <div className="relative h-44 overflow-hidden">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
                      <div className="w-0 h-0 border-t-[7px] border-b-[7px] border-l-[13px] border-t-transparent border-b-transparent border-l-[#D24723] ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <span className="inline-block text-white text-xs font-semibold px-3 py-1 rounded-full mb-2" style={{ backgroundColor: '#7698CB' }}>{video.category}</span>
                  <h4 className="text-gray-900 text-[16px] font-bold leading-snug group-hover:text-[#00008F] transition-colors" style={{ fontFamily: "'Publico Headline Web', serif" }}>{video.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Más categorías para ti */}
      <section className="py-12" style={{ backgroundColor: '#E8F0F8' }}>
        <div className="max-w-6xl mx-auto px-4">
          {/* Header: título + flechas (flechas solo desktop) */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[1.4rem] md:text-[2.5rem] leading-tight font-bold text-gray-900" style={{ fontFamily: "'Publico Headline Web', serif" }}>Más categorías para ti</h2>
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => slide(-1)}
                disabled={sliderIndex === 0}
                className="w-9 h-9 flex items-center justify-center border-2 border-[#00008F] text-[#00008F] hover:bg-[#00008F] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ borderRadius: 0 }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => slide(1)}
                disabled={sliderIndex >= maxIndex}
                className="w-9 h-9 flex items-center justify-center border-2 border-[#00008F] bg-[#00008F] text-white hover:bg-[#0000F7] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ borderRadius: 0 }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Mobile: carrusel scroll horizontal — 1.5 cards visibles */}
          <div ref={mobileSliderRef} onScroll={onScrollCat} className="md:hidden flex gap-4 overflow-x-auto pb-2" style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}>
            {moreCategories.map(topic => (
              <div
                key={topic.id}
                className="relative flex-shrink-0 rounded-xl overflow-hidden cursor-pointer group"
                style={{ width: '70vw', scrollSnapAlign: 'start' }}
                onClick={() => navigate(`/categoria/${encodeURIComponent(topic.cat)}`)}
              >
                <div className="h-56">
                  <img src={topic.image} alt={topic.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end justify-start p-4">
                    <h3 className="text-white text-lg font-bold leading-snug" style={{ fontFamily: "'Publico Headline Web', serif" }}>{topic.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex md:hidden justify-center gap-2 mt-3">
            {moreCategories.map((_, i) => <span key={i} className={`block w-2 h-2 rounded-full transition-colors ${i === dotCat ? 'bg-[#00008F]' : 'bg-[#00008F]/25'}`} />)}
          </div>

          {/* Desktop: slider con flechas — 3 cards */}
          <div className="hidden md:block overflow-hidden" ref={sliderRef}>
            <div
              className="flex gap-6 transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(calc(-${sliderIndex} * (100% / ${VISIBLE} + 8px)))` }}
            >
              {moreCategories.map(topic => (
                <div
                  key={topic.id}
                  className="relative flex-shrink-0 rounded-lg overflow-hidden cursor-pointer group"
                  style={{ width: `calc((100% - ${(VISIBLE - 1) * 24}px) / ${VISIBLE})` }}
                  onClick={() => navigate(`/categoria/${encodeURIComponent(topic.cat)}`)}
                >
                  <div className="h-72">
                    <img src={topic.image} alt={topic.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end justify-start p-6">
                      <h3 className="text-white text-xl font-bold" style={{ fontFamily: "'Publico Headline Web', serif" }}>{topic.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#4976BA] py-10 px-6 text-center">
        <p className="text-white/80 text-sm">© {new Date().getFullYear()} AXA Colpatria. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
