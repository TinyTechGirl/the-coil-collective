-- Insert a test salon
INSERT INTO salons (
  name,
  city,
  address,
  postcode,
  services,
  instagram_url,
  website_url,
  phone,
  claimed
) VALUES (
  'The Curl Studio',
  'Bristol',
  '123 Hair Street',
  'BS1 2AB',
  ARRAY['cut', 'color', 'styling', 'treatment'],
  'https://instagram.com/thecurlstudio',
  'https://thecurlstudio.com',
  '0117 123 4567',
  false
); 