-- Fix RLS policies for admin_users table
-- Drop existing problematic policies
drop policy if exists "admin_users_select_policy" on admin_users;
drop policy if exists "admin_users_insert_policy" on admin_users;
drop policy if exists "admin_users_update_policy" on admin_users;
drop policy if exists "admin_users_delete_policy" on admin_users;

-- Create proper policies with optimized auth checks
create policy "Admins can read admin_users" on admin_users for select
  using (true); -- Allow anyone to read (needed for admin checking)

create policy "Admins can insert admin_users" on admin_users for insert
  with check ((select auth.email()) in (select email from admin_users));

create policy "Admins can update admin_users" on admin_users for update
  using ((select auth.email()) in (select email from admin_users))
  with check ((select auth.email()) in (select email from admin_users));

create policy "Admins can delete admin_users" on admin_users for delete
  using ((select auth.email()) in (select email from admin_users));

-- Fix other tables' RLS policies for performance
-- Drop and recreate theme_settings policies
drop policy if exists "Admins can update theme" on theme_settings;
create policy "Admins can update theme" on theme_settings for update
  using ((select auth.email()) in (select email from admin_users))
  with check ((select auth.email()) in (select email from admin_users));

-- Drop and recreate artists policies
drop policy if exists "Admins can insert artists" on artists;
drop policy if exists "Admins can update artists" on artists;
drop policy if exists "Admins can delete artists" on artists;

create policy "Admins can insert artists" on artists for insert
  with check ((select auth.email()) in (select email from admin_users));

create policy "Admins can update artists" on artists for update
  using ((select auth.email()) in (select email from admin_users))
  with check ((select auth.email()) in (select email from admin_users));

create policy "Admins can delete artists" on artists for delete
  using ((select auth.email()) in (select email from admin_users));

-- Drop and recreate releases policies
drop policy if exists "Admins can insert releases" on releases;
drop policy if exists "Admins can update releases" on releases;
drop policy if exists "Admins can delete releases" on releases;

create policy "Admins can insert releases" on releases for insert
  with check ((select auth.email()) in (select email from admin_users));

create policy "Admins can update releases" on releases for update
  using ((select auth.email()) in (select email from admin_users))
  with check ((select auth.email()) in (select email from admin_users));

create policy "Admins can delete releases" on releases for delete
  using ((select auth.email()) in (select email from admin_users));

-- Enable RLS on admin_promotions and add policies
alter table admin_promotions enable row level security;

create policy "Admins can read admin_promotions" on admin_promotions for select
  using ((select auth.email()) in (select email from admin_users));

create policy "Admins can insert admin_promotions" on admin_promotions for insert
  with check ((select auth.email()) in (select email from admin_users));

create policy "Admins can update admin_promotions" on admin_promotions for update
  using ((select auth.email()) in (select email from admin_users))
  with check ((select auth.email()) in (select email from admin_users));

create policy "Admins can delete admin_promotions" on admin_promotions for delete
  using ((select auth.email()) in (select email from admin_users));

-- Enable RLS on admins table and add policies
alter table admins enable row level security;

create policy "Admins can read admins" on admins for select
  using ((select auth.email()) in (select email from admin_users));

create policy "Admins can insert admins" on admins for insert
  with check ((select auth.email()) in (select email from admin_users));

create policy "Admins can update admins" on admins for update
  using ((select auth.email()) in (select email from admin_users))
  with check ((select auth.email()) in (select email from admin_users));

create policy "Admins can delete admins" on admins for delete
  using ((select auth.email()) in (select email from admin_users));