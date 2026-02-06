-- ============================================
-- RLS POLICIES COMPLETION
-- ============================================

-- Gamification
CREATE POLICY "Badges are viewable by everyone" ON badges
    FOR SELECT USING (true);
CREATE POLICY "Users can view own badges" ON user_badges
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert user badges" ON user_badges
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "XP is viewable by everyone" ON user_xp
    FOR SELECT USING (true);
CREATE POLICY "Users can view own XP history" ON xp_history
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own XP transactions" ON xp_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Ebooks
CREATE POLICY "Ebooks are viewable by everyone" ON ebooks
    FOR SELECT USING (true);
CREATE POLICY "Admins can manage ebooks" ON ebooks
    FOR ALL USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- Certificates
CREATE POLICY "Users can view own certificates" ON certificates
    FOR SELECT USING (auth.uid() = user_id);

-- Study Groups
CREATE POLICY "Study groups are viewable by everyone" ON study_groups
    FOR SELECT USING (is_private = false);
CREATE POLICY "Members can view private groups" ON study_groups
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM study_group_members WHERE group_id = study_groups.id AND user_id = auth.uid()
        )
    );
CREATE POLICY "Users can create study groups" ON study_groups
    FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Group admins can manage groups" ON study_groups
    FOR UPDATE USING (created_by = auth.uid());

-- Study Group Members
CREATE POLICY "Users can view group memberships" ON study_group_members
    FOR SELECT USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM study_groups sg WHERE sg.id = study_group_members.group_id AND sg.created_by = auth.uid()
    ));
CREATE POLICY "Users can join groups" ON study_group_members
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Group admins can manage members" ON study_group_members
    FOR DELETE USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM study_group_members gm 
            WHERE gm.group_id = study_group_members.group_id 
            AND gm.user_id = auth.uid() 
            AND gm.role = 'admin'
        )
    );

-- Peer Reviews
CREATE POLICY "Users can view own reviews" ON peer_reviews
    FOR SELECT USING (auth.uid() = reviewer_id OR auth.uid() = reviewee_id);
CREATE POLICY "Users can create reviews" ON peer_reviews
    FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Chat
CREATE POLICY "Users can view own chats" ON chat_sessions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own chats" ON chat_sessions
    FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own messages" ON chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_sessions WHERE id = chat_messages.session_id AND user_id = auth.uid()
        )
    );
CREATE POLICY "Users can create own messages" ON chat_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM chat_sessions WHERE id = chat_messages.session_id AND user_id = auth.uid()
        )
    );

-- Journal
CREATE POLICY "Users can view own journal" ON journal_entries
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own journal" ON journal_entries
    FOR ALL USING (auth.uid() = user_id);

-- Aggregated Content
CREATE POLICY "Content is viewable by everyone" ON aggregated_content
    FOR SELECT USING (true);

-- Knowledge Vectors
CREATE POLICY "Vectors are viewable by everyone" ON knowledge_vectors
    FOR SELECT USING (true);

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('avatars', 'avatars', true),
    ('course-content', 'course-content', true),
    ('ebooks', 'ebooks', true),
    ('certificates', 'certificates', true),
    ('badges', 'badges', true),
    ('journal', 'journal', true),
    ('content', 'content', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Avatar public access" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Course content public access" ON storage.objects
    FOR SELECT USING (bucket_id = 'course-content');
CREATE POLICY "Ebooks public access" ON storage.objects
    FOR SELECT USING (bucket_id = 'ebooks');
CREATE POLICY "Certificates accessible by owner" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'certificates' AND 
        (storage.foldername(name))[1] = auth.uid()::text
    );
CREATE POLICY "Badges public access" ON storage.objects
    FOR SELECT USING (bucket_id = 'badges');
CREATE POLICY "Journal private access" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'journal' AND 
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- ============================================
-- SEED DATA
-- ============================================

-- Insert default faculties
INSERT INTO faculties (code, name, description, dean_name) VALUES
('FTIRS', 'Fakultas Teknologi Industri dan Rekayasa Sistem', 'FTIRS ITS', 'Prof. Dr. Ir. Teknologi'),
('FSAD', 'Fakultas Seni dan Desain', 'FSAD ITS', 'Prof. Dr. Seni'),
('FIA', 'Fakultas Ilmu Alam', 'FIA ITS', 'Prof. Dr. Alam'),
('FTEIC', 'Fakultas Teknik Elektro dan Informatika Cerdas', 'FTEIC ITS', 'Prof. Dr. Elektro')
ON CONFLICT (code) DO NOTHING;

-- Insert default departments
INSERT INTO departments (faculty_id, code, name, description) 
SELECT f.id, 'TM', 'Teknik Mesin', 'Departemen Teknik Mesin FTIRS'
FROM faculties f WHERE f.code = 'FTIRS'
ON CONFLICT (code) DO NOTHING;

INSERT INTO departments (faculty_id, code, name, description) 
SELECT f.id, 'TI', 'Teknik Industri', 'Departemen Teknik Industri FTIRS'
FROM faculties f WHERE f.code = 'FTIRS'
ON CONFLICT (code) DO NOTHING;

INSERT INTO departments (faculty_id, code, name, description) 
SELECT f.id, 'IF', 'Informatika', 'Departemen Informatika FTEIC'
FROM faculties f WHERE f.code = 'FTEIC'
ON CONFLICT (code) DO NOTHING;

-- Insert content sources
INSERT INTO content_sources (name, source_type, url, is_active) VALUES
('ITS News', 'news', 'https://www.its.ac.id/news/', true),
('YouTube Edu', 'youtube', 'https://youtube.com/education', true),
('GitHub Trending', 'github', 'https://github.com/trending', true),
('Research Gate', 'research', 'https://researchgate.net', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================
SELECT 'RLS Policies and Seed Data Applied Successfully!' as status;
