import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
    maxWidth?: string;
}

export function AnimatedModal({ isOpen, onClose, children, title, maxWidth = 'max-w-lg' }: AnimatedModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className={`bg-white rounded-2xl p-6 w-full ${maxWidth} max-h-[90vh] overflow-y-auto pointer-events-auto`}>
                            {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

interface SlideUpPanelProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
}

export function SlideUpPanel({ isOpen, onClose, children, title }: SlideUpPanelProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/50"
                    />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto"
                    >
                        <div className="sticky top-0 bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                            <h2 className="font-semibold">{title}</h2>
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export function fadeInUp(delay: number = 0) {
    return {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay, ease: 'easeOut' }
    };
}

export function scaleIn(delay: number = 0) {
    return {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3, delay, ease: 'easeOut' }
    };
}