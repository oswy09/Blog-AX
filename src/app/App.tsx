import { useState, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Search, Calendar, Clock, ChevronRight as ChevRight, X, Menu } from 'lucide-react';
import ArticleDetail from './components/ArticleDetail';
import CategoryPage from './components/CategoryPage';
import { featuredPosts, recentPosts, blogPosts, mostReadPosts } from './data';

const categories = ['Todos', 'Seguros', 'Salud', 'ARL', 'Bienestar', 'Prevención', 'Movilidad'];

const videoItems = [
  { id: 1, title: 'Guía de Bienestar Corporativo', thumbnail: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', category: 'Bienestar' },
  { id: 2, title: 'El Sistema de Seguros de Vida', thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', category: 'Seguros' },
  { id: 3, title: 'Ejercicios de Bienestar en el Trabajo', thumbnail: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', category: 'ARL' },
];



function VideoModal({ video, onClose }: { video: typeof videoItems[0] | null; onClose: () => void }) {
  if (!video) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75" onClick={onClose}>
      <div className="relative w-full max-w-3xl mx-4" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors flex items-center gap-1 text-sm font-semibold">
          <X size={18} /> Cerrar
        </button>
        <div className="relative w-full rounded-xl overflow-hidden shadow-2xl" style={{ paddingTop: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/fzSyiC2DWgc?autoplay=1&rel=0`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="text-white font-semibold mt-3 text-center" style={{ fontFamily: "'Publico Headline Web', serif" }}>{video.title}</p>
      </div>
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [activeVideo, setActiveVideo] = useState<typeof videoItems[0] | null>(null);
  const [showAllCards, setShowAllCards] = useState(false);
  const [dotReciente, setDotReciente] = useState(0);
  const [dotMasLeido, setDotMasLeido] = useState(0);
  const [dotVideo, setDotVideo] = useState(0);
  const refReciente = useRef<HTMLDivElement>(null);
  const refMasLeido = useRef<HTMLDivElement>(null);
  const refVideo = useRef<HTMLDivElement>(null);
  const onScrollDot = (ref: React.RefObject<HTMLDivElement>, count: number, setter: (i: number) => void) => {
    const el = ref.current; if (!el) return;
    setter(Math.min(count - 1, Math.round(el.scrollLeft / (el.scrollWidth / count))));
  };

  const toggleTag = (tag: string) => setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  const clearFilters = () => { setActiveTags([]); setSearchQuery(''); setSelectedCategory('Todos'); };
  const hasActiveFilters = activeTags.length > 0 || searchQuery !== '';
  const filteredRecent = recentPosts.filter(p => (selectedCategory === 'Todos' || p.category === selectedCategory) && (activeTags.length === 0 || activeTags.includes(p.category)));
  const filteredBlog = blogPosts.filter(p => (selectedCategory === 'Todos' || p.category === selectedCategory) && (activeTags.length === 0 || activeTags.includes(p.category)));

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex items-center h-[52px] gap-3 md:gap-8">
            <img src="https://image.marketing.axacolpatria.co/lib/fe2911747364047e721277/m/1/414c8f47-08cb-4aca-80c0-c4ef42d1e91d.jpg" alt="AXA Colpatria" className="h-8 flex-shrink-0 cursor-pointer" onClick={() => navigate('/')} />
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center justify-center gap-7 flex-1">
              {['INICIO', 'Salud y Bienestar', 'Estilo de vida', 'Empresas', 'Actualidad'].map(item => (
                <a key={item} href="#" className="text-sm font-bold text-[#00008F] hover:text-[#4976BA] whitespace-nowrap transition-colors">{item}</a>
              ))}
            </nav>
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              <button className="bg-[#00008F] hover:bg-[#0000F7] text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors whitespace-nowrap">Cotiza tu seguro aquí</button>
              <button className="border border-[#00008F] text-[#00008F] hover:bg-[#00008F] hover:text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors whitespace-nowrap">Contáctanos</button>
            </div>
            {/* Mobile: inline search + hamburger */}
            <div className="flex md:hidden items-center flex-1 gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#00008F] transition-colors"
                />
              </div>
              <button className="w-11 h-11 flex items-center justify-center text-[#00008F] flex-shrink-0" aria-label="Menú"><Menu size={24} /></button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[260px] md:h-[480px] overflow-hidden" style={{ backgroundImage: `url(https://www.axacolpatria.co/documents/42201273/156411758/banner-vida-en-casa.webp/2960ab3f-161f-a106-6dc8-472e446c57d0?t=1755812539060)`, backgroundSize: 'cover', backgroundPosition: 'center center' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-8">
          <p className="text-white text-2xl font-normal mb-3 tracking-wide">Blog</p>
          <h1 className="text-white leading-tight text-[1.5rem] md:text-[4rem]" style={{ fontFamily: "'Publico Headline Web', serif", fontWeight: 300 }}>Protegemos lo que más importa con información útil para tu día a día</h1>
        </div>
      </section>

      {/* Search + Categorías */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h2 className="text-center text-gray-800 mb-7 leading-tight text-[1.75rem] md:text-[2.5rem]" style={{ fontFamily: "'Publico Headline Web', serif", fontWeight: 700 }}>¿Qué quieres aprender hoy?</h2>
          <div className="hidden md:flex gap-2 mb-5 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Buscar" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#00008F] transition-colors" />
            </div>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2.5 text-xs font-medium text-[#D24723] border border-[#D24723]/30 rounded-full hover:bg-[#D24723]/5 transition-colors whitespace-nowrap"><X size={13} /> Limpiar</button>
            )}
          </div>
          {/* Desktop: una fila sin wrap. Mobile: grid 3 columnas */}
          <div className="hidden md:flex gap-2 justify-center flex-nowrap">
            <button onClick={() => { setActiveTags([]); setSelectedCategory('Todos'); }} className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all border whitespace-nowrap flex-shrink-0 ${activeTags.length === 0 && selectedCategory === 'Todos' ? 'bg-[#00008F] text-white border-[#00008F]' : 'bg-white text-[#00008F] border-[#00008F]/30 hover:bg-[#00008F]/5'}`}>Todos</button>
            {categories.filter(c => c !== 'Todos').map(tag => (
              <button key={tag} onClick={() => { toggleTag(tag); setSelectedCategory(tag); navigate(`/categoria/${encodeURIComponent(tag)}`); }} className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all border whitespace-nowrap flex-shrink-0 ${activeTags.includes(tag) || selectedCategory === tag ? 'bg-[#00008F] text-white border-[#00008F]' : 'bg-white text-[#4976BA] border-[#4976BA]/40 hover:border-[#00008F] hover:text-[#00008F]'}`}>{tag}</button>
            ))}
          </div>
          <div className="flex md:hidden flex-wrap gap-1.5 justify-center">
            {categories.map(tag => (
              <button key={tag} onClick={() => { if (tag === 'Todos') { setActiveTags([]); setSelectedCategory('Todos'); } else { toggleTag(tag); setSelectedCategory(tag); navigate(`/categoria/${encodeURIComponent(tag)}`); } }} className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${(tag === 'Todos' && activeTags.length === 0 && selectedCategory === 'Todos') || activeTags.includes(tag) || selectedCategory === tag ? 'bg-[#00008F] text-white border-[#00008F]' : 'bg-white text-[#4976BA] border-[#4976BA]/40'}`}>{tag}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Destacados */}
      <section className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="mb-5 text-[1.75rem] md:text-[2.5rem] leading-tight" style={{ fontFamily: "'Publico Headline Web', serif", fontWeight: 700, color: '#00008F' }}>Destacados de la semana</h2>
          <div className="relative w-full h-[340px] rounded-xl overflow-hidden cursor-pointer group" onClick={() => navigate(`/articulo/${featuredPosts[0].id}`)}>
            <img src={featuredPosts[0].image} alt={featuredPosts[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 max-w-2xl">
              <h3 className="text-white text-2xl md:text-3xl leading-snug mb-3" style={{ fontFamily: "'Publico Headline Web', serif", fontWeight: 700 }}>{featuredPosts[0].title}</h3>
              <p className="text-white/80 text-sm leading-relaxed line-clamp-2 mb-4">{featuredPosts[0].excerpt}</p>
              <div className="flex items-center gap-3">
                <span className="inline-block text-white text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: '#7698CB' }}>{featuredPosts[0].category}</span>
                <p className="text-white/60 text-xs">{featuredPosts[0].date}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recomendados + Sidebar */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h2 className="mb-6 text-[1.75rem] md:text-[2.5rem] leading-tight" style={{ fontFamily: "'Publico Headline Web', serif", fontWeight: 700, color: '#00008F' }}>Recomendados del día</h2>
              {(() => {
                const allPosts = (filteredRecent.length > 0 ? filteredRecent : recentPosts).concat(filteredBlog.length > 0 ? filteredBlog : blogPosts).slice(0, 6);
                const visiblePosts = showAllCards ? allPosts : allPosts.slice(0, 3);
                return (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {visiblePosts.map(post => (
                        <article key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer group" onClick={() => navigate(`/articulo/${post.id}`)}>
                          <div className="relative w-full h-44 overflow-hidden">
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-3 right-3"><span className="inline-block text-white text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: '#7698CB' }}>{post.category}</span></div>
                          </div>
                          <div className="p-4">
                            <h3 className="text-[17px] leading-snug mb-2 line-clamp-2 text-gray-900" style={{ fontFamily: "'Publico Headline Web', serif", fontWeight: 700 }}>{post.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{post.excerpt}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                              <span className="flex items-center gap-1"><Calendar size={12} />{post.date}</span>
                              <span className="flex items-center gap-1"><Clock size={12} />{post.readTime}</span>
                            </div>
                            <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#00008F]">Leer más <ChevRight size={14} /></span>
                          </div>
                        </article>
                      ))}
                    </div>
                    {/* Cargar más — solo mobile */}
                    {!showAllCards && allPosts.length > 3 && (
                      <div className="flex justify-center mt-6 sm:hidden">
                        <button onClick={() => setShowAllCards(true)} className="border border-[#00008F] text-[#00008F] font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-[#00008F] hover:text-white transition-colors">
                          Cargar más artículos
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            <div className="lg:col-span-1 space-y-8">
              {/* Recientes */}
              <div>
                <h2 className="mb-4 text-lg leading-tight" style={{ fontFamily: "'Publico Headline Web', serif", fontWeight: 700, color: '#00008F' }}>Recientes</h2>
                {/* Mobile: carrusel horizontal */}
                <div ref={refReciente} onScroll={() => onScrollDot(refReciente, 3, setDotReciente)} className="flex gap-3 overflow-x-auto pb-2 lg:hidden" style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}>
                  {mostReadPosts.slice(0, 3).map(post => (
                    <div key={post.id} className="flex-shrink-0 w-56 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer" style={{ scrollSnapAlign: 'start' }} onClick={() => navigate(`/articulo/${post.id}`)}>
                      <img src={post.image} alt={post.title} className="w-full h-32 object-cover" />
                      <div className="p-3">
                        <h4 className="text-[13px] font-bold leading-snug text-gray-900 line-clamp-2 mb-1" style={{ fontFamily: "'Publico Headline Web', serif" }}>{post.title}</h4>
                        <p className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={10} /> {post.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex lg:hidden justify-center gap-2 mt-2">
                  {[0,1,2].map(i => <span key={i} className={`block w-2 h-2 rounded-full transition-colors ${i === dotReciente ? 'bg-[#00008F]' : 'bg-[#00008F]/25'}`} />)}
                </div>
                {/* Desktop: lista vertical */}
                <div className="hidden lg:block divide-y divide-gray-100">
                  {mostReadPosts.slice(0, 3).map(post => (
                    <div key={post.id} className="flex items-start gap-3 py-3 cursor-pointer group" onClick={() => navigate(`/articulo/${post.id}`)}>
                      <img src={post.image} alt={post.title} className="w-[72px] h-[72px] object-cover flex-shrink-0 rounded-md" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[14px] font-bold leading-snug text-gray-900 line-clamp-2 group-hover:text-[#00008F] transition-colors mb-1" style={{ fontFamily: "'Publico Headline Web', serif" }}>{post.title}</h4>
                        <p className="text-xs text-gray-400 line-clamp-1 mb-1">{post.excerpt}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={11} /> {post.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Más leídos */}
              <div>
                <h2 className="mb-4 text-lg leading-tight" style={{ fontFamily: "'Publico Headline Web', serif", fontWeight: 700, color: '#00008F' }}>Más leídos</h2>
                {/* Mobile: carrusel horizontal */}
                <div ref={refMasLeido} onScroll={() => onScrollDot(refMasLeido, 3, setDotMasLeido)} className="flex gap-3 overflow-x-auto pb-2 lg:hidden" style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}>
                  {mostReadPosts.slice(3, 6).map(post => (
                    <div key={post.id} className="flex-shrink-0 w-56 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer" style={{ scrollSnapAlign: 'start' }} onClick={() => navigate(`/articulo/${post.id}`)}>
                      <img src={post.image} alt={post.title} className="w-full h-32 object-cover" />
                      <div className="p-3">
                        <h4 className="text-[13px] font-bold leading-snug text-gray-900 line-clamp-2 mb-1" style={{ fontFamily: "'Publico Headline Web', serif" }}>{post.title}</h4>
                        <p className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={10} /> {post.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex lg:hidden justify-center gap-2 mt-2">
                  {[0,1,2].map(i => <span key={i} className={`block w-2 h-2 rounded-full transition-colors ${i === dotMasLeido ? 'bg-[#00008F]' : 'bg-[#00008F]/25'}`} />)}
                </div>
                {/* Desktop: lista vertical */}
                <div className="hidden lg:block divide-y divide-gray-100">
                  {mostReadPosts.slice(3, 6).map(post => (
                    <div key={post.id} className="flex items-start gap-3 py-3 cursor-pointer group" onClick={() => navigate(`/articulo/${post.id}`)}>
                      <img src={post.image} alt={post.title} className="w-[72px] h-[72px] object-cover flex-shrink-0 rounded-md" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[14px] font-bold leading-snug text-gray-900 line-clamp-2 group-hover:text-[#00008F] transition-colors mb-1" style={{ fontFamily: "'Publico Headline Web', serif" }}>{post.title}</h4>
                        <p className="text-xs text-gray-400 line-clamp-1 mb-1">{post.excerpt}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={11} /> {post.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Videos */}
      <section style={{ backgroundColor: '#E8F0F8' }} className="py-14">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center mb-10 text-[1.75rem] md:text-[2.5rem] leading-tight" style={{ fontFamily: "'Publico Headline Web', serif", fontWeight: 700, color: '#00008F' }}>Conoce en menos de 2 minutos...</h2>
          <div ref={refVideo} onScroll={() => onScrollDot(refVideo, 3, setDotVideo)} className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0" style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}>
            {videoItems.map(video => (
              <div key={video.id} className="bg-white rounded-xl overflow-hidden shadow-lg group cursor-pointer flex-shrink-0 w-72 md:w-auto" style={{ scrollSnapAlign: 'start' }} onClick={() => setActiveVideo(video)}>
                <div className="relative h-44 overflow-hidden">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/95 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
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
          <div className="flex md:hidden justify-center gap-2 mt-4">
            {[0,1,2].map(i => <span key={i} className={`block w-2 h-2 rounded-full transition-colors ${i === dotVideo ? 'bg-[#00008F]' : 'bg-[#00008F]/25'}`} />)}
          </div>
        </div>
      </section>

      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />

      <footer className="bg-[#4976BA] py-10 px-6 text-center">
        <p className="text-white/80 text-sm">© {new Date().getFullYear()} AXA Colpatria. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/articulo/:id" element={<ArticleDetail />} />
      <Route path="/categoria/:nombre" element={<CategoryPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
