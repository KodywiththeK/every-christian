-- 기존 users 테이블에 새 필드 추가
ALTER TABLE users
ADD COLUMN IF NOT EXISTS church_name TEXT,
ADD COLUMN IF NOT EXISTS denomination TEXT,
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- 교단 테이블 생성
CREATE TABLE IF NOT EXISTS denominations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기본 교단 데이터 삽입
INSERT INTO denominations (name) VALUES
('장로교') ON CONFLICT (name) DO NOTHING;

INSERT INTO denominations (name) VALUES
('감리교') ON CONFLICT (name) DO NOTHING;

INSERT INTO denominations (name) VALUES
('침례교') ON CONFLICT (name) DO NOTHING;

INSERT INTO denominations (name) VALUES
('성결교') ON CONFLICT (name) DO NOTHING;

INSERT INTO denominations (name) VALUES
('기타') ON CONFLICT (name) DO NOTHING;
