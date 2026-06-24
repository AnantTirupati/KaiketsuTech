-- Alter payments table check constraint to support the new pricing packages
alter table public.payments drop constraint if exists payments_package_type_check;

alter table public.payments add constraint payments_package_type_check 
check (package_type in ('starter', 'business', 'enterprise', 'launch', 'growth', 'business_pro', 'care_plan'));
