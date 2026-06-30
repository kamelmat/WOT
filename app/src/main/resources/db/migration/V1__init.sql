CREATE TABLE fit_profiles (
  id BIGSERIAL PRIMARY KEY,
  public_id VARCHAR(64) NOT NULL UNIQUE,
  user_id VARCHAR(64) NOT NULL,
  confidence NUMERIC(5,4) NOT NULL DEFAULT 0,
  profile_state VARCHAR(32) NOT NULL DEFAULT 'LOW_CONFIDENCE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fit_profiles_user_id ON fit_profiles (user_id);

CREATE TABLE shoes (
  id BIGSERIAL PRIMARY KEY,
  fit_profile_id BIGINT NOT NULL REFERENCES fit_profiles(id) ON DELETE CASCADE,
  brand VARCHAR(128) NOT NULL,
  model VARCHAR(128) NOT NULL,
  size VARCHAR(32) NOT NULL,
  fit_feedback VARCHAR(16) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_shoes_fit_profile_id ON shoes (fit_profile_id);
CREATE INDEX idx_shoes_brand_model ON shoes (brand, model);

