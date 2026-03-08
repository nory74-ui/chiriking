import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Users, Map as MapIcon, BarChart, Sprout, Factory, 
  CloudRain, Activity, Play, RotateCcw, Award, 
  AlertCircle, ShieldAlert, CheckCircle, XCircle, 
  ChevronRight, Smartphone, User, Cpu, ThumbsUp,
  Network, Plus, LogIn, ClipboardList
} from 'lucide-react';

// ==========================================
// 音声関連 (Web Audio API)
// ==========================================
let audioCtx = null;
const initAudio = () => {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      gain.gain.value = 0;
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.001);
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

const playSound = (type) => {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  switch(type) {
    case 'play':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
      break;
    case 'pass':
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
      break;
    case 'doubt':
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.setValueAtTime(1200, now + 0.1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
      break;
    case 'success':
      osc.type = 'square';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      osc.frequency.setValueAtTime(783.99, now + 0.2);
      osc.frequency.setValueAtTime(1046.50, now + 0.3);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
      break;
    case 'fail':
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.4);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
      break;
    case 'click':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
      break;
    default:
      break;
  }
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
      <div className={`${small ? 'w-10 h-14 sm:w-14 sm:h-20 md:w-16 md:h-24' : 'w-14 h-20 sm:w-20 sm:h-28 md:w-24 md:h-36'} bg-emerald-900 rounded-lg shadow-md border-2 border-white/20 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
        <div className="text-white/20 text-[6px] sm:text-[8px] md:text-[10px] font-black italic tracking-tighter uppercase transform -rotate-45 absolute">ChiriKing</div>
        {card?.declaredName && (
          <div className="z-10 bg-black/70 px-1 py-0.5 sm:px-2 sm:py-1 rounded-md text-white text-[8px] sm:text-xs md:text-sm font-bold text-center shadow-lg backdrop-blur-sm border border-white/10 mt-2 sm:mt-4">
            {card.declaredName}
          </div>
        )}
      </div>
    );
  }
  if (!card || !activeThemes) return null;
  const themes = activeThemes.map(id => THEME_DEFS[id]);

  return (
    <div 
      onClick={() => {
        if (selectable && onClick) {
          playSound('click');
          onClick(card);
        }
      }} 
      className={`
        ${small ? 'w-12 h-16 sm:w-14 sm:h-20 md:w-20 md:h-28' : 'w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-36'} 
        bg-white rounded-lg shadow-md border border-slate-300 flex flex-col items-center justify-between p-1 sm:p-2 relative transition-all
        ${selectable ? 'cursor-pointer hover:-translate-y-2 border-emerald-400 ring-2 ring-emerald-100' : 'opacity-90'}
      `}
    >
      <div className="text-[6px] sm:text-[7px] md:text-[8px] text-slate-400 w-full text-left font-serif italic leading-none">No.{card.id}</div>
      <div className="text-[10px] sm:text-xs md:text-base font-black text-slate-800 text-center tracking-tighter leading-tight line-clamp-1">{card.name}</div>
      <div className="flex flex-col w-full space-y-0.5">
        {themes.map(t => (
          <div key={t.id} className={`flex justify-between items-center px-0.5 sm:px-1 rounded-sm text-[6px] sm:text-[7px] md:text-[9px] ${highlight === t.id ? 'bg-emerald-800 text-white font-bold shadow-inner' : 'text-slate-500 bg-slate-50'}`}>
            <span className="flex items-center whitespace-nowrap"><t.icon size={8} className="mr-0.5 hidden sm:block md:w-2.5 md:h-2.5"/>{t.name}</span>
            <span className="whitespace-nowrap">{card[t.id]}<span className="text-[4px] sm:text-[5px] md:text-[6px] opacity-70 ml-0.5">{t.unit}</span></span>
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
  const [pendingTheme, setPendingTheme] = useState(null);
  const [declaringCard, setDeclaringCard] = useState(null); 
  const [user, setUser] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [roomData, setRoomData] = useState(null);
  const [myPlayerIndex, setMyPlayerIndex] = useState(0);
  const [joinRoomIdInput, setJoinRoomIdInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (activeThemes && activeThemes.length > 0) {
      setPendingTheme(activeThemes[0]);
    }
  }, [activeThemes]);

  useEffect(() => {
    const uid = Math.random().toString(36).substring(2, 15);
    setUser({ uid });
  }, []);

  useEffect(() => {
    let url = '';
    let key = '';
    try {
      url = import.meta.env.VITE_SUPABASE_URL || '';
      key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    } catch (e) {}
    if (!url || !key) return;
    if (window.supabase) {
      setSupabase(window.supabase.createClient(url, key));
    }
  }, []);

  useEffect(() => {
    if (!isOnline || !roomId || !user || !supabase) return;
    const fetchRoom = async () => {
      const { data } = await supabase.from('rooms').select('*').eq('id', roomId).single();
      if (data) {
        setRoomData(data);
        if (data.game) setGame(data.game);
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
    if (!supabase) { setErrorMsg('Supabase設定が必要です'); return; }
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
    } catch (e) { setErrorMsg('部屋作成失敗'); }
  };

  const joinRoom = async () => {
    if (!supabase) { setErrorMsg('Supabase設定が必要です'); return; }
    if (!user || !joinRoomIdInput) return;
    try {
      const { data, error } = await supabase.from('rooms').select('*').eq('id', joinRoomIdInput).single();
      if (error || !data) { setErrorMsg("部屋なし"); return; }
      const newPlayers = [...data.players, { uid: user.uid, name: `ゲスト${data.players.length}` }];
      await supabase.from('rooms').update({ players: newPlayers }).eq('id', joinRoomIdInput);
      setRoomId(joinRoomIdInput);
      setIsOnline(true);
      setStep('LOBBY');
    } catch (e) { setErrorMsg('入室失敗'); }
  };

  const handleStartButton = () => {
    initAudio();
    playSound('click');
    if (isOnline) { createRoom(); } else {
      const deck = [...PREFECTURES].sort(() => Math.random() - 0.5);
      const players = Array.from({ length: 4 }).map((_, i) => ({
        id: i, name: i < playerCount ? (playerCount === 1 ? 'あなた' : `プレイヤー${i + 1}`) : `CPU ${i - playerCount + 1}`,
        isCpu: i >= playerCount, hand: deck.slice(i * 5, (i + 1) * 5).sort((a,b) => a.id - b.id), passed: false
      }));
      setGame({
        players, turn: 0, viewIndex: 0, fieldCards: [], currentThemeId: null, lastPlayedIdx: 0, winner: null, phase: 'WAITING',
        isPassing: playerCount > 1, nextViewIndex: 0, message: '対戦開始', targetValue: 0, targetPref: null,
        pending: null, doubtResult: null, deck: deck.slice(20)
      });
      setStep('BOARD');
    }
  };

  const handleStartOnlineMatch = async () => {
    if (!roomData || roomData.host_uid !== user.uid || !supabase) return;
    const deck = [...PREFECTURES].sort(() => Math.random() - 0.5);
    const players = Array.from({ length: 4 }).map((_, i) => ({
      id: i, name: i < roomData.players.length ? roomData.players[i].name : `CPU ${i - roomData.players.length + 1}`,
      isCpu: i >= roomData.players.length, hand: deck.slice(i * 5, (i + 1) * 5).sort((a,b) => a.id - b.id), passed: false
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
          return { ...prev, turn: prev.lastPlayedIdx, fieldCards: [], currentThemeId: null, players: reset, phase: 'WAITING', message: `🔄 場が流れました` };
        }
      }
      return { ...prev, turn: next, phase: 'WAITING' };
    });
  }, [mode, updateGame]);

  const handlePlayBasic = (idx, card, theme = null) => {
    playSound('play');
    updateGame(prev => {
      const activeT = theme || prev.currentThemeId;
      const newPlayers = prev.players.map((p, i) => i === idx ? { ...p, hand: p.hand.filter(c => c.id !== card.id) } : p);
      if (newPlayers[idx].hand.length === 0) return { ...prev, players: newPlayers, winner: newPlayers[idx], phase: 'OVER' };
      return { ...prev, players: newPlayers.map(p => ({ ...p, passed: false })), fieldCards: [...prev.fieldCards, card], currentThemeId: activeT, lastPlayedIdx: idx, phase: 'RESOLVING', message: `${prev.players[idx].name}の番` };
    });
  };

  const handlePassBasic = (idx) => {
    playSound('pass');
    updateGame(prev => ({ ...prev, players: prev.players.map((p, i) => i === idx ? { ...p, passed: true } : p), phase: 'RESOLVING', message: `パス` }));
  };

  const onDoubtPlay = (card, declaredPref, theme = null) => {
    playSound('play');
    updateGame(prev => ({
      ...prev, 
      players: prev.players.map((p, i) => i === prev.turn ? { ...p, hand: p.hand.filter(c => c.id !== card.id) } : p), 
      pending: { card, declared: declaredPref, playerIndex: prev.turn }, 
      currentThemeId: theme || prev.currentThemeId,
      phase: 'DOUBT_WINDOW'
    }));
  };

  const onResolveDoubt = (doubterId) => {
    playSound('doubt');
    updateGame(prev => {
      if (prev.phase !== 'DOUBT_WINDOW') return prev;
      const isTruth = prev.pending.card.id === prev.pending.declared.id;
      const loserId = isTruth ? doubterId : prev.pending.playerIndex;
      let newHand = [...prev.players[loserId].hand];
      let currentDeck = [...prev.deck];
      while (newHand.length < 5 && currentDeck.length > 0) newHand.push(currentDeck.shift());
      const updatedPlayers = prev.players.map((p, i) => i === loserId ? { ...p, hand: newHand.sort((a,b)=>a.id-b.id) } : p);
      return { 
        ...prev, deck: currentDeck, players: updatedPlayers, phase: 'RESOLUTION', 
        doubtResult: { actual: prev.pending.card, declared: prev.pending.declared, isTruth, loserId, doubterId } 
      };
    });
  };

  useEffect(() => {
    if (!game) return;
    if (game.phase === 'RESOLUTION' && game.doubtResult) {
      playSound(game.doubtResult.isTruth ? 'fail' : 'success');
    } else if (game.phase === 'OVER') {
      playSound('success');
    }
    if (isOnline && roomData?.host_uid !== user?.uid) return;
    if (game.phase === 'RESOLVING') { const t = setTimeout(moveToNext, 1200); return () => clearTimeout(t); }
  }, [game?.phase, isOnline, roomData?.host_uid, moveToNext]);

  const renderError = () => errorMsg && (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-full z-[1000] flex items-center gap-2 font-black shadow-lg">
      <AlertCircle size={20}/>{errorMsg}
      <button onClick={() => setErrorMsg('')}><XCircle size={16}/></button>
    </div>
  );

  if (step === 'PLAYER_SELECT') return (
    <div className="min-h-screen bg-emerald-800 flex items-center justify-center p-4 text-white text-center">
      <div className="bg-white p-6 rounded-[32px] max-w-md w-full text-slate-800 shadow-2xl animate-fade-in">
        <h2 className="text-2xl font-black text-emerald-700 mb-6 italic">何人で遊ぶ？</h2>
        <div className="flex flex-col gap-3 mb-6">
          {[1, 2, 3, 4].map(num => (
            <button key={num} onClick={() => { playSound('click'); setPlayerCount(num); setStep('THEME'); }} className={`py-3 rounded-xl font-black text-lg border-4 transition-all duration-200 flex items-center justify-center gap-2 ${playerCount === num ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg scale-105' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-emerald-300'}`}>
              <Users size={20} /> {num}人
            </button>
          ))}
        </div>
        <button onClick={() => { playSound('click'); setStep('MENU'); }} className="text-xs font-bold text-slate-400 underline">戻る</button>
      </div>
    </div>
  );

  if (step === 'MENU') return (
    <div className="min-h-screen bg-emerald-800 flex flex-col items-center justify-center p-6 text-center text-white font-sans">
      <div className="z-10 w-full max-w-sm space-y-12 animate-fade-in">
        <h1 className="text-6xl font-black italic tracking-tighter drop-shadow-xl">チリキング</h1>
        <div className="space-y-4">
          <button onClick={() => { initAudio(); playSound('click'); setIsOnline(false); setStep('PLAYER_SELECT'); }} className="w-full py-4 bg-white text-emerald-900 rounded-2xl font-black text-xl shadow-xl active:scale-95 transition-all">1台で遊ぶ (オフライン)</button>
          <button onClick={() => { initAudio(); playSound('click'); setIsOnline(true); setStep('ONLINE_MENU'); }} className="w-full py-4 bg-emerald-950 text-white rounded-2xl font-black text-xl border border-white/20 shadow-xl active:scale-95 transition-all">みんなで遊ぶ (オンライン)</button>
        </div>
      </div>
    </div>
  );

  if (step === 'ONLINE_MENU') return (
    <div className="min-h-screen bg-emerald-800 flex flex-col items-center justify-center p-6 text-white text-center">
      {renderError()}
      <div className="w-full max-w-sm space-y-8 animate-fade-in">
        <h2 className="text-4xl font-black italic">オンライン</h2>
        <div className="bg-white/10 p-6 rounded-[32px] backdrop-blur-md border border-white/10">
          <button onClick={() => { playSound('click'); setPlayerCount(1); setStep('THEME');}} className="w-full bg-white text-emerald-900 py-5 rounded-2xl font-black text-2xl mb-6 shadow-md">部屋を作る</button>
          <input type="text" value={joinRoomIdInput} onChange={e => setJoinRoomIdInput(e.target.value)} placeholder="ルームID" className="w-full bg-emerald-950/50 text-white text-center text-3xl font-black py-4 rounded-2xl mb-4 focus:ring-4 ring-emerald-400 outline-none placeholder:text-white/30"/>
          <button onClick={() => { playSound('click'); joinRoom(); }} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl">部屋に入る</button>
        </div>
        <button onClick={() => { playSound('click'); setStep('MENU'); }} className="text-sm underline opacity-50">戻る</button>
      </div>
    </div>
  );

  if (step === 'LOBBY') return (
    <div className="min-h-screen bg-emerald-800 flex flex-col items-center justify-center p-4 text-white text-center">
      {renderError()}
      <div className="bg-white p-6 rounded-[32px] max-w-sm w-full text-slate-800 shadow-2xl animate-fade-in">
        <h2 className="text-2xl font-black text-emerald-700 mb-4 italic">待機室</h2>
        <div className="bg-slate-100 p-3 rounded-xl mb-4 border border-slate-200">
          <p className="text-[10px] text-slate-400 uppercase mb-1 tracking-widest">Room ID</p>
          <p className="text-3xl font-mono font-black text-emerald-600">{roomId}</p>
        </div>
        <div className="text-left mb-6 space-y-2">
          {roomData?.players?.map((p, i) => (
            <div key={p.uid} className="bg-emerald-50 p-2 rounded-lg font-black flex items-center gap-2 text-emerald-900 text-sm">
              <User size={16}/> {p.name} {i === 0 && <span className="text-[8px] bg-emerald-600 text-white px-2 py-0.5 rounded-full ml-auto">HOST</span>}
            </div>
          ))}
        </div>
        {roomData?.host_uid === user?.uid ? (
          <button onClick={() => { playSound('click'); handleStartOnlineMatch(); }} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg">ゲーム開始</button>
        ) : (
          <p className="text-slate-400 font-black animate-pulse">ホストの開始を待っています...</p>
        )}
      </div>
    </div>
  );

  if (step === 'THEME') return (
    <div className="min-h-screen bg-emerald-800 text-white flex flex-col items-center justify-center p-4 space-y-6">
      <h2 className="text-3xl font-black italic">属性設定</h2>
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {Object.values(THEME_DEFS).map(t => (
          <button key={t.id} onClick={() => { if (activeThemes[0] === t.id) return; playSound('click'); setActiveThemes([t.id, activeThemes[0]]); }} className={`p-3 rounded-xl border-2 flex flex-col items-center transition-all ${activeThemes.includes(t.id) ? 'bg-white text-emerald-900 border-white scale-105 shadow-xl' : 'bg-white/10 border-transparent opacity-50 hover:opacity-80'}`}>
            <t.icon size={24} className="mb-1"/><span className="font-black text-xs">{t.name}</span>
          </button>
        ))}
      </div>
      <button onClick={() => { playSound('click'); setStep('RULE'); }} className="w-full max-w-xs py-4 bg-emerald-400 text-emerald-900 rounded-full font-black text-lg">ルール設定へ</button>
    </div>
  );

  if (step === 'RULE') return (
    <div className="min-h-screen bg-emerald-800 flex items-center justify-center p-4 text-white text-center">
      <div className="bg-white p-6 rounded-[32px] max-w-md w-full text-slate-800 shadow-2xl animate-fade-in">
        <h2 className="text-2xl font-black text-emerald-700 mb-6 italic">ルール確認</h2>
        <div className="flex flex-col gap-3 mb-6">
          <button onClick={()=>{ playSound('click'); setMode('daifugo'); }} className={`py-4 rounded-xl font-black border-2 transition-all ${mode==='daifugo'?'bg-emerald-600 text-white border-emerald-600 shadow-md':'border-slate-200 text-slate-400 hover:border-emerald-300'}`}>基本ルール</button>
          <button onClick={()=>{ playSound('click'); setMode('doubt'); }} className={`py-4 rounded-xl font-black border-2 transition-all ${mode==='doubt'?'bg-red-600 text-white border-red-600 shadow-md':'border-slate-200 text-slate-400 hover:border-red-300'}`}>ダウトルール</button>
        </div>
        <button onClick={handleStartButton} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-xl">対戦開始！！</button>
      </div>
    </div>
  );

  if (step === 'BOARD' && game) {
    const actualViewIndex = isOnline ? myPlayerIndex : game.viewIndex;
    const cp = game.players[actualViewIndex];
    const currentOrPendingThemeId = game.currentThemeId || pendingTheme;
    const td = THEME_DEFS[currentOrPendingThemeId];
    const targetName = mode === 'doubt' ? game.targetPref?.name : (game.fieldCards.length > 0 ? game.fieldCards[game.fieldCards.length-1].name : "Waiting...");
    const targetNum = mode === 'doubt' ? game.targetValue : (game.fieldCards.length > 0 ? game.fieldCards[game.fieldCards.length-1][game.currentThemeId] : "-");

    return (
      <div className="min-h-screen bg-emerald-800 text-white flex flex-col overflow-hidden relative">
        {declaringCard && (
          <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-2 backdrop-blur-sm animate-fade-in">
            <div className="bg-emerald-900 p-4 rounded-[24px] w-full max-w-lg border-2 border-emerald-400 flex flex-col max-h-[90vh] shadow-2xl">
              <h3 className="text-xl font-black text-white mb-2 text-center italic">どの都道府県として出す？</h3>
              <div className="overflow-y-auto flex-1 grid grid-cols-3 gap-1.5 p-1 scrollbar-hide">
                {PREFECTURES.map(pref => {
                  const theme = game.currentThemeId || pendingTheme;
                  const isValid = game.targetValue === 0 || pref[theme] > game.targetValue;
                  return (
                    <button key={pref.id} onClick={() => { if (isValid) { onDoubtPlay(declaringCard, pref, theme); setDeclaringCard(null); } }} disabled={!isValid} className={`py-2 px-1 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${isValid ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-slate-800 text-slate-500 border-slate-700 opacity-40'}`}>
                      <div className="text-[10px] font-black">{pref.name}</div>
                      <div className="text-[8px] font-mono bg-black/10 px-1 py-0.5 rounded-full">{pref[theme]}</div>
                    </button>
                  );
                })}
              </div>
              <button onClick={() => { playSound('click'); setDeclaringCard(null); }} className="mt-4 bg-slate-700 text-white py-3 rounded-full font-black text-base">キャンセル</button>
            </div>
          </div>
        )}

        <div className="bg-emerald-950/90 h-12 p-3 flex justify-between items-center shrink-0 border-b border-white/10 z-50">
          <div className="font-black text-emerald-500 text-xs italic tracking-widest flex items-center gap-1">CHIRIKING</div>
          <div className="text-[8px] font-black bg-emerald-400/20 text-emerald-100 px-2 py-1 rounded-full uppercase italic animate-pulse truncate max-w-[50%]">{game.message}</div>
          <button onClick={() => { playSound('click'); setStep('MENU'); }} className="text-[8px] bg-red-600/20 text-red-400 font-black px-2 py-1 rounded">EXIT</button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-start relative px-2 pt-16 pb-4">
          <div className="absolute top-2 left-0 right-0 flex justify-center gap-2 z-40 px-2 w-full max-w-2xl mx-auto">
            {game.players.map((p, i) => {
              if (i === actualViewIndex) return null;
              return (
                <div key={i} className={`flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-xl border-2 transition-all duration-300 flex-1 max-w-[80px] ${game.turn === i ? 'bg-emerald-500 text-emerald-950 border-emerald-300 scale-105 shadow-[0_0_15px_rgba(52,211,153,0.5)] z-10' : 'bg-black/40 border-white/10 text-white/70 opacity-80'}`}>
                  <span className="text-[8px] font-black truncate w-full text-center">{p.name}</span>
                  <div className="flex flex-col items-center gap-0">
                    <div className="flex -space-x-1">
                      {Array.from({ length: Math.min(p.hand.length, 5) }).map((_, idx) => (
                        <div key={idx} className={`w-2 h-3 bg-blue-900 border border-white/30 rounded-[1px] shadow-sm`} />
                      ))}
                    </div>
                    <span className="text-[8px] font-black leading-none mt-0.5">{p.hand.length}枚</span>
                  </div>
                  {p.passed && <span className="absolute -bottom-1 bg-red-500 text-white text-[6px] px-1 rounded-full border border-white/20 font-black">PASS</span>}
                </div>
              );
            })}
          </div>

          {!game.currentThemeId ? (
            <div className="text-center mt-8 mb-4 z-10 animate-fade-in w-full max-w-sm">
              {game.turn === actualViewIndex ? (
                <div className="bg-emerald-900/90 p-4 rounded-[24px] border-2 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)]">
                  <p className="text-[10px] font-black text-emerald-300 mb-3 tracking-widest">属性選択</p>
                  <div className="flex justify-center gap-2">
                    {activeThemes.map(tId => (
                      <button key={tId} onClick={() => { playSound('click'); setPendingTheme(tId); }} className={`px-2 py-2 rounded-xl font-black flex flex-col items-center gap-1 border-2 transition-all ${pendingTheme === tId ? 'bg-emerald-500 text-emerald-950 border-emerald-300 scale-105 shadow-lg' : 'bg-black/40 border-white/10 text-white/50'}`}>
                        {React.createElement(THEME_DEFS[tId].icon, { size: 16 })}
                        <span className="text-[10px]">{THEME_DEFS[tId].name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-black/40 px-4 py-3 rounded-2xl border border-white/10">
                  <p className="text-xs font-black text-emerald-400/80 animate-pulse">{game.players[game.turn]?.name} 選択中...</p>
                </div>
              )}
            </div>
          ) : (
            td && (
              <div className="bg-emerald-900/80 p-3 rounded-[24px] border-2 border-emerald-400 text-center mt-12 mb-4 relative z-10 w-[85%] max-w-xs mx-auto">
                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-400 text-emerald-950 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-md flex items-center gap-1 whitespace-nowrap">
                   {React.createElement(td.icon, { size: 12 })} 現在のテーマ
                 </div>
                 <div className="text-emerald-100 text-[10px] font-black mb-1">{td.name} 勝負</div>
                 <div className="text-white text-base font-black italic flex items-baseline justify-center gap-1 truncate">
                   <span className="truncate max-w-[80px]">{targetName}</span>
                   <span className="text-yellow-400 font-mono text-3xl leading-none ml-1">{targetNum}</span>
                   <span className="text-[8px] text-yellow-400/70">{td.unit}</span>
                 </div>
              </div>
            )
          )}
          
          <div className="relative w-full h-32 flex items-center justify-center flex-1 max-h-[40vh]">
            {game.fieldCards.map((c, i) => (
              <div key={i} className="absolute transform transition-transform duration-500" style={{ rotate: `${(i*7)%30-15}deg`, zIndex: i }}>
                <CardView card={c} activeThemes={activeThemes} highlight={game.currentThemeId} faceDown={c.faceDown} />
              </div>
            ))}
            {game.fieldCards.length === 0 && <div className="text-white/10 font-black italic text-2xl border-2 border-dashed border-white/10 rounded-2xl w-32 h-40 flex items-center justify-center">FIELD</div>}
          </div>
        </div>

        {game.phase === 'DOUBT_WINDOW' && (
          <div className="absolute inset-0 bg-black/60 z-[100] flex flex-col items-center justify-center backdrop-blur-sm px-4">
            <div className="bg-emerald-900/90 p-6 rounded-[32px] border-4 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.4)] flex flex-col items-center animate-[bounce_2s_infinite] w-full max-w-sm">
              <div className="text-red-300 text-sm font-black mb-1 tracking-widest uppercase">宣言されたカード</div>
              <div className="text-white text-xl font-black mb-4 flex items-center gap-1">
                {game.pending.declared.name} 
                <span className="text-yellow-400 font-mono text-2xl">{game.pending.declared[game.currentThemeId]}</span>
                <span className="text-xs text-yellow-400/70">{THEME_DEFS[game.currentThemeId].unit}</span>
              </div>
              <div className="scale-125 mb-6 mt-2">
                <CardView card={game.pending.card} faceDown={true} activeThemes={activeThemes} />
              </div>
              {game.pending.playerIndex !== actualViewIndex ? (
                <button onClick={() => onResolveDoubt(actualViewIndex)} className="bg-red-600 text-white text-2xl font-black px-8 py-3 rounded-full border-b-4 border-red-800 active:translate-y-2 active:border-b-0 w-full shadow-2xl">ダウト！！</button>
              ) : (
                <div className="text-emerald-300 font-black animate-pulse text-sm">他の反応待ち...</div>
              )}
            </div>
          </div>
        )}

        <div className={`h-40 sm:h-56 transition-colors duration-300 border-t-2 p-2 pb-4 shrink-0 shadow-[0_-15px_40px_rgba(0,0,0,0.5)] z-50 backdrop-blur-xl relative 
          ${game.turn === actualViewIndex ? 'bg-emerald-800/95 border-emerald-400' : 'bg-emerald-950/95 border-emerald-950'}`}>
           <div className="flex justify-between items-center mb-2 max-w-lg mx-auto relative">
             <div className={`text-[10px] font-black italic uppercase tracking-[0.2em] flex items-center gap-1 px-2 py-1 rounded-full ${game.turn === actualViewIndex ? 'bg-emerald-400 text-emerald-950' : 'text-emerald-500/50'}`}>
               <ClipboardList size={12}/> {game.turn === actualViewIndex ? 'YOUR TURN!' : 'Hand'}
             </div>
             {game.turn === actualViewIndex && mode === 'daifugo' && game.currentThemeId && (
               <button onClick={()=>handlePassBasic(actualViewIndex)} className="text-[8px] font-black bg-red-500 text-white px-4 py-1.5 rounded-full border-b-2 border-red-700">PASS</button>
             )}
             {game.players[actualViewIndex]?.passed && <span className="text-[10px] font-black text-red-400 bg-red-400/10 px-2 py-1 rounded">PASSED</span>}
           </div>
           <div className="flex justify-center items-end space-x-1 h-24 sm:h-36 overflow-x-auto pb-2 scrollbar-hide px-1">
             {cp?.hand.map(c => (
               <div key={c.id} className={`${game.turn === actualViewIndex ? 'animate-[bounce_2s_infinite]' : ''}`} style={{animationDelay: `${Math.random()}s`}}>
                 <CardView card={c} activeThemes={activeThemes} selectable={game.turn === actualViewIndex && !cp.passed} onClick={() => { if (mode === 'daifugo') { handlePlayBasic(actualViewIndex, c, game.currentThemeId ? null : pendingTheme); } else { playSound('click'); setDeclaringCard(c); } }} highlight={game.currentThemeId || pendingTheme} />
               </div>
             ))}
           </div>
        </div>

        {game.phase === 'RESOLUTION' && game.doubtResult && (
          <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4 text-center animate-fade-in backdrop-blur-lg">
            <div className={`p-6 rounded-[32px] border-4 shadow-2xl w-full max-w-2xl ${game.doubtResult.isTruth ? 'bg-red-700 border-red-400' : 'bg-emerald-600 border-emerald-400'}`}>
              <h2 className="text-4xl font-black mb-1 italic text-white">{game.doubtResult.isTruth ? '失敗！' : '成功！'}</h2>
              <p className="text-white text-sm font-bold mb-4">{game.doubtResult.isTruth ? `本当でした！` : `見破った！`}</p>
              <div className="flex flex-row items-center justify-center gap-4 mb-6">
                <div className="flex flex-col items-center">
                  <span className="text-white/70 font-black mb-1 text-[10px]">宣言</span>
                  <div className="text-lg font-black text-white bg-black/30 px-3 py-2 rounded-xl whitespace-nowrap">{game.doubtResult.declared.name}</div>
                </div>
                <div className="text-white/50 font-black text-xl">VS</div>
                <div className="flex flex-col items-center">
                  <span className="text-white/70 font-black mb-1 text-[10px]">正体</span>
                  <div className="scale-90"><CardView card={game.doubtResult.actual} activeThemes={activeThemes} highlight={game.currentThemeId} /></div>
                </div>
              </div>
              <p className="text-white font-black text-sm mb-6 bg-black/40 py-2 px-4 rounded-full inline-block">
                <span className="text-yellow-400">{game.players[game.doubtResult.loserId].name}</span> ペナルティ！
              </p>
              <div>
                <button onClick={() => { playSound('click'); updateGame(prev => { if (prev.players.some(p => p.hand.length === 0)) { return { ...prev, phase: 'OVER', winner: prev.players.find(p => p.hand.length === 0) }; } return { ...prev, phase: 'WAITING', doubtResult: null, fieldCards: [], currentThemeId: null, turn: prev.doubtResult.loserId, targetValue: 0, targetPref: null, pending: null }; })}} className="bg-white text-slate-900 px-8 py-3 rounded-full font-black text-base w-full sm:w-auto">次へ</button>
              </div>
            </div>
          </div>
        )}

        {game.phase === 'OVER' && (
          <div className="fixed inset-0 bg-emerald-950 z-[300] flex flex-col items-center justify-center text-center p-4 backdrop-blur-xl">
            <div className="bg-emerald-900/80 p-8 rounded-[40px] border-2 border-emerald-400/30 shadow-2xl w-full max-w-lg">
              <Award size={80} className="text-yellow-400 mb-4 mx-auto animate-bounce" />
              <h2 className="text-5xl font-black italic text-white mb-1 uppercase">WINNER!</h2>
              <h3 className="text-3xl font-black italic text-emerald-400 mb-8">{game.winner?.name}</h3>
              <button onClick={() => { playSound('click'); setStep('MENU'); }} className="bg-white text-emerald-950 px-10 py-4 rounded-full font-black text-xl shadow-xl w-full sm:w-auto">タイトルへ</button>
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
}