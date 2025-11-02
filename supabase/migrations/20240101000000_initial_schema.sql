-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Theme Settings Table
create table theme_settings (
  id uuid primary key default uuid_generate_v4(),
  primary_color text not null default '#3B82F6',
  secondary_color text not null default '#EF4444',
  accent_color text not null default '#FBBF24',
  extra_color_1 text not null default '#10B981',
  extra_color_2 text not null default '#8B5CF6',
  background_color text not null default '#FFFFFF',
  border_color text not null default '#000000',
  label_name text not null default 'Dolmen Gate Media',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Artists Table
create table artists (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  genre text not null,
  bio text,
  image_url text not null,
  color text not null,
  instagram text,
  twitter text,
  spotify text,
  soundcloud text,
  featured boolean default false,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Releases Table
create table releases (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  artist_id uuid references artists(id) on delete cascade,
  artist_name text not null,
  artwork_url text not null,
  year text not null,
  color text not null,
  spotify_url text,
  apple_music_url text,
  soundcloud_url text,
  featured boolean default false,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Admin Users Table
create table admin_users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default theme
insert into theme_settings (id) values ('00000000-0000-0000-0000-000000000001');

-- Enable Row Level Security
alter table theme_settings enable row level security;
alter table artists enable row level security;
alter table releases enable row level security;
alter table admin_users enable row level security;

-- Public read access for theme, artists, and releases
create policy "Public can read theme" on theme_settings for select using (true);
create policy "Public can read artists" on artists for select using (true);
create policy "Public can read releases" on releases for select using (true);

-- Admin write access (authenticated users in admin_users table)
create policy "Admins can update theme" on theme_settings for update 
  using (auth.email() in (select email from admin_users));

create policy "Admins can insert artists" on artists for insert 
  using (auth.email() in (select email from admin_users));
create policy "Admins can update artists" on artists for update 
  using (auth.email() in (select email from admin_users));
create policy "Admins can delete artists" on artists for delete 
  using (auth.email() in (select email from admin_users));

create policy "Admins can insert releases" on releases for insert 
  using (auth.email() in (select email from admin_users));
create policy "Admins can update releases" on releases for update 
  using (auth.email() in (select email from admin_users));
create policy "Admins can delete releases" on releases for delete 
  using (auth.email() in (select email from admin_users));
