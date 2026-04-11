import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, AlertCircle } from 'lucide-react';

const PinLockModal = ({
    isOpen,
    onClose,
    onUnlock,
    mode = 'unlock', // 'unlock' or 'set'
    onForgotPin
}) => {
    const [pin, setPin] = useState(['', '', '', '']);
    const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);
    const inputRefs = [useRef(), useRef(), useRef(), useRef()];
    const confirmRefs = [useRef(), useRef(), useRef(), useRef()];

    // useEffect(() => {
    //     if (isOpen && inputRefs[0].current) {
    //         setTimeout(() => inputRefs[0].current.focus(), 100);
    //     }
    // }, [isOpen]);
    useEffect(() => {
        if (isOpen) {
            // Force clear all PIN state
            setPin(['', '', '', '']);
            setConfirmPin(['', '', '', '']);
            setError('');
            setIsConfirming(false);

            // Also clear any auto-fill from browser
            setTimeout(() => {
                inputRefs.forEach(ref => {
                    if (ref.current) {
                        ref.current.value = '';
                    }
                });
            }, 0);

            // Focus on first input
            setTimeout(() => inputRefs[0]?.current?.focus(), 100);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const handlePinChange = (index, value, isConfirm = false) => {
        if (!/^\d*$/.test(value)) return;

        const currentPin = isConfirm ? [...confirmPin] : [...pin];
        const refs = isConfirm ? confirmRefs : inputRefs;

        currentPin[index] = value;

        if (isConfirm) {
            setConfirmPin(currentPin);
        } else {
            setPin(currentPin);
        }

        setError('');

        // Auto-focus next input
        if (value && index < 3) {
            refs[index + 1].current?.focus();
        }
    };

    const handleKeyDown = (e, index, isConfirm = false) => {
        const refs = isConfirm ? confirmRefs : inputRefs;
        const currentPin = isConfirm ? confirmPin : pin;

        if (e.key === 'Backspace' && !currentPin[index] && index > 0) {
            refs[index - 1].current?.focus();
        }
    };

    const handleSetPin = () => {
        const pinString = pin.join('');
        const confirmPinString = confirmPin.join('');

        if (pinString.length !== 4) {
            setError('Please enter a 4-digit PIN');
            return;
        }

        if (!isConfirming) {
            setIsConfirming(true);
            setTimeout(() => confirmRefs[0].current?.focus(), 100);
            return;
        }

        if (pinString !== confirmPinString) {
            setError('PINs do not match. Please try again.');
            setConfirmPin(['', '', '', '']);
            setIsConfirming(false);
            setTimeout(() => inputRefs[0].current?.focus(), 100);
            return;
        }

        onUnlock(pinString);
    };

    const handleUnlock = () => {
        const pinString = pin.join('');

        if (pinString.length !== 4) {
            setError('Please enter a 4-digit PIN');
            return;
        }

        onUnlock(pinString);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mode === 'set') {
            handleSetPin();
        } else {
            handleUnlock();
        }
    };

    const resetModal = () => {
        setPin(['', '', '', '']);
        setConfirmPin(['', '', '', '']);
        setError('');
        setIsConfirming(false);
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-[#FBE4C9] dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                                    <Lock className="w-6 h-6 text-[#F8BA90]" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                        {mode === 'set'
                                            ? (isConfirming ? 'Confirm PIN' : 'Set PIN')
                                            : 'Enter PIN'
                                        }
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {mode === 'set'
                                            ? (isConfirming
                                                ? 'Re-enter your 4-digit PIN'
                                                : 'Create a 4-digit PIN to lock this entry'
                                            )
                                            : 'This entry is locked. Enter your 4-digit PIN to view it.'
                                        }
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* PIN Input */}
                            <div className="mb-6">
                                <div className="flex gap-4 justify-center mb-4">
                                    {(isConfirming && mode === 'set' ? confirmPin : pin).map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={isConfirming && mode === 'set' ? confirmRefs[index] : inputRefs[index]}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength="1"
                                            value={digit}
                                            onChange={(e) => handlePinChange(index, e.target.value, isConfirming && mode === 'set')}
                                            onKeyDown={(e) => handleKeyDown(e, index, isConfirming && mode === 'set')}
                                            className="w-16 h-16 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-[#F8BA90] focus:outline-none focus:ring-2 focus:ring-[#F8BA90]/20 dark:bg-gray-700 dark:text-white transition-all"
                                        />
                                    ))}
                                </div>

                                {/* Progress indicator for set mode */}
                                {mode === 'set' && (
                                    <div className="flex gap-2 justify-center mb-4">
                                        <div className={`h-1 w-16 rounded-full ${!isConfirming ? 'bg-[#F8BA90]' : 'bg-gray-300'}`} />
                                        <div className={`h-1 w-16 rounded-full ${isConfirming ? 'bg-[#F8BA90]' : 'bg-gray-300'}`} />
                                    </div>
                                )}

                                {/* Error Message */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg"
                                    >
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        <span>{error}</span>
                                    </motion.div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={
                                        mode === 'set'
                                            ? (isConfirming ? confirmPin.join('').length !== 4 : pin.join('').length !== 4)
                                            : pin.join('').length !== 4
                                    }
                                    className="w-full bg-[#89BEAB] hover:bg-[#F8BA90] text-white py-4 rounded-full font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                >
                                    {mode === 'set'
                                        ? (isConfirming ? 'Confirm & Lock' : 'Continue')
                                        : 'Unlock'
                                    }
                                </motion.button>

                                {mode === 'unlock' && onForgotPin && (
                                    <button
                                        type="button"
                                        onClick={onForgotPin}
                                        className="text-[#F8BA90] hover:text-[#89BEAB] text-sm font-medium transition-colors"
                                    >
                                        Forgot PIN?
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PinLockModal;