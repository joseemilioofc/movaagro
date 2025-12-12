import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

interface BreadcrumbConfig {
  label: string;
  parent?: string;
}

const routeLabels: Record<string, BreadcrumbConfig> = {
  "/": { label: "Início" },
  "/dashboard/cooperative": { label: "Painel Cooperativa" },
  "/dashboard/transporter": { label: "Painel Transportador" },
  "/dashboard/admin": { label: "Painel Admin" },
  "/admin/settings": { label: "Configurações", parent: "/dashboard/admin" },
  "/admin/audit-logs": { label: "Logs de Auditoria", parent: "/dashboard/admin" },
  "/contracts": { label: "Contratos" },
  "/profile": { label: "Perfil" },
  "/ranking": { label: "Ranking" },
  "/chat": { label: "Chat" },
  "/about": { label: "Sobre Nós" },
  "/pricing": { label: "Preços" },
  "/terms": { label: "Termos de Uso" },
  "/privacy": { label: "Política de Privacidade" },
  "/security": { label: "Segurança" },
  "/install": { label: "Instalar App" },
};

export const Breadcrumbs = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Don't show breadcrumbs on home page
  if (currentPath === "/") return null;

  const buildBreadcrumbTrail = (): { path: string; label: string }[] => {
    const trail: { path: string; label: string }[] = [{ path: "/", label: "Início" }];
    
    const config = routeLabels[currentPath];
    if (!config) {
      // Handle dynamic routes or unknown routes
      const pathSegments = currentPath.split("/").filter(Boolean);
      let accumulatedPath = "";
      
      pathSegments.forEach((segment, index) => {
        accumulatedPath += `/${segment}`;
        const segmentConfig = routeLabels[accumulatedPath];
        if (segmentConfig) {
          trail.push({ path: accumulatedPath, label: segmentConfig.label });
        } else if (index === pathSegments.length - 1) {
          // Last segment - use capitalized version as fallback
          trail.push({ 
            path: accumulatedPath, 
            label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")
          });
        }
      });
      
      return trail;
    }

    // Add parent if exists
    if (config.parent && routeLabels[config.parent]) {
      trail.push({ path: config.parent, label: routeLabels[config.parent].label });
    }

    // Add current page
    trail.push({ path: currentPath, label: config.label });

    return trail;
  };

  const breadcrumbTrail = buildBreadcrumbTrail();

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {breadcrumbTrail.map((item, index) => {
          const isLast = index === breadcrumbTrail.length - 1;
          
          return (
            <BreadcrumbItem key={item.path}>
              {index > 0 && <BreadcrumbSeparator />}
              {isLast ? (
                <BreadcrumbPage className="flex items-center gap-1.5">
                  {index === 0 && <Home className="h-3.5 w-3.5" />}
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.path} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    {index === 0 && <Home className="h-3.5 w-3.5" />}
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
