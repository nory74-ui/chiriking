import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Users, Map as MapIcon, BarChart, Sprout, Factory, 
  CloudRain, Activity, Play, RotateCcw, Award, 
  AlertCircle, ShieldAlert, CheckCircle, XCircle, 
  ChevronRight, Smartphone, User, Cpu, ThumbsUp,
  Network, Plus, LogIn, ClipboardList, ShieldAlert as DoubtIcon
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

// ==========================================
// 2. UIコンポーネント
// ==========================================
const CardView = ({ card, activeThemes, faceDown, selectable, onClick, highlight, small, declaredName }) => {
  if (faceDown) {
    return (
      <div className={`${small ? 'w-10 h-14 sm:w-16 sm:h-24' : 'w-20 h-28 sm:w-24 sm:h-36'} bg-emerald-900 rounded-lg shadow-md border-2 border-white/20 flex flex-col items-center justify-center relative overflow-hidden text-white`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
        <div className="text-[7px] sm:text-[10px] font-black italic tracking-tighter uppercase transform -rotate-45 opacity-30 mb-2">ChiriKing</div>
        {declaredName && (
          <div className="bg-black/60 px-2 py-0.5 rounded text-[8px] font-black text-white absolute bottom-2 whitespace-nowrap">{declaredName}</div>
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
        bg-white rounded-lg shadow-md border border-slate-300 flex flex-col items-center justify-between p-1 sm:p-2 relative transition-all
        ${selectable ? 'cursor-pointer hover:-translate-y-2 border-emerald-400 ring-2 ring-emerald-100' : 'opacity-90'}
      `}
    >
      <div className="text-[7px] sm:text-[8px] text-slate-400 w-full text-left font-serif italic">No.{card.id}</div>
      <div className="text-xs sm:text-base font-black text-slate-800 text-center tracking-tighter leading-tight">{card.name}</div>
      <div className="flex flex-col w-full space-y-0.5">
        {themes.map(t => (
          <div key={t.id} className={`flex justify-between items-center px-1 rounded-sm text-[7px] sm:text-[9px] ${highlight === t.id ? 'bg-emerald-800 text-white font-bold shadow-inner' : 'text-slate-500 bg-slate-50'}`}>
            <span className="flex items-center"><t.icon size={8} className="mr-0.5 sm:size-10"/>{t.name}</span>
            <span>{card[t.id]}<span className="text-[5px] sm:text-[6px] opacity-70 ml-0.5">{t.unit}</span></span>
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
  const [activeThemes, setActiveThemes] = useState(['population', 'area']);
  const [game, setGame] = useState(null);
  const [pendingTheme, setPendingTheme] = useState('population');
  
  const [nickname, setNickname] = useState('プレイヤー');
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
        id: i, name: i < playerCount ? (playerCount === 1 ? (nickname || 'あなた') : `${nickname}${i + 1}`) : `CPU ${i - playerCount + 1}`,
        isCpu: i >= playerCount, hand: deck.slice(i * 5, (i + 1) * 5).sort((a,b) => a.id - b.id), passed: false
      }));
      setGame({
        mode, players, turn: 0, fieldCards: [], currentThemeId: null, winner: null, phase: 'WAITING',
        message: '勝負開始！', deck: deck.slice(20)
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
      message: '開始！', deck: deck.slice(20)
    };
    await supabase.from('rooms').update({ status: 'playing', game: initialGame }).eq('id', roomId);
  };

  const moveToNext = useCallback(() => {
    updateGame(prev => {
      if (!prev || prev.winner) return prev;
      let next = (prev.turn + 1) % 4;
      if (prev.mode === 'daifugo') {
        let loop = 0;
        while (prev.players[next].passed && loop < 4) { next = (next + 1) % 4; loop++; }
        if (next === (prev.lastPlayedIdx || 0) && prev.players.filter(p => p.passed).length >= 3) {
          return { ...prev, turn: prev.lastPlayedIdx, fieldCards: [], currentThemeId: null, players: prev.players.map(p => ({ ...p, passed: false })), phase: 'WAITING', message: `🔄 場が流れました。` };
        }
      }
      return { ...prev, turn: next, phase: 'WAITING' };
    });
  }, [updateGame]);

  const handlePlayBasic = (idx, card, theme = null) => {
    updateGame(prev => {
      const activeT = prev.currentThemeId || theme || pendingTheme;
      const newPlayers = prev.players.map((p, i) => i === idx ? { ...p, hand: p.hand.filter(c => c.id !== card.id) } : p);
      if (newPlayers[idx].hand.length === 0) return { ...prev, players: newPlayers, winner: newPlayers[idx], phase: 'OVER' };
      return { ...prev, lastPlayedIdx: idx, players: newPlayers.map(p => ({ ...p, passed: false })), fieldCards: [...prev.fieldCards, card], currentThemeId: activeT, phase: 'RESOLVING', message: `${prev.players[idx].name}のカード！` };
    });
  };

  // ダウトモードでカードをクリックした時の処理（嘘の宣言モーダルを表示）
  const handleDoubtPlayClick = (card) => {
    setSelectedCardToPlay(card);
    setShowDeclareModal(true);
  };

  // 嘘の宣言を確定してカードを出す処理
  const executeDoubtPlay = (declaredPref) => {
    setShowDeclareModal(false);
    const cardToPlay = selectedCardToPlay;
    setSelectedCardToPlay(null);
    setSearchPrefectureQuery('');

    updateGame(prev => {
      const tid = prev.currentThemeId || pendingTheme;
      return {
        ...prev, 
        players: prev.players.map((p, i) => i === prev.turn ? { ...p, hand: p.hand.filter(c => c.id !== cardToPlay.id) } : p), 
        pending: { card: cardToPlay, declaredPref, playerIndex: prev.turn, themeAtPlay: tid }, 
        currentThemeId: tid,
        phase: 'DOUBT_WINDOW',
        message: `${prev.players[prev.turn].name}が「${declaredPref.name}」を宣言！`
      };
    });
  };

  const onResolveDoubt = (doubterId) => {
    updateGame(prev => {
      if (prev.phase !== 'DOUBT_WINDOW' || !prev.pending) return prev;
      const tid = prev.pending.themeAtPlay || 'population'; // 万が一のためにフォールバック
      const targetValue = prev.fieldCards.length === 0 ? 0 : prev.fieldCards[prev.fieldCards.length-1][tid] || 0;
      
      const isTruth = (prev.pending.card[tid] >= targetValue) && (prev.pending.card.id === prev.pending.declaredPref.id);
      const loserId = isTruth ? doubterId : prev.pending.playerIndex;
      
      let newHand = [...prev.players[loserId].hand];
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
        fieldCards: [...prev.fieldCards, prev.pending.card], pending: null, message: `誰もダウトしませんでした。` 
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
        if (!game.currentThemeId) handlePlayBasic(game.turn, p.hand[0], cpuTheme);
        else {
          const top = game.fieldCards[game.fieldCards.length-1][game.currentThemeId];
          const v = p.hand.filter(c => c[game.currentThemeId] > top).sort((a,b)=>a[game.currentThemeId]-b[game.currentThemeId])[0];
          if (v) handlePlayBasic(game.turn, v); else handlePassBasic(game.turn);
        }
      } else {
        // CPUのダウトモードロジック：基本は本当のことを言うが、たまに嘘の宣言をする（20%の確率）
        const isLying = Math.random() < 0.2;
        const actualCard = p.hand[0];
        let declaredPref = actualCard;
        
        if (isLying) {
          const possibleLies = PREFECTURES.filter(pref => pref.id !== actualCard.id);
          declaredPref = possibleLies[Math.floor(Math.random() * possibleLies.length)];
        }
        
        updateGame(prev => {
          const tid = prev.currentThemeId || cpuTheme;
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

  // UI
  if (step === 'MENU') return (
    <div className="min-h-screen bg-emerald-800 flex flex-col items-center justify-center p-6 text-center text-white font-sans overflow-hidden relative">
      <style dangerouslySetInnerHTML={{__html: `@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }.animate-fade-in { animation: fade-in 0.4s forwards; }`}} />
      <div className="z-10 w-full max-w-sm space-y-12 animate-fade-in">
        <h1 className="text-6xl font-black italic tracking-tighter drop-shadow-xl">CHIRIKING</h1>
        <div className="bg-white/10 p-5 rounded-3xl border border-white/20 shadow-lg">
          <label className="text-[10px] font-black uppercase tracking-widest text-emerald-300 block mb-2">Nickname</label>
          <div className="relative text-white">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />
            <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="名前を入力" className="w-full bg-emerald-950/50 text-white pl-12 pr-4 py-4 rounded-2xl font-black focus:ring-4 ring-emerald-400 outline-none transition-all placeholder:text-white/20"/>
          </div>
        </div>
        <div className="space-y-4">
          <button onClick={() => { setIsOnline(false); setStep('PLAYER_SELECT'); }} className="w-full py-5 bg-white text-emerald-900 rounded-2xl font-black text-2xl shadow-xl active:scale-95 transition-all">1台で遊ぶ</button>
          <button onClick={() => { setIsOnline(true); setStep('ONLINE_MENU'); }} className="w-full py-5 bg-emerald-950 text-white rounded-2xl font-black text-2xl border border-white/20 shadow-xl active:scale-95 transition-all">オンライン対戦</button>
        </div>
      </div>
    </div>
  );

  if (step === 'PLAYER_SELECT') return (
    <div className="min-h-screen bg-emerald-800 flex items-center justify-center p-6 text-white text-center">
      <div className="bg-white p-10 rounded-[48px] max-w-md w-full text-slate-800 shadow-2xl animate-fade-in">
        <h2 className="text-3xl font-black text-emerald-700 mb-8 italic">何人で遊ぶ？</h2>
        <div className="flex flex-col gap-4 mb-8">
          {[1, 2, 3, 4].map(num => (
            <button key={num} onClick={() => { setPlayerCount(num); setStep('RULE'); }} className={`py-4 rounded-2xl font-black text-xl border-4 transition-all duration-200 flex items-center justify-center gap-3 ${playerCount === num ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}><Users size={24} /> {num}人</button>
          ))}
        </div>
        <button onClick={() => setStep('MENU')} className="text-sm font-bold text-slate-400 underline">戻る</button>
      </div>
    </div>
  );

  if (step === 'ONLINE_MENU') return (
    <div className="min-h-screen bg-emerald-800 flex flex-col items-center justify-center p-6 text-white text-center">
      {errorMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-full z-[1000] flex items-center gap-2 shadow-lg">
          <AlertCircle size={20}/>{errorMsg}<button onClick={() => setErrorMsg('')}><XCircle size={16}/></button>
        </div>
      )}
      <div className="w-full max-w-sm space-y-8 animate-fade-in">
        <h2 className="text-4xl font-black italic">ONLINE</h2>
        <div className="bg-white/10 p-6 rounded-[32px] border border-white/10 shadow-2xl space-y-6">
          <button onClick={() => { setIsOnline(true); setStep('PLAYER_SELECT'); }} className="w-full bg-white text-emerald-900 py-5 rounded-2xl font-black text-2xl shadow-md">部屋を作る</button>
          <div className="space-y-2">
            <input type="text" value={joinRoomIdInput} onChange={e => setJoinRoomIdInput(e.target.value)} placeholder="ルームID" className="w-full bg-emerald-950/50 text-white text-center text-3xl font-black py-4 rounded-2xl outline-none placeholder:text-white/30 transition-all"/>
            <button disabled={!supabase} onClick={joinRoom} className={`w-full py-5 rounded-2xl font-black text-xl transition-all ${supabase ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-500 text-slate-300'}`}>参加する</button>
          </div>
        </div>
        <button onClick={() => setStep('MENU')} className="text-sm underline">戻る</button>
      </div>
    </div>
  );

  if (step === 'LOBBY') return (
    <div className="min-h-screen bg-emerald-800 flex flex-col items-center justify-center p-6 text-white text-center">
      <div className="bg-white p-10 rounded-[48px] max-w-sm w-full text-slate-800 shadow-2xl">
        <h2 className="text-3xl font-black text-emerald-700 mb-6 italic">待機室</h2>
        <div className="bg-slate-100 p-4 rounded-2xl mb-6"><p className="text-4xl font-mono font-black text-emerald-600">{roomId}</p></div>
        <div className="text-left mb-6 space-y-2">
          {roomData?.players?.map((p, i) => (
            <div key={p.uid} className="bg-emerald-50 p-3 rounded-xl font-black flex items-center gap-2 text-emerald-900"><User size={16}/> {p.name} {i === 0 && <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full ml-auto">HOST</span>}</div>
          ))}
        </div>
        {roomData?.host_uid === user?.uid ? (
          <button onClick={handleStartOnlineMatch} className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black text-xl shadow-lg">開始</button>
        ) : (
          <p className="text-slate-400 font-black animate-pulse">ホストを待っています...</p>
        )}
      </div>
    </div>
  );

  if (step === 'RULE') return (
    <div className="min-h-screen bg-emerald-800 flex items-center justify-center p-6 text-white text-center">
      <div className="bg-white p-10 rounded-[48px] max-w-md w-full text-slate-800 shadow-2xl">
        <h2 className="text-3xl font-black text-emerald-700 mb-8 italic">ルール</h2>
        <div className="flex gap-4 mb-8">
          <button onClick={()=>setMode('daifugo')} className={`flex-1 py-4 rounded-xl font-black border-2 ${mode==='daifugo'?'bg-emerald-600 text-white':'border-slate-200 text-slate-400'}`}>基本</button>
          <button onClick={()=>setMode('doubt')} className={`flex-1 py-4 rounded-xl font-black border-2 ${mode==='doubt'?'bg-red-600 text-white':'border-slate-200 text-slate-400'}`}>ダウト</button>
        </div>
        <button onClick={handleStartButton} className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black text-2xl">決定！</button>
      </div>
    </div>
  );

  if (step === 'BOARD' && game) {
    const actualViewIndex = isOnline ? myPlayerIndex : game.turn;
    const cp = game.players[actualViewIndex];
    const currentOrPendingThemeId = game.currentThemeId || pendingTheme;
    const td = THEME_DEFS[currentOrPendingThemeId];
    const currentMode = game.mode || mode;

    return (
      <div className="min-h-screen bg-emerald-800 text-white flex flex-col overflow-hidden relative">
        <div className="bg-emerald-950/90 p-3 flex justify-between items-center shrink-0 border-b border-white/10 z-50 backdrop-blur-md">
          <div className="flex flex-col text-white">
            <div className="font-black text-emerald-500 text-[10px] italic tracking-widest flex items-center gap-1 uppercase"><MapIcon size={12}/> CHIRIKING</div>
            <div className={`text-[8px] font-bold uppercase px-1.5 rounded-sm inline-block ${currentMode === 'doubt' ? 'bg-red-600' : 'bg-emerald-600'} text-white`}>{currentMode}</div>
          </div>
          <div className="text-[10px] font-black text-emerald-100">{game.message}</div>
          <button onClick={() => setStep('MENU')} className="text-[9px] bg-red-600/20 text-red-400 font-black px-2 py-1 rounded">EXIT</button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center relative px-4">
          <div className="absolute top-4 left-0 right-0 flex justify-center gap-4 z-40 px-4">
            {game.players.map((p, i) => (
              i !== (isOnline ? myPlayerIndex : -1) && (
                <div key={i} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl border-2 transition-all ${game.turn === i ? 'bg-emerald-500 text-emerald-950 scale-110 shadow-lg' : 'bg-black/40 border-white/10 text-white/70 opacity-80'}`}>
                  <span className="text-[10px] font-black truncate max-w-[60px]">{p.name}</span>
                  <div className="flex items-center gap-1">
                    <div className="flex -space-x-1.5">{Array.from({ length: Math.min(p.hand.length, 5) }).map((_, idx) => <div key={idx} className="w-3 h-4 bg-emerald-900 border border-white/30 rounded-sm" />)}</div>
                    <span className="text-xs font-black">{p.hand.length}枚</span>
                  </div>
                </div>
              )
            ))}
          </div>

          {!game.currentThemeId ? (
            <div className="text-center mt-12 mb-6 z-10 animate-fade-in w-full max-w-sm">
              {game.turn === (isOnline ? myPlayerIndex : game.turn) ? (
                <div className="bg-emerald-900/90 p-5 rounded-[32px] border-2 border-emerald-400 shadow-xl backdrop-blur-md">
                  <p className="text-xs font-black text-emerald-300 mb-4 tracking-widest">属性を選んで勝負開始</p>
                  <div className="flex justify-center gap-4">{Object.values(THEME_DEFS).map(TDef => <button key={TDef.id} onClick={() => setPendingTheme(TDef.id)} className={`px-5 py-3 rounded-2xl font-black flex flex-col items-center gap-1 border-2 ${pendingTheme === TDef.id ? 'bg-emerald-50 text-emerald-950 border-emerald-300 scale-110 shadow-lg' : 'bg-black/40 border-white/10'}`}><TDef.icon size={20}/> <span className="text-xs">{TDef.name}</span></button>)}</div>
                </div>
              ) : (
                <div className="bg-black/40 px-6 py-4 rounded-3xl border border-white/10"><p className="text-sm font-black text-emerald-400/80 animate-pulse tracking-widest">{game.players[game.turn]?.name} が属性を選んでいます...</p></div>
              )}
            </div>
          ) : (
            td && (
              <div className="bg-emerald-900/80 p-6 rounded-[40px] border-2 border-emerald-400 text-center mt-10 mb-6 backdrop-blur-md shadow-xl animate-fade-in relative z-10 w-72">
                 <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-400 text-emerald-950 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md flex items-center gap-1"><td.icon size={14}/> CURRENT THEME</div>
                 <div className="text-emerald-100 text-sm font-black mb-3">{td.name} 勝負</div>
                 <div className="text-white text-2xl font-black italic flex items-baseline justify-center gap-2">
                   {game.fieldCards.length > 0 ? (currentMode === 'doubt' ? "???" : game.fieldCards[game.fieldCards.length-1].name) : "待機中"}
                   <span className="text-yellow-400 font-mono text-5xl drop-shadow-md leading-none ml-2">
                     {game.fieldCards.length > 0 ? (currentMode === 'doubt' ? "?" : game.fieldCards[game.fieldCards.length-1][game.currentThemeId]) : "-"}
                   </span>
                 </div>
              </div>
            )
          )}
          
          <div className="relative w-40 h-52 flex items-center justify-center">
            {game.fieldCards.map((c, i) => (
              <div key={i} className="absolute transform transition-transform duration-500" style={{ rotate: `${(i*7)%30-15}deg`, zIndex: i }}>
                <CardView card={c} activeThemes={['population', 'area']} highlight={game.currentThemeId} faceDown={currentMode === 'doubt'} declaredName={currentMode === 'doubt' ? PREFECTURES.find(p=>p.id===c.id)?.name : null} />
              </div>
            ))}
            {game.phase === 'DOUBT_WINDOW' && (
              <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none animate-bounce">
                 <div className="bg-red-600 text-white font-black px-6 py-2 rounded-full shadow-2xl text-xl italic uppercase border-2 border-white"><DoubtIcon size={24}/> DOUBT?</div>
              </div>
            )}
          </div>
        </div>

        <div className={`h-64 border-t-4 p-4 pb-10 shrink-0 shadow-2xl z-50 backdrop-blur-xl relative ${game.turn === actualViewIndex ? 'bg-emerald-800/95 border-emerald-400' : 'bg-emerald-950/95 border-emerald-950'}`}>
           <div className="flex justify-between items-center mb-4 max-w-lg mx-auto relative">
             <div className={`text-[10px] font-black italic uppercase flex items-center gap-1 px-3 py-1 rounded-full ${game.turn === actualViewIndex ? 'bg-emerald-400 text-emerald-950' : 'text-emerald-500/50'}`}>
               <ClipboardList size={12}/> {game.turn === actualViewIndex ? 'あなたのターン' : '手札'}
             </div>
             {game.turn === actualViewIndex && currentMode === 'daifugo' && game.currentThemeId && game.phase === 'WAITING' && (
               <button onClick={()=>handlePassBasic(actualViewIndex)} className="text-[10px] font-black bg-red-500 text-white px-6 py-2 rounded-full border-b-4 border-red-700 shadow-md">パス</button>
             )}
             {game.phase === 'DOUBT_WINDOW' && game.pending?.playerIndex !== actualViewIndex && (
               <button onClick={()=>onResolveDoubt(actualViewIndex)} className="text-sm font-black bg-red-600 text-white px-8 py-2 rounded-full border-b-4 border-red-800 shadow-xl animate-pulse">ダウト！！</button>
             )}
           </div>
           <div className="flex justify-center items-end space-x-2 h-40 overflow-x-auto scrollbar-hide px-2">
             {cp?.hand.map(c => (
               <div key={c.id} className={`${game.turn === actualViewIndex && game.phase === 'WAITING' ? 'animate-[bounce_2s_infinite]' : ''}`}>
                 <CardView card={c} activeThemes={['population', 'area']} selectable={game.turn === actualViewIndex && game.phase === 'WAITING'} onClick={() => currentMode === 'daifugo' ? handlePlayBasic(actualViewIndex, c, game.currentThemeId || pendingTheme) : handleDoubtPlayClick(c)} highlight={game.currentThemeId || pendingTheme} />
               </div>
             ))}
           </div>
        </div>

        {/* 嘘の宣言用モーダル */}
        {showDeclareModal && selectedCardToPlay && (
          <div className="fixed inset-0 bg-black/90 z-[400] flex flex-col items-center justify-center p-4 text-center animate-fade-in backdrop-blur-md">
            <h2 className="text-2xl font-black text-white mb-6">どの都道府県として出しますか？</h2>
            
            <div className="mb-6 flex justify-center">
              <CardView card={selectedCardToPlay} activeThemes={['population', 'area']} />
            </div>

            <div className="w-full max-w-sm bg-emerald-900/80 p-4 rounded-3xl border border-white/20 shadow-2xl">
              <div className="relative mb-4">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />
                <input 
                  type="text" 
                  placeholder="都道府県を検索..." 
                  value={searchPrefectureQuery}
                  onChange={(e) => setSearchPrefectureQuery(e.target.value)}
                  className="w-full bg-emerald-950/50 text-white pl-12 pr-4 py-3 rounded-xl font-bold focus:ring-2 ring-emerald-400 outline-none"
                />
              </div>

              <div className="h-48 overflow-y-auto rounded-xl bg-emerald-950/30 p-2 space-y-2">
                {/* 検索に一致する都道府県をフィルタリング */}
                {PREFECTURES.filter(pref => pref.name.includes(searchPrefectureQuery)).map(pref => (
                  <button 
                    key={pref.id}
                    onClick={() => executeDoubtPlay(pref)}
                    className="w-full text-left px-4 py-3 bg-emerald-800/50 hover:bg-emerald-600 rounded-lg text-white font-bold transition-colors flex justify-between items-center"
                  >
                    <span>{pref.name}</span>
                    {pref.id === selectedCardToPlay.id && <span className="text-[10px] bg-emerald-500 text-emerald-950 px-2 py-0.5 rounded-full">本当</span>}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => {
                setShowDeclareModal(false);
                setSelectedCardToPlay(null);
              }} 
              className="mt-6 text-sm font-bold text-slate-400 underline"
            >
              キャンセル
            </button>
          </div>
        )}

        {game.phase === 'RESOLUTION' && game.doubtResult && (
          <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-8 text-center animate-fade-in backdrop-blur-lg">
            <div className={`p-12 rounded-[56px] border-4 shadow-2xl transform transition-transform ${game.doubtResult.isTruth ? 'bg-emerald-600 border-emerald-400' : 'bg-red-700 border-red-400'}`}>
              <h2 className="text-7xl font-black mb-6 italic text-white uppercase">{game.doubtResult.isTruth ? '成功！' : '失敗！'}</h2>
              <div className="flex flex-col items-center gap-4 mb-8">
                 <div className="flex justify-center scale-110"><CardView card={game.doubtResult.actual} activeThemes={['population', 'area']} highlight={game.doubtResult.themeUsed} /></div>
                 <div className="text-white bg-black/20 px-4 py-1 rounded-full font-bold text-xs">正解: {game.doubtResult.actual.name}</div>
              </div>
              <p className="text-white font-black text-xl mb-6">{game.players[game.doubtResult.loserId]?.name} が負け！</p>
              <button onClick={() => updateGame(prev => ({...prev, phase: 'WAITING', doubtResult: null, fieldCards: [], currentThemeId: null, turn: prev.doubtResult.loserId, message: 'リスタート！' }))} className="bg-white text-slate-900 px-12 py-4 rounded-full font-black shadow-xl active:scale-95 transition-all text-xl hover:bg-slate-100">次へ</button>
            </div>
          </div>
        )}

        {game.phase === 'OVER' && (
          <div className="fixed inset-0 bg-emerald-950 z-[300] flex flex-col items-center justify-center text-center p-8 backdrop-blur-xl">
            <div className="bg-emerald-900/80 p-16 rounded-[64px] border-2 border-emerald-400/30 shadow-2xl">
              <Award size={120} className="text-yellow-400 mb-6 mx-auto animate-bounce shadow-yellow-400/50" />
              <h2 className="text-7xl font-black italic text-white mb-2 tracking-tighter drop-shadow-md">優勝！</h2>
              <h3 className="text-5xl font-black italic text-emerald-400 mb-12">{game.winner?.name}</h3>
              <button onClick={() => setStep('MENU')} className="bg-white text-emerald-950 px-16 py-5 rounded-full font-black text-2xl shadow-xl hover:scale-105 active:scale-95 transition-all">タイトルへ</button>
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
}