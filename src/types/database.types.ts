
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          nim: string | null
          role: string
          avatar_url: string | null
          xp: number
          level: number
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          nim?: string | null
          role?: string
          avatar_url?: string | null
          xp?: number
          level?: number
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          nim?: string | null
          role?: string
          avatar_url?: string | null
          xp?: number
          level?: number
          created_at?: string
        }
      }
      badges: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          icon_url: string | null
          awarded_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          icon_url?: string | null
          awarded_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          icon_url?: string | null
          awarded_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string | null
          thumbnail_url: string | null
          resource_id: string | null
          category: string | null
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          thumbnail_url?: string | null
          resource_id?: string | null
          category?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          thumbnail_url?: string | null
          resource_id?: string | null
          category?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      modules: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          video_url: string | null
          podcast_url: string | null
          slide_url: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          video_url?: string | null
          podcast_url?: string | null
          slide_url?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          video_url?: string | null
          podcast_url?: string | null
          slide_url?: string | null
          order_index?: number
          created_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          module_id: string
          title: string
          content: string | null
          video_url: string | null
          duration_minutes: number | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          module_id: string
          title: string
          content?: string | null
          video_url?: string | null
          duration_minutes?: number | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          module_id?: string
          title?: string
          content?: string | null
          video_url?: string | null
          duration_minutes?: number | null
          order_index?: number
          created_at?: string
        }
      }
      quizzes: {
        Row: {
          id: string
          module_id: string | null
          course_id: string | null
          title: string
          created_at: string
        }
        Insert: {
          id?: string
          module_id?: string | null
          course_id?: string | null
          title: string
          created_at?: string
        }
        Update: {
          id?: string
          module_id?: string | null
          course_id?: string | null
          title?: string
          created_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          quiz_id: string
          text: string
          options: Json | null
          correct_answer: string | null
          explanation: string | null
          created_at: string
        }
        Insert: {
          id?: string
          quiz_id: string
          text: string
          options?: Json | null
          correct_answer?: string | null
          explanation?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          quiz_id?: string
          text?: string
          options?: Json | null
          correct_answer?: string | null
          explanation?: string | null
          created_at?: string
        }
      }
       user_progress: {
         Row: {
           id: string
           user_id: string
           module_id: string
           completed: boolean
           quiz_score: number
           xp_earned: number
           completed_at: string | null
         }
         Insert: {
           id?: string
           user_id: string
           module_id: string
           completed?: boolean
           quiz_score?: number
           xp_earned?: number
           completed_at?: string | null
         }
         Update: {
           id?: string
           user_id: string
           module_id?: string
           completed?: boolean
           quiz_score?: number
           xp_earned?: number
           completed_at?: string | null
         }
       }
       admin_audit_log: {
         Row: {
           id?: string
           operation: string
           user_id?: string
           target_user_id?: string
           details: Json
           ip_address?: string
           timestamp: string
           environment: string
           success: boolean
           error?: string
         }
         Insert: {
           id?: string
           operation: string
           user_id?: string
           target_user_id?: string
           details?: Json
           ip_address?: string
           timestamp?: string
           environment?: string
           success?: boolean
           error?: string
         }
         Update: {
           id?: string
           operation?: string
           user_id?: string
           target_user_id?: string
           details?: Json
           ip_address?: string
           timestamp?: string
           environment?: string
           success?: boolean
           error?: string
         }
       }
     }
   }
 }
