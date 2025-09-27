// src/context/ScoreContext.jsx
import React, { createContext, useContext, useMemo, useReducer } from 'react'

// ---------------- Context ----------------
export const ScoreContext = createContext(null)

// ---------------- Initial State ----------
const initialState = {
  userScore: 0,
  categoryScores: {
    spending: 0,
    saving: 0,
    budgeting: 0,
    goals: 0,
    overall: 0,
  },
  badges: [],
  achievements: [],
  level: 1,
  xp: 0,
  friends: [],        // [{ id, score, level }]
  leaderboard: [],    // [{ handle, score }]
  streaks: {
    budgetStreak: 0,
    goalStreak: 0,
    savingStreak: 0,
  },
  pokemonData: {
    currentPokemon: null,    // { name, level, stats }
    caughtPokemon: [],       // array of pokemon objects
    evolutionProgress: 0,    // 0..100
  },
}

// ---------------- Helpers ----------------
function calculateOverallScore(categoryScores) {
  const scores = [
    categoryScores.spending,
    categoryScores.saving,
    categoryScores.budgeting,
    categoryScores.goals,
  ].filter((s) => s !== 0)

  if (scores.length === 0) return 0
  return scores.reduce((sum, s) => sum + s, 0) / scores.length
}

function evolvePokemon(currentPokemon) {
  if (!currentPokemon) return null
  const evolutions = {
    Budgasaur: 'Savysaur',
    Savysaur: 'Investizard',
    Goalchop: 'Achievechu',
    Achievechu: 'Successachu',
  }
  const nextName = evolutions[currentPokemon.name] || `${currentPokemon.name} Evolved`
  return {
    ...currentPokemon,
    name: nextName,
    level: (currentPokemon.level || 1) + 1,
    stats: {
      ...currentPokemon.stats,
      power: (currentPokemon.stats?.power || 10) + 5,
    },
  }
}

// ---------------- Reducer ----------------
function scoreReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_OVERALL_SCORE': {
      const next = action.payload
      return {
        ...state,
        userScore: next,
        categoryScores: { ...state.categoryScores, overall: next },
      }
    }

    case 'UPDATE_CATEGORY_SCORE': {
      const newCategoryScores = {
        ...state.categoryScores,
        [action.payload.category]: action.payload.score,
      }
      const overallScore = calculateOverallScore(newCategoryScores)
      return {
        ...state,
        categoryScores: newCategoryScores,
        userScore: overallScore,
      }
    }

    case 'ADD_BADGE': {
      return {
        ...state,
        badges: [
          ...state.badges,
          { ...action.payload, earnedAt: new Date() },
        ],
      }
    }

    case 'ADD_ACHIEVEMENT': {
      return {
        ...state,
        achievements: [
          ...state.achievements,
          { ...action.payload, unlockedAt: new Date() },
        ],
      }
    }

    case 'UPDATE_XP': {
      const newXP = state.xp + action.payload
      const newLevel = Math.floor(newXP / 100) + 1
      const leveledUp = newLevel > state.level
      return {
        ...state,
        xp: newXP,
        level: newLevel,
        ...(leveledUp && {
          achievements: [
            ...state.achievements,
            {
              id: `level_${newLevel}`,
              title: `Level ${newLevel} Reached!`,
              description: `Congratulations on reaching level ${newLevel}!`,
              type: 'level',
              unlockedAt: new Date(),
            },
          ],
        }),
      }
    }

    case 'UPDATE_STREAK': {
      const { type, count } = action.payload
      return { ...state, streaks: { ...state.streaks, [type]: count } }
    }

    case 'SET_FRIENDS':
      return { ...state, friends: action.payload }

    case 'UPDATE_LEADERBOARD':
      return { ...state, leaderboard: action.payload }

    case 'CATCH_POKEMON':
      return {
        ...state,
        pokemonData: {
          ...state.pokemonData,
          caughtPokemon: [...state.pokemonData.caughtPokemon, action.payload],
          currentPokemon: action.payload,
        },
      }

    case 'UPDATE_EVOLUTION_PROGRESS': {
      const newProgress = Math.min(
        state.pokemonData.evolutionProgress + action.payload,
        100
      )
      return {
        ...state,
        pokemonData: {
          ...state.pokemonData,
          evolutionProgress: newProgress,
        },
      }
    }

    case 'EVOLVE_POKEMON':
      return {
        ...state,
        pokemonData: {
          ...state.pokemonData,
          currentPokemon: action.payload,
          evolutionProgress: 0,
        },
      }

    default:
      return state
  }
}

