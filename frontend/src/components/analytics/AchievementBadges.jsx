import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock } from 'lucide-react';

const AchievementBadges = ({ achievements }) => {
    return (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-5 h-5 text-[#f4873e] dark:text-orange-400" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: "Brasika" }}>
                    🏆 Your Achievements
                </h3>
            </div>

            <div className="grid grid-cols-5 gap-4">
                {achievements.map((achievement, index) => (
                    <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative group cursor-pointer ${achievement.unlocked
                                ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 border-2 border-yellow-400 dark:border-yellow-600'
                                : 'bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600'
                            } rounded-2xl p-4 transition-all hover:shadow-lg`}
                    >
                        {/* Badge Icon */}
                        <div className="text-center mb-2">
                            {achievement.unlocked ? (
                                <motion.div
                                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                                    className="text-4xl"
                                >
                                    {achievement.icon}
                                </motion.div>
                            ) : (
                                <div className="text-4xl grayscale opacity-40">
                                    {achievement.icon}
                                </div>
                            )}
                        </div>

                        {/* Badge Name */}
                        <h4 className={`text-xs font-bold text-center mb-1 ${achievement.unlocked
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}>
                            {achievement.name}
                        </h4>

                        {/* Progress Bar */}
                        {!achievement.unlocked && (
                            <div className="mt-2">
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                    <div
                                        className="bg-gradient-to-r from-[#89beab] to-[#6fa893] h-1.5 rounded-full transition-all duration-500"
                                        style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                                    />
                                </div>
                                <p className="text-[10px] text-center text-gray-500 dark:text-gray-400 mt-1">
                                    {achievement.progress}/{achievement.target}
                                </p>
                            </div>
                        )}

                        {/* Unlocked Badge */}
                        {achievement.unlocked && (
                            <div className="absolute top-2 right-2">
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">✓</span>
                                </div>
                            </div>
                        )}

                        {/* Locked Badge */}
                        {!achievement.unlocked && (
                            <div className="absolute top-2 right-2">
                                <Lock className="w-4 h-4 text-gray-400" />
                            </div>
                        )}

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg">
                            <p className="font-semibold mb-1">{achievement.name}</p>
                            <p className="text-gray-300">{achievement.description}</p>
                            {!achievement.unlocked && (
                                <p className="text-yellow-400 mt-1">
                                    Progress: {achievement.progress}/{achievement.target}
                                </p>
                            )}
                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                                <div className="border-4 border-transparent border-t-gray-900"></div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Summary */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                        Unlocked: {achievements.filter(a => a.unlocked).length}/{achievements.length}
                    </span>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-400 rounded"></div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">Unlocked</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">Locked</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AchievementBadges;