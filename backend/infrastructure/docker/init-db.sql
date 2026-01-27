-- Nomadly Database Initialization
-- This script runs when PostgreSQL container starts

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create schemas for different services
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS social;
CREATE SCHEMA IF NOT EXISTS travel;
CREATE SCHEMA IF NOT EXISTS chat;
CREATE SCHEMA IF NOT EXISTS media;

-- Grant permissions
GRANT ALL PRIVILEGES ON SCHEMA auth TO nomadly;
GRANT ALL PRIVILEGES ON SCHEMA social TO nomadly;
GRANT ALL PRIVILEGES ON SCHEMA travel TO nomadly;
GRANT ALL PRIVILEGES ON SCHEMA chat TO nomadly;
GRANT ALL PRIVILEGES ON SCHEMA media TO nomadly;

-- =====================================================
-- AUTH SCHEMA - Users & Authentication
-- =====================================================

CREATE TABLE auth.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255),
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    travel_style VARCHAR(50),
    languages TEXT[] DEFAULT '{}',
    
    -- Trust & reputation
    trust_level VARCHAR(20) DEFAULT 'new',
    rating DECIMAL(3,2) DEFAULT 0,
    trip_count INT DEFAULT 0,
    feedback_count INT DEFAULT 0,
    countries_visited INT DEFAULT 0,
    favorite_destinations TEXT[] DEFAULT '{}',
    
    -- Auth metadata
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    auth_provider VARCHAR(50) DEFAULT 'email',
    two_factor_enabled BOOLEAN DEFAULT false,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    banned_until TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON auth.users(email);
CREATE INDEX idx_users_phone ON auth.users(phone);
CREATE INDEX idx_users_display_name ON auth.users USING gin(display_name gin_trgm_ops);

CREATE TABLE auth.user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(255) NOT NULL,
    device_info JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    revoked_at TIMESTAMPTZ
);

CREATE INDEX idx_sessions_user ON auth.user_sessions(user_id);
CREATE INDEX idx_sessions_token ON auth.user_sessions(refresh_token_hash);
CREATE INDEX idx_sessions_expires ON auth.user_sessions(expires_at);

CREATE TABLE auth.verification_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'email', 'phone', 'password_reset'
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_verification_user ON auth.verification_tokens(user_id);
CREATE INDEX idx_verification_token ON auth.verification_tokens(token_hash);

-- =====================================================
-- SOCIAL SCHEMA - Connections, Groups, Posts
-- =====================================================

CREATE TABLE social.connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    to_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending',
    icebreaker TEXT,
    trip_id UUID,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(from_user_id, to_user_id)
);

CREATE INDEX idx_connections_from ON social.connections(from_user_id);
CREATE INDEX idx_connections_to ON social.connections(to_user_id);
CREATE INDEX idx_connections_status ON social.connections(status);

CREATE TABLE social.groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL,
    emoji VARCHAR(10),
    description TEXT,
    cover_image_url TEXT,
    destination VARCHAR(100),
    country VARCHAR(100),
    start_date DATE,
    end_date DATE,
    privacy VARCHAR(20) DEFAULT 'public',
    
    -- Stats (denormalized)
    member_count INT DEFAULT 0,
    post_count INT DEFAULT 0,
    
    -- Moderation
    is_verified BOOLEAN DEFAULT false,
    moderation_level VARCHAR(20) DEFAULT 'standard',
    
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_groups_type ON social.groups(type);
CREATE INDEX idx_groups_destination ON social.groups(destination);
CREATE INDEX idx_groups_name ON social.groups USING gin(name gin_trgm_ops);

CREATE TABLE social.group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES social.groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    muted BOOLEAN DEFAULT false,
    
    UNIQUE(group_id, user_id)
);

CREATE INDEX idx_group_members_group ON social.group_members(group_id);
CREATE INDEX idx_group_members_user ON social.group_members(user_id);

