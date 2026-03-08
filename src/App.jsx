import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Users, Map as MapIcon, BarChart, Sprout, Factory, 
  CloudRain, Activity, Play, RotateCcw, Award, 
  AlertCircle, ShieldAlert, CheckCircle, XCircle, 
  ChevronRight, Smartphone, User, Cpu, ThumbsUp,
  Network, Plus, LogIn, ClipboardList, ShieldAlert as DoubtIcon,
  Search
} from 'lucide-react';

/**
 * Tailwind CSS & Supabase Dynamic Loader
 */
const useExternalScripts = () => {
  useEffect(() => {
    if (!document.getElementById('tailwind-cdn')) {
      const script = document.createElement('script');
      script.id = 'tailwind-cdn';
      script.src = 'https://cdn.tailwindcss.com';
      document.head.appendChild(script);
    }
    if (!document.getElementById('supabase-cdn')) {
      const script = document.createElement('script');
      script.id = 'supabase-cdn';
      script.src = 'https://unpkg.com/@supabase/supabase-js@2';
      document.head.appendChild(script);
    }
  }, []);
};

// ==========================================
// 1. 都道府県データ
// ==========================================
const PREFECTURES = [
  { id: 1, name: '北海道', population: 506, area: 83424, density: 60, agriculture: 13500, industry: 65000, precipitation: 1100, agingRate: 33.5 },
  { id: 2, name: '青森県', population: 118, area: 9606, density: 122, agriculture: 3400, industry: 16000, precipitation: 1350, agingRate: 34.8 },
  { id: 3, name: '岩手県', population: 116, area: 15275, density: 76, agriculture: 2700, industry: 23000, precipitation: 1300, agingRate: 34.5 },
  { id: 4, name: '宮城県', population: 225, area: 7282, density: 309, agriculture: 2100, industry: 45000, precipitation: 1250, agingRate: 29.5 },
  { id: 5, name: '秋田県', population: 91, area: 11637, density: 78, agriculture: 1600, industry: 11000, precipitation: 1750, agingRate: 38.7 },
  { id: 6, name: '山形県', population: 102, area: 9323, density: 109, agriculture: 2700, industry: 28000, precipitation: 1950, agingRate: 35.1 },
  { id: 7, name: '福島県', population: 176, area: 13783, density: 127, agriculture: 2200, industry: 53000, precipitation: 1200, agingRate: 32.9 },
  { id: 8, name: '茨城県', population: 282, area: 6097, density: 462, agriculture: 4600, industry: 125000, precipitation: 1350, agingRate: 30.5 },
  { id: 9, name: '栃木県', population: 189, area: 6408, density: 295, agriculture: 2800, industry: 90000, precipitation: 1550, agingRate: 30.1 },
  { id: 10, name: '群馬県', population: 190, area: 6362, density: 298, agriculture: 2600, industry: 85000, precipitation: 1250, agingRate: 31.0 },
  { id: 11, name: '埼玉県', population: 733, area: 3797, density: 1930, agriculture: 1600, industry: 135000, precipitation: 1350, agingRate: 27.8 },
  { id: 12, name: '千葉県', population: 627, area: 5157, density: 1215, agriculture: 4000, industry: 130000, precipitation: 1450, agingRate: 28.6 },
  { id: 13, name: '東京都', population: 1410, area: 2194, density: 6426, agriculture: 200, industry: 75000, precipitation: 1600, agingRate: 23.1 },
  { id: 14, name: '神奈川県', population: 923, area: 2415, density: 3821, agriculture: 550, industry: 180000, precipitation: 1750, agingRate: 26.1 },
  { id: 15, name: '新潟県', population: 213, area: 12584, density: 169, agriculture: 2600, industry: 48000, precipitation: 2750, agingRate: 34.1 },
  { id: 16, name: '富山県', population: 100, area: 4247, density: 235, agriculture: 500, industry: 38000, precipitation: 4050, agingRate: 33.5 },
  { id: 17, name: '石川県', population: 111, area: 4186, density: 265, agriculture: 500, industry: 27000, precipitation: 2850, agingRate: 30.8 },
  { id: 18, name: '福井県', population: 74, area: 4190, density: 176, agriculture: 400, industry: 21000, precipitation: 3050, agingRate: 32.1 },
  { id: 19, name: '山梨県', population: 79, area: 4465, density: 176, agriculture: 1100, industry: 32000, precipitation: 1150, agingRate: 32.1 },
  { id: 20, name: '長野県', population: 200, area: 13561, density: 147, agriculture: 3100, industry: 60000, precipitation: 950, agingRate: 33.0 },
  { id: 21, name: '岐阜県', population: 193, area: 10621, density: 181, agriculture: 1000, industry: 58000, precipitation: 1950, agingRate: 31.3 },
  { id: 22, name: '静岡県', population: 355, area: 7777, density: 456, agriculture: 2100, industry: 165000, precipitation: 2400, agingRate: 30.8 },
  { id: 23, name: '愛知県', population: 748, area: 5172, density: 1446, agriculture: 3000, industry: 480000, precipitation: 1550, agingRate: 26.2 },
  { id: 24, name: '三重県', population: 172, area: 5774, density: 297, agriculture: 1000, industry: 11000, precipitation: 2100, agingRate: 31.0 },
  { id: 25, name: '滋賀県', population: 140, area: 4017, density: 348, agriculture: 400, industry: 75000, precipitation: 1650, agingRate: 27.2 },
  { id: 26, name: '京都府', population: 253, area: 4612, density: 548, agriculture: 600, industry: 53000, precipitation: 1550, agingRate: 29.8 },
  { id: 27, name: '大阪府', population: 878, area: 1905, density: 4608, agriculture: 300, industry: 165000, precipitation: 1350, agingRate: 28.4 },
  { id: 28, name: '兵庫県', population: 536, area: 8400, density: 638, agriculture: 1500, industry: 160000, precipitation: 1450, agingRate: 29.7 },
  { id: 29, name: '奈良県', population: 130, area: 3691, density: 352, agriculture: 300, industry: 21000, precipitation: 1350, agingRate: 32.5 },
  { id: 30, name: '和歌山県', population: 89, area: 4724, density: 188, agriculture: 1000, industry: 48000, precipitation: 1750, agingRate: 34.1 },
  { id: 31, name: '鳥取県', population: 53, area: 3507, density: 151, agriculture: 600, industry: 11000, precipitation: 2050, agingRate: 33.6 },
  { id: 32, name: '島根県', population: 65, area: 6708, density: 96, agriculture: 500, industry: 11000, precipitation: 1850, agingRate: 35.1 },
  { id: 33, name: '岡山県', population: 185, area: 7114, density: 260, agriculture: 1000, industry: 85000, precipitation: 1150, agingRate: 31.3 },
  { id: 34, name: '広島県', population: 275, area: 8479, density: 324, agriculture: 1000, industry: 105000, precipitation: 1550, agingRate: 30.5 },
  { id: 35, name: '山口県', population: 130, area: 6112, density: 212, agriculture: 600, industry: 60000, precipitation: 1850, agingRate: 35.5 },
  { id: 36, name: '徳島県', population: 69, area: 4146, density: 166, agriculture: 1000, industry: 16000, precipitation: 1550, agingRate: 34.9 },
  { id: 37, name: '香川県', population: 92, area: 1876, density: 490, agriculture: 600, industry: 26000, precipitation: 1150, agingRate: 32.6 },
  { id: 38, name: '愛媛県', population: 129, area: 5676, density: 227, agriculture: 1000, industry: 42000, precipitation: 1350, agingRate: 34.2 },
  { id: 39, name: '高知県', population: 67, area: 7103, density: 94, agriculture: 1100, industry: 11000, precipitation: 2650, agingRate: 36.3 },
  { id: 40, name: '福岡県', population: 511, area: 4986, density: 1024, agriculture: 2000, industry: 90000, precipitation: 1650, agingRate: 28.5 },
  { id: 41, name: '佐賀県', population: 80, area: 2440, density: 327, agriculture: 1100, industry: 16000, precipitation: 1850, agingRate: 31.1 },
  { id: 42, name: '長崎県', population: 127, area: 4132, density: 307, agriculture: 1500, industry: 16000, precipitation: 1850, agingRate: 34.2 },
  { id: 43, name: '熊本県', population: 170, area: 7409, density: 229, agriculture: 3500, industry: 28000, precipitation: 2050, agingRate: 32.3 },
  { id: 44, name: '大分県', population: 109, area: 6340, density: 171, agriculture: 1000, industry: 32000, precipitation: 1650, agingRate: 34.4 },
  { id: 45, name: '宮崎県', population: 104, area: 7735, density: 134, agriculture: 3500, industry: 16000, precipitation: 2550, agingRate: 33.7 },
  { id: 46, name: '鹿児島県', population: 154, area: 9187, density: 167, agriculture: 5000, industry: 26000, precipitation: 2250, agingRate: 33.5 },
  { id: 47, name: '沖縄県', population: 146, area: 2281, density: 640, agriculture: 1000, industry: 6000, precipitation: 2050, agingRate: 23.5 }
];

