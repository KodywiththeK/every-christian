-- 사용자 테이블
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 감사일기 테이블
CREATE TABLE gratitude_journals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 기도제목 테이블
CREATE TABLE prayers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_answered BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  answered_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 챌린지 테이블
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 사용자 챌린지 참여 테이블
CREATE TABLE user_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
  progress INTEGER DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_check_in TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, challenge_id)
);

-- 챌린지 태스크 테이블
CREATE TABLE challenge_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
  day INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사용자 태스크 완료 테이블
CREATE TABLE user_task_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  task_id UUID REFERENCES challenge_tasks(id) ON DELETE CASCADE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, task_id)
);

-- 익명 게시판 테이블
CREATE TABLE anonymous_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  pray_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 익명 게시판 댓글 테이블
CREATE TABLE anonymous_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES anonymous_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 익명 게시판 기도 테이블
CREATE TABLE anonymous_prayers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES anonymous_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- 공개 게시판 테이블
CREATE TABLE public_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 공개 게시판 댓글 테이블
CREATE TABLE public_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 공개 게시판 좋아요 테이블
CREATE TABLE public_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- 성경 구절 테이블
CREATE TABLE bible_verses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  content TEXT NOT NULL,
  translation TEXT NOT NULL,
  UNIQUE(book, chapter, verse, translation)
);

-- 사용자 성경 하이라이트 테이블
CREATE TABLE bible_highlights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  verse_id UUID REFERENCES bible_verses(id) ON DELETE CASCADE NOT NULL,
  note TEXT,
  color TEXT DEFAULT 'yellow',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- RLS 정책 설정
ALTER TABLE gratitude_journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_task_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE anonymous_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE anonymous_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE anonymous_prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_highlights ENABLE ROW LEVEL SECURITY;

-- 감사일기 RLS 정책
CREATE POLICY "사용자는 자신의 감사일기만 조회할 수 있음" ON gratitude_journals
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "사용자는 자신의 감사일기만 생성할 수 있음" ON gratitude_journals
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "사용자는 자신의 감사일기만 수정할 수 있음" ON gratitude_journals
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "사용자는 자신의 감사일기만 삭제할 수 있음" ON gratitude_journals
  FOR DELETE USING (auth.uid() = user_id);

-- 기도제목 RLS 정책
CREATE POLICY "사용자는 자신의 기도제목만 조회할 수 있음" ON prayers
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "사용자는 자신의 기도제목만 생성할 수 있음" ON prayers
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "사용자는 자신의 기도제목만 수정할 수 있음" ON prayers
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "사용자는 자신의 기도제목만 삭제할 수 있음" ON prayers
  FOR DELETE USING (auth.uid() = user_id);

-- 트리거 함수: 댓글 수 업데이트
CREATE OR REPLACE FUNCTION update_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF TG_TABLE_NAME = 'anonymous_comments' THEN
      UPDATE anonymous_posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_TABLE_NAME = 'public_comments' THEN
      UPDATE public_posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF TG_TABLE_NAME = 'anonymous_comments' THEN
      UPDATE anonymous_posts SET comment_count = comment_count - 1 WHERE id = OLD.post_id;
    ELSIF TG_TABLE_NAME = 'public_comments' THEN
      UPDATE public_posts SET comment_count = comment_count - 1 WHERE id = OLD.post_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 트리거: 익명 게시판 댓글 수 업데이트
CREATE TRIGGER update_anonymous_comment_count
AFTER INSERT OR DELETE ON anonymous_comments
FOR EACH ROW
EXECUTE FUNCTION update_comment_count();

-- 트리거: 공개 게시판 댓글 수 업데이트
CREATE TRIGGER update_public_comment_count
AFTER INSERT OR DELETE ON public_comments
FOR EACH ROW
EXECUTE FUNCTION update_comment_count();

-- 트리거 함수: 기도 수 업데이트
CREATE OR REPLACE FUNCTION update_pray_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE anonymous_posts SET pray_count = pray_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE anonymous_posts SET pray_count = pray_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 트리거: 익명 게시판 기도 수 업데이트
CREATE TRIGGER update_anonymous_pray_count
AFTER INSERT OR DELETE ON anonymous_prayers
FOR EACH ROW
EXECUTE FUNCTION update_pray_count();

-- 트리거 함수: 좋아요 수 업데이트
CREATE OR REPLACE FUNCTION update_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public_posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public_posts SET like_count = like_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 트리거: 공개 게시판 좋아요 수 업데이트
CREATE TRIGGER update_public_like_count
AFTER INSERT OR DELETE ON public_likes
FOR EACH ROW
EXECUTE FUNCTION update_like_count();

