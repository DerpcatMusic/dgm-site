-- Update theme colors to modern playful scheme
UPDATE theme_settings 
SET 
  primary_color = '#FF6B9D',
  secondary_color = '#C44569',
  accent_color = '#FFA07A',
  extra_color_1 = '#4ECDC4',
  extra_color_2 = '#95E1D3',
  background_color = '#FFF5E4',
  border_color = '#2C3E50'
WHERE id = '00000000-0000-0000-0000-000000000001';