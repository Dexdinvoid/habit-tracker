import { LeagueTier, LEAGUES } from './types';

export const calculateLeague = (points: number): { tier: LeagueTier; rank: 1 | 2 | 3 } => {
    // Find the league where points fit in the range
    // If points exceed the highest league (Radiant), return Radiant
    const league = LEAGUES.find(l => points >= l.minPoints && points <= l.maxPoints)
        || LEAGUES[LEAGUES.length - 1]; // Fallback to highest (Radiant) or Unranked?

    // Handle Radiant case (infinity) and fallback
    if (!league) return { tier: 'unranked', rank: 1 };

    // Calculate Rank (1, 2, 3) within the tier
    // 1 = High, 3 = Low (e.g., Gold I > Gold III) - OR standard III > I? 
    // Usually I is highest. Let's assume standard:
    // Lower 1/3 of range = III
    // Mid 1/3 of range = II
    // Upper 1/3 of range = I

    if (league.maxPoints === Infinity) return { tier: league.tier, rank: 1 };

    const range = league.maxPoints - league.minPoints;
    const progress = points - league.minPoints;

    // Split range into 3 parts
    const third = range / 3;

    if (progress < third) return { tier: league.tier, rank: 3 };
    if (progress < third * 2) return { tier: league.tier, rank: 2 };
    return { tier: league.tier, rank: 1 };
};
