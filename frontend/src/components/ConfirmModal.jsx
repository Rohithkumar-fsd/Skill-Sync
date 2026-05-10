import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onConfirm, onCancel, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'warning' }) => {
    const iconColors = {
        warning: 'text-yellow-600 dark:text-yellow-400',
        danger: 'text-red-600 dark:text-red-400',
        info: 'text-blue-600 dark:text-blue-400'
    };

    const confirmButtonColors = {
        warning: 'bg-yellow-600 hover:bg-yellow-700',
        danger: 'bg-red-600 hover:bg-red-700',
        info: 'bg-blue-600 hover:bg-blue-700'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="w-full max-w-md pointer-events-auto"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="confirm-modal-title"
                        >
                            <div className="bg-white dark:bg-card rounded-xl shadow-2xl border border-gray-200 dark:border-border overflow-hidden">
                                {/* Header */}
                                <div className="p-6 pb-0">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl bg-gray-100 dark:bg-accent ${iconColors[type]}`}>
                                            <AlertTriangle className="w-7 h-7" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 id="confirm-modal-title" className="text-xl font-bold text-gray-900 dark:text-foreground">
                                                {title}
                                            </h3>
                                        </div>
                                        <button
                                            onClick={onCancel}
                                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                                            aria-label="Close confirmation"
                                        >
                                            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {message}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="p-6 pt-0 flex gap-3">
                                    <button
                                        onClick={onCancel}
                                        className="flex-1 px-6 py-3 rounded-lg font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-accent hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                                    >
                                        {cancelText}
                                    </button>
                                    <button
                                        onClick={onConfirm}
                                        className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white ${confirmButtonColors[type]} shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50`}
                                    >
                                        {confirmText}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ConfirmModal;
