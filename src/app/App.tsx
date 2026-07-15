import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Search, Calendar, Clock, ArrowRight, ChevronRight as ChevRight, ChevronDown, X, User } from 'lucide-react';
import ArticleDetail from './components/ArticleDetail';
import CategoryPage from './components/CategoryPage';
import { featuredPosts, recentPosts, blogPosts, mostReadPosts, exploreMore, getArticleById, allArticles } from './data';
import { pushURL, getInitialPath } from './router';

const categories = ['Todos', 'Seguros', 'Salud', 'ARL', 'Bienestar', 'Prevención', 'Movilidad'];

const videoItems = [
  { id: 1, title: 'Guía de Bienestar Corporativo', duration: '8:30', thumbnail: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', category: 'Bienestar' },
  { id: 2, title: 'El Sistema de Seguros de Vida', duration: '6:15', thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', category: 'Seguros' },
  { id: 3, title: 'Ejercicios de Bienestar en el Trabajo', duration: '10:45', thumbnail: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', category: 'ARL' },
];

const categoryColor: Record<string, string> = {
  Bienestar: '#00008F', Seguros: '#4976BA', ARL: '#D24723', Salud: '#4976BA',
  Movilidad: '#00008F', Prevención: '#D24723', Hogar: '#4976BA', Todos: '#00008F',
};

function CategoryBadge({ category }: { category: string }) {
  const color = categoryColor[category] ?? '#4976BA';
  return (
    <span className="inline-block text-white text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: color, fontFamily: "'Source Sans Pro', sans-serif" }}>
      {category}
    </span>
  );
}

function PlayButton() {
  return (
    <div className="w-12 h-12 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
      <div className="w-0 h-0 border-t-[7px] border-b-[7px] border-l-[13px] border-t-transparent border-b-transparent border-l-[#D24723] ml-1" />
    </div>
  );
}

const filterDates = ['Última semana', 'Último mes', 'Últimos 3 meses', 'Este año'];
const filterFormats = ['Artículo', 'Video', 'Infografía', 'Podcast'];
const filterCategories = categories.filter(c => c !== 'Todos');

function FilterDropdown({ placeholder, options, value, onChange }: {
  placeholder: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = value !== '' ? value : null;
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)} className="flex items-center justify-between gap-3 border border-gray-300 rounded-xl px-4 py-2.5 bg-white text-sm transition-colors min-w-[190px] hover:border-[#00008F] focus:border-[#00008F] focus:outline-none" style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>
        <span className={selected ? 'text-gray-800' : 'text-gray-400'}>{selected ?? placeholder}</span>
        <ChevronDown size={16} className={`flex-shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 min-w-[210px] py-1 overflow-hidden">
          {selected && (
            <button onClick={() => { onChange(''); setOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-400 hover:bg-gray-50" style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>
              {placeholder}
            </button>
          )}
          {options.map(opt => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${value === opt ? 'bg-[#00008F]/5 text-[#00008F] font-semibold' : 'text-gray-700 hover:bg-gray-50'}`} style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type View =
  | { type: 'home' }
  | { type: 'article'; article: any }
  | { type: 'category'; category: string };

function parseInitialView(): View {
  const path = getInitialPath();
  const articleMatch = path.match(/^\/articulo\/(\d+)/);
  if (articleMatch) {
    const article = getArticleById(Number(articleMatch[1]));
    if (article) return { type: 'article', article };
  }
  const categoryMatch = path.match(/^\/categoria\/(.+)/);
  if (categoryMatch) return { type: 'category', category: decodeURIComponent(categoryMatch[1]) };
  return { type: 'home' };
}

export default function App() {
  const [view, setView] = useState<View>(parseInitialView);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [filterDate, setFilterDate] = useState('');
  const [filterFormat, setFilterFormat] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);

  // Sync URL with current view
  useEffect(() => {
    if (view.type === 'home') pushURL('/');
    else if (view.type === 'article') pushURL(`/articulo/${view.article.id}`);
    else if (view.type === 'category') pushURL(`/categoria/${encodeURIComponent(view.category)}`);
  }, [view]);

  // Handle browser back/forward
  useEffect(() => {
    const onPop = () => setView(parseInitialView());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const goHome = () => setView({ type: 'home' });
  const goArticle = (article: any) => setView({ type: 'article', article });
  const goCategory = (category: string) => setView({ type: 'category', category });

  const toggleTag = (tag: string) => setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const clearFilters = () => { setFilterDate(''); setFilterFormat(''); setFilterCat(''); setActiveTags([]); setSearchQuery(''); setSelectedCategory('Todos'); };

  const hasActiveFilters = filterDate !== '' || filterFormat !== '' || filterCat !== '' || activeTags.length > 0;

  const filteredRecent = recentPosts.filter(p => (selectedCategory === 'Todos' || p.category === selectedCategory) && (activeTags.length === 0 || activeTags.includes(p.category)));
  const filteredBlog = blogPosts.filter(p => (selectedCategory === 'Todos' || p.category === selectedCategory) && (activeTags.length === 0 || activeTags.includes(p.category)));

  if (view.type === 'article') {
    return <ArticleDetail article={view.article} onClose={goHome} onArticleClick={goArticle} />;
  }

  if (view.type === 'category') {
    return <CategoryPage category={view.category} onClose={goHome} onArticleClick={goArticle} />;
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>

      {/* Utility bar */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto px-4 flex items-center h-8">
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-gray-600 hover:text-[#00008F]">Personas</a>
            <a href="#" className="text-xs text-gray-600 hover:text-[#00008F]">Empresas</a>
          </div>
          <div className="flex items-center gap-5 ml-auto">
            <a href="#" className="text-xs text-gray-500 hover:text-[#00008F]">Ley de transparencia</a>
            <div className="flex items-center gap-1 cursor-pointer group">
              <User size={13} className="text-gray-400 group-hover:text-[#00008F]" />
              <span className="text-xs text-gray-500 group-hover:text-[#00008F]">Pagos y facturación</span>
              <ChevronDown size={12} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1 cursor-pointer group">
              <User size={13} className="text-gray-400 group-hover:text-[#00008F]" />
              <span className="text-xs text-gray-500 group-hover:text-[#00008F]">Ingresa a tu cuenta</span>
              <ChevronDown size={12} className="text-gray-400" />
            </div>
            <button className="border border-[#00008F] text-[#00008F] hover:bg-[#00008F] hover:text-white text-xs font-semibold px-4 h-8 transition-colors">Paga aquí</button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex items-center h-[52px] gap-8">
            <img src="https://image.marketing.axacolpatria.co/lib/fe2911747364047e721277/m/1/414c8f47-08cb-4aca-80c0-c4ef42d1e91d.jpg" alt="AXA Colpatria" className="h-8 flex-shrink-0 cursor-pointer" onClick={goHome} />
            <nav className="flex items-center justify-center gap-7 flex-1">
              {['INICIO', 'Salud y Bienestar', 'Estilo de vida', 'Empresas', 'Actualidad'].map(item => (
                <a key={item} href="#" className="text-sm font-bold text-[#00008F] hover:text-[#4976BA] whitespace-nowrap transition-colors" style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>{item}</a>
              ))}
            </nav>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button className="bg-[#00008F] hover:bg-[#0000b3] text-white text-sm font-semibold px-4 py-2 transition-colors whitespace-nowrap">Cotiza tu seguro aquí</button>
              <button className="border border-[#00008F] text-[#00008F] hover:bg-[#00008F] hover:text-white text-sm font-semibold px-4 py-2 transition-colors whitespace-nowrap">Contáctanos</button>
              <button className="p-2 text-gray-500 hover:text-[#00008F] transition-colors"><Search size={18} /></button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[400px] md:h-[480px] overflow-hidden" style={{ backgroundImage: `url(https://www.axacolpatria.co/documents/42201273/156411758/banner-vida-en-casa.webp/2960ab3f-161f-a106-6dc8-472e446c57d0?t=1755812539060)`, backgroundSize: 'cover', backgroundPosition: 'center center' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-8">
          <p className="text-white text-2xl font-normal mb-3 tracking-wide">Blog</p>
          <h1 className="text-white leading-tight" style={{ fontFamily: "'Publico Headline Web', serif", fontWeight: 700, fontSize: 'clamp(1.75rem, 3.5vw, 2.6rem)' }}>
            Protegemos lo que más importa con información útil para tu día a día
          </h1>
        </div>
      </section>

      {/* Search + Filters */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <h2 className="text-center text-3xl md:text-4xl text-gray-800 mb-7 leading-tight">
            <span style={{ fontFamily: "'Publico Headline Web', serif", fontWeight: 700 }}>¿Qué quieres aprender hoy?</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-2 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Buscar" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#00008F] transition-colors" style={{ fontFamily: "'Source Sans Pro', sans-serif" }} />
            </div>
            <FilterDropdown placeholder="Selecciona fecha" options={filterDates} value={filterDate} onChange={setFilterDate} />
            <FilterDropdown placeholder="Selecciona formato" options={filterFormats} value={filterFormat} onChange={setFilterFormat} />
            <FilterDropdown placeholder="Selecciona categoría" options={filterCategories} value={filterCat} onChange={v => { setFilterCat(v); setSelectedCategory(v === '' ? 'Todos' : v); }} />
            {hasActiveFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2.5 text-xs font-medium text-[#D24723] border border-[#D24723]/30 rounded hover:bg-[#D24723]/5 transition-colors whitespace-nowrap">
                <X size={13} /> Limpiar
              </button>
            )}
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            <button onClick={() => { setActiveTags([]); setSelectedCategory('Todos'); }} className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all border ${activeTags.length === 0 && selectedCategory === 'Todos' ? 'bg-[#00008F] text-white border-[#00008F]' : 'bg-white text-[#00008F] border-[#00008F]/30 hover:bg-[#00008F]/5'}`}>Todos</button>
            {categories.filter(c => c !== 'Todos').map(tag => (
              <button key={tag} onClick={() => { toggleTag(tag); setSelectedCategory(tag); goCategory(tag); }} className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all border ${activeTags.includes(tag) || selectedCategory === tag ? 'bg-[#00008F] text-white border-[#00008F]' : 'bg-white text-[#4976BA] border-[#4976BA]/40 hover:border-[#00008F] hover:text-[#00008F]'}`}>{tag}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Destacados */}
      <section className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl mb-5" style={{ fontFamily: "'Publico Headline Web', serif", fontWeight: 700, color: '#00008F' }}>Destacados de la semana</h2>
          <div className="relative w-full h-[340px] rounded-xl overflow-hidden cursor-pointer group" onClick={() => goArticle(featuredPosts[0])}>
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
              <h2 className="text-2xl mb-6" style={{ fontFamily: "'Publico Headline Web', serif", fontWeight: 700, color: '#00008F' }}>Recomendados para ti</h2>
              <div className="grid grid-cols-2 gap-6">
                {(filteredRecent.length > 0 ? filteredRecent : recentPosts).concat(filteredBlog.length > 0 ? filteredBlog : blogPosts).slice(0, 6).map(post => (
                  <article key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer group" onClick={() => goArticle(post)}>
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
            </div>

            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-xl mb-4" style={{ fontFamily: "'Publico Headline Web', serif", fontWeight: 700, color: '#00008F' }}>Recientes</h2>
                <div className="divide-y divide-gray-100">
                  {mostReadPosts.slice(0, 3).map(post => (
                    <div key={post.id} className="flex items-start gap-3 py-3 cursor-pointer group" onClick={() => goArticle(post)}>
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

              <div>
                <h2 className="text-xl mb-4" style={{ fontFamily: "'Publico Headline Web', serif", fontWeight: 700, color: '#00008F' }}>Te puede interesar</h2>
                <div className="divide-y divide-gray-100">
                  {mostReadPosts.slice(3, 6).map(post => (
                    <div key={post.id} className="flex items-start gap-3 py-3 cursor-pointer group" onClick={() => goArticle(post)}>
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

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2" style={{ fontFamily: "'Publico Headline Web', serif" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7698CB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[['#Bienestar','Bienestar'],['#ARL','ARL'],['#Finanzas','Seguros'],['#Prevención','Prevención'],['#Salud','Salud'],['#Seguros','Seguros'],['#Sostenibilidad','Bienestar'],['#SOAT','Seguros'],['#Riesgos Laborales','ARL'],['#Estilo de Vida','Bienestar'],['#Movilidad','Movilidad'],['#Pyme','Seguros'],['#Hogar','Prevención']].map(([label, cat]) => (
                    <span key={label} className="text-xs text-gray-600 border border-gray-200 rounded-full px-3 py-1 hover:border-[#00008F] hover:text-[#00008F] hover:font-bold cursor-pointer transition-colors" onClick={() => goCategory(cat)}>{label}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Videos */}
      <section style={{ backgroundColor: '#070E40' }} className="py-14">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-white text-center mb-10" style={{ fontFamily: "'Publico Headline Web', serif", fontWeight: 700, fontSize: 'clamp(2rem, 3.5vw, 2.8rem)' }}>Conoce en menos de 2 minutos...</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videoItems.map(video => (
              <div key={video.id} className="bg-white rounded-xl overflow-hidden shadow-lg group cursor-pointer">
                <div className="relative h-44 overflow-hidden">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors flex items-center justify-center"><PlayButton /></div>
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

      {/* Sigue explorando */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl" style={{ fontFamily: "'Publico Headline Web', serif", fontWeight: 700, color: '#00008F' }}>Sigue explorando</h2>
            <a href="#" className="text-sm font-semibold text-[#00008F] hover:text-[#4976BA] flex items-center gap-1 transition-colors">Ver todos <ChevRight size={16} /></a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {exploreMore.map(post => (
              <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group" onClick={() => goArticle(post)}>
                <div className="relative h-52 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3"><CategoryBadge category={post.category} /></div>
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

      {/* Footer */}
      <footer>
        <img src="https://res.cloudinary.com/ddqbnr9vo/image/upload/v1782842464/footer_AXA_f1azqa.jpg" alt="Footer AXA Colpatria" className="w-full h-auto" />
      </footer>
    </div>
  );
}
