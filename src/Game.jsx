import { useState, useCallback, useRef, useEffect } from 'react';
import useGameLoop from './useGameLoop';
import Student from './Student';
import Obstacle, { OBSTACLES } from './Obstacle';

const GROUND_Y = 60;
const STUDENT_X = 60;
const STUDENT_W = 32;
const STUDENT_H = 48;
const GRAVITY = 2200;
const JUMP_VEL = -700;
const BASE_SPEED = 280;
const OBSTACLE_TYPES = ['assignment', 'coffee', 'wifi', 'prof'];

const RANDOM_EVENTS = [
  { msg: '📢 Lab Cancelled!', effect: 'slow', color: '#22c55e' },
  { msg: '⚡ Assignment Due in 5min!', effect: 'fast', color: '#ef4444' },
  { msg: '☕ Free Coffee!', effect: 'slow', color: '#f59e0b' },
  { msg: '📶 WiFi Restored!', effect: 'normal', color: '#3b82f6' },
  { msg: '😤 Prof is Watching!', effect: 'fast', color: '#a855f7' },
];

let obstacleId = 0;

function getInitialState() {
  return {
    phase: 'idle',
    studentY: 0,
    velocityY: 0,
    isJumping: false,
    obstacles: [],
    score: 0,
    speed: BASE_SPEED,
    combo: 0,
    activeEvent: null,
    eventTimer: 0,
    nextObstacleIn: 1.5,
    groundOffset: 0,
    bgOffset: 0,
    shaking: false,
    highScore: 0,
  };
}

