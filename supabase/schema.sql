-- ══════════════════════════════════════════════════════════════
-- 哲思 · 用户系统数据库结构（Supabase）
-- 在 Supabase 控制台 → SQL Editor 里整段执行一次即可。
-- 表：profiles / likes / favorites / comments / quote_stats
-- 安全：全部开启 RLS；计数由触发器维护，前端只读。
-- ══════════════════════════════════════════════════════════════

-- 用户资料（id 与 auth.users 一一对应，注册时由触发器自动创建）
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nickname text not null default '无名氏',
  created_at timestamptz not null default now()
);

-- 点赞：一人一则一条
create table if not exists public.likes (
  user_id uuid not null references auth.users (id) on delete cascade,
  quote_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, quote_id)
);

-- 收藏：仅本人可见
create table if not exists public.favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  quote_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, quote_id)
);

-- 评论
-- user_id 引用 public.profiles（而非 auth.users），这样前端可以用
-- select('*, profiles(nickname)') 直接联出昵称——PostgREST 只认声明过的外键
create table if not exists public.comments (
  id bigint generated always as identity primary key,
  quote_id text not null,
  user_id uuid not null references public.profiles (id) on delete cascade,
  content text not null check (char_length(content) between 1 and 500),
  created_at timestamptz not null default now()
);
create index if not exists comments_quote_id_idx
  on public.comments (quote_id, created_at desc);

-- 每则引文的公开计数（点赞/收藏/评论数），由触发器维护
create table if not exists public.quote_stats (
  quote_id text primary key,
  likes integer not null default 0,
  favorites integer not null default 0,
  comments integer not null default 0
);

-- ── 注册后自动建立 profiles 行 ──────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nickname)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'nickname', ''),
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── 计数触发器：likes / favorites / comments 增删时维护 quote_stats ──
create or replace function public.bump_stat()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  t text := TG_TABLE_NAME;              -- 'likes' | 'favorites' | 'comments'
  q text;
  d integer;
begin
  if TG_OP = 'INSERT' then
    q := NEW.quote_id; d := 1;
  else
    q := OLD.quote_id; d := -1;
  end if;

  insert into public.quote_stats (quote_id, likes, favorites, comments)
  values (
    q,
    case when t = 'likes' and d = 1 then 1 else 0 end,
    case when t = 'favorites' and d = 1 then 1 else 0 end,
    case when t = 'comments' and d = 1 then 1 else 0 end
  )
  on conflict (quote_id) do update set
    likes = greatest(0, quote_stats.likes + case when t = 'likes' then d else 0 end),
    favorites = greatest(0, quote_stats.favorites + case when t = 'favorites' then d else 0 end),
    comments = greatest(0, quote_stats.comments + case when t = 'comments' then d else 0 end);

  if TG_OP = 'INSERT' then
    return NEW;
  else
    return OLD;
  end if;
end;
$$;

drop trigger if exists likes_stat on public.likes;
create trigger likes_stat
  after insert or delete on public.likes
  for each row execute function public.bump_stat();

drop trigger if exists favorites_stat on public.favorites;
create trigger favorites_stat
  after insert or delete on public.favorites
  for each row execute function public.bump_stat();

drop trigger if exists comments_stat on public.comments;
create trigger comments_stat
  after insert or delete on public.comments
  for each row execute function public.bump_stat();

-- ── 行级安全（RLS）──────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.likes enable row level security;
alter table public.favorites enable row level security;
alter table public.comments enable row level security;
alter table public.quote_stats enable row level security;

-- profiles：昵称公开可读；本人可改自己的；插入只由触发器完成
create policy "profiles_select_public" on public.profiles
  for select using (true);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- likes：公开可读（供计数与状态回显）；写删限本人
create policy "likes_select_public" on public.likes
  for select using (true);
create policy "likes_insert_own" on public.likes
  for insert with check (auth.uid() = user_id);
create policy "likes_delete_own" on public.likes
  for delete using (auth.uid() = user_id);

-- favorites：仅本人可读可写
create policy "favorites_select_own" on public.favorites
  for select using (auth.uid() = user_id);
create policy "favorites_insert_own" on public.favorites
  for insert with check (auth.uid() = user_id);
create policy "favorites_delete_own" on public.favorites
  for delete using (auth.uid() = user_id);

-- comments：公开可读；登录可发；本人可删
create policy "comments_select_public" on public.comments
  for select using (true);
create policy "comments_insert_own" on public.comments
  for insert with check (auth.uid() = user_id);
create policy "comments_delete_own" on public.comments
  for delete using (auth.uid() = user_id);

-- quote_stats：公开只读（无写策略 = 客户端不可写，只能由触发器更新）
create policy "quote_stats_select_public" on public.quote_stats
  for select using (true);
