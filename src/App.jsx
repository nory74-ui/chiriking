import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Users, Map as MapIcon, BarChart, Sprout, Factory, 
  CloudRain, Activity, Play, RotateCcw, Award, 
  AlertCircle, ShieldAlert, CheckCircle, XCircle, 
  ChevronRight, Smartphone, User, Cpu, ThumbsUp,
  Network, Plus, LogIn, ClipboardList
} from 'lucide-react';

// Tailwind CSSを動的に読み込む（プレビュー環境でのデザイン崩れ防止用）
const loadTailwind = () => {
  if (!document.getElementById('tailwind-script')) {
    const script = document.createElement('script');
    script.id = 'tailwind-script';
    script.src = 'https://cdn.tailwindcss.com';
    document.head.appendChild(script);
  }
};
loadTailwind();

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
  { id: 24, name: '三重県', population: 172, area: 5774, density: 297, agriculture: 1000, industry: 110000, precipitation: 2100, agingRate: 31.0 },
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
  area: { id: 'area', name: '面積', unit: 'km²', icon: MapIcon, color: 'text-green-600' },
  density: { id: 'density', name: '人口密度', unit: '人/km²', icon: BarChart, color: 'text-purple-600' },
  agriculture: { id: 'agriculture', name: '農業産出額', unit: '億円', icon: Sprout, color: 'text-orange-600' },
  industry: { id: 'industry', name: '製造品出荷額', unit: '億円', icon: Factory, color: 'text-slate-700' },
  precipitation: { id: 'precipitation', name: '年間降水量', unit: 'mm', icon: CloudRain, color: 'text-cyan-600' },
  agingRate: { id: 'agingRate', name: '高齢化率', unit: '%', icon: Activity, color: 'text-red-600' }
};