export default function Game() {
  const [state, setState] = useState(getInitialState());
  const stateRef = useRef(state);
  const highScoreRef = useRef(
    parseInt(localStorage.getItem('dd_hs') || '0', 10)
  );

  useEffect(() => { stateRef.current = state; }, [state]);

  const jump = useCallback(() => {
    const s = stateRef.current;
    if (s.phase === 'idle') {
      setState(prev => ({ ...prev, phase: 'playing' }));
      return;
    }
    if (s.phase === 'dead') {
      setState({ ...getInitialState(), highScore: highScoreRef.current, phase: 'idle' });
      return;
    }
    if (s.phase === 'playing' && !s.isJumping) {
      setState(prev => ({ ...prev, velocityY: JUMP_VEL, isJumping: true }));
    }
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jump(); } };
    const onTouch = (e) => { e.preventDefault(); jump(); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouch, { passive: false });
    window.addEventListener('mousedown', jump);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('mousedown', jump);
    };
  }, [jump]);

  const tick = useCallback((dt) => {
    setState(prev => {
      if (prev.phase !== 'playing') return prev;

      let {
        studentY, velocityY, isJumping, obstacles,
        score, speed, combo, activeEvent, eventTimer,
        nextObstacleIn, groundOffset, bgOffset, shaking
      } = prev;

      // Physics
      velocityY += GRAVITY * dt;
      studentY += velocityY * dt;
      if (studentY >= 0) { studentY = 0; velocityY = 0; isJumping = false; }

      // Score
      score += dt * (speed / BASE_SPEED) * 10;

      // Speed ramp
      speed = Math.min(BASE_SPEED + score * 0.8, BASE_SPEED * 3);

      // Event modifier
      let speedMod = 1;
      if (activeEvent) {
        if (activeEvent.effect === 'slow') speedMod = 0.6;
        if (activeEvent.effect === 'fast') speedMod = 1.5;
        eventTimer -= dt;
        if (eventTimer <= 0) activeEvent = null;
      }

      const effectiveSpeed = speed * speedMod;

      // Ground scroll
      groundOffset = (groundOffset + effectiveSpeed * dt) % 64;
      bgOffset = (bgOffset + effectiveSpeed * 0.3 * dt) % 200;

      // Obstacles
      nextObstacleIn -= dt;
      let newObstacles = obstacles
        .map(o => ({ ...o, x: o.x - effectiveSpeed * dt }))
        .filter(o => o.x > -100);

      if (nextObstacleIn <= 0) {
        const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
        newObstacles.push({ id: obstacleId++, type, x: 420 });
        const gap = 0.8 + Math.random() * 1.2 - Math.min(combo * 0.05, 0.4);
        nextObstacleIn = gap;

        // Random event chance
        if (Math.random() < 0.25 && !activeEvent) {
          const ev = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
          activeEvent = ev;
          eventTimer = 3;
        }
      }

      // Collision detection
      const sw = STUDENT_W - 8, sh = STUDENT_H - 8;
      const sx1 = STUDENT_X + 4, sy1 = -studentY + 4;
      const sx2 = sx1 + sw, sy2 = sy1 + sh;

      let dead = false;
      let newCombo = combo;

      for (const obs of newObstacles) {
        const od = OBSTACLES[obs.type];
        const ox1 = obs.x + 4, oy1 = GROUND_Y - od.height + 4 + 8;
        const ox2 = obs.x + od.width - 4, oy2 = GROUND_Y + 4;

        if (sx2 > ox1 && sx1 < ox2 && sy2 > oy1 && sy1 < oy2) {
          dead = true;
          break;
        }

        // Combo: passed an obstacle
        if (obs.x + od.width < STUDENT_X && !obs.passed) {
          obs.passed = true;
          newCombo += 1;
        }
      }

      if (dead) {
        const finalScore = Math.floor(score);
        if (finalScore > highScoreRef.current) {
          highScoreRef.current = finalScore;
          localStorage.setItem('dd_hs', finalScore);
        }
        return { ...prev, phase: 'dead', score, shaking: true };
      }

      return {
        ...prev,
        studentY, velocityY, isJumping,
        obstacles: newObstacles,
        score, speed, combo: newCombo,
        activeEvent, eventTimer,
        nextObstacleIn,
        groundOffset, bgOffset,
        shaking: false,
      };
    });
  }, []);

  useGameLoop(tick, state.phase === 'playing');

  const { phase, studentY, isJumping, obstacles, score, combo, activeEvent, groundOffset, bgOffset, shaking } = state;
  const hs = highScoreRef.current;

  const comboGlow = combo >= 5;
  const pct = Math.min(Math.floor(score), 100);

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        background: '#0f0f1a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Press Start 2P', monospace",
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Stars background */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'
      }}>
        {[...Array(30)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: i % 3 === 0 ? 2 : 1,
            height: i % 3 === 0 ? 2 : 1,
            background: '#fff',
            borderRadius: '50%',
            left: `${(i * 37 + 13) % 100}%`,
            top: `${(i * 53 + 7) % 60}%`,
            opacity: 0.3 + (i % 5) * 0.12,
          }} />
        ))}
      </div>

      {/* HUD */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        padding: '12px 16px',
        zIndex: 10,
      }}>
        <div>
          <div style={{ fontSize: 8, color: '#facc15', marginBottom: 4 }}>SCORE</div>
          <div style={{ fontSize: 14, color: '#fff' }}>{Math.floor(score).toString().padStart(5, '0')}</div>
        </div>

        {combo >= 3 && (
          <div style={{
            background: comboGlow ? '#facc15' : '#fef08a',
            color: '#1a0a00',
            padding: '4px 8px',
            fontSize: 8,
            borderRadius: 4,
            animation: comboGlow ? 'pulse-glow 1s infinite' : 'none',
          }}>
            {combo}x COMBO!
          </div>
        )}

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 8, color: '#94a3b8', marginBottom: 4 }}>BEST</div>
          <div style={{ fontSize: 14, color: '#94a3b8' }}>{hs.toString().padStart(5, '0')}</div>
        </div>
      </div>

      {/* Deadline meter */}
      {phase === 'playing' && (
        <div style={{
          position: 'absolute', top: 60, left: 16, right: 16,
          zIndex: 10,
        }}>
          <div style={{ fontSize: 6, color: '#ef4444', marginBottom: 4 }}>
            ⏰ DEADLINE APPROACHING...
          </div>
          <div style={{
            height: 6, background: '#1e293b', borderRadius: 3, overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${Math.min(score / 5, 100)}%`,
              background: score > 350 ? '#ef4444' : score > 200 ? '#f59e0b' : '#22c55e',
              borderRadius: 3,
              transition: 'width 0.1s linear',
            }} />
          </div>
        </div>
      )}

      {/* Event banner */}
      {activeEvent && (
        <div
          key={activeEvent.msg}
          style={{
            position: 'absolute',
            top: 90,
            left: '50%',
            transform: 'translateX(-50%)',
            background: activeEvent.color,
            color: '#fff',
            padding: '6px 14px',
            fontSize: 8,
            borderRadius: 4,
            zIndex: 20,
            whiteSpace: 'nowrap',
            animation: 'float-up 2.5s ease-out forwards',
          }}
        >
          {activeEvent.msg}
        </div>
      )}

      {/* Game canvas */}
      <div
        className={shaking ? 'shake' : ''}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 430,
          height: 200,
          overflow: 'hidden',
        }}
      >
        {/* Distant buildings */}
        <div style={{
          position: 'absolute', bottom: GROUND_Y, left: 0, right: 0,
          height: 80, display: 'flex', alignItems: 'flex-end', gap: 8,
          transform: `translateX(-${bgOffset % 200}px)`,
          width: '200%',
        }}>
          {[...Array(12)].map((_, i) => (
            <div key={i} style={{
              width: 20 + (i % 4) * 10,
              height: 30 + (i % 5) * 15,
              background: `hsl(${220 + i * 8}, 30%, ${12 + i % 4 * 3}%)`,
              borderRadius: '2px 2px 0 0',
              flexShrink: 0,
            }}>
              {[...Array(3)].map((_, w) => (
                <div key={w} style={{
                  width: 3, height: 3,
                  background: Math.random() > 0.5 ? '#facc1588' : 'transparent',
                  margin: '4px auto',
                }} />
              ))}
            </div>
          ))}
        </div>

        {/* Ground */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: GROUND_Y,
          background: '#1e293b',
          borderTop: '3px solid #334155',
        }}>
          {/* Dashes on ground */}
          <div style={{
            position: 'absolute', top: 6, left: 0, right: 0,
            height: 2, display: 'flex', gap: 16,
            transform: `translateX(-${groundOffset}px)`,
            width: '200%',
          }}>
            {[...Array(20)].map((_, i) => (
              <div key={i} style={{ width: 32, height: 2, background: '#475569', flexShrink: 0 }} />
            ))}
          </div>
        </div>

        {/* Student */}
        <div
          style={{
            position: 'absolute',
            left: STUDENT_X,
            bottom: GROUND_Y - studentY,
            transition: 'none',
          }}
          className={comboGlow ? 'glow' : ''}
        >
          <Student isJumping={isJumping} isDead={phase === 'dead'} />
        </div>

        {/* Obstacles */}
        {obstacles.map(obs => (
          <Obstacle key={obs.id} type={obs.type} x={obs.x} groundY={GROUND_Y} />
        ))}
      </div>

      {/* IDLE screen */}
      {phase === 'idle' && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#0f0f1a',
          zIndex: 30, gap: 16,
        }}>
          <div style={{ fontSize: 22, color: '#facc15', textAlign: 'center', lineHeight: 1.8 }}>
            DEADLINE
          </div>
          <div style={{ fontSize: 22, color: '#fff', textAlign: 'center', lineHeight: 1.8 }}>
            DASH 🎓
          </div>
          <div style={{ fontSize: 7, color: '#94a3b8', textAlign: 'center', maxWidth: 240, lineHeight: 2 }}>
            Jump over assignments, coffee cups, wifi dead zones & professors
          </div>
          {hs > 0 && (
            <div style={{ fontSize: 8, color: '#facc15' }}>BEST: {hs}</div>
          )}
          <div style={{
            marginTop: 16,
            fontSize: 9, color: '#fff',
            padding: '12px 24px',
            border: '2px solid #facc15',
            borderRadius: 6,
            animation: 'blink 1s step-end infinite',
          }}>
            TAP TO START
          </div>
          <div style={{ fontSize: 7, color: '#475569' }}>
            SPACE / TAP / CLICK = JUMP
          </div>
        </div>
      )}

      {/* DEAD screen */}
      {phase === 'dead' && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#0f0f1acc',
          zIndex: 30, gap: 12,
        }}>
          <div style={{ fontSize: 14, color: '#ef4444' }}>MISSED</div>
          <div style={{ fontSize: 14, color: '#ef4444' }}>DEADLINE 💀</div>
          <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 8 }}>SUBMITTED</div>
          <div style={{ fontSize: 28, color: '#fff' }}>
            {Math.min(Math.floor((score / 500) * 100), 99)}%
          </div>
          <div style={{ fontSize: 8, color: '#64748b' }}>
            (late submission penalty applied)
          </div>
          <div style={{ fontSize: 8, color: '#facc15', marginTop: 8 }}>
            SCORE: {Math.floor(score).toString().padStart(5, '0')}
          </div>
          {Math.floor(score) >= highScoreRef.current && score > 0 && (
            <div style={{ fontSize: 8, color: '#22c55e' }}>🏆 NEW BEST!</div>
          )}
          <div style={{
            marginTop: 16,
            fontSize: 9, color: '#fff',
            padding: '12px 24px',
            border: '2px solid #facc15',
            borderRadius: 6,
            animation: 'blink 1s step-end infinite',
          }}>
            TAP TO RETRY
          </div>
        </div>
      )}

      {/* Mobile hint */}
      {phase === 'playing' && (
        <div style={{
          position: 'absolute', bottom: 8,
          fontSize: 6, color: '#1e293b',
        }}>TAP ANYWHERE TO JUMP</div>
      )}
    </div>
  );
}
