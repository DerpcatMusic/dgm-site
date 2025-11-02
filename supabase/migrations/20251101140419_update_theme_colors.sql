-- Update theme colors to rusting nature scheme
UPDATE theme_settings 
SET 
  primary_color = '#8B4513',
  secondary_color = '#228B22',
  accent_color = '#DAA520',
  extra_color_1 = '#CD853F',
  extra_color_2 = '#556B2F',
  background_color = '#F5F5DC',
  border_color = '#654321'
WHERE id = '00000000-0000-0000-0000-000000000001';