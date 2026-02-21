// import { Challenge } from "../models/Challenge.js";
// import { User } from "../models/User.js";

// // Get all active challenges
// export const getAllChallenges = async (req, res) => {
//     try {
//         const { category, status = "active", page = 1, limit = 10 } = req.query;

//         const query = { isActive: true };

//         // Filter by status
//         const now = new Date();
//         if (status === "active") {
//             query.startDate = { $lte: now };
//             query.endDate = { $gte: now };
//         } else if (status === "upcoming") {
//             query.startDate = { $gt: now };
//         } else if (status === "completed") {
//             query.endDate = { $lt: now };
//         }

//         if (category && category !== "all") {
//             query.category = category;
//         }

//         const challenges = await Challenge.find(query)
//             .populate('createdBy', 'firstName lastName')
//             .sort({ isFeatured: -1, startDate: -1 })
//             .limit(limit * 1)
//             .skip((page - 1) * limit)
//             .lean();

//         const count = await Challenge.countDocuments(query);

//         res.status(200).json({
//             challenges,
//             totalPages: Math.ceil(count / limit),
//             currentPage: page,
//             total: count
//         });
//     } catch (error) {
//         console.error("Error fetching challenges:", error);
//         res.status(500).json({ error: "Failed to fetch challenges" });
//     }
// };

// // Get single challenge by ID
// export const getChallengeById = async (req, res) => {
//     try {
//         const { challengeId } = req.params;

//         const challenge = await Challenge.findById(challengeId)
//             .populate('createdBy', 'firstName lastName')
//             .populate('participants.userId', 'firstName lastName')
//             .lean();

//         if (!challenge) {
//             return res.status(404).json({ error: "Challenge not found" });
//         }

//         res.status(200).json({ challenge });
//     } catch (error) {
//         console.error("Error fetching challenge:", error);
//         res.status(500).json({ error: "Failed to fetch challenge" });
//     }
// };

// // Get user's joined challenges
// export const getUserChallenges = async (req, res) => {
//     try {
//         const userId = req.user.id;

//         const challenges = await Challenge.find({
//             'participants.userId': userId,
//             isActive: true
//         })
//             .populate('createdBy', 'firstName lastName')
//             .sort({ startDate: -1 })
//             .lean();

//         res.status(200).json({ challenges });
//     } catch (error) {
//         console.error("Error fetching user challenges:", error);
//         res.status(500).json({ error: "Failed to fetch challenges" });
//     }
// };

// // Join a challenge
// export const joinChallenge = async (req, res) => {
//     try {
//         const { challengeId } = req.params;
//         const userId = req.user.id;

//         const challenge = await Challenge.findById(challengeId);

//         if (!challenge) {
//             return res.status(404).json({ error: "Challenge not found" });
//         }

//         if (!challenge.isActive) {
//             return res.status(403).json({ error: "This challenge is not active" });
//         }

//         // Check if challenge has ended
//         if (new Date() > challenge.endDate) {
//             return res.status(400).json({ error: "This challenge has ended" });
//         }

//         // Check if already participating
//         const isParticipant = challenge.participants.some(
//             p => p.userId.toString() === userId
//         );

//         if (isParticipant) {
//             return res.status(400).json({ error: "You are already participating in this challenge" });
//         }

//         // Check if challenge is full
//         if (challenge.maxParticipants && challenge.participants.length >= challenge.maxParticipants) {
//             return res.status(400).json({ error: "This challenge is full" });
//         }

//         challenge.participants.push({
//             userId,
//             joinedAt: Date.now(),
//             progress: 0,
//             completedDays: [],
//             isCompleted: false
//         });

//         await challenge.save();
//         await challenge.populate('createdBy', 'firstName lastName');
//         await challenge.populate('participants.userId', 'firstName lastName');

//         res.status(200).json({
//             message: "Successfully joined the challenge",
//             challenge
//         });
//     } catch (error) {
//         console.error("Error joining challenge:", error);
//         res.status(500).json({ error: "Failed to join challenge" });
//     }
// };

// // Leave a challenge
// export const leaveChallenge = async (req, res) => {
//     try {
//         const { challengeId } = req.params;
//         const userId = req.user.id;

//         const challenge = await Challenge.findById(challengeId);

//         if (!challenge) {
//             return res.status(404).json({ error: "Challenge not found" });
//         }

