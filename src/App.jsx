-- 1. オンライン対戦用のルームテーブルを作成
CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY,
  host_uid TEXT,
  players JSONB,
  status TEXT,
  game JSONB,
  mode TEXT,
  active_themes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- RLS (セキュリティルール) の設定
-- ※プロトタイプ用として、今回は誰でも読み書きできるように設定します。
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous access on rooms" ON rooms;
CREATE POLICY "Allow anonymous access on rooms" ON rooms FOR ALL USING (true) WITH CHECK (true);

-- リアルタイム通信の有効化 (超重要：これがないと画面が同期されません)
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;

-- 2. プロジェクト一時停止回避（Ping）用のテーブルを作成
CREATE TABLE IF NOT EXISTS keepalive (
  id INTEGER PRIMARY KEY,
  last_ping TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

ALTER TABLE keepalive ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous access on keepalive" ON keepalive;
CREATE POLICY "Allow anonymous access on keepalive" ON keepalive FOR ALL USING (true) WITH CHECK (true);

-- 初期データの挿入
INSERT INTO keepalive (id) VALUES (1) ON CONFLICT (id) DO NOTHING;