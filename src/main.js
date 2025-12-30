import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Sidebar } from './components/Sidebar';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
function App() {
    const [page, setPage] = useState('home');
    let PageComponent;
    switch (page) {
        case 'about':
            PageComponent = _jsx(About, {});
            break;
        case 'contact':
            PageComponent = _jsx(Contact, {});
            break;
        default:
            PageComponent = _jsx(Home, {});
    }
    return (_jsxs("div", { id: "app", style: { display: 'flex', height: '100vh' }, children: [_jsx(Sidebar, { onNavigate: setPage, activePage: page }), _jsx("main", { style: { flex: 1, padding: '20px' }, children: PageComponent })] }));
}
const root = createRoot(document.getElementById('app'));
root.render(_jsx(App, {}));
