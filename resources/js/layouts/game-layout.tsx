import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { Head } from '@inertiajs/react';

interface GameLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    title?: string;
}

export default function GameLayout({ children, breadcrumbs = [], title = 'Game Portal' }: GameLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-90">
            <Head title={title} />
            
            {/* Simple header for game pages */}
            <header className="border-b border-cyan-500/20 bg-gray-900/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-40 to-purple-500 bg-clip-text text-transparent">
                        Game Portal
                    </h1>
                    <div className="flex items-center gap-4">
                        {breadcrumbs.length > 0 && (
                            <nav className="text-sm text-gray-400">
                                {breadcrumbs.map((breadcrumb, index) => (
                                    <span key={index} className="after:content-['/'] last:after:content-[''] last:after:ml-0 after:ml-2 after:text-gray-600">
                                        {breadcrumb.title}
                                    </span>
                                ))}
                            </nav>
                        )}
                    </div>
                </div>
            </header>
            
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
            
            {/* Futuristic background elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            </div>
        </div>
    );
}