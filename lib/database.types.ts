export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          status: string
          start_date: string | null
          due_date: string | null
          is_starred: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          status: string
          start_date?: string | null
          due_date?: string | null
          is_starred?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          status?: string
          start_date?: string | null
          due_date?: string | null
          is_starred?: boolean
          created_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          role: string
          department: string
          avatar: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          role: string
          department: string
          avatar?: string | null
          status: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          role?: string
          department?: string
          avatar?: string | null
          status?: string
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          status: string
          priority: string
          due_date: string | null
          project_id: string | null
          assignee_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status: string
          priority: string
          due_date?: string | null
          project_id?: string | null
          assignee_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: string
          priority?: string
          due_date?: string | null
          project_id?: string | null
          assignee_id?: string | null
          created_at?: string
        }
      }
    }
  }
}
