import { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { useUser } from './UserContext';

const GameContext = createContext();

const gameInitialState = {
  id: null,
  host_id: null,
  players: [],
  status: 'waiting', // 'waiting', 'playing', 'finished'
  tiles: [],         // Se llenará dinámicamente según el tileCount
  tileCount: 9,      // Valor por defecto
  currentDice: [0, 0],
  currentPlayerId: null,
  loading: false
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_GAME_DATA':
      { const count = action.payload.tile_count || 9;
      
      const initialTiles = action.payload.tiles || Array.from({ length: count }, (_, i) => ({
        number: i + 1,
        isOpen: true
      }));

      return {
        ...state,
        ...action.payload,
        tileCount: count,
        tiles: initialTiles,
        loading: false
      }; }

    case 'SET_DICE':
      return { ...state, currentDice: action.payload };

    case 'TOGGLE_TILE':
      // Cambia el estado de una ficha (abierta/cerrada)
      return {
        ...state,
        tiles: state.tiles.map(t => 
          t.number === action.payload ? { ...t, isOpen: !t.isOpen } : t
        )
      };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'RESET_GAME':
      return gameInitialState;

    default:
      return state;
  }
};

export const GameProvider = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameReducer, gameInitialState);
  const { user } = useUser(); // Obtenemos el usuario actual para comparar

  // --- LÓGICA DERIVADA (Selectores) ---
  // No ocupan espacio en el state, se recalculan si cambia el state o el user
  const isHost = useMemo(() => user.id === gameState.host_id, [user.id, gameState.host_id]);
  const isMyTurn = useMemo(() => user.id === gameState.currentPlayerId, [user.id, gameState.currentPlayerId]);

  // --- ACCIONES (Funciones que los componentes llamarán) ---
  
  // Carga la partida desde el backend
  const loadGame = useCallback((data) => {
    dispatch({ type: 'LOAD_GAME_DATA', payload: data });
  }, []);

  // Simulación de tiro de dados (luego esto será un fetch a FastAPI)
  const rollDice = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    // Aquí iría: const res = await fetch(`/game/${gameState.id}/roll`)
    // Simulamos un delay y dados aleatorios
    setTimeout(() => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      dispatch({ type: 'SET_DICE', payload: [d1, d2] });
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 500);
  };

  // Acción para cerrar/abrir una ficha localmente
  const toggleTile = (tileNumber) => {
    dispatch({ type: 'TOGGLE_TILE', payload: tileNumber });
  };

  return (
    <GameContext.Provider value={{ 
      game: gameState, 
      isHost, 
      isMyTurn, 
      loadGame, 
      rollDice,
      toggleTile
    }}>
      {children}
    </GameContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame debe usarse dentro de un GameProvider');
  }
  return context;
};