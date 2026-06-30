-- from prompt requirements: profile pain + per-shoe liked text + optional shoe image

ALTER TABLE fit_profiles
  ADD COLUMN IF NOT EXISTS pain VARCHAR(2000);

ALTER TABLE shoes
  ADD COLUMN IF NOT EXISTS liked_description VARCHAR(2000);

ALTER TABLE shoes
  ADD COLUMN IF NOT EXISTS image_path VARCHAR(1024);

