export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          image: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          image?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          image?: string | null
          created_at?: string
        }
      }
      gratitude_journals: {
        Row: {
          id: string
          user_id: string
          content: string
          date: string
          is_public: boolean
          tags: string[] | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          date: string
          is_public?: boolean
          tags?: string[] | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          date?: string
          is_public?: boolean
          tags?: string[] | null
          created_at?: string
          updated_at?: string | null
        }
      }
      prayers: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          is_answered: boolean
          is_public: boolean
          start_date: string
          answered_date: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          is_answered?: boolean
          is_public?: boolean
          start_date?: string
          answered_date?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          is_answered?: boolean
          is_public?: boolean
          start_date?: string
          answered_date?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      challenges: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          difficulty: string
          duration_days: number
          start_date: string
          end_date: string
          is_public: boolean
          creator_id: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          difficulty: string
          duration_days: number
          start_date: string
          end_date: string
          is_public?: boolean
          creator_id: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          difficulty?: string
          duration_days?: number
          start_date?: string
          end_date?: string
          is_public?: boolean
          creator_id?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      user_challenges: {
        Row: {
          id: string
          user_id: string
          challenge_id: string
          progress: number
          start_date: string
          last_check_in: string | null
          completed: boolean
          completed_at: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          challenge_id: string
          progress?: number
          start_date?: string
          last_check_in?: string | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          challenge_id?: string
          progress?: number
          start_date?: string
          last_check_in?: string | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      challenge_tasks: {
        Row: {
          id: string
          challenge_id: string
          day: number
          title: string
          description: string | null
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          challenge_id: string
          day: number
          title: string
          description?: string | null
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          challenge_id?: string
          day?: number
          title?: string
          description?: string | null
          date?: string
          created_at?: string
        }
      }
      user_task_completions: {
        Row: {
          id: string
          user_id: string
          task_id: string
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id: string
          completed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string
          completed_at?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