CREATE TABLE social.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES social.groups(id) ON DELETE CASCADE,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL,
    content TEXT,
    media_urls TEXT[] DEFAULT '{}',
    
    -- Type-specific data
    metadata JSONB DEFAULT '{}',
    
    -- Engagement (denormalized)
    reaction_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    share_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    
    -- Status
    is_pinned BOOLEAN DEFAULT false,
    moderation_status VARCHAR(20) DEFAULT 'approved',
    spam_score DECIMAL(5,4) DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_posts_group ON social.posts(group_id);
CREATE INDEX idx_posts_author ON social.posts(author_id);
CREATE INDEX idx_posts_created ON social.posts(created_at DESC);
CREATE INDEX idx_posts_type ON social.posts(type);

CREATE TABLE social.reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES social.posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    emoji VARCHAR(10) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(post_id, user_id)
);

CREATE INDEX idx_reactions_post ON social.reactions(post_id);

CREATE TABLE social.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES social.posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES social.comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    
    like_count INT DEFAULT 0,
    reply_count INT DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_comments_post ON social.comments(post_id);
CREATE INDEX idx_comments_parent ON social.comments(parent_id);

-- =====================================================
-- TRAVEL SCHEMA - Trips & Matching
-- =====================================================

CREATE TABLE travel.trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    country_code CHAR(2),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'planning',
    open_to VARCHAR(50)[] DEFAULT '{}',
    notes TEXT,
    visibility VARCHAR(20) DEFAULT 'public',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trips_user ON travel.trips(user_id);
CREATE INDEX idx_trips_dates ON travel.trips(start_date, end_date);
CREATE INDEX idx_trips_location ON travel.trips(city, country);
CREATE INDEX idx_trips_status ON travel.trips(status);

CREATE TABLE travel.feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    to_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    trip_id UUID REFERENCES travel.trips(id) ON DELETE SET NULL,
    
    would_travel_again BOOLEAN,
    vibe_rating VARCHAR(20),
    anonymous_note TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feedback_to ON travel.feedback(to_user_id);

-- =====================================================
-- CHAT SCHEMA - Messages
-- =====================================================

CREATE TABLE chat.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) DEFAULT 'direct', -- 'direct' or 'group'
    group_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chat.conversation_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES chat.conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    last_read_at TIMESTAMPTZ,
    muted BOOLEAN DEFAULT false,
    
    UNIQUE(conversation_id, user_id)
);

CREATE INDEX idx_conv_members_conv ON chat.conversation_members(conversation_id);
CREATE INDEX idx_conv_members_user ON chat.conversation_members(user_id);

CREATE TABLE chat.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES chat.conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT,
    message_type VARCHAR(20) DEFAULT 'text',
    media_urls TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_messages_conv ON chat.messages(conversation_id);
CREATE INDEX idx_messages_created ON chat.messages(created_at DESC);

-- =====================================================
-- MEDIA SCHEMA - Files & Uploads
-- =====================================================

CREATE TABLE media.files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255),
    mime_type VARCHAR(100),
    size_bytes BIGINT,
    storage_path TEXT NOT NULL,
    cdn_url TEXT,
    
    -- Image-specific
    width INT,
    height INT,
    thumbnail_url TEXT,
    
    -- Status
    processing_status VARCHAR(20) DEFAULT 'pending',
    moderation_status VARCHAR(20) DEFAULT 'pending',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_files_user ON media.files(user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON social.groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON social.posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON travel.trips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update group member count
CREATE OR REPLACE FUNCTION update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE social.groups SET member_count = member_count + 1 WHERE id = NEW.group_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE social.groups SET member_count = member_count - 1 WHERE id = OLD.group_id;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_group_member_count
    AFTER INSERT OR DELETE ON social.group_members
    FOR EACH ROW EXECUTE FUNCTION update_group_member_count();

-- Update post counts
CREATE OR REPLACE FUNCTION update_post_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE social.groups SET post_count = post_count + 1 WHERE id = NEW.group_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE social.groups SET post_count = post_count - 1 WHERE id = OLD.group_id;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_post_count
    AFTER INSERT OR DELETE ON social.posts
    FOR EACH ROW EXECUTE FUNCTION update_post_counts();

COMMIT;