//         const participantIndex = challenge.participants.findIndex(
//             p => p.userId.toString() === userId
//         );

//         if (participantIndex === -1) {
//             return res.status(400).json({ error: "You are not participating in this challenge" });
//         }

//         challenge.participants.splice(participantIndex, 1);
//         await challenge.save();

//         res.status(200).json({ message: "Successfully left the challenge" });
//     } catch (error) {
//         console.error("Error leaving challenge:", error);
//         res.status(500).json({ error: "Failed to leave challenge" });
//     }
// };

// // Update challenge progress
// export const updateChallengeProgress = async (req, res) => {
//     try {
//         const { challengeId } = req.params;
//         const { completed } = req.body; // boolean: did user complete today's goal?
//         const userId = req.user.id;

//         const challenge = await Challenge.findById(challengeId);

//         if (!challenge) {
//             return res.status(404).json({ error: "Challenge not found" });
//         }

//         const participant = challenge.participants.find(
//             p => p.userId.toString() === userId
//         );

//         if (!participant) {
//             return res.status(400).json({ error: "You are not participating in this challenge" });
//         }

//         const today = new Date().toISOString().split('T')[0];

//         // Check if already logged today
//         const alreadyLogged = participant.completedDays.some(
//             date => new Date(date).toISOString().split('T')[0] === today
//         );

//         if (alreadyLogged) {
//             return res.status(400).json({ error: "Progress already logged for today" });
//         }

//         if (completed) {
//             participant.completedDays.push(new Date());

//             // Calculate progress percentage
//             const totalDays = challenge.duration;
//             const completedDays = participant.completedDays.length;
//             participant.progress = Math.round((completedDays / totalDays) * 100);

//             // Check if challenge is completed
//             if (participant.progress >= 100) {
//                 participant.isCompleted = true;
//                 participant.completedAt = Date.now();
//             }
//         }

//         await challenge.save();
//         await challenge.populate('createdBy', 'firstName lastName');

//         res.status(200).json({
//             message: completed ? "Progress updated!" : "No progress logged",
//             challenge,
//             participant
//         });
//     } catch (error) {
//         console.error("Error updating challenge progress:", error);
//         res.status(500).json({ error: "Failed to update progress" });
//     }
// };

// // Get challenge leaderboard
// export const getChallengeLeaderboard = async (req, res) => {
//     try {
//         const { challengeId } = req.params;

//         const challenge = await Challenge.findById(challengeId)
//             .populate('participants.userId', 'firstName lastName')
//             .lean();

//         if (!challenge) {
//             return res.status(404).json({ error: "Challenge not found" });
//         }

//         // Sort participants by progress
//         const leaderboard = challenge.participants
//             .sort((a, b) => b.progress - a.progress)
//             .slice(0, 10); // Top 10

//         res.status(200).json({
//             leaderboard,
//             challengeName: challenge.title
//         });
//     } catch (error) {
//         console.error("Error fetching leaderboard:", error);
//         res.status(500).json({ error: "Failed to fetch leaderboard" });
//     }
// };

// // Create a new challenge (admin only)
// export const createChallenge = async (req, res) => {
//     try {
//         const {
//             title,
//             description,
//             type,
//             category,
//             icon,
//             duration,
//             startDate,
//             rules,
//             dailyGoal,
//             maxParticipants,
//             rewards
//         } = req.body;

//         const userId = req.user.id;

//         if (!title || !description || !type || !category || !duration || !startDate) {
//             return res.status(400).json({
//                 error: "Title, description, type, category, duration, and start date are required"
//             });
//         }

//         // Calculate end date
//         const start = new Date(startDate);
//         const end = new Date(start);
//         end.setDate(end.getDate() + duration);

//         const newChallenge = new Challenge({
//             title: title.trim(),
//             description: description.trim(),
//             type,
//             category,
//             icon: icon || "🎯",
//             duration,
//             startDate: start,
//             endDate: end,
//             rules: rules || [],
//             dailyGoal: dailyGoal || {},
//             maxParticipants: maxParticipants || null,
//             rewards: rewards || { badge: "🏆", points: 100 },
//             createdBy: userId,
//             isActive: true
//         });

//         await newChallenge.save();
//         await newChallenge.populate('createdBy', 'firstName lastName');

