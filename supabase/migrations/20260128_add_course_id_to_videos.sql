-- Add course_id to video_resources if it doesn't exist
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'video_resources' and column_name = 'course_id') then
        alter table video_resources add column course_id uuid references courses(id);
    end if;
end $$;

-- Update the unique constraint to optionally include course_id if needed, 
-- or just keep the topic_key one. 
-- For now, we keep the topic_key constraint as the primary cache mechanism.
