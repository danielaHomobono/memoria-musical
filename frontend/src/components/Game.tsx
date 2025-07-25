"use client"

import { useEffect, useState } from "react"
import { searchSounds } from "../services/freesoundService"
import { saveSession, getCurrentUser } from "../api/sessions"

interface Sound {
  id: number
  name: string
  duration: number
  previews: {
    "preview-hq-mp3": string
  }
}

interface Note {
  sound: Sound
  key: string
}

const KEYS = ["A", "S", "D", "F"]
const KEY_LABELS = ["Do", "Re", "Mi", "Fa"]

export default function Game() {
  const [notes, setNotes] = useState<Note[]>([])
  const [sequence, setSequence] = useState<Note[]>([])
  const [userInput, setUserInput] = useState<Note[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const [level, setLevel] = useState(1)
  const [attempts, setAttempts] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)

  // 🧠 Cargar progreso si existe
  useEffect(() => {
    const userId = getCurrentUser()

    if (!userId) {
      console.warn("⚠️ No se encontró userId, no se puede cargar progreso")
      return
    }

    // Obtener última sesión guardada
    fetch(`http://localhost:3000/api/sessions/${userId}`)
      .then((res) => res.json())
      .then((sessions) => {
        if (sessions.length > 0) {
          const lastSession = sessions[0]
          console.log("🧠 Progreso recuperado:", lastSession)

          setAttempts(lastSession.attempts || 0)
          const calculatedLevel = Math.floor(lastSession.matchedPairs / 5) + 1
          setLevel(calculatedLevel)
        } else {
          console.log("ℹ️ No hay progreso previo.")
        }
      })
      .catch((err) => console.error("❌ Error al recuperar progreso:", err))
  }, [])

  // 🎵 Cargar sonidos
  useEffect(() => {
    searchSounds("piano")
      .then((data) => {
        const sounds = data.results.slice(0, KEYS.length)
        const loadedNotes: Note[] = sounds.map((sound: Sound, index: number) => ({
          sound,
          key: KEYS[index],
        }))
        setNotes(loadedNotes)
        setLoading(false)
      })
      .catch(console.error)
  }, [])

  // 🎹 Manejo de teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase()
      if (KEYS.includes(key)) {
        handleKeyPress(key)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [userInput, isPlaying, gameOver, notes])

  const playSound = (note: Note) => {
    const audio = new Audio(note.sound.previews["preview-hq-mp3"])
    setActiveKey(note.key)
    audio.play()
    audio.onended = () => setActiveKey(null)
  }

  const playSequence = async (seq: Note[]) => {
    setIsPlaying(true)
    for (const note of seq) {
      playSound(note)
      await new Promise((res) => setTimeout(res, 1000))
    }
    setIsPlaying(false)
  }

  const startGame = () => {
    if (notes.length < 4) return
    const newSequence = Array.from({ length: level + 2 }, () => notes[Math.floor(Math.random() * notes.length)])
    setSequence(newSequence)
    setUserInput([])
    setGameOver(false)
    setAttempts((prev) => prev + 1)
    setStartTime(Date.now())
    playSequence(newSequence)
  }

  const handleKeyPress = async (key: string) => {
    if (isPlaying || gameOver) return
    const note = notes.find((n) => n.key === key)
    if (!note) return

    playSound(note)
    const currentIndex = userInput.length
    const expectedNote = sequence[currentIndex]

    if (note.key !== expectedNote.key) {
      setGameOver(true)
      return
    }

    const newUserInput = [...userInput, note]
    setUserInput(newUserInput)

    if (newUserInput.length === sequence.length) {
      const duration = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0
      const userId = getCurrentUser()
      console.log("🧠 userId actual:", userId)

      if (userId) {
        try {
          await saveSession({
            userId,
            attempts,
            matchedPairs: sequence.length + (level - 1) * 5, // total acumulado
            duration,
          })
          console.log("✅ Sesión guardada correctamente")
        } catch (err) {
          console.error("❌ Error guardando sesión:", err)
        }
      }

      alert(`¡Ganaste el nivel ${level}! 🎉`)
      setLevel((prev) => prev + 1)
      setAttempts(0)
      setTimeout(startGame, 1000)
    }
  }
  

  if (loading) {
    return (
      <div className="piano-game">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Cargando sonidos mágicos...</p>
        </div>
      </div>
    )
  }
  

  return (
    <div className="piano-game">
      <div className="piano-game-container">
        <h1 className="piano-game-title">🎹 Juego de Memoria Musical</h1>

        <div className="game-stats">
          <div className="stat-card"><div className="stat-label">Nivel</div><div className="stat-value">{level}</div></div>
          <div className="stat-card"><div className="stat-label">Intentos</div><div className="stat-value">{attempts}</div></div>
          <div className="stat-card"><div className="stat-label">Secuencia</div><div className="stat-value">{userInput.length}/{sequence.length}</div></div>
        </div>

        {gameOver ? (
          <div className="game-over">
            <h3>¡Oops! Inténtalo de nuevo 😅</h3>
            <button onClick={startGame} className="retry-button">Reintentar</button>
          </div>
        ) : (
          <button onClick={startGame} disabled={isPlaying} className="start-button">
            {isPlaying ? "Escucha la secuencia..." : "🎵 Empezar Nivel"}
          </button>
        )}

        <div className="piano-container">
          <div className="piano-base">
            <div className="piano-keys">
              {notes.map((note, index) => (
                <button
                  key={note.key}
                  onClick={() => handleKeyPress(note.key)}
                  className={`piano-key ${activeKey === note.key ? "active" : ""}`}
                  disabled={isPlaying}
                >
                  <div className="key-label">{KEY_LABELS[index]}</div>
                  <div className="key-binding">{note.key}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="game-instructions">
          <h3>🎯 Cómo Jugar</h3>
          <p><strong>Objetivo:</strong> Repite la secuencia musical que escuches</p>
          <p><strong>Controles:</strong> Usa las teclas A, S, D, F o haz clic en el piano</p>
          <p><strong>Progreso:</strong> Cada nivel aumenta la longitud de la secuencia</p>
        </div>
      </div>
    </div>
  )
}