//         res.status(201).json({
//             message: "Challenge created successfully",
//             challenge: newChallenge
//         });
//     } catch (error) {
//         console.error("Error creating challenge:", error);
//         res.status(500).json({ error: "Failed to create challenge" });
//     }
// };

// // Update challenge (admin only)
// export const updateChallenge = async (req, res) => {
//     try {
//         const { challengeId } = req.params;
//         const updateData = req.body;

//         const challenge = await Challenge.findById(challengeId);

//         if (!challenge) {
//             return res.status(404).json({ error: "Challenge not found" });
//         }

//         // Update allowed fields
//         const allowedFields = ['title', 'description', 'rules', 'dailyGoal', 'isFeatured', 'isActive'];
//         allowedFields.forEach(field => {
//             if (updateData[field] !== undefined) {
//                 challenge[field] = updateData[field];
//             }
//         });

//         await challenge.save();
//         await challenge.populate('createdBy', 'firstName lastName');

//         res.status(200).json({
//             message: "Challenge updated successfully",
//             challenge
//         });
//     } catch (error) {
//         console.error("Error updating challenge:", error);
//         res.status(500).json({ error: "Failed to update challenge" });
//     }
// };

// // Delete challenge (admin only)
// export const deleteChallenge = async (req, res) => {
//     try {
//         const { challengeId } = req.params;

//         const challenge = await Challenge.findById(challengeId);

//         if (!challenge) {
//             return res.status(404).json({ error: "Challenge not found" });
//         }

//         // Soft delete
//         challenge.isActive = false;
//         await challenge.save();

//         res.status(200).json({ message: "Challenge deactivated successfully" });
//     } catch (error) {
//         console.error("Error deleting challenge:", error);
//         res.status(500).json({ error: "Failed to delete challenge" });
//     }
// };

// // Get challenge statistics (admin only)
// export const getChallengeStats = async (req, res) => {
//     try {
//         const { challengeId } = req.params;

//         const challenge = await Challenge.findById(challengeId).lean();

//         if (!challenge) {
//             return res.status(404).json({ error: "Challenge not found" });
//         }

//         const stats = {
//             totalParticipants: challenge.participants.length,
//             completedParticipants: challenge.participants.filter(p => p.isCompleted).length,
//             averageProgress: challenge.participants.length > 0
//                 ? Math.round(challenge.participants.reduce((sum, p) => sum + p.progress, 0) / challenge.participants.length)
//                 : 0,
//             activeParticipants: challenge.participants.filter(p => !p.isCompleted && p.progress > 0).length
//         };

//         res.status(200).json({ stats });
//     } catch (error) {
//         console.error("Error fetching challenge stats:", error);
//         res.status(500).json({ error: "Failed to fetch statistics" });
//     }
// };
import { Challenge } from "../models/Challenge.js";
import { User } from "../models/User.js";

