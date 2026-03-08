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

-- 外部レプリケーションおよびCDC（変更データキャプチャ）のための設定
-- これにより、外部の分析プラットフォームやリードレプリカが変更を正確に追跡できるようになります
ALTER TABLE rooms REPLICA IDENTITY DEFAULT;

-- RLS (セキュリティルール) の設定
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous access on rooms" ON rooms;
CREATE POLICY "Allow anonymous access on rooms" ON rooms FOR ALL USING (true) WITH CHECK (true);

-- リアルタイム通信の有効化 (エラー回避のため、存在チェックを追加)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'rooms'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
    END IF;
  END IF;
END $$;

-- 2. 外部データウェアハウス・分析プラットフォーム同期用のパブリケーション作成
-- リードレプリカや外部のBigQuery, Snowflake等への同期に使用します
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'external_analytics_publication') THEN
    CREATE PUBLICATION external_analytics_publication FOR TABLE rooms;
  END IF;
END $$;

-- 3. プロジェクト一時停止回避（Ping）用のテーブルを作成
CREATE TABLE IF NOT EXISTS keepalive (
  id INTEGER PRIMARY KEY,
  last_ping TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

ALTER TABLE keepalive ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous access on keepalive" ON keepalive;
CREATE POLICY "Allow anonymous access on keepalive" ON keepalive FOR ALL USING (true) WITH CHECK (true);

-- 初期データの挿入
INSERT INTO keepalive (id) VALUES (1) ON CONFLICT (id) DO NOTHING;