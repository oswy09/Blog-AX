import { createContext, useContext, useState, useEffect, useCallback, ReactNode, ReactElement } from 'react';

interface RouterCtx {
  pathname: string;
  navigate: (to: string) => void;
  params: Record<string, string>;
}

const Ctx = createContext<RouterCtx>({ pathname: '/', navigate: () => {}, params: {} });

function matchRoute(pattern: string, pathname: string): Record<string, string> | null {
  const pp = pattern.split('/').filter(Boolean);
  const ph = pathname.split('/').filter(Boolean);
  if (pp.length !== ph.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < pp.length; i++) {
    if (pp[i].startsWith(':')) params[pp[i].slice(1)] = decodeURIComponent(ph[i]);
    else if (pp[i] !== ph[i]) return null;
  }
  return params;
}

export function Router({ children }: { children: ReactNode }) {
  const [pathname, setPathname] = useState(() => window.location.pathname || '/');

  const navigate = useCallback((to: string) => {
    try {
      history.pushState(null, '', to);
    } catch (_) {
      // iframe sandbox may block pushState — navigation still works via state
    }
    setPathname(to);
    try { window.scrollTo(0, 0); } catch (_) {}
  }, []);

  useEffect(() => {
    const onPop = () => setPathname(window.location.pathname || '/');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return <Ctx.Provider value={{ pathname, navigate, params: {} }}>{children}</Ctx.Provider>;
}

interface RouteDef {
  path: string;
  element: ReactNode;
  redirectTo?: string;
}

function findMatch(routes: RouteDef[], pathname: string): { element: ReactNode; params: Record<string, string> } | null {
  for (const route of routes) {
    if (route.redirectTo) {
      const params = matchRoute(route.path, pathname);
      if (params !== null) return { element: <RedirectInner to={route.redirectTo} />, params };
      continue;
    }
    if (route.path === '*') return { element: route.element, params: {} };
    const params = matchRoute(route.path, pathname);
    if (params !== null) return { element: route.element, params };
  }
  return null;
}

function RedirectInner({ to }: { to: string }) {
  const { navigate } = useContext(Ctx);
  useEffect(() => { navigate(to); }, []);
  return null;
}

export function Routes({ children }: { children: ReactNode }) {
  const { pathname, navigate } = useContext(Ctx);

  const routes: RouteDef[] = (Array.isArray(children) ? children : [children])
    .filter((c): c is ReactElement<{ path: string; element: ReactNode; redirectTo?: string }> => !!c)
    .map(c => ({ path: c.props.path, element: c.props.element, redirectTo: c.props.redirectTo }));

  const match = findMatch(routes, pathname);
  if (!match) return null;

  return <Ctx.Provider value={{ pathname, navigate, params: match.params }}>{match.element}</Ctx.Provider>;
}

export function Route(_: { path: string; element: ReactNode; redirectTo?: string }) { return null; }

export function Navigate({ to }: { to: string }) {
  const { navigate } = useContext(Ctx);
  useEffect(() => { navigate(to); }, []);
  return null;
}

export function useNavigate() { return useContext(Ctx).navigate; }
export function useParams<T extends Record<string, string>>(): T { return useContext(Ctx).params as T; }