// ==========================================
// 2. UIコンポーネント
// ==========================================
const CardView = ({ card, activeThemes, faceDown, selectable, onClick, highlight, small }) => {
  if (faceDown) {
    return (
      <div className={`${small ? 'w-10 h-14 sm:w-16 sm:h-24' : 'w-20 h-28 sm:w-24 sm:h-36'} bg-emerald-900 rounded-lg shadow-md border-2 border-white/20 flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
        <div className="text-white/30 text-[7px] sm:text-[10px] font-black italic tracking-tighter uppercase transform -rotate-45">ChiriKing</div>
      </div>
    );
  }
  if (!card || !activeThemes) return null;
  const themes = activeThemes.map(id => THEME_DEFS[id]);

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
  const [supabase, setSupabase] = useState(null);
  const [step, setStep] = useState('MENU');
  const [mode, setMode] = useState('daifugo'); 
  const [playerCount, setPlayerCount] = useState(1);
  const [activeThemes, setActiveThemes] = useState(['population', 'area']);
  const [game, setGame] = useState(null);
  
  const [user, setUser] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [roomData, setRoomData] = useState(null);
  const [myPlayerIndex, setMyPlayerIndex] = useState(0);
  const [joinRoomIdInput, setJoinRoomIdInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const doubtTimerRef = useRef(null);

  // ビルドエラー回避のため、Supabaseを動的に読み込む
  useEffect(() => {
    let url = '';
    let key = '';
    
    try {
      // Vite等で環境変数がビルド時に置換されるのを期待
      url = import.meta.env.VITE_SUPABASE_URL || '';
      key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    } catch (e) {
      // 無視する
    }

    // 環境変数がなければオンライン機能は使えないのでスキップ
    if (!url || !key) return;

    if (window.supabase) {
      setSupabase(window.supabase.createClient(url, key));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@supabase/supabase-js@2';
    script.onload = () => {
      if (window.supabase) {
        setSupabase(window.supabase.createClient(url, key));
      }
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    // ログイン不要で遊べるように、ブラウザ側で一時的なIDを発行します
    const uid = Math.random().toString(36).substring(2, 15);
    setUser({ uid });
  }, []);

  // Supabase リアルタイム購読
  useEffect(() => {
    if (!isOnline || !roomId || !user || !supabase) return;

    const fetchRoom = async () => {
      const { data, error } = await supabase.from('rooms').select('*').eq('id', roomId).single();
      if (data) {
        setRoomData(data);
        if (data.game) setGame(data.game);
        if (data.mode) setMode(data.mode);
        if (data.active_themes) setActiveThemes(data.active_themes);
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
        if (data.active_themes) setActiveThemes(data.active_themes);
        const pIdx = data.players.findIndex(p => p.uid === user.uid);
        if (pIdx !== -1) setMyPlayerIndex(pIdx);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isOnline, roomId, user, supabase]);

  useEffect(() => {
    if (step === 'LOBBY' && roomData?.status === 'playing') {
      setStep('BOARD');
    }
  }, [step, roomData?.status]);

  const updateGame = useCallback(async (updater) => {
    setGame(prev => {
      const newState = typeof updater === 'function' ? updater(prev) : updater;
      if (isOnline && roomId && supabase) {
        supabase.from('rooms').update({ game: newState }).eq('id', roomId).catch(e => console.error(e));
      }
      return newState;
    });
  }, [isOnline, roomId, supabase]);

  const createRoom = async () => {
    if (!supabase) { setErrorMsg('Supabaseが未設定です。URLとキーをVercelに設定してください。'); return; }
    if (!user) return;
    const newRoomId = Math.floor(1000 + Math.random() * 9000).toString();
    try {
      const { error } = await supabase.from('rooms').insert([{
        id: newRoomId, host_uid: user.uid, players: [{ uid: user.uid, name: 'ホスト' }],
        status: 'waiting', game: null, mode: mode, active_themes: activeThemes
      }]);
      if (error) throw error;
      setRoomId(newRoomId);
      setStep('LOBBY');
    } catch (e) { setErrorMsg('部屋の作成に失敗しました'); }
  };

  const joinRoom = async () => {
    if (!supabase) { setErrorMsg('Supabaseが未設定です'); return; }
    if (!user || !joinRoomIdInput) return;
    try {
      const { data, error } = await supabase.from('rooms').select('*').eq('id', joinRoomIdInput).single();
      if (error || !data) { setErrorMsg("部屋が見つかりません"); return; }
      if (data.status !== 'waiting') { setErrorMsg("進行中です"); return; }
      const newPlayers = [...data.players, { uid: user.uid, name: `ゲスト${data.players.length}` }];
      await supabase.from('rooms').update({ players: newPlayers }).eq('id', joinRoomIdInput);
      setRoomId(joinRoomIdInput);
      setIsOnline(true);
      setStep('LOBBY');
    } catch (e) { setErrorMsg('入室エラー'); }
  };

  const handleStartButton = () => {
    if (isOnline) { createRoom(); } else {
      const deck = [...PREFECTURES].sort(() => Math.random() - 0.5);
      const players = Array.from({ length: 4 }).map((_, i) => ({
        id: i, name: i < playerCount ? (playerCount === 1 ? 'あなた' : `プレイヤー${i + 1}`) : `CPU ${i - playerCount + 1}`,
        isCpu: i >= playerCount, hand: deck.slice(i * 5, (i + 1) * 5).sort((a,b) => a.id - b.id), passed: false
      }));
      setGame({
        players, turn: 0, viewIndex: 0, fieldCards: [], currentThemeId: null, lastPlayedIdx: 0, winner: null, phase: 'WAITING',
        isPassing: playerCount > 1, nextViewIndex: 0, message: '対戦を開始します', targetValue: 0, targetPref: null,
        pending: null, doubtResult: null, modal: null, selectedCard: null, deck: deck.slice(20)
      });
      setStep('BOARD');
    }
  };

  const handleStartOnlineMatch = async () => {
    if (!roomData || roomData.host_uid !== user.uid || !supabase) return;
    const deck = [...PREFECTURES].sort(() => Math.random() - 0.5);
    const pCount = roomData.players.length;
    const players = Array.from({ length: 4 }).map((_, i) => ({
      id: i, name: i < pCount ? roomData.players[i].name : `CPU ${i - pCount + 1}`,
      isCpu: i >= pCount, hand: deck.slice(i * 5, (i + 1) * 5).sort((a,b) => a.id - b.id), passed: false
    }));
    const initialGame = {
      players, turn: 0, viewIndex: 0, fieldCards: [], currentThemeId: null, lastPlayedIdx: 0, winner: null, phase: 'WAITING',
      isPassing: false, nextViewIndex: 0, message: '開始！', targetValue: 0, targetPref: null, pending: null, deck: deck.slice(20)
    };
    await supabase.from('rooms').update({ status: 'playing', game: initialGame }).eq('id', roomId);
  };

  const moveToNext = useCallback(() => {
    updateGame(prev => {
      if (!prev || prev.winner) return prev;
      let next = (prev.turn + 1) % 4;
      if (mode === 'daifugo') {
        let loop = 0;
        while (prev.players[next].passed && loop < 4) { next = (next + 1) % 4; loop++; }
        if (next === prev.lastPlayedIdx && prev.players.filter(p => p.passed).length >= 3) {
          const reset = prev.players.map(p => ({ ...p, passed: false }));
          return { ...prev, turn: prev.lastPlayedIdx, fieldCards: [], currentThemeId: null, players: reset, phase: 'WAITING', message: `🔄 場が流れました。` };
        }
      }
      return { ...prev, turn: next, phase: 'WAITING' };
    });
  }, [mode, updateGame]);

  const handlePlayBasic = (idx, card, theme = null) => {
    updateGame(prev => {
      const activeT = theme || prev.currentThemeId;
      const newPlayers = prev.players.map((p, i) => i === idx ? { ...p, hand: p.hand.filter(c => c.id !== card.id) } : p);
      if (newPlayers[idx].hand.length === 0) return { ...prev, players: newPlayers, winner: newPlayers[idx], phase: 'OVER' };
      return { ...prev, players: newPlayers.map(p => ({ ...p, passed: false })), fieldCards: [...prev.fieldCards, card], currentThemeId: activeT, lastPlayedIdx: idx, phase: 'RESOLVING', message: `${prev.players[idx].name}の番` };
    });
  };

  const handlePassBasic = (idx) => updateGame(prev => ({ ...prev, players: prev.players.map((p, i) => i === idx ? { ...p, passed: true } : p), phase: 'RESOLVING', message: `パス` }));

  const onDoubtPlay = (card, declared) => updateGame(prev => ({
    ...prev, players: prev.players.map((p, i) => i === prev.turn ? { ...p, hand: p.hand.filter(c => c.id !== card.id) } : p), 
    pending: { card, declared, playerIndex: prev.turn }, phase: 'DOUBT_WINDOW'
  }));

  const onResolveDoubt = (doubterId) => {
    updateGame(prev => {
      if (prev.phase !== 'DOUBT_WINDOW') return prev;
      const tid = prev.currentThemeId;
      const isTruth = prev.pending.card[tid] >= (prev.fieldCards.length === 0 ? prev.pending.declared[tid] : prev.targetValue);
      const loserId = isTruth ? doubterId : prev.pending.playerIndex;
      let newHand = [...prev.players[loserId].hand];
      let currentDeck = [...prev.deck];
      while (newHand.length < 5 && currentDeck.length > 0) newHand.push(currentDeck.shift());
      return { ...prev, deck: currentDeck, players: prev.players.map((p, i) => i === loserId ? { ...p, hand: newHand.sort((a,b)=>a.id-b.id) } : p), phase: 'RESOLUTION', doubtResult: { actual: prev.pending.card, isTruth, loserId } };
    });
  };

  const onAcceptDoubt = useCallback(() => {
    updateGame(prev => {
      if (prev.phase !== 'DOUBT_WINDOW') return prev;
      if (prev.players[prev.turn].hand.length === 0) return { ...prev, winner: prev.players[prev.turn], phase: 'OVER' };
      return { ...prev, turn: (prev.turn + 1) % 4, phase: 'WAITING', targetValue: prev.pending.declared[prev.currentThemeId], targetPref: prev.pending.declared, fieldCards: [...prev.fieldCards, prev.pending.card], pending: null };
    });
  }, [updateGame]);

  useEffect(() => {
    if (!game) return;
    if (isOnline && roomData?.host_uid !== user?.uid) return;
    if (game.phase === 'RESOLVING') { const t = setTimeout(moveToNext, 1200); return () => clearTimeout(t); }
    if (mode === 'doubt' && game.phase === 'DOUBT_WINDOW') {
       const t = setTimeout(onAcceptDoubt, 4000); return () => clearTimeout(t);
    }
  }, [game?.phase, mode, isOnline, roomData?.host_uid, moveToNext, onAcceptDoubt]);

  useEffect(() => {
    if (!game || game.winner || game.isPassing || game.phase !== 'WAITING') return;
    if (isOnline && roomData?.host_uid !== user?.uid) return; 
    const p = game.players[game.turn];
    if (!p || !p.isCpu) return;
    const t = setTimeout(() => {
      if (mode === 'daifugo') {
        if (!game.currentThemeId) handlePlayBasic(game.turn, p.hand[0], activeThemes[0]);
        else {
          const top = game.fieldCards[game.fieldCards.length-1][game.currentThemeId];
          const v = p.hand.filter(c => c[game.currentThemeId] > top).sort((a,b)=>a[game.currentThemeId]-b[game.currentThemeId])[0];
          if (v) handlePlayBasic(game.turn, v); else handlePassBasic(game.turn);
        }
      } else {
        if (!game.currentThemeId) updateGame(prev => ({ ...prev, currentThemeId: activeThemes[0], targetValue: 0 }));
        else onDoubtPlay(p.hand[0], p.hand[0]);
      }
    }, 1500);
    return () => clearTimeout(t);
  }, [game?.turn, game?.phase, mode, activeThemes, isOnline, roomData?.host_uid, updateGame]);

  const renderError = () => errorMsg && (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-full z-[1000] flex items-center gap-2 font-black">
      <AlertCircle size={20}/>{errorMsg}
      <button onClick={() => setErrorMsg('')}><XCircle size={16}/></button>
    </div>
  );

  if (step === 'MENU') return (
    <div className="min-h-screen bg-emerald-800 flex flex-col items-center justify-center p-6 text-center text-white font-sans">
      <style dangerouslySetInnerHTML={{__html: styles}} />
      <div className="z-10 w-full max-w-sm space-y-12">
        <h1 className="text-6xl font-black italic">チリキング</h1>
        <div className="space-y-4">
          <button onClick={() => { setIsOnline(false); setPlayerCount(1); setStep('THEME'); }} className="w-full py-5 bg-white text-emerald-900 rounded-2xl font-black text-2xl">1人で遊ぶ</button>
          <button onClick={() => { setIsOnline(true); setStep('ONLINE_MENU'); }} className="w-full py-5 bg-emerald-950 text-white rounded-2xl font-black text-2xl border border-white/20">オンライン対戦</button>
        </div>
      </div>
    </div>
  );

  if (step === 'ONLINE_MENU') return (
    <div className="min-h-screen bg-emerald-800 flex flex-col items-center justify-center p-6 text-white text-center">
      {renderError()}
      <div className="w-full max-w-sm space-y-8">
        <h2 className="text-4xl font-black italic">オンライン</h2>
        <div className="bg-white/10 p-6 rounded-[32px] backdrop-blur-md">
          <button onClick={() => {setPlayerCount(1); setStep('THEME');}} className="w-full bg-white text-emerald-900 py-5 rounded-2xl font-black text-2xl mb-6">部屋を作る</button>
          <input type="text" value={joinRoomIdInput} onChange={e => setJoinRoomIdInput(e.target.value)} placeholder="ルームID" className="w-full bg-emerald-950/50 text-white text-center text-3xl font-black py-4 rounded-2xl mb-4"/>
          <button onClick={joinRoom} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl">部屋に入る</button>
        </div>
        <button onClick={() => setStep('MENU')} className="text-sm underline">戻る</button>
      </div>
    </div>
  );

  if (step === 'LOBBY') return (
    <div className="min-h-screen bg-emerald-800 flex flex-col items-center justify-center p-6 text-white text-center">
      {renderError()}
      <div className="bg-white p-10 rounded-[48px] max-w-sm w-full text-slate-800">
        <h2 className="text-3xl font-black text-emerald-700 mb-6 italic">待機室</h2>
        <div className="bg-slate-100 p-4 rounded-2xl mb-6">
          <p className="text-4xl font-mono font-black text-emerald-600">{roomId}</p>
        </div>
        <div className="text-left mb-8">
          {roomData?.players?.map((p, i) => (
            <div key={p.uid} className="bg-emerald-50 p-3 rounded-xl mb-2 font-black">{p.name} {i === 0 && "(HOST)"}</div>
          ))}
        </div>
        {roomData?.host_uid === user?.uid ? (
          <button onClick={handleStartOnlineMatch} className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black text-xl">ゲーム開始</button>
        ) : (
          <p className="text-slate-400">ホストの開始を待っています...</p>
        )}
      </div>
    </div>
  );

  if (step === 'THEME') return (
    <div className="min-h-screen bg-emerald-800 text-white flex flex-col items-center justify-center p-6 space-y-10">
      <h2 className="text-4xl font-black italic">属性設定</h2>
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {Object.values(THEME_DEFS).map(t => (
          <button key={t.id} onClick={() => setActiveThemes([t.id, activeThemes[0]])} className={`p-5 rounded-2xl border-2 flex flex-col items-center ${activeThemes.includes(t.id) ? 'bg-white text-emerald-900 border-white' : 'bg-white/10'}`}>
            <t.icon size={32} /><span className="font-black text-sm">{t.name}</span>
          </button>
        ))}
      </div>
      <button onClick={() => setStep('RULE')} className="w-full max-w-xs py-5 bg-yellow-400 text-emerald-900 rounded-full font-black text-xl">決定</button>
    </div>
  );

  if (step === 'RULE') return (
    <div className="min-h-screen bg-emerald-800 flex items-center justify-center p-6 text-white text-center">
      <div className="bg-white p-10 rounded-[48px] max-w-md w-full text-slate-800">
        <h2 className="text-3xl font-black text-emerald-700 mb-8 italic">ルール確認</h2>
        <div className="flex gap-4 mb-8">
          <button onClick={()=>setMode('daifugo')} className={`flex-1 py-4 rounded-xl font-black border-2 ${mode==='daifugo'?'bg-emerald-600 text-white border-emerald-600':'border-slate-200'}`}>基本</button>
          <button onClick={()=>setMode('doubt')} className={`flex-1 py-4 rounded-xl font-black border-2 ${mode==='doubt'?'bg-red-600 text-white border-red-600':'border-slate-200'}`}>ダウト</button>
        </div>
        <button onClick={handleStartButton} className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black text-2xl">対戦開始！！</button>
      </div>
    </div>
  );

  if (step === 'BOARD' && game) {
    const actualViewIndex = isOnline ? myPlayerIndex : game.viewIndex;
    const cp = game.players[actualViewIndex];
    const td = THEME_DEFS[game.currentThemeId];

    return (
      <div className="min-h-screen bg-emerald-800 text-white flex flex-col overflow-hidden relative">
        <style dangerouslySetInnerHTML={{__html: styles}} />
        <div className="bg-emerald-950/80 p-3 flex justify-between items-center shrink-0">
          <div className="font-black text-emerald-500 text-sm italic">CHIRIKING</div>
          <div className="text-[10px] font-black bg-black/40 px-3 py-1 rounded-full uppercase italic">{game.message}</div>
          <button onClick={() => setStep('MENU')} className="text-[9px] bg-red-600/20 text-red-400 px-2 py-1 rounded">中断</button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center relative px-4">
          {td && (
            <div className="bg-white/10 p-4 rounded-3xl border border-white/20 text-center mb-4">
               <div className="text-white text-xl font-black italic">
                 {game.fieldCards.length > 0 ? game.fieldCards[game.fieldCards.length-1].name : (game.targetPref?.name || "待機中")}
                 <span className="text-yellow-400 ml-2 font-mono">
                   {game.fieldCards.length > 0 ? game.fieldCards[game.fieldCards.length-1][game.currentThemeId] : (game.targetValue || "-")}
                 </span>
               </div>
               <div className="text-[9px] font-black uppercase text-white/50">{td.name} 勝負</div>
            </div>
          )}
          <div className="relative w-40 h-52 flex items-center justify-center">
            {game.fieldCards.map((c, i) => (
              <div key={i} className="absolute transform" style={{ rotate: `${(i*7)%30-15}deg`, zIndex: i }}>
                <CardView card={c} activeThemes={activeThemes} highlight={game.currentThemeId} />
              </div>
            ))}
          </div>
        </div>

        <div className="h-56 bg-emerald-900/80 border-t-2 border-white/10 p-4 shrink-0">
           <div className="text-xs font-black italic mb-4">{cp?.name} の手札</div>
           <div className="flex justify-center items-end space-x-2 h-36 overflow-x-auto pb-6 scrollbar-hide">
             {cp?.hand.map(c => (
               <CardView key={c.id} card={c} activeThemes={activeThemes} selectable={game.turn === actualViewIndex} onClick={() => mode === 'daifugo' ? handlePlayBasic(actualViewIndex, c) : onDoubtPlay(c, c)} highlight={game.currentThemeId} />
             ))}
             {game.turn === actualViewIndex && mode === 'daifugo' && <button onClick={()=>handlePassBasic(actualViewIndex)} className="w-20 h-28 bg-black/20 border border-white/10 rounded-lg font-black italic">PASS</button>}
           </div>
        </div>

        {game.phase === 'RESOLUTION' && (
          <div className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-8 text-center animate-fade-in">
            <div className={`p-10 rounded-[48px] border-4 border-white ${game.doubtResult.isTruth ? 'bg-emerald-600' : 'bg-red-700'}`}>
              <h2 className="text-5xl font-black mb-6 italic">{game.doubtResult.isTruth ? 'SAFE!' : 'OUT!'}</h2>
              <CardView card={game.doubtResult.actual} activeThemes={activeThemes} />
              <button onClick={() => updateGame(prev => ({...prev, phase: 'WAITING', doubtResult: null, fieldCards: [], currentThemeId: null, turn: prev.doubtResult.loserId }))} className="mt-8 bg-white text-black px-12 py-3 rounded-full font-black">次へ</button>
            </div>
          </div>
        )}

        {game.phase === 'OVER' && (
          <div className="fixed inset-0 bg-emerald-950 z-[300] flex flex-col items-center justify-center animate-fade-in text-center">
            <Award size={100} className="text-yellow-400 mb-6" />
            <h2 className="text-6xl font-black italic mb-8">{game.winner?.name} WIN!</h2>
            <button onClick={() => setStep('MENU')} className="bg-white text-emerald-950 px-12 py-4 rounded-full font-black text-xl">タイトルへ</button>
          </div>
        )}
      </div>
    );
  }
  return null;
}

const styles = `
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
.animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
`;