// ------------- Provider & API -------------
export function ScoreContextProvider({ children }) {
  const [state, dispatch] = useReducer(scoreReducer, initialState)

  // --- actions (dispatch helpers) ---
  const updateCategoryScore = (category, score) => {
    dispatch({
      type: 'UPDATE_CATEGORY_SCORE',
      payload: { category, score: Math.max(-10, Math.min(10, score)) },
    })
  }

  const addBadge = (badge) => {
    if (!state.badges.find((b) => b.id === badge.id)) {
      dispatch({ type: 'ADD_BADGE', payload: badge })
    }
  }

  const addXP = (amount, reason) => {
    dispatch({ type: 'UPDATE_XP', payload: amount })
    // compute prospective XP using current state to decide badges
    checkForBadges(state.xp + amount, reason)
  }

  const updateStreak = (type, count) => {
    dispatch({ type: 'UPDATE_STREAK', payload: { type, count } })
    if (count > 0 && count % 5 === 0) addXP(10, `${type} streak`)
  }

  const checkForBadges = (totalXP, reason) => {
    const toAdd = []

    if (totalXP >= 100 && !state.badges.find((b) => b.id === 'first_hundred')) {
      toAdd.push({
        id: 'first_hundred',
        title: 'First Hundred',
        description: 'Earned your first 100 XP!',
        icon: '💯',
        rarity: 'common',
      })
    }
    if (totalXP >= 500 && !state.badges.find((b) => b.id === 'high_achiever')) {
      toAdd.push({
        id: 'high_achiever',
        title: 'High Achiever',
        description: 'Reached 500 XP!',
        icon: '🏆',
        rarity: 'rare',
      })
    }
    if (
      reason === 'budget adherence' &&
      !state.badges.find((b) => b.id === 'budget_master')
    ) {
      toAdd.push({
        id: 'budget_master',
        title: 'Budget Master',
        description: 'Consistently stayed within budget!',
        icon: '📊',
        rarity: 'uncommon',
      })
    }

    toAdd.forEach(addBadge)
  }

  const catchPokemon = (pokemon) => {
    dispatch({ type: 'CATCH_POKEMON', payload: pokemon })
    addXP(25, 'pokemon catch')
  }

  const updateEvolutionProgress = (progress) => {
    dispatch({ type: 'UPDATE_EVOLUTION_PROGRESS', payload: progress })

    const projected = state.pokemonData.evolutionProgress + progress
    if (projected >= 100 && state.pokemonData.currentPokemon) {
      const evolved = evolvePokemon(state.pokemonData.currentPokemon)
      if (evolved) {
        dispatch({ type: 'EVOLVE_POKEMON', payload: evolved })
        addXP(50, 'pokemon evolution')
      }
    }
  }

  const compareWithFriends = (friendId) => {
    const friend = state.friends.find((f) => f.id === friendId)
    if (!friend) return null
    return {
      myScore: state.userScore,
      friendScore: friend.score,
      difference: state.userScore - friend.score,
      myLevel: state.level,
      friendLevel: friend.level,
      comparison:
        state.userScore > friend.score
          ? 'ahead'
          : state.userScore < friend.score
          ? 'behind'
          : 'tied',
    }
  }

  const getScoreDescription = (score, category) => {
    if (score >= 7) return `Excellent ${category} habits!`
    if (score >= 4) return `Good ${category} progress`
    if (score >= 0) return `Fair ${category} performance`
    if (score >= -4) return `Needs improvement in ${category}`
    return `Critical ${category} issues`
  }

  const getScoreColor = (score) => {
    if (score >= 7) return 'var(--score-excellent)'
    if (score >= 4) return 'var(--score-good)'
    if (score >= 0) return 'var(--score-fair)'
    return 'var(--score-poor)'
  }

  const getScoreBreakdown = () => ({
    spending: {
      score: state.categoryScores.spending,
      description: getScoreDescription(state.categoryScores.spending, 'spending'),
      color: getScoreColor(state.categoryScores.spending),
    },
    saving: {
      score: state.categoryScores.saving,
      description: getScoreDescription(state.categoryScores.saving, 'saving'),
      color: getScoreColor(state.categoryScores.saving),
    },
    budgeting: {
      score: state.categoryScores.budgeting,
      description: getScoreDescription(state.categoryScores.budgeting, 'budgeting'),
      color: getScoreColor(state.categoryScores.budgeting),
    },
    goals: {
      score: state.categoryScores.goals,
      description: getScoreDescription(state.categoryScores.goals, 'goals'),
      color: getScoreColor(state.categoryScores.goals),
    },
  })

  const value = useMemo(
    () => ({
      ...state,
      updateCategoryScore,
      addXP,
      addBadge,
      updateStreak,
      catchPokemon,
      updateEvolutionProgress,
      compareWithFriends,
      getScoreBreakdown,
      dispatch,
    }),
    [state]
  )

  return <ScoreContext.Provider value={value}>{children}</ScoreContext.Provider>
}

// ------------- Convenience Hook ----------
export const useScoreContext = () => {
  const ctx = useContext(ScoreContext)
  if (!ctx) {
    console.error('useScoreContext must be used within ScoreContextProvider')
  }
  return ctx
}
