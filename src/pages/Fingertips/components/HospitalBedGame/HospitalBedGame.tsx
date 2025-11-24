import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Obstacle {
  id: number;
  x: number;
  type: 'iv-stand' | 'wheelchair' | 'block';
  width: number;
  height: number;
}

interface HospitalBedGameProps {
  onRetry?: () => void;
  onClose?: () => void;
  message?: string;
  showCloseButton?: boolean;
  autoClose?: boolean;
}

const HospitalBedGame: React.FC<HospitalBedGameProps> = ({ 
  onRetry,
  onClose,
  message = "Oops! Something went wrong. Play while we reconnect...",
  showCloseButton = false,
  autoClose = true
}) => {
  const [isJumping, setIsJumping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bedY, setBedY] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [gameStarted, setGameStarted] = useState(false);

  const velocityRef = useRef(0);
  const obstacleIdRef = useRef(0);
  const gameLoopRef = useRef<number>(10);
  const lastObstacleRef = useRef(0);

  const GRAVITY = -0.6;
  const JUMP_STRENGTH = 12;
  const GROUND_HEIGHT = 0;
  const BED_HEIGHT = 40;
  const BED_WIDTH = 60;
  const BED_X = 50;
  const GAME_SPEED = 5;
  const OBSTACLE_SPAWN_DISTANCE = 600;

  const obstacleTypes = [
    { type: 'iv-stand' as const, width: 30, height: 80 },
    { type: 'wheelchair' as const, width: 50, height: 50 },
    { type: 'block' as const, width: 40, height: 40 }
  ];

  const jump = useCallback(() => {
    if (!gameStarted) {
      setGameStarted(true);
      return;
    }
    if (!isJumping && !gameOver) {
      setIsJumping(true);
      velocityRef.current = JUMP_STRENGTH;
    }
  }, [isJumping, gameOver, gameStarted]);

  const reset = useCallback(() => {
    setGameOver(false);
    setScore(0);
    setBedY(0);
    setObstacles([]);
    setIsJumping(false);
    setGameStarted(false);
    velocityRef.current = 0;
    lastObstacleRef.current = 0;
    obstacleIdRef.current = 0;
  }, []);

  const handleRetry = useCallback(() => {
    reset();
    if (onRetry) {
      onRetry();
    }
  }, [reset, onRetry]);

  // Keyboard and click controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };

    const handleClick = () => {
      jump();
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleClick);
    };
  }, [jump]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = () => {
      // Update bed position
      velocityRef.current += GRAVITY;
      setBedY((prev) => {
        const newY = prev + velocityRef.current;
        if (newY <= GROUND_HEIGHT) {
          setIsJumping(false);
          velocityRef.current = 0;
          return GROUND_HEIGHT;
        }
        return newY;
      });

      // Update obstacles
      setObstacles((prev) => {
        const updated = prev
          .map((obs) => ({ ...obs, x: obs.x - GAME_SPEED }))
          .filter((obs) => obs.x > -obs.width);

        // Spawn new obstacles
        const rightmostX = updated.length > 0 
          ? Math.max(...updated.map(o => o.x))
          : -OBSTACLE_SPAWN_DISTANCE;

        if (window.innerWidth - rightmostX > OBSTACLE_SPAWN_DISTANCE) {
          const obsType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
          updated.push({
            id: obstacleIdRef.current++,
            x: window.innerWidth,
            type: obsType.type,
            width: obsType.width,
            height: obsType.height
          });
        }

        return updated;
      });

      // Update score
      setScore((prev) => prev + 1);

      // Collision detection
      obstacles.forEach((obs) => {
        const bedBottom = window.innerHeight - 100 - bedY - BED_HEIGHT;
        const bedTop = window.innerHeight - 100 - bedY;
        const bedLeft = BED_X;
        const bedRight = BED_X + BED_WIDTH;

        const obsBottom = window.innerHeight - 100;
        const obsTop = window.innerHeight - 100 - obs.height;
        const obsLeft = obs.x;
        const obsRight = obs.x + obs.width;

        if (
          bedRight > obsLeft &&
          bedLeft < obsRight &&
          bedTop > obsTop &&
          bedBottom < obsBottom
        ) {
          setGameOver(true);
        }
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStarted, gameOver, obstacles, bedY]);

  // Styles
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.3)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(2px)',
    },
    gameContainer: {
      width: '90%',
      maxWidth: '1200px',
      height: '80vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      background: '#f7f7f7',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      overflow: 'hidden',
    },
    header: {
      padding: '40px 20px 20px',
      textAlign: 'center',
      position: 'relative',
    },
    message: {
      fontSize: '24px',
      color: '#535353',
      margin: '0 0 20px 0',
      fontWeight: 400,
    },
    score: {
      fontSize: '20px',
      color: '#535353',
      fontFamily: 'monospace',
    },
    gameArea: {
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
    },
    startPrompt: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '18px',
      color: '#535353',
      textAlign: 'center',
      animation: 'pulse 2s ease-in-out infinite',
    },
    gameOverOverlay: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'white',
      padding: '40px',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      zIndex: 10,
    },
    gameOverTitle: {
      fontSize: '32px',
      color: '#535353',
      margin: '0 0 16px 0',
    },
    gameOverScore: {
      fontSize: '20px',
      color: '#757575',
      margin: '0 0 24px 0',
    },
    buttonContainer: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
    },
    button: {
      padding: '12px 24px',
      fontSize: '16px',
      border: '2px solid #535353',
      background: 'white',
      color: '#535353',
      cursor: 'pointer',
      borderRadius: '4px',
      fontWeight: 500,
    },
    retryButton: {
      padding: '12px 24px',
      fontSize: '16px',
      border: '2px solid #4CAF50',
      background: 'white',
      color: '#4CAF50',
      cursor: 'pointer',
      borderRadius: '4px',
      fontWeight: 500,
    },
    hospitalBed: {
      position: 'absolute',
      width: '60px',
      height: '40px',
    },
    bedFrame: {
      position: 'absolute',
      width: '100%',
      height: '25px',
      background: '#535353',
      borderRadius: '4px',
      top: 0,
    },
    bedFrameHead: {
      position: 'absolute',
      width: '10px',
      height: '15px',
      background: '#535353',
      left: '5px',
      top: '-10px',
      borderRadius: '2px',
    },
    bedFrameFoot: {
      position: 'absolute',
      width: '10px',
      height: '15px',
      background: '#535353',
      right: '5px',
      top: '-10px',
      borderRadius: '2px',
    },
    bedWheels: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: '15px',
    },
    wheel: {
      position: 'absolute',
      width: '12px',
      height: '12px',
      background: '#535353',
      borderRadius: '50%',
      bottom: 0,
    },
    wheelLeft: {
      left: '8px',
    },
    wheelRight: {
      right: '8px',
    },
    obstacle: {
      position: 'absolute',
    },
    ivPole: {
      width: '4px',
      height: '60px',
      background: '#535353',
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      top: 0,
    },
    ivBag: {
      width: '16px',
      height: '20px',
      background: '#535353',
      borderRadius: '8px 8px 4px 4px',
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      top: 0,
    },
    ivBase: {
      width: '28px',
      height: '6px',
      background: '#535353',
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      borderRadius: '3px',
    },
    ivWheel: {
      position: 'absolute',
      width: '8px',
      height: '8px',
      background: '#535353',
      borderRadius: '50%',
      bottom: '-1px',
    },
    wheelchairSeat: {
      width: '30px',
      height: '20px',
      background: '#535353',
      position: 'absolute',
      bottom: '18px',
      left: '10px',
      borderRadius: '4px',
    },
    wheelchairBack: {
      width: '6px',
      height: '30px',
      background: '#535353',
      position: 'absolute',
      bottom: '18px',
      left: '10px',
      borderRadius: '3px',
    },
    wheelchairWheel: {
      width: '20px',
      height: '20px',
      border: '3px solid #535353',
      background: 'transparent',
      borderRadius: '50%',
      position: 'absolute',
      bottom: 0,
    },
    wheelchairWheelSmall: {
      width: '16px',
      height: '16px',
      border: '2px solid #535353',
      background: 'transparent',
      borderRadius: '50%',
      position: 'absolute',
      bottom: '2px',
    },
    block: {
      width: '100%',
      height: '100%',
      background: '#535353',
      borderRadius: '4px',
    },
    closeButton: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      width: '32px',
      height: '32px',
      border: 'none',
      background: 'rgba(83, 83, 83, 0.2)',
      color: '#535353',
      fontSize: '24px',
      cursor: 'pointer',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
      fontWeight: 'bold',
      lineHeight: '1',
    },
    ground: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '100px',
      borderTop: '2px solid #535353',
      background: 'repeating-linear-gradient(90deg, transparent, transparent 50px, #d3d3d3 50px, #d3d3d3 52px)',
    },
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @keyframes ground-scroll {
            0% { background-position: 0 0; }
            100% { background-position: -52px 0; }
          }
          .ground-animate {
            animation: ground-scroll 1s linear infinite;
          }
          .pulse-animate {
            animation: pulse 2s ease-in-out infinite;
          }
          .game-button:hover {
            background: #535353 !important;
            color: white !important;
          }
          .retry-button:hover {
            background: #4CAF50 !important;
            color: white !important;
          }
          .close-button:hover {
            background: rgba(83, 83, 83, 0.4) !important;
          }
          @media (max-width: 768px) {
            .game-message { font-size: 18px !important; }
            .game-score { font-size: 16px !important; }
            .game-over-title { font-size: 24px !important; }
            .game-over-score { font-size: 16px !important; }
          }
        `}
      </style>
      <div style={styles.gameContainer}>
        <div style={styles.header}>
          {showCloseButton && onClose && (
            <button 
              onClick={onClose} 
              style={styles.closeButton}
              className="close-button"
              aria-label="Close game"
            >
              ×
            </button>
          )}
          <h2 style={styles.message} className="game-message">{message}</h2>
          <div style={styles.score} className="game-score">Score: {Math.floor(score / 10)}</div>
        </div>

        <div style={styles.gameArea}>
          {!gameStarted && !gameOver && (
            <div style={styles.startPrompt} className="pulse-animate">
              Press SPACE or CLICK to start jumping!
            </div>
          )}

          {gameOver && (
            <div style={styles.gameOverOverlay}>
              <h3 style={styles.gameOverTitle} className="game-over-title">Game Over!</h3>
              <p style={styles.gameOverScore} className="game-over-score">Final Score: {Math.floor(score / 10)}</p>
              <div style={styles.buttonContainer}>
                <button 
                  onClick={reset} 
                  style={styles.button}
                  className="game-button"
                >
                  Play Again
                </button>
                {onRetry && (
                  <button 
                    onClick={handleRetry} 
                    style={styles.retryButton}
                    className="game-button retry-button"
                  >
                    Retry Connection
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Hospital Bed */}
          <div
            style={{
              ...styles.hospitalBed,
              bottom: `${100 + bedY}px`,
              left: `${BED_X}px`
            }}
          >
            <div style={styles.bedFrame}>
              <div style={styles.bedFrameHead} />
              <div style={styles.bedFrameFoot} />
            </div>
            <div style={styles.bedWheels}>
              <div style={{ ...styles.wheel, ...styles.wheelLeft }} />
              <div style={{ ...styles.wheel, ...styles.wheelRight }} />
            </div>
          </div>

          {/* Obstacles */}
          {obstacles.map((obs) => (
            <div
              key={obs.id}
              style={{
                ...styles.obstacle,
                left: `${obs.x}px`,
                bottom: '100px',
                width: `${obs.width}px`,
                height: `${obs.height}px`
              }}
            >
              {obs.type === 'iv-stand' && (
                <>
                  <div style={styles.ivPole} />
                  <div style={styles.ivBag} />
                  <div style={styles.ivBase}>
                    <div style={{ ...styles.ivWheel, left: '2px' }} />
                    <div style={{ ...styles.ivWheel, right: '2px' }} />
                  </div>
                </>
              )}
              {obs.type === 'wheelchair' && (
                <>
                  <div style={styles.wheelchairSeat} />
                  <div style={styles.wheelchairBack} />
                  <div style={{ ...styles.wheelchairWheel, left: 0 }} />
                  <div style={{ ...styles.wheelchairWheelSmall, right: 0 }} />
                </>
              )}
              {obs.type === 'block' && <div style={styles.block} />}
            </div>
          ))}

          {/* Ground */}
          <div style={styles.ground} className="ground-animate" />
        </div>
      </div>
    </div>
  );
};

export default HospitalBedGame;