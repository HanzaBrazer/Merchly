-- =====================================================================
-- MERCHLY SEED DATA: NORDIC FURNITURE DEMO
-- =====================================================================

-- Note: In Supabase production, replace '00000000-0000-0000-0000-000000000001' with your auth.uid()
insert into workspaces (id, name, owner_id, plan, currency, sales_target_monthly, category)
values ('ws000000-0000-0000-0000-000000000001', 'Nordic Furniture', '00000000-0000-0000-0000-000000000001', 'FREE', 'USD', 10000, 'Furniture')
on conflict (id) do nothing;

insert into categories (id, workspace_id, name)
values 
  ('cat00000-0000-0000-0000-000000000001', 'ws000000-0000-0000-0000-000000000001', 'Chair'),
  ('cat00000-0000-0000-0000-000000000002', 'ws000000-0000-0000-0000-000000000001', 'Sofa'),
  ('cat00000-0000-0000-0000-000000000003', 'ws000000-0000-0000-0000-000000000001', 'Table'),
  ('cat00000-0000-0000-0000-000000000004', 'ws000000-0000-0000-0000-000000000001', 'Bed')
on conflict (id) do nothing;

insert into products (id, workspace_id, name, sku, price, cost, stock, reorder_point, status)
values
  ('prd00000-0000-0000-0000-000000000001', 'ws000000-0000-0000-0000-000000000001', 'Oslo Chair', 'OSL-CHR-01', 55, 25, 24, 5, 'published'),
  ('prd00000-0000-0000-0000-000000000002', 'ws000000-0000-0000-0000-000000000001', 'Sapporo Sofa', 'SPR-SOF-02', 90, 45, 10, 15, 'published'),
  ('prd00000-0000-0000-0000-000000000003', 'ws000000-0000-0000-0000-000000000001', 'Bergen Table', 'BRG-TBL-03', 210, 95, 8, 5, 'published'),
  ('prd00000-0000-0000-0000-000000000004', 'ws000000-0000-0000-0000-000000000001', 'Bergen Sofa', 'BRG-SOF-04', 420, 210, 3, 8, 'published'),
  ('prd00000-0000-0000-0000-000000000005', 'ws000000-0000-0000-0000-000000000001', 'Kyoto Bed', 'KYT-BED-05', 350, 160, 10, 5, 'published'),
  ('prd00000-0000-0000-0000-000000000006', 'ws000000-0000-0000-0000-000000000001', 'Helsinki Coffee Table', 'HLS-TBL-06', 75, 32, 15, 6, 'published'),
  ('prd00000-0000-0000-0000-000000000007', 'ws000000-0000-0000-0000-000000000001', 'Oak Dining Table', 'OAK-DNG-07', 399, 190, 4, 6, 'published')
on conflict (id) do nothing;