// Get all active challenges
export const getAllChallenges = async (req, res) => {
    try {
        const { category, status = "active", page = 1, limit = 10 } = req.query;

        const query = { isActive: true };

        // Filter by status
        const now = new Date();

        
        if (status === "active") {
            query.startDate = { $lte: now };
            query.endDate = { $gte: now };
        } else if (status === "upcoming") {
            query.startDate = { $gt: now };
        } else if (status === "completed") {
            query.endDate = { $lt: now };
        }

        if (category && category !== "all") {
            query.category = category;
        }

        const challenges = await Challenge.find(query)
            .populate('createdBy', 'firstName lastName')
            .sort({ isFeatured: -1, startDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Challenge.countDocuments(query);

        // Convert to plain objects WITH virtuals
        const challengesData = challenges.map(c => c.toObject());

        res.status(200).json({
            challenges: challengesData,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        console.error("Error fetching challenges:", error);
        res.status(500).json({ error: "Failed to fetch challenges" });
    }
};

// Get single challenge by ID
export const getChallengeById = async (req, res) => {
    try {
        const { challengeId } = req.params;

        const challenge = await Challenge.findById(challengeId)
            .populate('createdBy', 'firstName lastName')
            .populate('participants.userId', 'firstName lastName');

        if (!challenge) {
            return res.status(404).json({ error: "Challenge not found" });
        }

        res.status(200).json({ challenge: challenge.toObject() });
    } catch (error) {
        console.error("Error fetching challenge:", error);
        res.status(500).json({ error: "Failed to fetch challenge" });
    }
};

// Get user's joined challenges
export const getUserChallenges = async (req, res) => {
    try {
        const userId = req.user.id;

        const challenges = await Challenge.find({
            'participants.userId': userId,
            isActive: true
        })
            .populate('createdBy', 'firstName lastName')
            .sort({ startDate: -1 });

        res.status(200).json({
            challenges: challenges.map(c => c.toObject())
        });
    } catch (error) {
        console.error("Error fetching user challenges:", error);
        res.status(500).json({ error: "Failed to fetch challenges" });
    }
};

// Join a challenge
export const joinChallenge = async (req, res) => {
    try {
        const { challengeId } = req.params;
        const userId = req.user.id;

        const challenge = await Challenge.findById(challengeId);

        if (!challenge) {
            return res.status(404).json({ error: "Challenge not found" });
        }

        if (!challenge.isActive) {
            return res.status(403).json({ error: "This challenge is not active" });
        }

        // Check if challenge has ended
        if (new Date() > challenge.endDate) {
            return res.status(400).json({ error: "This challenge has ended" });
        }

        // Check if already participating
        const isParticipant = challenge.participants.some(
            p => p.userId.toString() === userId
        );

        if (isParticipant) {
            return res.status(400).json({ error: "You are already participating in this challenge" });
        }

        // Check if challenge is full
        if (challenge.maxParticipants && challenge.participants.length >= challenge.maxParticipants) {
            return res.status(400).json({ error: "This challenge is full" });
        }

        challenge.participants.push({
            userId,
            joinedAt: Date.now(),
            progress: 0,
            completedDays: [],
            isCompleted: false
        });

        await challenge.save();
        await challenge.populate('createdBy', 'firstName lastName');
        await challenge.populate('participants.userId', 'firstName lastName');

        res.status(200).json({
            message: "Successfully joined the challenge",
            challenge: challenge.toObject()
        });
    } catch (error) {
        console.error("Error joining challenge:", error);
        res.status(500).json({ error: "Failed to join challenge" });
    }
};

// Leave a challenge
export const leaveChallenge = async (req, res) => {
    try {
        const { challengeId } = req.params;
        const userId = req.user.id;

        const challenge = await Challenge.findById(challengeId);

        if (!challenge) {
            return res.status(404).json({ error: "Challenge not found" });
        }

        const participantIndex = challenge.participants.findIndex(
            p => p.userId.toString() === userId
        );

        if (participantIndex === -1) {
            return res.status(400).json({ error: "You are not participating in this challenge" });
        }

        challenge.participants.splice(participantIndex, 1);
        await challenge.save();

        res.status(200).json({ message: "Successfully left the challenge" });
    } catch (error) {
        console.error("Error leaving challenge:", error);
        res.status(500).json({ error: "Failed to leave challenge" });
    }
};

// Update challenge progress
export const updateChallengeProgress = async (req, res) => {
    try {
        const { challengeId } = req.params;
        const { completed } = req.body; // boolean: did user complete today's goal?
        const userId = req.user.id;

        const challenge = await Challenge.findById(challengeId);

        if (!challenge) {
            return res.status(404).json({ error: "Challenge not found" });
        }

        const participant = challenge.participants.find(
            p => p.userId.toString() === userId
        );

        if (!participant) {
            return res.status(400).json({ error: "You are not participating in this challenge" });
        }

        const today = new Date().toISOString().split('T')[0];

        // Check if already logged today
        const alreadyLogged = participant.completedDays.some(
            date => new Date(date).toISOString().split('T')[0] === today
        );

        if (alreadyLogged) {
            return res.status(400).json({ error: "Progress already logged for today" });
        }

        if (completed) {
            participant.completedDays.push(new Date());

            // Calculate progress percentage
            const totalDays = challenge.duration;
            const completedDays = participant.completedDays.length;
            participant.progress = Math.round((completedDays / totalDays) * 100);

            // Check if challenge is completed
            if (participant.progress >= 100) {
                participant.isCompleted = true;
                participant.completedAt = Date.now();
            }
        }

        await challenge.save();
        await challenge.populate('createdBy', 'firstName lastName');

        res.status(200).json({
            message: completed ? "Progress updated!" : "No progress logged",
            challenge: challenge.toObject(),
            participant
        });
    } catch (error) {
        console.error("Error updating challenge progress:", error);
        res.status(500).json({ error: "Failed to update progress" });
    }
};

// Get challenge leaderboard
export const getChallengeLeaderboard = async (req, res) => {
    try {
        const { challengeId } = req.params;

        const challenge = await Challenge.findById(challengeId)
            .populate('participants.userId', 'firstName lastName');

        if (!challenge) {
            return res.status(404).json({ error: "Challenge not found" });
        }

        // Sort participants by progress
        const leaderboard = challenge.participants
            .sort((a, b) => b.progress - a.progress)
            .slice(0, 10); // Top 10

        res.status(200).json({
            leaderboard,
            challengeName: challenge.title
        });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
};

// Create a new challenge (admin only)
export const createChallenge = async (req, res) => {
    try {
        const {
            title,
            description,
            type,
            category,
            icon,
            duration,
            startDate,
            rules,
            dailyGoal,
            maxParticipants,
            rewards
        } = req.body;

        const userId = req.user.id;

        if (!title || !description || !type || !category || !duration || !startDate) {
            return res.status(400).json({
                error: "Title, description, type, category, duration, and start date are required"
            });
        }

        // Calculate end date
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(end.getDate() + duration);

        const newChallenge = new Challenge({
            title: title.trim(),
            description: description.trim(),
            type,
            category,
            icon: icon || "🎯",
            duration,
            startDate: start,
            endDate: end,
            rules: rules || [],
            dailyGoal: dailyGoal || {},
            maxParticipants: maxParticipants || null,
            rewards: rewards || { badge: "🏆", points: 100 },
            createdBy: userId,
            isActive: true
        });

        await newChallenge.save();
        await newChallenge.populate('createdBy', 'firstName lastName');

        res.status(201).json({
            message: "Challenge created successfully",
            challenge: newChallenge.toObject()
        });
    } catch (error) {
        console.error("Error creating challenge:", error);
        res.status(500).json({ error: "Failed to create challenge" });
    }
};

// Update challenge (admin only)
export const updateChallenge = async (req, res) => {
    try {
        const { challengeId } = req.params;
        const updateData = req.body;

        const challenge = await Challenge.findById(challengeId);

        if (!challenge) {
            return res.status(404).json({ error: "Challenge not found" });
        }

        // Update allowed fields
        const allowedFields = ['title', 'description', 'rules', 'dailyGoal', 'isFeatured', 'isActive'];
        allowedFields.forEach(field => {
            if (updateData[field] !== undefined) {
                challenge[field] = updateData[field];
            }
        });

        await challenge.save();
        await challenge.populate('createdBy', 'firstName lastName');

        res.status(200).json({
            message: "Challenge updated successfully",
            challenge: challenge.toObject()
        });
    } catch (error) {
        console.error("Error updating challenge:", error);
        res.status(500).json({ error: "Failed to update challenge" });
    }
};

// Delete challenge (admin only)
export const deleteChallenge = async (req, res) => {
    try {
        const { challengeId } = req.params;

        const challenge = await Challenge.findById(challengeId);

        if (!challenge) {
            return res.status(404).json({ error: "Challenge not found" });
        }

        // Soft delete
        challenge.isActive = false;
        await challenge.save();

        res.status(200).json({ message: "Challenge deactivated successfully" });
    } catch (error) {
        console.error("Error deleting challenge:", error);
        res.status(500).json({ error: "Failed to delete challenge" });
    }
};

// Get challenge statistics (admin only)
export const getChallengeStats = async (req, res) => {
    try {
        const { challengeId } = req.params;

        const challenge = await Challenge.findById(challengeId);

        if (!challenge) {
            return res.status(404).json({ error: "Challenge not found" });
        }

        const stats = {
            totalParticipants: challenge.participants.length,
            completedParticipants: challenge.participants.filter(p => p.isCompleted).length,
            averageProgress: challenge.participants.length > 0
                ? Math.round(challenge.participants.reduce((sum, p) => sum + p.progress, 0) / challenge.participants.length)
                : 0,
            activeParticipants: challenge.participants.filter(p => !p.isCompleted && p.progress > 0).length
        };

        res.status(200).json({ stats });
    } catch (error) {
        console.error("Error fetching challenge stats:", error);
        res.status(500).json({ error: "Failed to fetch statistics" });
    }
};