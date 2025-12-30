import { jsx as _jsx } from "react/jsx-runtime";
export function Sidebar({ onNavigate, activePage }) {
    const pages = ['home', 'about', 'contact'];
    return (_jsx("aside", { id: "sidebar", children: _jsx("ul", { children: pages.map((page) => (_jsx("li", { children: _jsx("a", { href: "#", className: activePage === page ? 'active' : '', onClick: (e) => {
                        e.preventDefault();
                        onNavigate(page);
                    }, children: page.charAt(0).toUpperCase() + page.slice(1) }) }, page))) }) }));
}