const THEME_DEFS = {
  population: { id: 'population', name: '人口', unit: '万人', icon: Users, color: 'text-blue-600' },
  area: { id: 'area', name: '面積', unit: 'km²', icon: MapIcon, color: 'text-green-600' }
};

// 属性の安全な取得
const safeTheme = (theme) => ['population', 'area'].includes(theme) ? theme : 'population';

// ==========================================
// 2. UIコンポーネント
// ==========================================
const CardView = ({ card, activeThemes, faceDown, selectable, onClick, highlight, small, declaredName }) => {
  if (faceDown) {
    return (
      <div className={`${small ? 'w-10 h-14 sm:w-16 sm:h-24' : 'w-20 h-28 sm:w-24 sm:h-36'} bg-emerald-900 rounded-xl shadow-xl border-2 border-emerald-400/30 flex flex-col items-center justify-center relative overflow-hidden text-white transition-transform hover:scale-105 cursor-default`}>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-400 to-transparent" />
        <div className="text-[8px] sm:text-[12px] font-black italic tracking-widest uppercase transform -rotate-45 opacity-50 mb-2 drop-shadow-md">ChiriKing</div>
        {declaredName && (
          <div className="bg-red-600/90 border border-red-400 px-3 py-1 rounded-full text-[9px] sm:text-xs font-black text-white absolute bottom-3 whitespace-nowrap shadow-lg animate-pulse">{declaredName}</div>
        )}
      </div>
    );
  }
  if (!card) return null;
  const themes = (activeThemes || ['population', 'area']).map(id => THEME_DEFS[id]);

  return (
    <div 
      onClick={() => selectable && onClick && onClick(card)} 
      className={`
        ${small ? 'w-14 h-20 sm:w-20 sm:h-28' : 'w-20 h-28 sm:w-24 sm:h-36'} 
        bg-white rounded-xl shadow-lg border-2 flex flex-col items-center justify-between p-1 sm:p-2 relative transition-all duration-200
        ${selectable ? 'cursor-pointer hover:-translate-y-3 border-emerald-500 ring-4 ring-emerald-200 shadow-emerald-500/50' : 'opacity-60 border-slate-300 grayscale-[0.5]'}
      `}
    >
      <div className="text-[7px] sm:text-[9px] text-slate-400 w-full text-left font-bold italic px-1">No.{card.id}</div>
      <div className="text-sm sm:text-lg font-black text-slate-800 text-center tracking-tighter leading-tight drop-shadow-sm">{card.name}</div>
      <div className="flex flex-col w-full space-y-1 mb-1">
        {themes.map(t => (
          <div key={t.id} className={`flex justify-between items-center px-1.5 py-0.5 rounded text-[8px] sm:text-[10px] ${highlight === t.id ? 'bg-emerald-600 text-white font-black shadow-inner scale-105' : 'text-slate-600 bg-slate-100 font-bold'}`}>
            <span className="flex items-center gap-0.5"><t.icon size={10} className={highlight === t.id ? "text-white" : t.color}/>{t.name}</span>
            <span>{card[t.id]}<span className="text-[6px] sm:text-[7px] opacity-80 ml-0.5">{t.unit}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 3. アプリケーション本体
// ==========================================
export default function App() {
  useExternalScripts();
  
  const [scriptsReady, setScriptsReady] = useState(false);
  const [supabase, setSupabase] = useState(null);
  const [step, setStep] = useState('MENU');
  const [mode, setMode] = useState('daifugo'); 
  const [playerCount, setPlayerCount] = useState(1);
  const [activeThemes] = useState(['population', 'area']);
  const [game, setGame] = useState(null);
  
  // 場が空の時に親が選ぶ属性
  const [pendingTheme, setPendingTheme] = useState('population');
  
  const [nickname, setNickname] = useState('');
  const [user, setUser] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [roomData, setRoomData] = useState(null);
  const [myPlayerIndex, setMyPlayerIndex] = useState(0);
  const [joinRoomIdInput, setJoinRoomIdInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // ダウトモード用：嘘の宣言モーダル表示ステート
  const [showDeclareModal, setShowDeclareModal] = useState(false);
  const [selectedCardToPlay, setSelectedCardToPlay] = useState(null);
  const [searchPrefectureQuery, setSearchPrefectureQuery] = useState('');

  // 初期化
  useEffect(() => {
    const checkScripts = () => {
      if (window.supabase && typeof document !== 'undefined') {
        setScriptsReady(true);
        let url = '';
        let key = '';
        try {
          url = import.meta.env.VITE_SUPABASE_URL || '';
          key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
        } catch (e) {}
        if (url && key) {
          setSupabase(window.supabase.createClient(url, key));
        }
      } else {
        setTimeout(checkScripts, 500);
      }
    };
    checkScripts();
    const uid = Math.random().toString(36).substring(2, 15);
    setUser({ uid });
  }, []);

  // リアルタイム同期
  useEffect(() => {
    if (!isOnline || !roomId || !user || !supabase) return;
    const fetchRoom = async () => {
      const { data } = await supabase.from('rooms').select('*').eq('id', roomId).single();
      if (data) {
        setRoomData(data);
        if (data.game) setGame(data.game);
        if (data.mode) setMode(data.mode);
        const pIdx = data.players.findIndex(p => p.uid === user.uid);
        if (pIdx !== -1) setMyPlayerIndex(pIdx);
      }
    };
    fetchRoom();
    const channel = supabase.channel(`room_${roomId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` }, (payload) => {
        const data = payload.new;
        setRoomData(data);
        if (data.game) setGame(data.game);
        if (data.mode) setMode(data.mode);
        const pIdx = data.players.findIndex(p => p.uid === user.uid);
        if (pIdx !== -1) setMyPlayerIndex(pIdx);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isOnline, roomId, user, supabase]);

  useEffect(() => {
    if (step === 'LOBBY' && roomData?.status === 'playing') setStep('BOARD');
  }, [step, roomData?.status]);

  const updateGame = useCallback(async (updater) => {
    setGame(prev => {
      if (!prev) return prev;
      const newState = typeof updater === 'function' ? updater(prev) : updater;
      if (isOnline && roomId && supabase) {
        supabase.from('rooms').update({ game: newState }).eq('id', roomId).catch(e => console.error(e));
      }
      return newState;
    });
  }, [isOnline, roomId, supabase]);

  const createRoom = async () => {
    if (!supabase) { setErrorMsg('接続準備中です...'); return; }
    const newRoomId = Math.floor(1000 + Math.random() * 9000).toString();
    try {
      await supabase.from('rooms').insert([{
        id: newRoomId, host_uid: user.uid, players: [{ uid: user.uid, name: nickname || 'ホスト' }],
        status: 'waiting', mode: mode, active_themes: ['population', 'area'],
        game: { target_player_count: playerCount } 
      }]);
      setRoomId(newRoomId);
      setIsOnline(true);
      setStep('LOBBY');
    } catch (e) { setErrorMsg('部屋の作成に失敗'); }
  };

  const joinRoom = async () => {
    if (!supabase) return;
    const targetId = joinRoomIdInput.trim();
    try {
      const { data, error } = await supabase.from('rooms').select('*').eq('id', targetId).single();
      if (error || !data) { setErrorMsg("部屋が見つかりません"); return; }
      if (data.status !== 'waiting') { setErrorMsg("開始済みです"); return; }
      const newPlayers = [...data.players, { uid: user.uid, name: nickname || `参加者${data.players.length + 1}` }];
      await supabase.from('rooms').update({ players: newPlayers }).eq('id', targetId);
      setRoomId(targetId);
      setIsOnline(true);
      setStep('LOBBY');
    } catch (e) { setErrorMsg('エラー発生'); }
  };

  const handleStartButton = () => {
    if (isOnline) { 
      createRoom(); 
    } else {
      const deck = [...PREFECTURES].sort(() => Math.random() - 0.5);
      const players = Array.from({ length: 4 }).map((_, i) => ({
        id: i, name: i < playerCount ? (playerCount === 1 ? (nickname || 'あなた') : `${nickname || 'P'}${i + 1}`) : `CPU ${i - playerCount + 1}`,
        isCpu: i >= playerCount, hand: deck.slice(i * 5, (i + 1) * 5).sort((a,b) => a.id - b.id), passed: false
      }));
      setGame({
        mode, players, turn: 0, fieldCards: [], currentThemeId: null, winner: null, phase: 'WAITING',
        message: 'ゲームスタート！勝負属性を選んでカードを出してください。', deck: deck.slice(20)
      });
      setStep('BOARD');
    }
  };

  const handleStartOnlineMatch = async () => {
    if (!roomData || roomData.host_uid !== user.uid || !supabase) return;
    const deck = [...PREFECTURES].sort(() => Math.random() - 0.5);
    const joinedCount = roomData.players.length;
    const players = Array.from({ length: 4 }).map((_, i) => ({
      id: i, name: i < joinedCount ? roomData.players[i].name : `CPU ${i - joinedCount + 1}`,
      isCpu: i >= joinedCount, hand: deck.slice(i * 5, (i + 1) * 5).sort((a,b) => a.id - b.id), passed: false
    }));
    const initialGame = {
      mode, players, turn: 0, fieldCards: [], currentThemeId: null, winner: null, phase: 'WAITING',
      message: 'ゲームスタート！親は属性を選んでください。', deck: deck.slice(20)
    };
    await supabase.from('rooms').update({ status: 'playing', game: initialGame }).eq('id', roomId);
  };

  const moveToNext = useCallback(() => {
    updateGame(prev => {
      if (!prev || prev.winner) return prev;
      let next = (prev.turn + 1) % 4;
      if (prev.mode === 'daifugo') {
        let loop = 0;
        while (prev.players[next]?.passed && loop < 4) { next = (next + 1) % 4; loop++; }
        if (next === (prev.lastPlayedIdx || 0) && prev.players.filter(p => p.passed).length >= 3) {
          return { ...prev, turn: prev.lastPlayedIdx, fieldCards: [], currentThemeId: null, players: prev.players.map(p => ({ ...p, passed: false })), phase: 'WAITING', message: `場が流れました。親が属性を選択します。` };
        }
      }
      return { ...prev, turn: next, phase: 'WAITING' };
    });
  }, [updateGame]);

  const handlePlayBasic = (idx, card, theme = null) => {
    updateGame(prev => {
      const activeT = safeTheme(prev.currentThemeId || theme || pendingTheme);
      const newPlayers = prev.players.map((p, i) => i === idx ? { ...p, hand: p.hand.filter(c => c.id !== card.id) } : p);
      if (newPlayers[idx].hand.length === 0) return { ...prev, players: newPlayers, winner: newPlayers[idx], phase: 'OVER' };
      return { ...prev, lastPlayedIdx: idx, players: newPlayers.map(p => ({ ...p, passed: false })), fieldCards: [...prev.fieldCards, card], currentThemeId: activeT, phase: 'RESOLVING', message: `${prev.players[idx].name}のカード！` };
    });
  };

  const handleDoubtPlayClick = (card) => {
    setSelectedCardToPlay(card);
    setShowDeclareModal(true);
  };

  const executeDoubtPlay = (declaredPref) => {
    setShowDeclareModal(false);
    const cardToPlay = selectedCardToPlay;
    setSelectedCardToPlay(null);
    setSearchPrefectureQuery('');

    if (!cardToPlay || !declaredPref) return;

    updateGame(prev => {
      const tid = safeTheme(prev.currentThemeId || pendingTheme);
      const cp = prev.players[prev.turn];
      if(!cp) return prev;

      return {
        ...prev, 
        players: prev.players.map((p, i) => i === prev.turn ? { ...p, hand: p.hand.filter(c => c.id !== cardToPlay.id) } : p), 
        pending: { card: cardToPlay, declaredPref, playerIndex: prev.turn, themeAtPlay: tid }, 
        currentThemeId: tid,
        phase: 'DOUBT_WINDOW',
        message: `${cp.name} が「${declaredPref.name}」を宣言！`
      };
    });
  };

  const onResolveDoubt = (doubterId) => {
    updateGame(prev => {
      if (prev.phase !== 'DOUBT_WINDOW' || !prev.pending) return prev;
      
      const tid = safeTheme(prev.pending.themeAtPlay);
      const targetValue = prev.fieldCards.length === 0 ? 0 : (prev.fieldCards[prev.fieldCards.length-1][tid] || 0);
      
      const actualValue = prev.pending.card[tid] || 0;
      const isTruth = (actualValue >= targetValue) && (prev.pending.card.id === prev.pending.declaredPref.id);
      
      const loserId = isTruth ? doubterId : prev.pending.playerIndex;
      
      let newHand = [...(prev.players[loserId]?.hand || [])];
      let currentDeck = [...prev.deck];
      while (newHand.length < 5 && currentDeck.length > 0) newHand.push(currentDeck.shift());
      
      return { 
        ...prev, deck: currentDeck, 
        players: prev.players.map((p, i) => i === loserId ? { ...p, hand: newHand.sort((a,b)=>a.id-b.id) } : p), 
        phase: 'RESOLUTION', 
        doubtResult: { actual: prev.pending.card, declared: prev.pending.declaredPref, isTruth, loserId, themeUsed: tid },
        fieldCards: [], currentThemeId: null, turn: loserId 
      };
    });
  };

  const handlePassBasic = (idx) => updateGame(prev => ({ ...prev, players: prev.players.map((p, i) => i === idx ? { ...p, passed: true } : p), phase: 'RESOLVING', message: `パス` }));

  const onAcceptDoubt = useCallback(() => {
    updateGame(prev => {
      if (prev.phase !== 'DOUBT_WINDOW' || !prev.pending) return prev;
      if (prev.players[prev.turn].hand.length === 0) return { ...prev, winner: prev.players[prev.turn], phase: 'OVER' };
      return { 
        ...prev, turn: (prev.turn + 1) % 4, phase: 'WAITING', 
        fieldCards: [...prev.fieldCards, prev.pending.card], pending: null, message: `スルーされました。` 
      };
    });
  }, [updateGame]);

  useEffect(() => {
    if (!game) return;
    if (isOnline && roomData?.host_uid !== user?.uid) return;
    if (game.phase === 'RESOLVING') { const t = setTimeout(moveToNext, 1200); return () => clearTimeout(t); }
    if (game.mode === 'doubt' && game.phase === 'DOUBT_WINDOW') {
       const t = setTimeout(onAcceptDoubt, 4500); return () => clearTimeout(t);
    }
  }, [game?.phase, game?.mode, isOnline, roomData, moveToNext, onAcceptDoubt]);

  // CPUロジック
  useEffect(() => {
    if (!game || game.winner || game.phase !== 'WAITING') return;
    if (isOnline && roomData?.host_uid !== user?.uid) return; 
    const p = game.players[game.turn];
    if (!p || !p.isCpu) return;
    const t = setTimeout(() => {
      const cpuTheme = activeThemes[Math.floor(Math.random() * activeThemes.length)];
      if (game.mode === 'daifugo') {
        const tid = game.currentThemeId || cpuTheme;
        const targetValue = game.fieldCards.length === 0 ? 0 : game.fieldCards[game.fieldCards.length-1][tid];
        const playableCards = p.hand.filter(c => c[tid] >= targetValue).sort((a,b)=>a[tid]-b[tid]);
        
        if (playableCards.length > 0) {
          handlePlayBasic(game.turn, playableCards[0], tid);
        } else {
          if(!game.currentThemeId) handlePlayBasic(game.turn, p.hand[0], tid); // 場が空なら何でも出せる
          else handlePassBasic(game.turn);
        }
      } else {
        const isLying = Math.random() < 0.2;
        const actualCard = p.hand[0];
        let declaredPref = actualCard;
        
        if (isLying) {
          const possibleLies = PREFECTURES.filter(pref => pref.id !== actualCard.id);
          declaredPref = possibleLies[Math.floor(Math.random() * possibleLies.length)];
        }
        
        updateGame(prev => {
          const tid = safeTheme(prev.currentThemeId || cpuTheme);
          return {
            ...prev, 
            players: prev.players.map((pl, i) => i === prev.turn ? { ...pl, hand: pl.hand.filter(c => c.id !== actualCard.id) } : pl), 
            pending: { card: actualCard, declaredPref, playerIndex: prev.turn, themeAtPlay: tid }, 
            currentThemeId: tid,
            phase: 'DOUBT_WINDOW',
            message: `${prev.players[prev.turn].name}が「${declaredPref.name}」を宣言！`
          };
        });
      }
    }, 1500);
    return () => clearTimeout(t);
  }, [game?.turn, game?.phase, game?.mode, updateGame]);

  // 出せるカードかどうかの判定
  const canPlayCard = (card) => {
    if (!game) return false;
    const actualViewIndex = isOnline ? Math.max(0, myPlayerIndex) : 0;
    if (game.phase !== 'WAITING') return false;
    if (game.turn !== actualViewIndex) return false;
    if (game.mode === 'doubt') return true; // ダウトはルール無視で出せる(嘘として)
    
    const tid = safeTheme(game.currentThemeId || pendingTheme);
    const targetValue = game.fieldCards.length === 0 ? 0 : (game.fieldCards[game.fieldCards.length-1][tid] || 0);
    return card[tid] >= targetValue;
  };

  // デザイン反映用スタイル
  const pageBaseStyle = {
    minHeight: '100vh',
    backgroundColor: '#064e3b', // emerald-900 (より深い緑)
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    textAlign: 'center',
    color: 'white',
    fontFamily: 'sans-serif'
  };

  if (!scriptsReady) return <div style={pageBaseStyle}>Loading Assets...</div>;

  if (step === 'MENU') return (
    <div className="min-h-screen bg-emerald-900 flex flex-col items-center justify-center p-6 text-center text-white font-sans overflow-hidden relative">
      <style dangerouslySetInnerHTML={{__html: `@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }.animate-fade-in { animation: fade-in 0.4s forwards; } .scrollbar-hide::-webkit-scrollbar { display: none; }`}} />
      <div className="z-10 w-full max-w-sm space-y-12 animate-fade-in">
        <h1 className="text-6xl font-black italic tracking-tighter drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">CHIRIKING</h1>
        <div className="bg-emerald-800/50 p-6 rounded-3xl border border-emerald-500/30 shadow-2xl">
          <label className="text-[10px] font-black uppercase tracking-widest text-emerald-300 block mb-3">Player Name</label>
          <div className="relative text-white">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />
            <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="名前を入力..." className="w-full bg-emerald-950/80 text-white pl-12 pr-4 py-4 rounded-2xl font-black focus:ring-4 ring-emerald-400 outline-none transition-all placeholder:text-white/30 shadow-inner"/>
          </div>
        </div>
        <div className="space-y-4">
          <button onClick={() => { setIsOnline(false); setStep('PLAYER_SELECT'); }} className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-2xl font-black text-2xl shadow-[0_5px_15px_rgba(16,185,129,0.3)] active:scale-95 transition-all">1台で遊ぶ</button>
          <button onClick={() => { setIsOnline(true); setStep('ONLINE_MENU'); }} className="w-full py-5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded-2xl font-black text-2xl border-2 border-emerald-500/30 shadow-lg active:scale-95 transition-all">オンライン対戦</button>
        </div>
      </div>
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-600 rounded-full mix-blend-overlay filter blur-[100px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-emerald-500 rounded-full mix-blend-overlay filter blur-[120px] opacity-20"></div>
    </div>
  );

  if (step === 'PLAYER_SELECT') return (
    <div className="min-h-screen bg-emerald-900 flex items-center justify-center p-6 text-white text-center">
      <div className="bg-emerald-800/80 border border-emerald-500/20 p-10 rounded-[48px] max-w-md w-full shadow-2xl animate-fade-in backdrop-blur-md">
        <h2 className="text-3xl font-black text-emerald-300 mb-6 italic drop-shadow-md">何人で遊ぶ？</h2>
        <p className="text-xs font-bold text-emerald-200/60 mb-8">{isOnline ? "参加を待つ人間の数を選択してください" : "残りの枠にはCPUが入ります（計4人）"}</p>
        <div className="flex flex-col gap-4 mb-8">
          {[1, 2, 3, 4].map(num => (
            <button key={num} onClick={() => { setPlayerCount(num); setStep('RULE'); }} className={`py-4 rounded-2xl font-black text-xl border-2 transition-all duration-200 flex items-center justify-center gap-3 ${playerCount === num ? 'bg-emerald-500 text-emerald-950 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-105' : 'bg-emerald-950/50 border-emerald-800 text-emerald-400 hover:border-emerald-500'}`}><Users size={24} /> {num}人</button>
          ))}
        </div>
        <button onClick={() => setStep('MENU')} className="text-sm font-bold text-emerald-400/60 hover:text-emerald-300 underline">戻る</button>
      </div>
    </div>
  );

  if (step === 'ONLINE_MENU') return (
    <div className="min-h-screen bg-emerald-900 flex flex-col items-center justify-center p-6 text-white text-center">
      {errorMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-full z-[1000] flex items-center gap-2 shadow-lg">
          <AlertCircle size={20}/>{errorMsg}<button onClick={() => setErrorMsg('')}><XCircle size={16}/></button>
        </div>
      )}
      <div className="w-full max-w-sm space-y-8 animate-fade-in">
        <h2 className="text-4xl font-black italic drop-shadow-md">ONLINE</h2>
        <div className="bg-emerald-800/50 p-6 rounded-[32px] border border-emerald-500/20 shadow-2xl space-y-6 backdrop-blur-md">
          <button onClick={() => { setIsOnline(true); setStep('PLAYER_SELECT'); }} className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 py-5 rounded-2xl font-black text-2xl shadow-lg transition-all active:scale-95">部屋を作る</button>
          <div className="flex items-center justify-center gap-4 py-2">
            <div className="h-px bg-emerald-500/30 flex-1"></div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">OR</span>
            <div className="h-px bg-emerald-500/30 flex-1"></div>
          </div>
          <div className="space-y-3">
            <input type="text" value={joinRoomIdInput} onChange={e => setJoinRoomIdInput(e.target.value)} placeholder="ルームIDを入力" className="w-full bg-emerald-950/80 text-emerald-300 text-center text-3xl font-black py-4 rounded-2xl outline-none placeholder:text-emerald-700/50 focus:ring-4 ring-emerald-500/50 transition-all shadow-inner"/>
            <button disabled={!supabase} onClick={joinRoom} className={`w-full py-5 rounded-2xl font-black text-xl transition-all ${supabase ? 'bg-emerald-900 border-2 border-emerald-500 hover:bg-emerald-700 text-emerald-300 shadow-lg active:scale-95' : 'bg-emerald-950 text-emerald-800 cursor-not-allowed border-2 border-emerald-900'}`}>参加する</button>
          </div>
        </div>
        <button onClick={() => setStep('MENU')} className="text-sm font-bold text-emerald-400/60 hover:text-emerald-300 underline">戻る</button>
      </div>
    </div>
  );

  if (step === 'LOBBY') return (
    <div className="min-h-screen bg-emerald-900 flex flex-col items-center justify-center p-6 text-white text-center">
      <div className="bg-emerald-800/80 border border-emerald-500/20 p-10 rounded-[48px] max-w-sm w-full shadow-2xl backdrop-blur-md animate-fade-in">
        <h2 className="text-3xl font-black text-emerald-300 mb-6 italic drop-shadow-md">待機室</h2>
        <div className="bg-emerald-950/80 p-5 rounded-3xl mb-8 shadow-inner border border-emerald-900">
          <p className="text-[10px] font-black text-emerald-500 uppercase mb-2 tracking-widest">Room ID</p>
          <p className="text-5xl font-mono font-black text-emerald-300 tracking-widest drop-shadow-md">{roomId}</p>
        </div>
        <div className="text-left mb-8 space-y-3">
          <div className="flex justify-between items-center px-2 mb-2">
             <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Players</p>
             <p className="text-[10px] font-black text-emerald-300 bg-emerald-950 px-3 py-1 rounded-full">{roomData?.players?.length} / {playerCount}</p>
          </div>
          {roomData?.players?.map((p, i) => (
            <div key={p.uid} className="bg-emerald-600/20 border border-emerald-500/30 p-4 rounded-2xl font-black flex items-center gap-3 text-emerald-100 shadow-sm"><User size={18} className="text-emerald-400"/> {p.name} {i === 0 && <span className="text-[9px] bg-emerald-500 text-emerald-950 px-2 py-0.5 rounded-full ml-auto shadow-sm">HOST</span>}</div>
          ))}
          {Array.from({ length: Math.max(0, playerCount - (roomData?.players?.length || 0)) }).map((_, i) => (
            <div key={`empty-${i}`} className="border-2 border-dashed border-emerald-700/50 p-4 rounded-2xl font-bold flex items-center gap-3 text-emerald-700/50 italic"><Plus size={18}/> 参加待ち...</div>
          ))}
        </div>
        {roomData?.host_uid === user?.uid ? (
          <button onClick={handleStartOnlineMatch} disabled={roomData?.players?.length < playerCount} className={`w-full py-5 rounded-3xl font-black text-xl shadow-lg transition-all ${roomData?.players?.length >= playerCount ? 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 active:scale-95 shadow-[0_5px_15px_rgba(16,185,129,0.3)]' : 'bg-emerald-950 text-emerald-800 cursor-not-allowed'}`}>ゲーム開始</button>
        ) : (
          <p className="text-emerald-400 font-black animate-pulse bg-emerald-950/50 py-4 rounded-2xl border border-emerald-800">ホストの開始を待っています...</p>
        )}
      </div>
    </div>
  );

  if (step === 'RULE') return (
    <div className="min-h-screen bg-emerald-900 flex items-center justify-center p-6 text-white text-center">
      <div className="bg-emerald-800/80 border border-emerald-500/20 p-10 rounded-[48px] max-w-md w-full shadow-2xl backdrop-blur-md animate-fade-in">
        <h2 className="text-3xl font-black text-emerald-300 mb-8 italic drop-shadow-md">ルール選択</h2>
        <div className="flex flex-col gap-4 mb-10">
          <button onClick={()=>setMode('daifugo')} className={`py-6 rounded-2xl font-black text-xl border-2 transition-all flex flex-col items-center gap-2 ${mode==='daifugo'?'bg-emerald-500 text-emerald-950 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-105':'bg-emerald-950/50 border-emerald-800 text-emerald-400'}`}>
            <span>基本モード</span>
            <span className={`text-[10px] ${mode==='daifugo'?'text-emerald-900':'text-emerald-600'} font-bold`}>数字の大きさを競う王道ルール</span>
          </button>
          <button onClick={()=>setMode('doubt')} className={`py-6 rounded-2xl font-black text-xl border-2 transition-all flex flex-col items-center gap-2 ${mode==='doubt'?'bg-red-500 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)] scale-105':'bg-emerald-950/50 border-emerald-800 text-emerald-400'}`}>
            <span>ダウトモード</span>
            <span className={`text-[10px] ${mode==='doubt'?'text-red-100':'text-emerald-600'} font-bold`}>嘘をついて場を制する心理戦</span>
          </button>
        </div>
        <button onClick={handleStartButton} className="w-full bg-emerald-400 hover:bg-emerald-300 text-emerald-950 py-5 rounded-3xl font-black text-2xl shadow-lg active:scale-95 transition-all">決定！</button>
      </div>
    </div>
  );

  if (step === 'BOARD' && game) {
    // オフライン時は常に自分(index 0)視点
    const actualViewIndex = isOnline ? Math.max(0, myPlayerIndex) : 0;
    const cp = game.players[actualViewIndex];
    const currentOrPendingThemeId = safeTheme(game.currentThemeId || pendingTheme);
    const td = THEME_DEFS[currentOrPendingThemeId];
    const currentMode = game.mode || mode;

    return (
      <div className="min-h-screen bg-emerald-900 text-white flex flex-col overflow-hidden relative">
        {/* 背景装飾 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-emerald-600/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>

        {/* ヘッダー */}
        <div className="bg-emerald-950/90 p-3 flex justify-between items-center shrink-0 border-b border-emerald-500/20 shadow-md z-50 backdrop-blur-md">
          <div className="flex flex-col">
            <div className="font-black text-emerald-400 text-[10px] italic tracking-widest flex items-center gap-1 uppercase"><MapIcon size={12}/> CHIRIKING</div>
            <div className={`text-[8px] font-bold uppercase px-1.5 py-0.5 mt-0.5 rounded-sm inline-block ${currentMode === 'doubt' ? 'bg-red-600/20 text-red-400 border border-red-500/30' : 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'} w-fit`}>{currentMode === 'doubt' ? 'DOUBT MODE' : 'BASIC MODE'}</div>
          </div>
          <div className="text-xs font-black text-emerald-100 bg-emerald-800/50 px-4 py-1.5 rounded-full border border-emerald-500/30 shadow-inner flex-1 mx-4 text-center truncate">{game.message}</div>
          <button onClick={() => setStep('MENU')} className="text-[9px] bg-red-900/50 text-red-400 font-black px-3 py-1.5 rounded-lg border border-red-800 hover:bg-red-800 transition-colors">EXIT</button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center relative px-4 pt-6 pb-2">
          
          {/* 対戦相手のステータス表示 */}
          <div className="absolute top-4 left-0 right-0 flex justify-center gap-3 z-40 px-4">
            {game.players.map((p, i) => {
              if (i === actualViewIndex) return null;
              const isTurn = game.turn === i;
              return (
                <div key={i} className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-2xl border transition-all duration-300 ${isTurn ? 'bg-emerald-700/80 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)] scale-110 z-10' : 'bg-emerald-950/60 border-emerald-800/50 opacity-80'}`}>
                  <span className={`text-[10px] font-black truncate max-w-[60px] ${isTurn ? 'text-emerald-100' : 'text-emerald-500'}`}>{p.name}</span>
                  <div className="flex items-center gap-1">
                    <div className="flex -space-x-1.5">{Array.from({ length: Math.min(p.hand.length, 5) }).map((_, idx) => <div key={idx} className={`w-3 h-4 rounded-sm shadow-sm border ${isTurn ? 'bg-emerald-500 border-emerald-200' : 'bg-emerald-800 border-emerald-900'}`} />)}</div>
                    <span className={`text-xs font-black ml-1 ${isTurn ? 'text-white' : 'text-emerald-600'}`}>{p.hand.length}</span>
                  </div>
                  {p.passed && <span className="absolute -bottom-2 bg-slate-700 text-slate-300 text-[8px] px-2 py-0.5 rounded-full border border-slate-600 font-black shadow-md">PASS</span>}
                </div>
              );
            })}
          </div>

          {/* 中央エリア: 属性選択 / 場のカード */}
          <div className="flex-1 w-full flex flex-col items-center justify-center mt-10">
            {!game.currentThemeId ? (
              // 場が流れている時
              <div className="text-center z-10 animate-fade-in w-full max-w-sm">
                {game.turn === actualViewIndex ? (
                  <div className="bg-emerald-800/80 p-6 rounded-[32px] border border-emerald-500/40 shadow-2xl backdrop-blur-md">
                    <p className="text-sm font-black text-emerald-200 mb-6 tracking-widest drop-shadow-md">勝負する属性を選んでください</p>
                    <div className="flex justify-center gap-4">
                      {Object.values(THEME_DEFS).map(TDef => (
                        <button 
                          key={TDef.id} 
                          onClick={() => setPendingTheme(TDef.id)} 
                          className={`flex-1 py-4 rounded-2xl font-black flex flex-col items-center gap-2 border-2 transition-all duration-200 ${pendingTheme === TDef.id ? 'bg-emerald-400 text-emerald-950 border-emerald-300 scale-105 shadow-[0_5px_15px_rgba(52,211,153,0.4)]' : 'bg-emerald-950/50 border-emerald-800 text-emerald-500 hover:border-emerald-600'}`}
                        >
                          <TDef.icon size={24}/> 
                          <span className="text-sm">{TDef.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-950/80 px-8 py-5 rounded-3xl border border-emerald-800/50 shadow-lg backdrop-blur-md">
                    <p className="text-sm font-black text-emerald-400/80 animate-pulse tracking-widest">{game.players[game.turn]?.name} が属性を選択中...</p>
                  </div>
                )}
              </div>
            ) : (
              // 属性が決定している時
              td && (
                <div className="bg-emerald-950/60 p-6 rounded-[40px] border border-emerald-700/50 text-center mb-8 backdrop-blur-md shadow-xl animate-fade-in relative z-10 min-w-[240px]">
                   <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-emerald-950 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md flex items-center gap-1 border border-emerald-300">
                     <td.icon size={12}/> CURRENT THEME
                   </div>
                   <div className="text-emerald-400 text-xs font-black mb-2 mt-1 tracking-widest">{td.name} 勝負</div>
                   <div className="text-white text-xl font-black italic flex items-baseline justify-center gap-2 drop-shadow-md">
                     {game.fieldCards.length > 0 ? (currentMode === 'doubt' ? "???" : game.fieldCards[game.fieldCards.length-1].name) : "待機中"}
                     <span className="text-yellow-400 font-mono text-5xl drop-shadow-[0_2px_10px_rgba(250,204,21,0.3)] leading-none ml-2">
                       {game.fieldCards.length > 0 ? (currentMode === 'doubt' ? "?" : game.fieldCards[game.fieldCards.length-1][game.currentThemeId]) : "-"}
                     </span>
                     {game.fieldCards.length > 0 && <span className="text-[10px] text-yellow-400/60 font-sans tracking-normal ml-1">{td.unit}</span>}
                   </div>
                </div>
              )
            )}
            
            {/* 場のカード */}
            <div className="relative w-40 h-52 flex items-center justify-center mt-4">
              {game.fieldCards.map((c, i) => (
                <div key={`field-${i}`} className="absolute transform transition-all duration-500 drop-shadow-2xl" style={{ rotate: `${(i*7)%30-15}deg`, zIndex: i }}>
                  <CardView card={c} activeThemes={['population', 'area']} highlight={game.currentThemeId} faceDown={currentMode === 'doubt'} declaredName={currentMode === 'doubt' ? PREFECTURES.find(p=>p.id===c.id)?.name : null} />
                </div>
              ))}
              
              {/* ダウト判定中のカード描画 */}
              {game.phase === 'DOUBT_WINDOW' && game.pending && (
                <div className="absolute transform transition-all duration-500 scale-110 -translate-y-4 shadow-2xl" style={{ rotate: `${(game.fieldCards.length*7)%30-15}deg`, zIndex: game.fieldCards.length + 10 }}>
                  <CardView card={game.pending.card} activeThemes={['population', 'area']} highlight={game.currentThemeId} faceDown={true} declaredName={game.pending.declaredPref.name} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none animate-pulse">
                     <div className="bg-red-600 text-white font-black px-5 py-2 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.8)] text-lg italic uppercase border-2 border-white flex items-center gap-1">
                       <DoubtIcon size={20}/> DOUBT?
                     </div>
                  </div>
                </div>
              )}
              
              {game.fieldCards.length === 0 && !game.pending && (
                <div className="w-32 h-44 border-4 border-dashed border-emerald-700/30 rounded-2xl flex items-center justify-center">
                  <span className="text-emerald-700/40 font-black italic text-3xl uppercase tracking-widest">Field</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 自分の手札セクション */}
        <div className={`h-64 border-t-2 p-4 pb-10 shrink-0 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] z-50 backdrop-blur-2xl relative transition-colors duration-500 ${game.turn === actualViewIndex ? 'bg-emerald-800/90 border-emerald-400' : 'bg-emerald-950/95 border-emerald-900'}`}>
           <div className="flex justify-between items-center mb-5 max-w-lg mx-auto relative">
             <div className={`text-[10px] font-black italic uppercase flex items-center gap-1.5 px-4 py-1.5 rounded-full shadow-inner ${game.turn === actualViewIndex ? 'bg-emerald-400 text-emerald-950 shadow-emerald-300' : 'bg-emerald-900 text-emerald-600'}`}>
               <ClipboardList size={14}/> {game.turn === actualViewIndex ? 'YOUR TURN' : 'HAND'}
             </div>
             
             {/* アクションボタン */}
             {game.turn === actualViewIndex && currentMode === 'daifugo' && game.currentThemeId && game.phase === 'WAITING' && (
               <button onClick={()=>handlePassBasic(actualViewIndex)} className="text-xs font-black bg-slate-700 hover:bg-slate-600 text-white px-8 py-2 rounded-full border-b-4 border-slate-900 active:scale-95 active:border-b-0 active:translate-y-1 transition-all shadow-lg">パスする</button>
             )}
             
             {game.phase === 'DOUBT_WINDOW' && game.pending?.playerIndex !== actualViewIndex && (
               <button onClick={()=>onResolveDoubt(actualViewIndex)} className="text-sm font-black bg-red-500 hover:bg-red-400 text-white px-10 py-2.5 rounded-full border-b-4 border-red-700 active:scale-95 active:border-b-0 active:translate-y-1 transition-all shadow-[0_5px_20px_rgba(239,68,68,0.4)] animate-pulse">ダウト！！</button>
             )}

             {cp?.passed && <span className="text-[10px] font-black text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full uppercase tracking-widest italic border border-slate-700">PASS中</span>}
           </div>
           
           <div className="flex justify-center items-end space-x-2 h-40 overflow-x-auto scrollbar-hide px-4 pb-2">
             {cp?.hand.map(c => {
               const selectable = canPlayCard(c);
               return (
                 <div key={c.id} className={`${game.turn === actualViewIndex && game.phase === 'WAITING' && selectable ? 'animate-[bounce_2s_infinite]' : ''}`} style={{animationDelay: `${Math.random()}s`}}>
                   <CardView 
                     card={c} 
                     activeThemes={['population', 'area']} 
                     selectable={selectable} 
                     onClick={() => currentMode === 'daifugo' ? handlePlayBasic(actualViewIndex, c, game.currentThemeId || pendingTheme) : handleDoubtPlayClick(c)} 
                     highlight={game.currentThemeId || pendingTheme} 
                   />
                 </div>
               );
             })}
             {cp?.hand.length === 0 && <div className="text-emerald-700/50 font-black italic text-2xl h-full flex items-center uppercase tracking-widest">No Cards</div>}
           </div>
        </div>

        {/* ダウト：嘘の宣言用モーダル */}
        {showDeclareModal && selectedCardToPlay && (
          <div className="fixed inset-0 bg-emerald-950/95 z-[400] flex flex-col items-center justify-center p-6 text-center animate-fade-in backdrop-blur-xl">
            <h2 className="text-2xl font-black text-emerald-300 mb-6 drop-shadow-md">どの都道府県として出しますか？</h2>
            
            <div className="mb-8 flex justify-center scale-110 drop-shadow-2xl">
              <CardView card={selectedCardToPlay} activeThemes={['population', 'area']} highlight={game.currentThemeId || pendingTheme} />
            </div>

            <div className="w-full max-w-sm bg-emerald-900/50 p-5 rounded-[32px] border border-emerald-500/20 shadow-2xl">
              <div className="relative mb-4">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />
                <input 
                  type="text" 
                  placeholder="都道府県を検索..." 
                  value={searchPrefectureQuery}
                  onChange={(e) => setSearchPrefectureQuery(e.target.value)}
                  className="w-full bg-emerald-950/80 text-white pl-12 pr-4 py-3.5 rounded-2xl font-bold focus:ring-4 ring-emerald-500/50 outline-none placeholder:text-emerald-700 shadow-inner"
                />
              </div>

              <div className="h-48 overflow-y-auto rounded-2xl bg-emerald-950/40 p-2 space-y-2 border border-emerald-800/50 scrollbar-hide">
                {PREFECTURES.filter(pref => pref.name.includes(searchPrefectureQuery)).map(pref => {
                  const isTruth = pref.id === selectedCardToPlay.id;
                  return (
                    <button 
                      key={pref.id}
                      onClick={() => executeDoubtPlay(pref)}
                      className={`w-full text-left px-5 py-4 rounded-xl font-black transition-all flex justify-between items-center ${isTruth ? 'bg-emerald-600 text-white shadow-md' : 'bg-emerald-800/40 text-emerald-100 hover:bg-emerald-700'}`}
                    >
                      <span className="text-lg">{pref.name}</span>
                      {isTruth && <span className="text-[10px] bg-emerald-950/50 text-emerald-200 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-400/30">本当</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <button 
              onClick={() => { setShowDeclareModal(false); setSelectedCardToPlay(null); }} 
              className="mt-8 text-sm font-bold text-emerald-500 hover:text-emerald-300 underline tracking-widest"
            >
              キャンセル
            </button>
          </div>
        )}

        {/* 判定結果モーダル */}
        {game.phase === 'RESOLUTION' && game.doubtResult && (
          <div className="fixed inset-0 bg-emerald-950/95 z-[500] flex items-center justify-center p-6 text-center animate-fade-in backdrop-blur-2xl">
            <div className={`p-10 w-full max-w-sm rounded-[48px] border-4 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center ${game.doubtResult.isTruth ? 'bg-emerald-600 border-emerald-300' : 'bg-red-600 border-red-300'}`}>
              <div className="bg-white/20 p-4 rounded-full mb-4 backdrop-blur-sm">
                {game.doubtResult.isTruth ? <CheckCircle size={64} className="text-white" /> : <XCircle size={64} className="text-white" />}
              </div>
              <h2 className="text-5xl font-black mb-8 italic text-white uppercase drop-shadow-md tracking-tighter">
                {game.doubtResult.isTruth ? 'SUCCESS!' : 'OUT!'}
              </h2>
              
              <div className="flex flex-col items-center gap-4 mb-10 w-full">
                 <div className="flex justify-center scale-110 drop-shadow-xl"><CardView card={game.doubtResult.actual} activeThemes={['population', 'area']} highlight={game.doubtResult.themeUsed} /></div>
                 <div className="text-white bg-black/30 px-6 py-2 rounded-full font-black text-sm shadow-inner border border-white/10 mt-4 flex items-center gap-2">
                   <span className="text-white/60 text-[10px] uppercase">正解のカード</span> {game.doubtResult.actual.name}
                 </div>
              </div>
              
              <div className="bg-black/20 w-full py-4 rounded-2xl mb-8 border border-white/10">
                <p className="text-white font-black text-lg">{game.players[game.doubtResult.loserId]?.name} がペナルティ</p>
                <p className="text-white/70 text-[10px] mt-1 font-bold">手札が5枚になるまで補充されます</p>
              </div>

              <button onClick={() => updateGame(prev => ({...prev, phase: 'WAITING', doubtResult: null, fieldCards: [], currentThemeId: null, turn: prev.doubtResult.loserId, message: 'リスタート！親は属性を選択' }))} className="w-full bg-white text-slate-900 py-5 rounded-full font-black shadow-xl active:scale-95 transition-all text-xl">次のラウンドへ</button>
            </div>
          </div>
        )}

        {/* ゲーム終了 */}
        {game.phase === 'OVER' && (
          <div className="fixed inset-0 bg-emerald-950/95 z-[600] flex flex-col items-center justify-center text-center p-6 backdrop-blur-2xl">
            <div className="bg-emerald-800/80 p-12 w-full max-w-sm rounded-[48px] border border-emerald-500/30 shadow-[0_0_100px_rgba(16,185,129,0.2)] flex flex-col items-center">
              <Award size={100} className="text-yellow-400 mb-8 mx-auto animate-bounce drop-shadow-[0_0_30px_rgba(250,204,21,0.6)]" />
              <h2 className="text-3xl font-black text-emerald-200 mb-2 tracking-widest uppercase">Winner</h2>
              <h3 className="text-6xl font-black italic text-white mb-12 drop-shadow-lg">{game.winner?.name}</h3>
              <button onClick={() => setStep('MENU')} className="w-full bg-emerald-400 hover:bg-emerald-300 text-emerald-950 py-5 rounded-full font-black text-2xl shadow-lg active:scale-95 transition-all">タイトルに戻る</button>
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
}